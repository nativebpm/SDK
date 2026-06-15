import { WASI } from 'node:wasi';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as zlib from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultWasmPath = path.resolve(__dirname, 'core.wasm');
const compiledModuleCache = new Map<any, Promise<WebAssembly.Module>>();

function decompressWasmIfNeeded(data: Uint8Array): Uint8Array {
  if (data.length >= 4 && data[0] === 0x00 && data[1] === 0x61 && data[2] === 0x73 && data[3] === 0x6d) {
    return data;
  }
  // Gzip check: 0x1f 0x8b
  if (data.length >= 2 && data[0] === 0x1f && data[1] === 0x8b) {
    try {
      return new Uint8Array(zlib.gunzipSync(data));
    } catch (err: any) {
      throw new Error(`failed to decompress gzip wasm: ${err.message}`);
    }
  }
  // Brotli check
  try {
    const decompressed = zlib.brotliDecompressSync(data);
    if (decompressed.length >= 4 && decompressed[0] === 0x00 && decompressed[1] === 0x61 && decompressed[2] === 0x73 && decompressed[3] === 0x6d) {
      return new Uint8Array(decompressed);
    }
  } catch (err) {
    // ignore and fall through
  }
  throw new Error("unsupported or invalid WebAssembly binary format (failed to decompress or identify magic header)");
}

export interface InVariable {
  source: string;
  target: string;
  variables: string;
  local: boolean;
}

export interface OutVariable {
  source: string;
  target: string;
  variables: string;
}

export interface NodeAST {
  type: string;
  id: string;
  name: string;
  topic?: string;
  wasmPath?: string;
  provider?: string;
  model?: string;
  prompt?: string;
  systemInstruction?: string;
  responseSchema?: string;
  temperature?: number;
  resultVar?: string;
  assignee?: string;
  candidateGroups?: string;
  dueDate?: string;
  calledElement?: string;
  inVariables?: InVariable[];
  outVariables?: OutVariable[];
  decisionRef?: string;
  mapDecisionResult?: string;
  hitPolicy?: string;
  inputs?: Array<{ expression: string; type: string }>;
  outputs?: Array<{ name: string; type: string }>;
  rules?: Array<{ inputs: string[]; outputs: string[] }>;
}

export interface FlowAST {
  id: string;
  source: string;
  target: string;
  condition: string;
}

export interface WorkflowAST {
  id: string;
  name: string;
  nodes: NodeAST[];
  flows: FlowAST[];
}

export class StartEventBuilder {
  constructor(private workflow: Workflow, private id: string) {}

  public next(targetID: string): Workflow {
    this.workflow.sequenceFlow(this.id, targetID);
    return this.workflow;
  }

  public connectTo(targetID: string): Workflow {
    return this.next(targetID);
  }

  public builder(): Workflow { return this.workflow; }
}

export class ServiceTaskBuilder {
  constructor(private workflow: Workflow, private id: string) {}

  public wasmPath(path: string): ServiceTaskBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) node.wasmPath = path;
    return this;
  }

  public wasm(alias: string): ServiceTaskBuilder {
    return this.wasmPath(alias);
  }

  public next(targetID: string): Workflow {
    this.workflow.sequenceFlow(this.id, targetID);
    return this.workflow;
  }

  public connectTo(targetID: string): Workflow {
    return this.next(targetID);
  }

  public builder(): Workflow {
    return this.workflow;
  }
}

export class AITaskBuilder {
  constructor(private workflow: Workflow, private id: string) {}

  public provider(p: string): AITaskBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) node.provider = p;
    return this;
  }

  public model(m: string): AITaskBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) node.model = m;
    return this;
  }

  public prompt(p: string): AITaskBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) node.prompt = p;
    return this;
  }

  public systemInstruction(si: string): AITaskBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) node.systemInstruction = si;
    return this;
  }

  public responseSchema(rs: string): AITaskBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) node.responseSchema = rs;
    return this;
  }

  public temperature(t: number): AITaskBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) node.temperature = t;
    return this;
  }

  public resultVar(rv: string): AITaskBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) node.resultVar = rv;
    return this;
  }

  public next(targetID: string): Workflow {
    this.workflow.sequenceFlow(this.id, targetID);
    return this.workflow;
  }

  public connectTo(targetID: string): Workflow {
    return this.next(targetID);
  }

  public builder(): Workflow {
    return this.workflow;
  }
}

export class UserTaskBuilder {
  constructor(private workflow: Workflow, private id: string) {}

  public assignee(a: string): UserTaskBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) node.assignee = a;
    return this;
  }

  public candidateGroups(cg: string): UserTaskBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) node.candidateGroups = cg;
    return this;
  }

  public dueDate(d: string): UserTaskBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) node.dueDate = d;
    return this;
  }

  public next(targetID: string): Workflow {
    this.workflow.sequenceFlow(this.id, targetID);
    return this.workflow;
  }

  public connectTo(targetID: string): Workflow {
    return this.next(targetID);
  }

  public builder(): Workflow {
    return this.workflow;
  }
}

export class ExclusiveGatewayBuilder {
  constructor(private workflow: Workflow, private id: string) {}

  public next(targetID: string): Workflow {
    this.workflow.sequenceFlow(this.id, targetID);
    return this.workflow;
  }

  public nextWithCondition(targetID: string, condition: string): Workflow {
    this.workflow.sequenceFlowWithCondition(this.id, targetID, condition);
    return this.workflow;
  }

  public connectTo(targetID: string): Workflow {
    return this.next(targetID);
  }

  public builder(): Workflow {
    return this.workflow;
  }
}

export class ParallelGatewayBuilder {
  constructor(private workflow: Workflow, private id: string) {}

  public next(targetID: string): Workflow {
    this.workflow.sequenceFlow(this.id, targetID);
    return this.workflow;
  }

  public connectTo(targetID: string): Workflow {
    return this.next(targetID);
  }

  public builder(): Workflow {
    return this.workflow;
  }
}

export class EventBasedGatewayBuilder {
  constructor(private workflow: Workflow, private id: string) {}

  public next(targetID: string): Workflow {
    this.workflow.sequenceFlow(this.id, targetID);
    return this.workflow;
  }

  public connectTo(targetID: string): Workflow {
    return this.next(targetID);
  }

  public builder(): Workflow {
    return this.workflow;
  }
}

export class CallActivityBuilder {
  constructor(private workflow: Workflow, private id: string) {}

  public in(source: string, target: string): CallActivityBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) {
      if (!node.inVariables) node.inVariables = [];
      node.inVariables.push({ source, target, variables: '', local: false });
    }
    return this;
  }

  public inAll(): CallActivityBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) {
      if (!node.inVariables) node.inVariables = [];
      node.inVariables.push({ source: '', target: '', variables: 'all', local: false });
    }
    return this;
  }

  public out(source: string, target: string): CallActivityBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) {
      if (!node.outVariables) node.outVariables = [];
      node.outVariables.push({ source, target, variables: '' });
    }
    return this;
  }

  public outAll(): CallActivityBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) {
      if (!node.outVariables) node.outVariables = [];
      node.outVariables.push({ source: '', target: '', variables: 'all' });
    }
    return this;
  }

  public next(targetID: string): Workflow {
    this.workflow.sequenceFlow(this.id, targetID);
    return this.workflow;
  }

  public connectTo(targetID: string): Workflow {
    return this.next(targetID);
  }

  public builder(): Workflow {
    return this.workflow;
  }
}

function formatDMNValue(val: any): string {
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
  constructor(public workflow: Workflow, public id: string) {}

  public mapDecisionResult(mapDecisionResult: string): BusinessRuleTaskBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) node.mapDecisionResult = mapDecisionResult;
    return this;
  }

  public resultVariable(resultVar: string): BusinessRuleTaskBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) node.resultVar = resultVar;
    return this;
  }

  public hitPolicy(hitPolicy: string): BusinessRuleTaskBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) node.hitPolicy = hitPolicy;
    return this;
  }

  public input(expression: string, type: string): BusinessRuleTaskBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) {
      if (!node.inputs) node.inputs = [];
      node.inputs.push({ expression, type });
    }
    return this;
  }

  public output(name: string, type: string): BusinessRuleTaskBuilder {
    const node = this.workflow.findNode(this.id);
    if (node) {
      if (!node.outputs) node.outputs = [];
      node.outputs.push({ name, type });
    }
    return this;
  }

  public rule(): DMNRuleBuilder {
    return new DMNRuleBuilder(this);
  }

  public next(targetID: string): Workflow {
    this.workflow.sequenceFlow(this.id, targetID);
    return this.workflow;
  }

  public connectTo(targetID: string): Workflow {
    return this.next(targetID);
  }

  public builder(): Workflow {
    return this.workflow;
  }
}

export class DMNRuleBuilder {
  private inputs: Record<string, string> = {};
  private outputs: Record<string, string> = {};

  constructor(private taskBuilder: BusinessRuleTaskBuilder) {}

  public when(expression: string, val: any): DMNRuleBuilder {
    this.inputs[expression] = formatDMNValue(val);
    return this;
  }

  public then(name: string, val: any): DMNRuleBuilder {
    this.outputs[name] = formatDMNValue(val);
    return this;
  }

  private commit(): void {
    const node = this.taskBuilder.workflow.findNode(this.taskBuilder.id);
    if (!node) return;
    if (!node.rules) node.rules = [];

    const inputsList = node.inputs || [];
    const outputsList = node.outputs || [];

    const ruleInputs: string[] = [];
    for (const inVal of inputsList) {
      const expr = inVal.expression;
      if (expr in this.inputs) {
        ruleInputs.push(this.inputs[expr]);
      } else {
        ruleInputs.push("-");
      }
    }

    const ruleOutputs: string[] = [];
    for (const outVal of outputsList) {
      const name = outVal.name;
      if (name in this.outputs) {
        ruleOutputs.push(this.outputs[name]);
      } else {
        ruleOutputs.push("-");
      }
    }

    node.rules.push({
      inputs: ruleInputs,
      outputs: ruleOutputs
    });
  }

  public rule(): DMNRuleBuilder {
    this.commit();
    return this.taskBuilder.rule();
  }

  public next(targetID: string): Workflow {
    this.commit();
    return this.taskBuilder.next(targetID);
  }

  public connectTo(targetID: string): Workflow {
    return this.next(targetID);
  }

  public builder(): Workflow {
    this.commit();
    return this.taskBuilder.builder();
  }

  public mapDecisionResult(mapDecisionResult: string): BusinessRuleTaskBuilder {
    this.commit();
    return this.taskBuilder.mapDecisionResult(mapDecisionResult);
  }

  public resultVariable(resultVar: string): BusinessRuleTaskBuilder {
    this.commit();
    return this.taskBuilder.resultVariable(resultVar);
  }
}

export class Branch {
  public hasEnded: boolean = false;
  constructor(
    public workflow: Workflow,
    public gatewayID: string,
    public currentNodeID: string,
    public isConditional: boolean,
    public condition?: string
  ) {}

  private connectNode(id: string): void {
    if (this.hasEnded) return;

    const merges = (this.workflow as any).pendingMerges as string[];
    if (merges && merges.length > 0) {
      for (const sourceID of merges) {
        this.workflow.sequenceFlow(sourceID, id);
      }
      (this.workflow as any).pendingMerges = [];
      this.currentNodeID = id;
      return;
    }

    if (this.currentNodeID === this.gatewayID) {
      if (this.isConditional) {
        this.workflow.sequenceFlowWithCondition(this.gatewayID, id, this.condition || '');
      } else {
        this.workflow.sequenceFlow(this.gatewayID, id);
      }
    } else if (this.currentNodeID && this.currentNodeID !== id) {
      this.workflow.sequenceFlow(this.currentNodeID, id);
    }
    this.currentNodeID = id;
  }

  public user(id: string, name: string, config?: (t: UserTaskBuilder) => void): Branch {
    const builder = this.workflow.userTask(id, name);
    if (config) config(builder);
    this.connectNode(id);
    return this;
  }

  public service(id: string, name: string, topic: string, config?: (t: ServiceTaskBuilder) => void): Branch {
    const builder = this.workflow.serviceTask(id, name, topic);
    if (config) config(builder);
    this.connectNode(id);
    return this;
  }

  public ai(id: string, name: string, config?: (t: AITaskBuilder) => void): Branch {
    const builder = this.workflow.aiTask(id, name);
    if (config) config(builder);
    this.connectNode(id);
    return this;
  }

  public end(id: string, name: string): Branch {
    this.workflow.endEvent(id, name);
    this.connectNode(id);
    this.hasEnded = true;
    return this;
  }

  public if(condition: string | { toString(): string }, thenFn: (b: Branch) => void): IfElseBranchBuilder {
    const gwID = `gw_${this.currentNodeID}_decision`;
    this.workflow.exclusiveGateway(gwID, 'Decision Gateway');
    this.connectNode(gwID);

    const condStr = typeof condition === 'string' ? condition : condition.toString();
    const thenBranch = new Branch(this.workflow, gwID, gwID, true, condStr);
    thenFn(thenBranch);

    if (!thenBranch.hasEnded && thenBranch.currentNodeID !== gwID) {
      ((this.workflow as any).pendingMerges as string[]).push(thenBranch.currentNodeID);
    }

    return new IfElseBranchBuilder(this, gwID);
  }
}

export class IfElseBuilder {
  constructor(public workflow: Workflow, public gatewayID: string) {}

  public else(elseFn: (b: Branch) => void): Workflow {
    const elseBranch = new Branch(this.workflow, this.gatewayID, this.gatewayID, false);
    elseFn(elseBranch);

    if (!elseBranch.hasEnded && elseBranch.currentNodeID !== this.gatewayID) {
      ((this.workflow as any).pendingMerges as string[]).push(elseBranch.currentNodeID);
    }

    return this.workflow;
  }
}

export class IfElseBranchBuilder {
  constructor(public branch: Branch, public gatewayID: string) {}

  public else(elseFn: (b: Branch) => void): Branch {
    const elseBranch = new Branch(this.branch.workflow, this.gatewayID, this.gatewayID, false);
    elseFn(elseBranch);

    if (!elseBranch.hasEnded && elseBranch.currentNodeID !== this.gatewayID) {
      ((this.branch.workflow as any).pendingMerges as string[]).push(elseBranch.currentNodeID);
    }

    return this.branch;
  }
}

export class Workflow {
  private id: string;
  private name: string;
  private nodes: NodeAST[] = [];
  private flows: FlowAST[] = [];
  private compiledModulePromise: Promise<WebAssembly.Module> | null = null;
  private currentNodeID: string = '';
  private pendingMerges: string[] = [];

  constructor(id: string, name: string, wasmInput?: string | Uint8Array) {
    this.id = id;
    this.name = name;
    if (wasmInput !== undefined) {
      this.initCompiler(wasmInput);
    }
  }

  private initCompiler(wasmInput: string | Uint8Array): void {
    const cacheKey = wasmInput;
    if (compiledModuleCache.has(cacheKey)) {
      this.compiledModulePromise = compiledModuleCache.get(cacheKey)!;
      return;
    }

    let wasmBuffer: Uint8Array;
    if (wasmInput instanceof Uint8Array) {
      wasmBuffer = wasmInput;
    } else {
      if (!fs.existsSync(wasmInput)) {
        throw new Error(`core.wasm not found at ${wasmInput}. Please compile it or specify a valid path.`);
      }
      wasmBuffer = new Uint8Array(fs.readFileSync(wasmInput));
    }
    const decompressedBytes = decompressWasmIfNeeded(wasmBuffer);
    const promise = WebAssembly.compile(decompressedBytes as any);
    compiledModuleCache.set(cacheKey, promise);
    this.compiledModulePromise = promise;
  }

  private connectNode(id: string): void {
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
    } else if (this.currentNodeID && this.currentNodeID !== id) {
      this.sequenceFlow(this.currentNodeID, id);
    }
    this.currentNodeID = id;
  }

  public start(id: string = 'start'): Workflow {
    this.startEvent(id);
    this.connectNode(id);
    return this;
  }

  public end(id: string, name: string): Workflow {
    this.endEvent(id, name);
    this.connectNode(id);
    this.currentNodeID = '';
    return this;
  }

  public user(id: string, name: string, config?: (t: UserTaskBuilder) => void): Workflow {
    const builder = this.userTask(id, name);
    if (config) config(builder);
    this.connectNode(id);
    return this;
  }

  public service(id: string, name: string, topic: string, config?: (t: ServiceTaskBuilder) => void): Workflow {
    const builder = this.serviceTask(id, name, topic);
    if (config) config(builder);
    this.connectNode(id);
    return this;
  }

  public ai(id: string, name: string, config?: (t: AITaskBuilder) => void): Workflow {
    const builder = this.aiTask(id, name);
    if (config) config(builder);
    this.connectNode(id);
    return this;
  }

  public if(condition: string | { toString(): string }, thenFn: (b: Branch) => void): IfElseBuilder {
    const gwID = `gw_${this.currentNodeID}_decision`;
    this.exclusiveGateway(gwID, 'Decision Gateway');
    this.connectNode(gwID);

    const condStr = typeof condition === 'string' ? condition : condition.toString();
    const thenBranch = new Branch(this, gwID, gwID, true, condStr);
    thenFn(thenBranch);

    if (!thenBranch.hasEnded && thenBranch.currentNodeID !== gwID) {
      this.pendingMerges.push(thenBranch.currentNodeID);
    }

    return new IfElseBuilder(this, gwID);
  }

  public startEvent(id: string = 'start'): StartEventBuilder {
    const node: NodeAST = { type: 'startEvent', id, name: 'Start' };
    this.nodes.push(node);
    return new StartEventBuilder(this, id);
  }

  public endEvent(id: string, name: string): Workflow {
    const node: NodeAST = { type: 'endEvent', id, name };
    this.nodes.push(node);
    return this;
  }

  public serviceTask(id: string, name: string, topic: string): ServiceTaskBuilder {
    const node: NodeAST = { type: 'serviceTask', id, name, topic };
    this.nodes.push(node);
    return new ServiceTaskBuilder(this, id);
  }

  public aiTask(id: string, name: string): AITaskBuilder {
    const node: NodeAST = { type: 'aiServiceTask', id, name };
    this.nodes.push(node);
    return new AITaskBuilder(this, id);
  }

  public userTask(id: string, name: string): UserTaskBuilder {
    const node: NodeAST = { type: 'userTask', id, name };
    this.nodes.push(node);
    return new UserTaskBuilder(this, id);
  }

  public exclusiveGateway(id: string, name: string): ExclusiveGatewayBuilder {
    const node: NodeAST = { type: 'exclusiveGateway', id, name };
    this.nodes.push(node);
    return new ExclusiveGatewayBuilder(this, id);
  }

  public parallelGateway(id: string, name: string): ParallelGatewayBuilder {
    const node: NodeAST = { type: 'parallelGateway', id, name };
    this.nodes.push(node);
    return new ParallelGatewayBuilder(this, id);
  }

  public eventBasedGateway(id: string, name: string): EventBasedGatewayBuilder {
    const node: NodeAST = { type: 'eventBasedGateway', id, name };
    this.nodes.push(node);
    return new EventBasedGatewayBuilder(this, id);
  }

  public callActivity(id: string, name: string, calledElement: string): CallActivityBuilder {
    const node: NodeAST = { type: 'callActivity', id, name, calledElement };
    this.nodes.push(node);
    return new CallActivityBuilder(this, id);
  }

  public businessRuleTask(id: string, name: string, decisionRef: string): BusinessRuleTaskBuilder {
    const node: NodeAST = { type: 'businessRuleTask', id, name, decisionRef };
    this.nodes.push(node);
    return new BusinessRuleTaskBuilder(this, id);
  }

  public sequenceFlow(source: string, target: string): Workflow {
    this.flows.push({ id: `flow-${source}-${target}`, source, target, condition: '' });
    return this;
  }

  public sequenceFlowWithCondition(source: string, target: string, condition: string): Workflow {
    this.flows.push({ id: `flow-${source}-${target}`, source, target, condition });
    return this;
  }

  public findNode(id: string): NodeAST | undefined {
    return this.nodes.find(n => n.id === id);
  }

  public toAST(): WorkflowAST {
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

  public async buildXML(wasmInput?: string | Uint8Array): Promise<string> {
    if (!this.compiledModulePromise) {
      if (wasmInput !== undefined) {
        this.initCompiler(wasmInput);
      } else {
        this.initCompiler(defaultWasmPath);
      }
    }

    const wasmModule = await this.compiledModulePromise!;

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

    const exports = instance.exports as any;
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
    const resultSize = Number(resultPacked & 0xFFFFFFFFn);

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

export class Expression {
  constructor(public expr: string) {}
  public toString(): string {
    return `\${${this.expr}}`;
  }
}

export class Variable {
  constructor(public name: string) {}
  public eq(value: any): Expression {
    const valStr = typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value);
    return new Expression(`${this.name} == ${valStr}`);
  }
  public ne(value: any): Expression {
    const valStr = typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value);
    return new Expression(`${this.name} != ${valStr}`);
  }
  public gt(value: any): Expression {
    return new Expression(`${this.name} > ${value}`);
  }
  public gte(value: any): Expression {
    return new Expression(`${this.name} >= ${value}`);
  }
  public lt(value: any): Expression {
    return new Expression(`${this.name} < ${value}`);
  }
  public lte(value: any): Expression {
    return new Expression(`${this.name} <= ${value}`);
  }
}

export function V(name: string): Variable {
  return new Variable(name);
}

export function v(name: string): Variable {
  return new Variable(name);
}
