import { WASI } from 'node:wasi';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as zlib from 'node:zlib';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultWasmPath = path.resolve(__dirname, 'core.wasm');
const compiledModuleCache = new Map();
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
function populateNodeProperties(node, opts) {
    if (!opts)
        return;
    for (const [key, val] of Object.entries(opts)) {
        let targetKey = key;
        if (key === 'wasm')
            targetKey = 'wasmPath';
        if (key === 'resultVariable')
            targetKey = 'resultVar';
        if (key.includes('_')) {
            targetKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            if (targetKey === 'wasm')
                targetKey = 'wasmPath';
            if (targetKey === 'resultVariable')
                targetKey = 'resultVar';
        }
        node[targetKey] = val;
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
    user(id, name, opts) {
        this.workflow.userTask(id, name, opts);
        this.connectNode(id);
        return this;
    }
    service(id, name, topic, opts) {
        this.workflow.serviceTask(id, name, topic, opts);
        this.connectNode(id);
        return this;
    }
    ai(id, name, opts) {
        this.workflow.aiTask(id, name, opts);
        this.connectNode(id);
        return this;
    }
    call(id, name, calledElement, opts) {
        this.workflow.callActivity(id, name, calledElement, opts);
        this.connectNode(id);
        return this;
    }
    businessRule(id, name, decisionRef, opts) {
        this.workflow.businessRuleTask(id, name, decisionRef, opts);
        this.connectNode(id);
        return this;
    }
    end(id, name) {
        this.workflow.endEvent(id, name);
        this.connectNode(id);
        this.hasEnded = true;
        return this;
    }
    when(condition) {
        const gwID = `gw_${this.currentNodeID}_decision`;
        this.workflow.exclusiveGateway(gwID, 'Decision Gateway');
        this.connectNode(gwID);
        const condStr = typeof condition === 'string' ? condition : condition.toString();
        return new WhenBranchBuilder(this, gwID, condStr);
    }
}
export class WhenBuilder {
    workflow;
    gatewayID;
    condition;
    constructor(workflow, gatewayID, condition) {
        this.workflow = workflow;
        this.gatewayID = gatewayID;
        this.condition = condition;
    }
    then(thenFn) {
        const thenBranch = new Branch(this.workflow, this.gatewayID, this.gatewayID, true, this.condition);
        thenFn(thenBranch);
        if (!thenBranch.hasEnded && thenBranch.currentNodeID !== this.gatewayID) {
            this.workflow.pendingMerges.push(thenBranch.currentNodeID);
        }
        return new ThenBuilder(this.workflow, this.gatewayID);
    }
}
export class ThenBuilder {
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
    otherwise(elseFn) {
        return this.else(elseFn);
    }
}
export class WhenBranchBuilder {
    branch;
    gatewayID;
    condition;
    constructor(branch, gatewayID, condition) {
        this.branch = branch;
        this.gatewayID = gatewayID;
        this.condition = condition;
    }
    then(thenFn) {
        const thenBranch = new Branch(this.branch.workflow, this.gatewayID, this.gatewayID, true, this.condition);
        thenFn(thenBranch);
        if (!thenBranch.hasEnded && thenBranch.currentNodeID !== this.gatewayID) {
            this.branch.workflow.pendingMerges.push(thenBranch.currentNodeID);
        }
        return new ThenBranchBuilder(this.branch, this.gatewayID);
    }
}
export class ThenBranchBuilder {
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
    otherwise(elseFn) {
        return this.else(elseFn);
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
        const cacheKey = wasmInput;
        if (compiledModuleCache.has(cacheKey)) {
            this.compiledModulePromise = compiledModuleCache.get(cacheKey);
            return;
        }
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
        const promise = WebAssembly.compile(decompressedBytes);
        compiledModuleCache.set(cacheKey, promise);
        this.compiledModulePromise = promise;
    }
    connectNode(id) {
        const node = this.findNode(id);
        const hasStart = this.nodes.some(n => n.type === 'startEvent');
        if (!hasStart && node && node.type !== 'startEvent') {
            this.startEvent('start');
            this.sequenceFlow('start', id);
            this.currentNodeID = id;
            return;
        }
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
    start(id = 'start') {
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
    user(id, name, opts) {
        this.userTask(id, name, opts);
        this.connectNode(id);
        return this;
    }
    service(id, name, topic, opts) {
        this.serviceTask(id, name, topic, opts);
        this.connectNode(id);
        return this;
    }
    ai(id, name, opts) {
        this.aiTask(id, name, opts);
        this.connectNode(id);
        return this;
    }
    call(id, name, calledElement, opts) {
        this.callActivity(id, name, calledElement, opts);
        this.connectNode(id);
        return this;
    }
    businessRule(id, name, decisionRef, opts) {
        this.businessRuleTask(id, name, decisionRef, opts);
        this.connectNode(id);
        return this;
    }
    when(condition) {
        const gwID = `gw_${this.currentNodeID}_decision`;
        this.exclusiveGateway(gwID, 'Decision Gateway');
        this.connectNode(gwID);
        const condStr = typeof condition === 'string' ? condition : condition.toString();
        return new WhenBuilder(this, gwID, condStr);
    }
    startEvent(id = 'start') {
        const node = { type: 'startEvent', id, name: 'Start' };
        this.nodes.push(node);
        this.currentNodeID = id;
        return this;
    }
    endEvent(id, name) {
        const node = { type: 'endEvent', id, name };
        this.nodes.push(node);
        return this;
    }
    serviceTask(id, name, topic, opts) {
        const node = { type: 'serviceTask', id, name, topic };
        populateNodeProperties(node, opts);
        this.nodes.push(node);
        return this;
    }
    aiTask(id, name, opts) {
        const node = { type: 'aiServiceTask', id, name };
        populateNodeProperties(node, opts);
        this.nodes.push(node);
        return this;
    }
    userTask(id, name, opts) {
        const node = { type: 'userTask', id, name };
        populateNodeProperties(node, opts);
        this.nodes.push(node);
        return this;
    }
    exclusiveGateway(id, name) {
        const node = { type: 'exclusiveGateway', id, name };
        this.nodes.push(node);
        return this;
    }
    parallelGateway(id, name) {
        const node = { type: 'parallelGateway', id, name };
        this.nodes.push(node);
        return this;
    }
    eventBasedGateway(id, name) {
        const node = { type: 'eventBasedGateway', id, name };
        this.nodes.push(node);
        return this;
    }
    callActivity(id, name, calledElement, opts) {
        const node = { type: 'callActivity', id, name, calledElement };
        populateNodeProperties(node, opts);
        this.nodes.push(node);
        return this;
    }
    businessRuleTask(id, name, decisionRef, opts) {
        const node = { type: 'businessRuleTask', id, name, decisionRef };
        populateNodeProperties(node, opts);
        this.nodes.push(node);
        return this;
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
        const nodes = [...this.nodes];
        const flows = [...this.flows];
        const sourceIDs = new Set(flows.map(f => f.source));
        for (const node of this.nodes) {
            if (node.type === 'endEvent' || node.type === 'startEvent') {
                continue;
            }
            if (!sourceIDs.has(node.id)) {
                const endID = `end_${node.id}`;
                nodes.push({ type: 'endEvent', id: endID, name: 'Process Finished' });
                flows.push({ id: `flow-${node.id}-${endID}`, source: node.id, target: endID, condition: '' });
            }
        }
        return {
            id: this.id,
            name: this.name,
            nodes,
            flows
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
export class Expression extends String {
}
export class Variable {
    name;
    constructor(name) {
        this.name = name;
    }
    eq(value) {
        const valStr = typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value);
        return new Expression(`${this.name} == ${valStr}`);
    }
    ne(value) {
        const valStr = typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value);
        return new Expression(`${this.name} != ${valStr}`);
    }
    gt(value) {
        return new Expression(`${this.name} > ${value}`);
    }
    gte(value) {
        return new Expression(`${this.name} >= ${value}`);
    }
    lt(value) {
        return new Expression(`${this.name} < ${value}`);
    }
    lte(value) {
        return new Expression(`${this.name} <= ${value}`);
    }
}
export function V(name) {
    return new Variable(name);
}
export function v(name) {
    return new Variable(name);
}
