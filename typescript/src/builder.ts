// Zero-dependency AST Workflow builder

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

function populateNodeProperties(node: any, opts?: Record<string, any>): void {
  if (!opts) return;
  for (const [key, val] of Object.entries(opts)) {
    let targetKey = key;
    if (key === 'wasm') targetKey = 'wasmPath';
    if (key === 'resultVariable') targetKey = 'resultVar';
    if (key.includes('_')) {
      targetKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      if (targetKey === 'wasm') targetKey = 'wasmPath';
      if (targetKey === 'resultVariable') targetKey = 'resultVar';
    }
    node[targetKey] = val;
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

  public user(id: string, name: string, opts?: Record<string, any>): Branch {
    this.workflow.userTask(id, name, opts);
    this.connectNode(id);
    return this;
  }

  public service(id: string, name: string, topic: string, opts?: Record<string, any>): Branch {
    this.workflow.serviceTask(id, name, topic, opts);
    this.connectNode(id);
    return this;
  }

  public ai(id: string, name: string, opts?: Record<string, any>): Branch {
    this.workflow.aiTask(id, name, opts);
    this.connectNode(id);
    return this;
  }

  public call(id: string, name: string, calledElement: string, opts?: Record<string, any>): Branch {
    this.workflow.callActivity(id, name, calledElement, opts);
    this.connectNode(id);
    return this;
  }

  public businessRule(id: string, name: string, decisionRef: string, opts?: Record<string, any>): Branch {
    this.workflow.businessRuleTask(id, name, decisionRef, opts);
    this.connectNode(id);
    return this;
  }

  public end(id: string, name: string): Branch {
    this.workflow.endEvent(id, name);
    this.connectNode(id);
    this.hasEnded = true;
    return this;
  }

  public when(condition: string | { toString(): string }): WhenBranchBuilder {
    const gwID = `gw_${this.currentNodeID}_decision`;
    this.workflow.exclusiveGateway(gwID, 'Decision Gateway');
    this.connectNode(gwID);

    const condStr = typeof condition === 'string' ? condition : condition.toString();
    return new WhenBranchBuilder(this, gwID, condStr);
  }
}

export class WhenBuilder {
  constructor(public workflow: Workflow, public gatewayID: string, public condition: string) {}

  public then(thenFn: (flow: Branch) => void): ThenBuilder {
    const thenBranch = new Branch(this.workflow, this.gatewayID, this.gatewayID, true, this.condition);
    thenFn(thenBranch);

    if (!thenBranch.hasEnded && thenBranch.currentNodeID !== this.gatewayID) {
      ((this.workflow as any).pendingMerges as string[]).push(thenBranch.currentNodeID);
    }

    return new ThenBuilder(this.workflow, this.gatewayID);
  }
}

export class ThenBuilder {
  constructor(public workflow: Workflow, public gatewayID: string) {}

  public else(elseFn: (flow: Branch) => void): Workflow {
    const elseBranch = new Branch(this.workflow, this.gatewayID, this.gatewayID, false);
    elseFn(elseBranch);

    if (!elseBranch.hasEnded && elseBranch.currentNodeID !== this.gatewayID) {
      ((this.workflow as any).pendingMerges as string[]).push(elseBranch.currentNodeID);
    }

    return this.workflow;
  }


}

export class WhenBranchBuilder {
  constructor(public branch: Branch, public gatewayID: string, public condition: string) {}

  public then(thenFn: (flow: Branch) => void): ThenBranchBuilder {
    const thenBranch = new Branch(this.branch.workflow, this.gatewayID, this.gatewayID, true, this.condition);
    thenFn(thenBranch);

    if (!thenBranch.hasEnded && thenBranch.currentNodeID !== this.gatewayID) {
      ((this.branch.workflow as any).pendingMerges as string[]).push(thenBranch.currentNodeID);
    }

    return new ThenBranchBuilder(this.branch, this.gatewayID);
  }
}

export class ThenBranchBuilder {
  constructor(public branch: Branch, public gatewayID: string) {}

  public else(elseFn: (flow: Branch) => void): Branch {
    const elseBranch = new Branch(this.branch.workflow, this.gatewayID, this.gatewayID, false);
    elseFn(elseBranch);

    if (!elseBranch.hasEnded && elseBranch.currentNodeID !== this.gatewayID) {
      ((this.branch.workflow as any).pendingMerges as string[]).push(elseBranch.currentNodeID);
    }

    return this.branch;
  }


}

export class Workflow {
  public id: string;
  public name: string;
  public nodes: NodeAST[] = [];
  public flows: FlowAST[] = [];
  private currentNodeID: string = '';
  private pendingMerges: string[] = [];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
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

  public user(id: string, name: string, opts?: Record<string, any>): Workflow {
    this.userTask(id, name, opts);
    this.connectNode(id);
    return this;
  }

  public service(id: string, name: string, topic: string, opts?: Record<string, any>): Workflow {
    this.serviceTask(id, name, topic, opts);
    this.connectNode(id);
    return this;
  }

  public ai(id: string, name: string, opts?: Record<string, any>): Workflow {
    this.aiTask(id, name, opts);
    this.connectNode(id);
    return this;
  }

  public call(id: string, name: string, calledElement: string, opts?: Record<string, any>): Workflow {
    this.callActivity(id, name, calledElement, opts);
    this.connectNode(id);
    return this;
  }

  public businessRule(id: string, name: string, decisionRef: string, opts?: Record<string, any>): Workflow {
    this.businessRuleTask(id, name, decisionRef, opts);
    this.connectNode(id);
    return this;
  }

  public when(condition: string | { toString(): string }): WhenBuilder {
    const gwID = `gw_${this.currentNodeID}_decision`;
    this.exclusiveGateway(gwID, 'Decision Gateway');
    this.connectNode(gwID);

    const condStr = typeof condition === 'string' ? condition : condition.toString();
    return new WhenBuilder(this, gwID, condStr);
  }

  public startEvent(id: string = 'start'): Workflow {
    if (this.findNode(id)) {
      this.currentNodeID = id;
      return this;
    }
    const node: NodeAST = { type: 'startEvent', id, name: 'Start' };
    this.nodes.push(node);
    this.currentNodeID = id;
    return this;
  }

  public endEvent(id: string, name: string): Workflow {
    if (this.findNode(id)) return this;
    const node: NodeAST = { type: 'endEvent', id, name };
    this.nodes.push(node);
    return this;
  }

  public serviceTask(id: string, name: string, topic: string, opts?: Record<string, any>): Workflow {
    if (this.findNode(id)) return this;
    const node: NodeAST = { type: 'serviceTask', id, name, topic };
    populateNodeProperties(node, opts);
    this.nodes.push(node);
    return this;
  }

  public aiTask(id: string, name: string, opts?: Record<string, any>): Workflow {
    if (this.findNode(id)) return this;
    const node: NodeAST = { type: 'aiServiceTask', id, name };
    populateNodeProperties(node, opts);
    this.nodes.push(node);
    return this;
  }

  public userTask(id: string, name: string, opts?: Record<string, any>): Workflow {
    if (this.findNode(id)) return this;
    const node: NodeAST = { type: 'userTask', id, name };
    populateNodeProperties(node, opts);
    this.nodes.push(node);
    return this;
  }

  public exclusiveGateway(id: string, name: string): Workflow {
    if (this.findNode(id)) return this;
    const node: NodeAST = { type: 'exclusiveGateway', id, name };
    this.nodes.push(node);
    return this;
  }

  public parallelGateway(id: string, name: string): Workflow {
    if (this.findNode(id)) return this;
    const node: NodeAST = { type: 'parallelGateway', id, name };
    this.nodes.push(node);
    return this;
  }

  public eventBasedGateway(id: string, name: string): Workflow {
    if (this.findNode(id)) return this;
    const node: NodeAST = { type: 'eventBasedGateway', id, name };
    this.nodes.push(node);
    return this;
  }

  public callActivity(id: string, name: string, calledElement: string, opts?: Record<string, any>): Workflow {
    if (this.findNode(id)) return this;
    const node: NodeAST = { type: 'callActivity', id, name, calledElement };
    populateNodeProperties(node, opts);
    this.nodes.push(node);
    return this;
  }

  public businessRuleTask(id: string, name: string, decisionRef: string, opts?: Record<string, any>): Workflow {
    if (this.findNode(id)) return this;
    const node: NodeAST = { type: 'businessRuleTask', id, name, decisionRef };
    populateNodeProperties(node, opts);
    this.nodes.push(node);
    return this;
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

  public toJSON(): string {
    return JSON.stringify(this.toAST());
  }
}

export class Expression extends String {}

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
