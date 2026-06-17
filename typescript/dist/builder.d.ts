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
    inputs?: Array<{
        expression: string;
        type: string;
    }>;
    outputs?: Array<{
        name: string;
        type: string;
    }>;
    rules?: Array<{
        inputs: string[];
        outputs: string[];
    }>;
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
export declare class Branch {
    workflow: Workflow;
    gatewayID: string;
    currentNodeID: string;
    isConditional: boolean;
    condition?: string;
    hasEnded: boolean;
    constructor(workflow: Workflow, gatewayID: string, currentNodeID: string, isConditional: boolean, condition?: string);
    private connectNode;
    user(id: string, name: string, opts?: Record<string, any>): Branch;
    service(id: string, name: string, topic: string, opts?: Record<string, any>): Branch;
    ai(id: string, name: string, opts?: Record<string, any>): Branch;
    call(id: string, name: string, calledElement: string, opts?: Record<string, any>): Branch;
    businessRule(id: string, name: string, decisionRef: string, opts?: Record<string, any>): Branch;
    end(id: string, name: string): Branch;
    when(condition: string | {
        toString(): string;
    }): WhenBranchBuilder;
}
export declare class WhenBuilder {
    workflow: Workflow;
    gatewayID: string;
    condition: string;
    constructor(workflow: Workflow, gatewayID: string, condition: string);
    then(thenFn: (flow: Branch) => void): ThenBuilder;
}
export declare class ThenBuilder {
    workflow: Workflow;
    gatewayID: string;
    constructor(workflow: Workflow, gatewayID: string);
    else(elseFn: (flow: Branch) => void): Workflow;
    otherwise(elseFn: (flow: Branch) => void): Workflow;
}
export declare class WhenBranchBuilder {
    branch: Branch;
    gatewayID: string;
    condition: string;
    constructor(branch: Branch, gatewayID: string, condition: string);
    then(thenFn: (flow: Branch) => void): ThenBranchBuilder;
}
export declare class ThenBranchBuilder {
    branch: Branch;
    gatewayID: string;
    constructor(branch: Branch, gatewayID: string);
    else(elseFn: (flow: Branch) => void): Branch;
    otherwise(elseFn: (flow: Branch) => void): Branch;
}
export declare class Workflow {
    id: string;
    name: string;
    nodes: NodeAST[];
    flows: FlowAST[];
    private currentNodeID;
    private pendingMerges;
    constructor(id: string, name: string);
    private connectNode;
    start(id?: string): Workflow;
    end(id: string, name: string): Workflow;
    user(id: string, name: string, opts?: Record<string, any>): Workflow;
    service(id: string, name: string, topic: string, opts?: Record<string, any>): Workflow;
    ai(id: string, name: string, opts?: Record<string, any>): Workflow;
    call(id: string, name: string, calledElement: string, opts?: Record<string, any>): Workflow;
    businessRule(id: string, name: string, decisionRef: string, opts?: Record<string, any>): Workflow;
    when(condition: string | {
        toString(): string;
    }): WhenBuilder;
    startEvent(id?: string): Workflow;
    endEvent(id: string, name: string): Workflow;
    serviceTask(id: string, name: string, topic: string, opts?: Record<string, any>): Workflow;
    aiTask(id: string, name: string, opts?: Record<string, any>): Workflow;
    userTask(id: string, name: string, opts?: Record<string, any>): Workflow;
    exclusiveGateway(id: string, name: string): Workflow;
    parallelGateway(id: string, name: string): Workflow;
    eventBasedGateway(id: string, name: string): Workflow;
    callActivity(id: string, name: string, calledElement: string, opts?: Record<string, any>): Workflow;
    businessRuleTask(id: string, name: string, decisionRef: string, opts?: Record<string, any>): Workflow;
    sequenceFlow(source: string, target: string): Workflow;
    sequenceFlowWithCondition(source: string, target: string, condition: string): Workflow;
    findNode(id: string): NodeAST | undefined;
    toAST(): WorkflowAST;
    toJSON(): string;
}
export declare class Expression extends String {
}
export declare class Variable {
    name: string;
    constructor(name: string);
    eq(value: any): Expression;
    ne(value: any): Expression;
    gt(value: any): Expression;
    gte(value: any): Expression;
    lt(value: any): Expression;
    lte(value: any): Expression;
}
export declare function V(name: string): Variable;
export declare function v(name: string): Variable;
