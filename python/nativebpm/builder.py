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

class StartEventBuilder:
    def __init__(self, workflow: 'Workflow', node_id: str):
        self._workflow = workflow
        self._id = node_id

    def next(self, target_id: str) -> 'Workflow':
        self._workflow.sequence_flow(self._id, target_id)
        return self._workflow

    def connect_to(self, target_id: str) -> 'Workflow':
        return self.next(target_id)

    def builder(self) -> 'Workflow':
        return self._workflow

class ServiceTaskBuilder:
    def __init__(self, workflow: 'Workflow', node_id: str):
        self._workflow = workflow
        self._id = node_id

    def wasm_path(self, path: str) -> 'ServiceTaskBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            node['wasmPath'] = path
        return self

    def wasm(self, alias: str) -> 'ServiceTaskBuilder':
        return self.wasm_path(alias)

    def next(self, target_id: str) -> 'Workflow':
        self._workflow.sequence_flow(self._id, target_id)
        return self._workflow

    def connect_to(self, target_id: str) -> 'Workflow':
        return self.next(target_id)

    def builder(self) -> 'Workflow':
        return self._workflow

class AITaskBuilder:
    def __init__(self, workflow: 'Workflow', node_id: str):
        self._workflow = workflow
        self._id = node_id

    def provider(self, p: str) -> 'AITaskBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            node['provider'] = p
        return self

    def model(self, m: str) -> 'AITaskBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            node['model'] = m
        return self

    def prompt(self, p: str) -> 'AITaskBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            node['prompt'] = p
        return self

    def system_instruction(self, si: str) -> 'AITaskBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            node['systemInstruction'] = si
        return self

    def response_schema(self, rs: str) -> 'AITaskBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            node['responseSchema'] = rs
        return self

    def temperature(self, t: float) -> 'AITaskBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            node['temperature'] = t
        return self

    def result_var(self, rv: str) -> 'AITaskBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            node['resultVar'] = rv
        return self

    def next(self, target_id: str) -> 'Workflow':
        self._workflow.sequence_flow(self._id, target_id)
        return self._workflow

    def connect_to(self, target_id: str) -> 'Workflow':
        return self.next(target_id)

    def builder(self) -> 'Workflow':
        return self._workflow

class UserTaskBuilder:
    def __init__(self, workflow: 'Workflow', node_id: str):
        self._workflow = workflow
        self._id = node_id

    def assignee(self, a: str) -> 'UserTaskBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            node['assignee'] = a
        return self

    def candidate_groups(self, cg: str) -> 'UserTaskBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            node['candidateGroups'] = cg
        return self

    def due_date(self, d: str) -> 'UserTaskBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            node['dueDate'] = d
        return self

    def next(self, target_id: str) -> 'Workflow':
        self._workflow.sequence_flow(self._id, target_id)
        return self._workflow

    def connect_to(self, target_id: str) -> 'Workflow':
        return self.next(target_id)

    def builder(self) -> 'Workflow':
        return self._workflow

class ExclusiveGatewayBuilder:
    def __init__(self, workflow: 'Workflow', node_id: str):
        self._workflow = workflow
        self._id = node_id

    def next(self, target_id: str) -> 'Workflow':
        self._workflow.sequence_flow(self._id, target_id)
        return self._workflow

    def next_with_condition(self, target_id: str, condition: str) -> 'Workflow':
        self._workflow.sequence_flow_with_condition(self._id, target_id, condition)
        return self._workflow

    def condition(self, target_id: str, cond: str) -> 'ExclusiveGatewayBuilder':
        self._workflow.sequence_flow_with_condition(self._id, target_id, cond)
        return self

    def default(self, target_id: str) -> 'ExclusiveGatewayBuilder':
        self._workflow.sequence_flow(self._id, target_id)
        return self

    def connect_to(self, target_id: str) -> 'Workflow':
        return self.next(target_id)

    def builder(self) -> 'Workflow':
        return self._workflow

class ParallelGatewayBuilder:
    def __init__(self, workflow: 'Workflow', node_id: str):
        self._workflow = workflow
        self._id = node_id

    def next(self, target_id: str) -> 'Workflow':
        self._workflow.sequence_flow(self._id, target_id)
        return self._workflow

    def connect_to(self, target_id: str) -> 'Workflow':
        return self.next(target_id)

    def builder(self) -> 'Workflow':
        return self._workflow

class EventBasedGatewayBuilder:
    def __init__(self, workflow: 'Workflow', node_id: str):
        self._workflow = workflow
        self._id = node_id

    def next(self, target_id: str) -> 'Workflow':
        self._workflow.sequence_flow(self._id, target_id)
        return self._workflow

    def connect_to(self, target_id: str) -> 'Workflow':
        return self.next(target_id)

    def builder(self) -> 'Workflow':
        return self._workflow

class CallActivityBuilder:
    def __init__(self, workflow: 'Workflow', node_id: str):
        self._workflow = workflow
        self._id = node_id

    def in_val(self, source: str, target: str) -> 'CallActivityBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            if 'inVariables' not in node:
                node['inVariables'] = []
            node['inVariables'].append({'source': source, 'target': target, 'variables': '', 'local': False})
        return self

    def in_all(self) -> 'CallActivityBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            if 'inVariables' not in node:
                node['inVariables'] = []
            node['inVariables'].append({'source': '', 'target': '', 'variables': 'all', 'local': False})
        return self

    def out_val(self, source: str, target: str) -> 'CallActivityBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            if 'outVariables' not in node:
                node['outVariables'] = []
            node['outVariables'].append({'source': source, 'target': target, 'variables': ''})
        return self

    def out_all(self) -> 'CallActivityBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            if 'outVariables' not in node:
                node['outVariables'] = []
            node['outVariables'].append({'source': '', 'target': '', 'variables': 'all'})
        return self

    def next(self, target_id: str) -> 'Workflow':
        self._workflow.sequence_flow(self._id, target_id)
        return self._workflow

    def connect_to(self, target_id: str) -> 'Workflow':
        return self.next(target_id)

    def builder(self) -> 'Workflow':
        return self._workflow

def format_dmn_value(val: Any) -> str:
    if val is None:
        return "-"
    if isinstance(val, str):
        s = val.strip()
        for op in ["<=", ">=", "!=", "<>", "<", ">"]:
            if s.startswith(op):
                return s
        if s == "true" or s == "false":
            return s
        try:
            float(s)
            return s
        except ValueError:
            pass
        return f'"{s}"'
    if isinstance(val, bool):
        return "true" if val else "false"
    return str(val)

class BusinessRuleTaskBuilder:
    def __init__(self, workflow: 'Workflow', node_id: str):
        self._workflow = workflow
        self._id = node_id

    def map_decision_result(self, map_decision_result: str) -> 'BusinessRuleTaskBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            node['mapDecisionResult'] = map_decision_result
        return self

    def result_variable(self, result_var: str) -> 'BusinessRuleTaskBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            node['resultVar'] = result_var
        return self

    def hit_policy(self, hit_policy: str) -> 'BusinessRuleTaskBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            node['hitPolicy'] = hit_policy
        return self

    def input(self, expression: str, type_str: str) -> 'BusinessRuleTaskBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            if 'inputs' not in node:
                node['inputs'] = []
            node['inputs'].append({'expression': expression, 'type': type_str})
        return self

    def output(self, name: str, type_str: str) -> 'BusinessRuleTaskBuilder':
        node = self._workflow.find_node(self._id)
        if node:
            if 'outputs' not in node:
                node['outputs'] = []
            node['outputs'].append({'name': name, 'type': type_str})
        return self

    def rule(self) -> 'DMNRuleBuilder':
        return DMNRuleBuilder(self)

    def next(self, target_id: str) -> 'Workflow':
        self._workflow.sequence_flow(self._id, target_id)
        return self._workflow

    def connect_to(self, target_id: str) -> 'Workflow':
        return self.next(target_id)

    def builder(self) -> 'Workflow':
        return self._workflow

class DMNRuleBuilder:
    def __init__(self, task_builder: BusinessRuleTaskBuilder):
        self._task_builder = task_builder
        self._inputs = {}
        self._outputs = {}

    def when(self, expression: str, val: Any) -> 'DMNRuleBuilder':
        self._inputs[expression] = format_dmn_value(val)
        return self

    def then(self, name: str, val: Any) -> 'DMNRuleBuilder':
        self._outputs[name] = format_dmn_value(val)
        return self

    def _commit(self):
        node = self._task_builder._workflow.find_node(self._task_builder._id)
        if not node:
            return
        if 'rules' not in node:
            node['rules'] = []

        inputs_list = node.get('inputs', [])
        outputs_list = node.get('outputs', [])

        rule_inputs = []
        for in_val in inputs_list:
            expr = in_val.get('expression')
            if expr in self._inputs:
                rule_inputs.append(self._inputs[expr])
            else:
                rule_inputs.append("-")

        rule_outputs = []
        for out_val in outputs_list:
            name = out_val.get('name')
            if name in self._outputs:
                rule_outputs.append(self._outputs[name])
            else:
                rule_outputs.append("-")

        node['rules'].append({
            'inputs': rule_inputs,
            'outputs': rule_outputs
        })

    def rule(self) -> 'DMNRuleBuilder':
        self._commit()
        return self._task_builder.rule()

    def next(self, target_id: str) -> 'Workflow':
        self._commit()
        return self._task_builder.next(target_id)

    def connect_to(self, target_id: str) -> 'Workflow':
        return self.next(target_id)

    def builder(self) -> 'Workflow':
        self._commit()
        return self._task_builder.builder()

    def map_decision_result(self, map_decision_result: str) -> BusinessRuleTaskBuilder:
        self._commit()
        return self._task_builder.map_decision_result(map_decision_result)

    def result_variable(self, result_var: str) -> BusinessRuleTaskBuilder:
        self._commit()
        return self._task_builder.result_variable(result_var)

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

    def user(self, node_id: str, name: str, config=None) -> 'Branch':
        builder = self._workflow.user_task(node_id, name)
        if config:
            config(builder)
        self._connect_node(node_id)
        return self

    def service(self, node_id: str, name: str, topic: str, config=None) -> 'Branch':
        builder = self._workflow.service_task(node_id, name, topic)
        if config:
            config(builder)
        self._connect_node(node_id)
        return self

    def ai(self, node_id: str, name: str, config=None) -> 'Branch':
        builder = self._workflow.ai_task(node_id, name)
        if config:
            config(builder)
        self._connect_node(node_id)
        return self

    def end(self, node_id: str, name: str) -> 'Branch':
        self._workflow.end_event(node_id, name)
        self._connect_node(node_id)
        self._has_ended = True
        return self

    def if_branch(self, condition: str, then_fn=None):
        if then_fn is None:
            def decorator(func):
                return self.if_branch(condition, func)
            return decorator

        gw_id = f"gw_{self._current_node_id}_decision"
        self._workflow.exclusive_gateway(gw_id, "Decision Gateway")
        self._connect_node(gw_id)

        then_branch = Branch(self._workflow, gw_id, gw_id, True, condition)
        then_fn(then_branch)

        if not then_branch._has_ended and then_branch._current_node_id != gw_id:
            self._workflow._pending_merges.append(then_branch._current_node_id)

        return IfElseBranchBuilder(self, gw_id)

class IfElseBuilder:
    def __init__(self, workflow: 'Workflow', gateway_id: str):
        self._workflow = workflow
        self._gateway_id = gateway_id

    def else_branch(self, else_fn=None) -> 'Workflow':
        if else_fn is None:
            def decorator(func):
                return self.else_branch(func)
            return decorator

        else_branch = Branch(self._workflow, self._gateway_id, self._gateway_id, False)
        else_fn(else_branch)

        if not else_branch._has_ended and else_branch._current_node_id != self._gateway_id:
            self._workflow._pending_merges.append(else_branch._current_node_id)

        return self._workflow

class IfElseBranchBuilder:
    def __init__(self, branch: Branch, gateway_id: str):
        self._branch = branch
        self._gateway_id = gateway_id

    def else_branch(self, else_fn=None) -> Branch:
        if else_fn is None:
            def decorator(func):
                return self.else_branch(func)
            return decorator

        else_branch = Branch(self._branch._workflow, self._gateway_id, self._gateway_id, False)
        else_fn(else_branch)

        if not else_branch._has_ended and else_branch._current_node_id != self._gateway_id:
            self._branch._workflow._pending_merges.append(else_branch._current_node_id)

        return self._branch

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
        if self._pending_merges:
            for source_id in self._pending_merges:
                self.sequence_flow(source_id, node_id)
            self._pending_merges = []
        elif self._current_node_id and self._current_node_id != node_id:
            self.sequence_flow(self._current_node_id, node_id)
        self._current_node_id = node_id

    def start(self, node_id: str) -> 'Workflow':
        self.start_event(node_id)
        self._connect_node(node_id)
        return self

    def end(self, node_id: str, name: str) -> 'Workflow':
        self.end_event(node_id, name)
        self._connect_node(node_id)
        self._current_node_id = ""
        return self

    def user(self, node_id: str, name: str, config=None) -> 'Workflow':
        builder = self.user_task(node_id, name)
        if config:
            config(builder)
        self._connect_node(node_id)
        return self

    def service(self, node_id: str, name: str, topic: str, config=None) -> 'Workflow':
        builder = self.service_task(node_id, name, topic)
        if config:
            config(builder)
        self._connect_node(node_id)
        return self

    def ai(self, node_id: str, name: str, config=None) -> 'Workflow':
        builder = self.ai_task(node_id, name)
        if config:
            config(builder)
        self._connect_node(node_id)
        return self

    def if_branch(self, condition: str, then_fn=None):
        if then_fn is None:
            def decorator(func):
                return self.if_branch(condition, func)
            return decorator

        gw_id = f"gw_{self._current_node_id}_decision"
        self.exclusive_gateway(gw_id, "Decision Gateway")
        self._connect_node(gw_id)

        then_branch = Branch(self, gw_id, gw_id, True, condition)
        then_fn(then_branch)

        if not then_branch._has_ended and then_branch._current_node_id != gw_id:
            self._pending_merges.append(then_branch._current_node_id)

        return IfElseBuilder(self, gw_id)

    def start_event(self, node_id: str) -> StartEventBuilder:
        self._nodes.append({'type': 'startEvent', 'id': node_id, 'name': 'Start'})
        return StartEventBuilder(self, node_id)

    def end_event(self, node_id: str, name: str) -> 'Workflow':
        self._nodes.append({'type': 'endEvent', 'id': node_id, 'name': name})
        return self

    def service_task(self, node_id: str, name: str, topic: str) -> ServiceTaskBuilder:
        self._nodes.append({'type': 'serviceTask', 'id': node_id, 'name': name, 'topic': topic})
        return ServiceTaskBuilder(self, node_id)

    def ai_task(self, node_id: str, name: str) -> AITaskBuilder:
        self._nodes.append({'type': 'aiServiceTask', 'id': node_id, 'name': name})
        return AITaskBuilder(self, node_id)

    def user_task(self, node_id: str, name: str) -> UserTaskBuilder:
        self._nodes.append({'type': 'userTask', 'id': node_id, 'name': name})
        return UserTaskBuilder(self, node_id)

    def exclusive_gateway(self, node_id: str, name: str) -> ExclusiveGatewayBuilder:
        self._nodes.append({'type': 'exclusiveGateway', 'id': node_id, 'name': name})
        return ExclusiveGatewayBuilder(self, node_id)

    def parallel_gateway(self, node_id: str, name: str) -> ParallelGatewayBuilder:
        self._nodes.append({'type': 'parallelGateway', 'id': node_id, 'name': name})
        return ParallelGatewayBuilder(self, node_id)

    def event_based_gateway(self, node_id: str, name: str) -> EventBasedGatewayBuilder:
        self._nodes.append({'type': 'eventBasedGateway', 'id': node_id, 'name': name})
        return EventBasedGatewayBuilder(self, node_id)

    def call_activity(self, node_id: str, name: str, called_element: str) -> CallActivityBuilder:
        self._nodes.append({'type': 'callActivity', 'id': node_id, 'name': name, 'calledElement': called_element})
        return CallActivityBuilder(self, node_id)

    def business_rule_task(self, node_id: str, name: str, decision_ref: str) -> 'BusinessRuleTaskBuilder':
        self._nodes.append({'type': 'businessRuleTask', 'id': node_id, 'name': name, 'decisionRef': decision_ref})
        return BusinessRuleTaskBuilder(self, node_id)

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
        return {
            'id': self._id,
            'name': self._name,
            'nodes': self._nodes,
            'flows': self._flows
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
