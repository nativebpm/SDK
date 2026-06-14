import { WASI } from 'node:wasi';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as zlib from 'node:zlib';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultWasmPath = path.resolve(__dirname, 'core.wasm');
function decompressWasmIfNeeded(data) {
    if (data.length >= 4 && data[0] === 0x00 && data[1] === 0x61 && data[2] === 0x73 && data[3] === 0x6d) {
        return data;
    }
    // Gzip check: 0x1f 0x8b
    if (data.length >= 2 && data[0] === 0x1f && data[1] === 0x8b) {
        try {
            return new Uint8Array(zlib.gunzipSync(data));
        }
        catch (err) {
            throw new Error(`failed to decompress gzip wasm: ${err.message}`);
        }
    }
    // Brotli check
    try {
        const decompressed = zlib.brotliDecompressSync(data);
        if (decompressed.length >= 4 && decompressed[0] === 0x00 && decompressed[1] === 0x61 && decompressed[2] === 0x73 && decompressed[3] === 0x6d) {
            return new Uint8Array(decompressed);
        }
    }
    catch (err) {
        // ignore and fall through
    }
    throw new Error("unsupported or invalid WebAssembly binary format (failed to decompress or identify magic header)");
}
export class StartEventBuilder {
    workflow;
    id;
    constructor(workflow, id) {
        this.workflow = workflow;
        this.id = id;
    }
    next(targetID) {
        this.workflow.sequenceFlow(this.id, targetID);
        return this.workflow;
    }
    connectTo(targetID) {
        return this.next(targetID);
    }
    builder() { return this.workflow; }
}
export class ServiceTaskBuilder {
    workflow;
    id;
    constructor(workflow, id) {
        this.workflow = workflow;
        this.id = id;
    }
    wasmPath(path) {
        const node = this.workflow.findNode(this.id);
        if (node)
            node.wasmPath = path;
        return this;
    }
    wasm(alias) {
        return this.wasmPath(alias);
    }
    next(targetID) {
        this.workflow.sequenceFlow(this.id, targetID);
        return this.workflow;
    }
    connectTo(targetID) {
        return this.next(targetID);
    }
    builder() {
        return this.workflow;
    }
}
export class AITaskBuilder {
    workflow;
    id;
    constructor(workflow, id) {
        this.workflow = workflow;
        this.id = id;
    }
    provider(p) {
        const node = this.workflow.findNode(this.id);
        if (node)
            node.provider = p;
        return this;
    }
    model(m) {
        const node = this.workflow.findNode(this.id);
        if (node)
            node.model = m;
        return this;
    }
    prompt(p) {
        const node = this.workflow.findNode(this.id);
        if (node)
            node.prompt = p;
        return this;
    }
    systemInstruction(si) {
        const node = this.workflow.findNode(this.id);
        if (node)
            node.systemInstruction = si;
        return this;
    }
    responseSchema(rs) {
        const node = this.workflow.findNode(this.id);
        if (node)
            node.responseSchema = rs;
        return this;
    }
    temperature(t) {
        const node = this.workflow.findNode(this.id);
        if (node)
            node.temperature = t;
        return this;
    }
    resultVar(rv) {
        const node = this.workflow.findNode(this.id);
        if (node)
            node.resultVar = rv;
        return this;
    }
    next(targetID) {
        this.workflow.sequenceFlow(this.id, targetID);
        return this.workflow;
    }
    connectTo(targetID) {
        return this.next(targetID);
    }
    builder() {
        return this.workflow;
    }
}
export class UserTaskBuilder {
    workflow;
    id;
    constructor(workflow, id) {
        this.workflow = workflow;
        this.id = id;
    }
    assignee(a) {
        const node = this.workflow.findNode(this.id);
        if (node)
            node.assignee = a;
        return this;
    }
    candidateGroups(cg) {
        const node = this.workflow.findNode(this.id);
        if (node)
            node.candidateGroups = cg;
        return this;
    }
    dueDate(d) {
        const node = this.workflow.findNode(this.id);
        if (node)
            node.dueDate = d;
        return this;
    }
    next(targetID) {
        this.workflow.sequenceFlow(this.id, targetID);
        return this.workflow;
    }
    connectTo(targetID) {
        return this.next(targetID);
    }
    builder() {
        return this.workflow;
    }
}
export class ExclusiveGatewayBuilder {
    workflow;
    id;
    constructor(workflow, id) {
        this.workflow = workflow;
        this.id = id;
    }
    next(targetID) {
        this.workflow.sequenceFlow(this.id, targetID);
        return this.workflow;
    }
    nextWithCondition(targetID, condition) {
        this.workflow.sequenceFlowWithCondition(this.id, targetID, condition);
        return this.workflow;
    }
    connectTo(targetID) {
        return this.next(targetID);
    }
    builder() {
        return this.workflow;
    }
}
export class ParallelGatewayBuilder {
    workflow;
    id;
    constructor(workflow, id) {
        this.workflow = workflow;
        this.id = id;
    }
    next(targetID) {
        this.workflow.sequenceFlow(this.id, targetID);
        return this.workflow;
    }
    connectTo(targetID) {
        return this.next(targetID);
    }
    builder() {
        return this.workflow;
    }
}
export class EventBasedGatewayBuilder {
    workflow;
    id;
    constructor(workflow, id) {
        this.workflow = workflow;
        this.id = id;
    }
    next(targetID) {
        this.workflow.sequenceFlow(this.id, targetID);
        return this.workflow;
    }
    connectTo(targetID) {
        return this.next(targetID);
    }
    builder() {
        return this.workflow;
    }
}
export class CallActivityBuilder {
    workflow;
    id;
    constructor(workflow, id) {
        this.workflow = workflow;
        this.id = id;
    }
    in(source, target) {
        const node = this.workflow.findNode(this.id);
        if (node) {
            if (!node.inVariables)
                node.inVariables = [];
            node.inVariables.push({ source, target, variables: '', local: false });
        }
        return this;
    }
    inAll() {
        const node = this.workflow.findNode(this.id);
        if (node) {
            if (!node.inVariables)
                node.inVariables = [];
            node.inVariables.push({ source: '', target: '', variables: 'all', local: false });
        }
        return this;
    }
    out(source, target) {
        const node = this.workflow.findNode(this.id);
        if (node) {
            if (!node.outVariables)
                node.outVariables = [];
            node.outVariables.push({ source, target, variables: '' });
        }
        return this;
    }
    outAll() {
        const node = this.workflow.findNode(this.id);
        if (node) {
            if (!node.outVariables)
                node.outVariables = [];
            node.outVariables.push({ source: '', target: '', variables: 'all' });
        }
        return this;
    }
    next(targetID) {
        this.workflow.sequenceFlow(this.id, targetID);
        return this.workflow;
    }
    connectTo(targetID) {
        return this.next(targetID);
    }
    builder() {
        return this.workflow;
    }
}
function formatDMNValue(val) {
    if (val === null || val === undefined) {
        return "-";
    }
    if (typeof val === 'string') {
        const s = val.trim();
        for (const op of ["<=", ">=", "!=", "<>", "<", ">"]) {
            if (s.startsWith(op)) {
                return s;
            }
        }
        if (s === "true" || s === "false") {
            return s;
        }
        if (!isNaN(Number(s)) && s !== "") {
            return s;
        }
        return `"${s}"`;
    }
    if (typeof val === 'boolean') {
        return val ? "true" : "false";
    }
    return String(val);
}
export class BusinessRuleTaskBuilder {
    workflow;
    id;
    constructor(workflow, id) {
        this.workflow = workflow;
        this.id = id;
    }
    mapDecisionResult(mapDecisionResult) {
        const node = this.workflow.findNode(this.id);
        if (node)
            node.mapDecisionResult = mapDecisionResult;
        return this;
    }
    resultVariable(resultVar) {
        const node = this.workflow.findNode(this.id);
        if (node)
            node.resultVar = resultVar;
        return this;
    }
    hitPolicy(hitPolicy) {
        const node = this.workflow.findNode(this.id);
        if (node)
            node.hitPolicy = hitPolicy;
        return this;
    }
    input(expression, type) {
        const node = this.workflow.findNode(this.id);
        if (node) {
            if (!node.inputs)
                node.inputs = [];
            node.inputs.push({ expression, type });
        }
        return this;
    }
    output(name, type) {
        const node = this.workflow.findNode(this.id);
        if (node) {
            if (!node.outputs)
                node.outputs = [];
            node.outputs.push({ name, type });
        }
        return this;
    }
    rule() {
        return new DMNRuleBuilder(this);
    }
    next(targetID) {
        this.workflow.sequenceFlow(this.id, targetID);
        return this.workflow;
    }
    connectTo(targetID) {
        return this.next(targetID);
    }
    builder() {
        return this.workflow;
    }
}
export class DMNRuleBuilder {
    taskBuilder;
    inputs = {};
    outputs = {};
    constructor(taskBuilder) {
        this.taskBuilder = taskBuilder;
    }
    when(expression, val) {
        this.inputs[expression] = formatDMNValue(val);
        return this;
    }
    then(name, val) {
        this.outputs[name] = formatDMNValue(val);
        return this;
    }
    commit() {
        const node = this.taskBuilder.workflow.findNode(this.taskBuilder.id);
        if (!node)
            return;
        if (!node.rules)
            node.rules = [];
        const inputsList = node.inputs || [];
        const outputsList = node.outputs || [];
        const ruleInputs = [];
        for (const inVal of inputsList) {
            const expr = inVal.expression;
            if (expr in this.inputs) {
                ruleInputs.push(this.inputs[expr]);
            }
            else {
                ruleInputs.push("-");
            }
        }
        const ruleOutputs = [];
        for (const outVal of outputsList) {
            const name = outVal.name;
            if (name in this.outputs) {
                ruleOutputs.push(this.outputs[name]);
            }
            else {
                ruleOutputs.push("-");
            }
        }
        node.rules.push({
            inputs: ruleInputs,
            outputs: ruleOutputs
        });
    }
    rule() {
        this.commit();
        return this.taskBuilder.rule();
    }
    next(targetID) {
        this.commit();
        return this.taskBuilder.next(targetID);
    }
    connectTo(targetID) {
        return this.next(targetID);
    }
    builder() {
        this.commit();
        return this.taskBuilder.builder();
    }
    mapDecisionResult(mapDecisionResult) {
        this.commit();
        return this.taskBuilder.mapDecisionResult(mapDecisionResult);
    }
    resultVariable(resultVar) {
        this.commit();
        return this.taskBuilder.resultVariable(resultVar);
    }
}
export class Branch {
    workflow;
    gatewayID;
    currentNodeID;
    isConditional;
    condition;
    hasEnded = false;
    constructor(workflow, gatewayID, currentNodeID, isConditional, condition) {
        this.workflow = workflow;
        this.gatewayID = gatewayID;
        this.currentNodeID = currentNodeID;
        this.isConditional = isConditional;
        this.condition = condition;
    }
    connectNode(id) {
        if (this.hasEnded)
            return;
        const merges = this.workflow.pendingMerges;
        if (merges && merges.length > 0) {
            for (const sourceID of merges) {
                this.workflow.sequenceFlow(sourceID, id);
            }
            this.workflow.pendingMerges = [];
            this.currentNodeID = id;
            return;
        }
        if (this.currentNodeID === this.gatewayID) {
            if (this.isConditional) {
                this.workflow.sequenceFlowWithCondition(this.gatewayID, id, this.condition || '');
            }
            else {
                this.workflow.sequenceFlow(this.gatewayID, id);
            }
        }
        else if (this.currentNodeID && this.currentNodeID !== id) {
            this.workflow.sequenceFlow(this.currentNodeID, id);
        }
        this.currentNodeID = id;
    }
    user(id, name, config) {
        const builder = this.workflow.userTask(id, name);
        if (config)
            config(builder);
        this.connectNode(id);
        return this;
    }
    service(id, name, topic, config) {
        const builder = this.workflow.serviceTask(id, name, topic);
        if (config)
            config(builder);
        this.connectNode(id);
        return this;
    }
    ai(id, name, config) {
        const builder = this.workflow.aiTask(id, name);
        if (config)
            config(builder);
        this.connectNode(id);
        return this;
    }
    end(id, name) {
        this.workflow.endEvent(id, name);
        this.connectNode(id);
        this.hasEnded = true;
        return this;
    }
    if(condition, thenFn) {
        const gwID = `gw_${this.currentNodeID}_decision`;
        this.workflow.exclusiveGateway(gwID, 'Decision Gateway');
        this.connectNode(gwID);
        const thenBranch = new Branch(this.workflow, gwID, gwID, true, condition);
        thenFn(thenBranch);
        if (!thenBranch.hasEnded && thenBranch.currentNodeID !== gwID) {
            this.workflow.pendingMerges.push(thenBranch.currentNodeID);
        }
        return new IfElseBranchBuilder(this, gwID);
    }
}
export class IfElseBuilder {
    workflow;
    gatewayID;
    constructor(workflow, gatewayID) {
        this.workflow = workflow;
        this.gatewayID = gatewayID;
    }
    else(elseFn) {
        const elseBranch = new Branch(this.workflow, this.gatewayID, this.gatewayID, false);
        elseFn(elseBranch);
        if (!elseBranch.hasEnded && elseBranch.currentNodeID !== this.gatewayID) {
            this.workflow.pendingMerges.push(elseBranch.currentNodeID);
        }
        return this.workflow;
    }
}
export class IfElseBranchBuilder {
    branch;
    gatewayID;
    constructor(branch, gatewayID) {
        this.branch = branch;
        this.gatewayID = gatewayID;
    }
    else(elseFn) {
        const elseBranch = new Branch(this.branch.workflow, this.gatewayID, this.gatewayID, false);
        elseFn(elseBranch);
        if (!elseBranch.hasEnded && elseBranch.currentNodeID !== this.gatewayID) {
            this.branch.workflow.pendingMerges.push(elseBranch.currentNodeID);
        }
        return this.branch;
    }
}
export class Workflow {
    id;
    name;
    nodes = [];
    flows = [];
    compiledModulePromise = null;
    currentNodeID = '';
    pendingMerges = [];
    constructor(id, name, wasmInput) {
        this.id = id;
        this.name = name;
        if (wasmInput !== undefined) {
            this.initCompiler(wasmInput);
        }
    }
    initCompiler(wasmInput) {
        let wasmBuffer;
        if (wasmInput instanceof Uint8Array) {
            wasmBuffer = wasmInput;
        }
        else {
            if (!fs.existsSync(wasmInput)) {
                throw new Error(`core.wasm not found at ${wasmInput}. Please compile it or specify a valid path.`);
            }
            wasmBuffer = new Uint8Array(fs.readFileSync(wasmInput));
        }
        const decompressedBytes = decompressWasmIfNeeded(wasmBuffer);
        this.compiledModulePromise = WebAssembly.compile(decompressedBytes);
    }
    connectNode(id) {
        if (this.pendingMerges.length > 0) {
            for (const sourceID of this.pendingMerges) {
                this.sequenceFlow(sourceID, id);
            }
            this.pendingMerges = [];
        }
        else if (this.currentNodeID && this.currentNodeID !== id) {
            this.sequenceFlow(this.currentNodeID, id);
        }
        this.currentNodeID = id;
    }
    start(id) {
        this.startEvent(id);
        this.connectNode(id);
        return this;
    }
    end(id, name) {
        this.endEvent(id, name);
        this.connectNode(id);
        this.currentNodeID = '';
        return this;
    }
    user(id, name, config) {
        const builder = this.userTask(id, name);
        if (config)
            config(builder);
        this.connectNode(id);
        return this;
    }
    service(id, name, topic, config) {
        const builder = this.serviceTask(id, name, topic);
        if (config)
            config(builder);
        this.connectNode(id);
        return this;
    }
    ai(id, name, config) {
        const builder = this.aiTask(id, name);
        if (config)
            config(builder);
        this.connectNode(id);
        return this;
    }
    if(condition, thenFn) {
        const gwID = `gw_${this.currentNodeID}_decision`;
        this.exclusiveGateway(gwID, 'Decision Gateway');
        if (this.currentNodeID) {
            this.sequenceFlow(this.currentNodeID, gwID);
        }
        const thenBranch = new Branch(this, gwID, gwID, true, condition);
        thenFn(thenBranch);
        if (!thenBranch.hasEnded && thenBranch.currentNodeID !== gwID) {
            this.pendingMerges.push(thenBranch.currentNodeID);
        }
        return new IfElseBuilder(this, gwID);
    }
    startEvent(id) {
        const node = { type: 'startEvent', id, name: 'Start' };
        this.nodes.push(node);
        return new StartEventBuilder(this, id);
    }
    endEvent(id, name) {
        const node = { type: 'endEvent', id, name };
        this.nodes.push(node);
        return this;
    }
    serviceTask(id, name, topic) {
        const node = { type: 'serviceTask', id, name, topic };
        this.nodes.push(node);
        return new ServiceTaskBuilder(this, id);
    }
    aiTask(id, name) {
        const node = { type: 'aiTask', id, name };
        this.nodes.push(node);
        return new AITaskBuilder(this, id);
    }
    userTask(id, name) {
        const node = { type: 'userTask', id, name };
        this.nodes.push(node);
        return new UserTaskBuilder(this, id);
    }
    exclusiveGateway(id, name) {
        const node = { type: 'exclusiveGateway', id, name };
        this.nodes.push(node);
        return new ExclusiveGatewayBuilder(this, id);
    }
    parallelGateway(id, name) {
        const node = { type: 'parallelGateway', id, name };
        this.nodes.push(node);
        return new ParallelGatewayBuilder(this, id);
    }
    eventBasedGateway(id, name) {
        const node = { type: 'eventBasedGateway', id, name };
        this.nodes.push(node);
        return new EventBasedGatewayBuilder(this, id);
    }
    callActivity(id, name, calledElement) {
        const node = { type: 'callActivity', id, name, calledElement };
        this.nodes.push(node);
        return new CallActivityBuilder(this, id);
    }
    businessRuleTask(id, name, decisionRef) {
        const node = { type: 'businessRuleTask', id, name, decisionRef };
        this.nodes.push(node);
        return new BusinessRuleTaskBuilder(this, id);
    }
    sequenceFlow(source, target) {
        this.flows.push({ id: `flow-${source}-${target}`, source, target, condition: '' });
        return this;
    }
    sequenceFlowWithCondition(source, target, condition) {
        this.flows.push({ id: `flow-${source}-${target}`, source, target, condition });
        return this;
    }
    findNode(id) {
        return this.nodes.find(n => n.id === id);
    }
    toAST() {
        return {
            id: this.id,
            name: this.name,
            nodes: this.nodes,
            flows: this.flows
        };
    }
    async buildXML(wasmInput) {
        if (!this.compiledModulePromise) {
            if (wasmInput !== undefined) {
                this.initCompiler(wasmInput);
            }
            else {
                this.initCompiler(defaultWasmPath);
            }
        }
        const wasmModule = await this.compiledModulePromise;
        const wasi = new WASI({
            version: 'preview1',
            args: [],
            env: {},
            preopens: {}
        });
        const instance = await WebAssembly.instantiate(wasmModule, {
            wasi_snapshot_preview1: wasi.wasiImport
        });
        wasi.start(instance);
        const exports = instance.exports;
        const allocate = exports.allocate;
        const deallocate = exports.deallocate;
        const compileWorkflow = exports.compileWorkflow;
        const memory = exports.memory;
        const astJson = JSON.stringify(this.toAST());
        const encoder = new TextEncoder();
        const astBytes = encoder.encode(astJson);
        const inputPtr = allocate(astBytes.length);
        const memView = new Uint8Array(memory.buffer);
        memView.set(astBytes, inputPtr);
        const resultPacked = compileWorkflow(inputPtr, astBytes.length);
        const resultPtr = Number(resultPacked >> 32n);
        const resultSize = Number(resultPacked & 0xffffffffn);
        const resultBytes = new Uint8Array(memory.buffer, resultPtr, resultSize);
        const decoder = new TextDecoder();
        const resultJson = decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        deallocate(inputPtr, astBytes.length);
        deallocate(resultPtr, resultSize);
        if (result.error) {
            throw new Error(`Wasm workflow compilation failed: ${result.error}`);
        }
        return result.xml;
    }
}
