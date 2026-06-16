import json
import gzip
import io
import zipfile
import brotli
from pathlib import Path
from typing import Any, Dict, List, Optional
from wasmtime import Engine, Linker, Module, Store, WasiConfig, Config, ExitTrap

DEFAULT_WASM_PATH = Path(__file__).parent / "core.wasm"

def decompress_wasm_if_needed(data: bytes) -> bytes:
    if len(data) >= 4 and data[:4] == b'\x00asm':
        return data
    # Gzip check: 0x1f 0x8b
    if len(data) >= 2 and data[0] == 0x1f and data[1] == 0x8b:
        with gzip.GzipFile(fileobj=io.BytesIO(data)) as f:
            return f.read()
    # Zip check: PK\x03\x04
    if len(data) >= 4 and data[:4] == b'PK\x03\x04':
        with zipfile.ZipFile(io.BytesIO(data)) as z:
            for name in z.namelist():
                if name.endswith('.wasm'):
                    return z.read(name)
        raise ValueError("no .wasm file found inside zip archive")
    # Brotli check
    try:
        decompressed = brotli.decompress(data)
        if len(decompressed) >= 4 and decompressed[:4] == b'\x00asm':
            return decompressed
    except Exception:
        pass
    raise ValueError("unsupported or invalid WebAssembly binary format (failed to decompress or identify magic header)")

def to_camel_case(s: str) -> str:
    if s == "wasm":
        return "wasmPath"
    if s == "result_variable":
        return "resultVar"
    if '_' not in s:
        return s
    parts = s.split('_')
    return parts[0] + ''.join(x.title() for x in parts[1:])

def populate_node_properties(node: dict, kwargs: dict):
    for k, val in kwargs.items():
        key = to_camel_case(k)
        node[key] = val

_COMPILER_CACHE = {}

class Branch:
    def __init__(self, workflow: 'Workflow', gateway_id: str, current_node_id: str, is_conditional: bool, condition: Optional[str] = None):
        self._workflow = workflow
        self._gateway_id = gateway_id
        self._current_node_id = current_node_id
        self._is_conditional = is_conditional
        self._condition = condition
        self._has_ended = False

    def _connect_node(self, node_id: str):
        if self._has_ended:
            return
        
        merges = self._workflow._pending_merges
        if merges:
            for source_id in merges:
                self._workflow.sequence_flow(source_id, node_id)
            self._workflow._pending_merges = []
            self._current_node_id = node_id
            return

        if self._current_node_id == self._gateway_id:
            if self._is_conditional:
                self._workflow.sequence_flow_with_condition(self._gateway_id, node_id, self._condition or "")
            else:
                self._workflow.sequence_flow(self._gateway_id, node_id)
        elif self._current_node_id and self._current_node_id != node_id:
            self._workflow.sequence_flow(self._current_node_id, node_id)
        
        self._current_node_id = node_id

    def user(self, node_id: str, name: str, **kwargs) -> 'Branch':
        self._workflow.user_task(node_id, name, **kwargs)
        self._connect_node(node_id)
        return self

    def service(self, node_id: str, name: str, topic: str, **kwargs) -> 'Branch':
        self._workflow.service_task(node_id, name, topic, **kwargs)
        self._connect_node(node_id)
        return self

    def ai(self, node_id: str, name: str, **kwargs) -> 'Branch':
        self._workflow.ai_task(node_id, name, **kwargs)
        self._connect_node(node_id)
        return self

    def call(self, node_id: str, name: str, called_element: str, **kwargs) -> 'Branch':
        self._workflow.call_activity(node_id, name, called_element, **kwargs)
        self._connect_node(node_id)
        return self

    def business_rule(self, node_id: str, name: str, decision_ref: str, **kwargs) -> 'Branch':
        self._workflow.business_rule_task(node_id, name, decision_ref, **kwargs)
        self._connect_node(node_id)
        return self

    def end(self, node_id: str, name: str) -> 'Branch':
        self._workflow.end_event(node_id, name)
        self._connect_node(node_id)
        self._has_ended = True
        return self

    def when(self, condition: Any):
        gw_id = f"gw_{self._current_node_id}_decision"
        self._workflow.exclusive_gateway(gw_id, "Decision Gateway")
        self._connect_node(gw_id)
        return WhenBranchBuilder(self, gw_id, str(condition))

class WhenBuilder:
    def __init__(self, workflow: 'Workflow', gateway_id: str, condition: str):
        self.workflow = workflow
        self.gateway_id = gateway_id
        self.condition = condition

    def then(self, then_fn: Any) -> 'ThenBuilder':
        then_branch = Branch(self.workflow, self.gateway_id, self.gateway_id, True, self.condition)
        then_fn(then_branch)

        if not then_branch._has_ended and then_branch._current_node_id != self.gateway_id:
            self.workflow._pending_merges.append(then_branch._current_node_id)

        return ThenBuilder(self.workflow, self.gateway_id)

    def __call__(self, then_fn: Any) -> 'ThenBuilder':
        return self.then(then_fn)

class ThenBuilder:
    def __init__(self, workflow: 'Workflow', gateway_id: str):
        self.workflow = workflow
        self.gateway_id = gateway_id

    def otherwise(self, else_fn=None) -> Any:
        if else_fn is None:
            def decorator(func):
                return self.otherwise(func)
            return decorator

        else_branch = Branch(self.workflow, self.gateway_id, self.gateway_id, False)
        else_fn(else_branch)

        if not else_branch._has_ended and else_branch._current_node_id != self.gateway_id:
            self.workflow._pending_merges.append(else_branch._current_node_id)

        return self.workflow

    def Else(self, else_fn=None) -> Any:
        return self.otherwise(else_fn)

class WhenBranchBuilder:
    def __init__(self, branch: Branch, gateway_id: str, condition: str):
        self.branch = branch
        self.gateway_id = gateway_id
        self.condition = condition

    def then(self, then_fn: Any) -> 'ThenBranchBuilder':
        then_branch = Branch(self.branch._workflow, self.gateway_id, self.gateway_id, True, self.condition)
        then_fn(then_branch)

        if not then_branch._has_ended and then_branch._current_node_id != self.gateway_id:
            self.branch._workflow._pending_merges.append(then_branch._current_node_id)

        return ThenBranchBuilder(self.branch, self.gateway_id)

    def __call__(self, then_fn: Any) -> 'ThenBranchBuilder':
        return self.then(then_fn)

class ThenBranchBuilder:
    def __init__(self, branch: Branch, gateway_id: str):
        self.branch = branch
        self.gateway_id = gateway_id

    def otherwise(self, else_fn=None) -> Any:
        if else_fn is None:
            def decorator(func):
                return self.otherwise(func)
            return decorator

        else_branch = Branch(self.branch._workflow, self.gateway_id, self.gateway_id, False)
        else_fn(else_branch)

        if not else_branch._has_ended and else_branch._current_node_id != self.gateway_id:
            self.branch._workflow._pending_merges.append(else_branch._current_node_id)

        return self.branch

    def Else(self, else_fn=None) -> Any:
        return self.otherwise(else_fn)

class Workflow:
    def __init__(self, id_str: str, name: str, wasm_input: Optional[Any] = None):
        self._id = id_str
        self._name = name
        self._nodes: List[Dict[str, Any]] = []
        self._flows: List[Dict[str, Any]] = []
        self._engine = None
        self._compiled_module = None
        self._current_node_id = ""
        self._pending_merges: List[str] = []

        if wasm_input is not None:
            self.init_compiler(wasm_input)

    def init_compiler(self, wasm_input: Any):
        if isinstance(wasm_input, (bytes, bytearray)):
            wasm_bytes = bytes(wasm_input)
        else:
            resolved_path = Path(wasm_input)
            if not resolved_path.exists():
                raise FileNotFoundError(f"core.wasm not found at {resolved_path}")
            wasm_bytes = resolved_path.read_bytes()

        decompressed_bytes = decompress_wasm_if_needed(wasm_bytes)

        import hashlib
        cache_key = hashlib.sha256(decompressed_bytes).digest()

        global _COMPILER_CACHE
        if cache_key in _COMPILER_CACHE:
            self._engine, self._compiled_module = _COMPILER_CACHE[cache_key]
            return

        config = Config()
        try:
            config.signals_based_traps = False
        except AttributeError:
            config.signals_based_traps(False)
        try:
            config.macos_use_mach_ports = False
        except AttributeError:
            config.macos_use_mach_ports(False)

        engine = Engine(config)
        compiled_module = Module(engine, decompressed_bytes)

        _COMPILER_CACHE[cache_key] = (engine, compiled_module)
        self._engine = engine
        self._compiled_module = compiled_module

    def _connect_node(self, node_id: str):
        node = self.find_node(node_id)
        has_start = any(n.get('type') == 'startEvent' for n in self._nodes)
        if not has_start and node and node.get('type') != 'startEvent':
            self.start_event('start')
            self.sequence_flow('start', node_id)
            self._current_node_id = node_id
            return

        if self._pending_merges:
            for source_id in self._pending_merges:
                self.sequence_flow(source_id, node_id)
            self._pending_merges = []
        elif self._current_node_id and self._current_node_id != node_id:
            self.sequence_flow(self._current_node_id, node_id)
        self._current_node_id = node_id

    def start(self, node_id: str = "start") -> 'Workflow':
        self.start_event(node_id)
        self._connect_node(node_id)
        return self

    def end(self, node_id: str, name: str) -> 'Workflow':
        self.end_event(node_id, name)
        self._connect_node(node_id)
        self._current_node_id = ""
        return self

    def user(self, node_id: str, name: str, **kwargs) -> 'Workflow':
        self.user_task(node_id, name, **kwargs)
        self._connect_node(node_id)
        return self

    def service(self, node_id: str, name: str, topic: str, **kwargs) -> 'Workflow':
        self.service_task(node_id, name, topic, **kwargs)
        self._connect_node(node_id)
        return self

    def ai(self, node_id: str, name: str, **kwargs) -> 'Workflow':
        self.ai_task(node_id, name, **kwargs)
        self._connect_node(node_id)
        return self

    def call(self, node_id: str, name: str, called_element: str, **kwargs) -> 'Workflow':
        self.call_activity(node_id, name, called_element, **kwargs)
        self._connect_node(node_id)
        return self

    def business_rule(self, node_id: str, name: str, decision_ref: str, **kwargs) -> 'Workflow':
        self.business_rule_task(node_id, name, decision_ref, **kwargs)
        self._connect_node(node_id)
        return self

    def when(self, condition: Any) -> WhenBuilder:
        gw_id = f"gw_{self._current_node_id}_decision"
        self.exclusive_gateway(gw_id, "Decision Gateway")
        self._connect_node(gw_id)
        return WhenBuilder(self, gw_id, str(condition))

    def start_event(self, node_id: str = "start") -> 'Workflow':
        self._nodes.append({'type': 'startEvent', 'id': node_id, 'name': 'Start'})
        return self

    def end_event(self, node_id: str, name: str) -> 'Workflow':
        self._nodes.append({'type': 'endEvent', 'id': node_id, 'name': name})
        return self

    def service_task(self, node_id: str, name: str, topic: str, **kwargs) -> 'Workflow':
        node = {'type': 'serviceTask', 'id': node_id, 'name': name, 'topic': topic}
        populate_node_properties(node, kwargs)
        self._nodes.append(node)
        return self

    def ai_task(self, node_id: str, name: str, **kwargs) -> 'Workflow':
        node = {'type': 'aiServiceTask', 'id': node_id, 'name': name}
        populate_node_properties(node, kwargs)
        self._nodes.append(node)
        return self

    def user_task(self, node_id: str, name: str, **kwargs) -> 'Workflow':
        node = {'type': 'userTask', 'id': node_id, 'name': name}
        populate_node_properties(node, kwargs)
        self._nodes.append(node)
        return self

    def exclusive_gateway(self, node_id: str, name: str) -> 'Workflow':
        self._nodes.append({'type': 'exclusiveGateway', 'id': node_id, 'name': name})
        return self

    def parallel_gateway(self, node_id: str, name: str) -> 'Workflow':
        self._nodes.append({'type': 'parallelGateway', 'id': node_id, 'name': name})
        return self

    def event_based_gateway(self, node_id: str, name: str) -> 'Workflow':
        self._nodes.append({'type': 'eventBasedGateway', 'id': node_id, 'name': name})
        return self

    def call_activity(self, node_id: str, name: str, called_element: str, **kwargs) -> 'Workflow':
        node = {'type': 'callActivity', 'id': node_id, 'name': name, 'calledElement': called_element}
        populate_node_properties(node, kwargs)
        self._nodes.append(node)
        return self

    def business_rule_task(self, node_id: str, name: str, decision_ref: str, **kwargs) -> 'Workflow':
        node = {'type': 'businessRuleTask', 'id': node_id, 'name': name, 'decisionRef': decision_ref}
        populate_node_properties(node, kwargs)
        self._nodes.append(node)
        return self

    def sequence_flow(self, source: str, target: str) -> 'Workflow':
        self._flows.append({'id': f"flow-{source}-{target}", 'source': source, 'target': target, 'condition': ''})
        return self

    def sequence_flow_with_condition(self, source: str, target: str, condition: str) -> 'Workflow':
        self._flows.append({'id': f"flow-{source}-{target}", 'source': source, 'target': target, 'condition': condition})
        return self

    def find_node(self, node_id: str) -> Optional[Dict[str, Any]]:
        for n in self._nodes:
            if n['id'] == node_id:
                return n
        return None

    def to_ast(self) -> Dict[str, Any]:
        nodes = list(self._nodes)
        flows = list(self._flows)

        source_ids = {f['source'] for f in self._flows if 'source' in f}

        for node in self._nodes:
            if node.get('type') in ('endEvent', 'startEvent'):
                continue
            if node.get('id') not in source_ids:
                end_id = f"end_{node['id']}"
                nodes.append({'type': 'endEvent', 'id': end_id, 'name': 'Process Finished'})
                flows.append({
                    'id': f"flow-{node['id']}-{end_id}",
                    'source': node['id'],
                    'target': end_id,
                    'condition': ''
                })

        return {
            'id': self._id,
            'name': self._name,
            'nodes': nodes,
            'flows': flows
        }

    def build_xml(self, wasm_input: Optional[Any] = None) -> str:
        if self._compiled_module is None:
            if wasm_input is not None:
                self.init_compiler(wasm_input)
            else:
                self.init_compiler(DEFAULT_WASM_PATH)

        engine = self._engine
        linker = Linker(engine)
        linker.define_wasi()

        module = self._compiled_module
        store = Store(engine)

        wasi = WasiConfig()
        wasi.inherit_stdout()
        wasi.inherit_stderr()
        store.set_wasi(wasi)

        instance = linker.instantiate(store, module)

        exports = instance.exports(store)
        start = exports.get("_start")
        if start:
            try:
                start(store)
            except ExitTrap:
                pass
            except SystemExit:
                pass

        allocate = exports.get("allocate")
        deallocate = exports.get("deallocate")
        compile_workflow = exports.get("compileWorkflow")
        memory = exports.get("memory")

        ast_json = json.dumps(self.to_ast())
        ast_bytes = ast_json.encode('utf-8')

        input_ptr = allocate(store, len(ast_bytes))
        memory.write(store, ast_bytes, input_ptr)

        result_packed = compile_workflow(store, input_ptr, len(ast_bytes))

        result_ptr = (result_packed >> 32) & 0xFFFFFFFF
        result_size = result_packed & 0xFFFFFFFF

        result_bytes = memory.read(store, result_ptr, result_ptr + result_size)
        result_json = result_bytes.decode('utf-8')

        deallocate(store, input_ptr, len(ast_bytes))
        deallocate(store, result_ptr, result_size)

        result = json.loads(result_json)
        if result.get("error"):
            raise ValueError(f"Wasm workflow compilation failed: {result['error']}")

        return result["xml"]


class Expression(str):
    pass


class Variable:
    def __init__(self, name: str):
        self.name = name

    def __str__(self) -> str:
        return self.name

    def eq(self, value: Any) -> Expression:
        val_str = "true" if value is True else ("false" if value is False else str(value))
        return Expression(f"{self.name} == {val_str}")

    def ne(self, value: Any) -> Expression:
        val_str = "true" if value is True else ("false" if value is False else str(value))
        return Expression(f"{self.name} != {val_str}")

    def gt(self, value: Any) -> Expression:
        return Expression(f"{self.name} > {value}")

    def gte(self, value: Any) -> Expression:
        return Expression(f"{self.name} >= {value}")

    def lt(self, value: Any) -> Expression:
        return Expression(f"{self.name} < {value}")

    def lte(self, value: Any) -> Expression:
        return Expression(f"{self.name} <= {value}")


def V(name: str) -> Variable:
    return Variable(name)


def v(name: str) -> Variable:
    return Variable(name)
