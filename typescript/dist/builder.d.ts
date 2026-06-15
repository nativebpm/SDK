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
export declare class StartEventBuilder {
    private workflow;
    private id;
    constructor(workflow: Workflow, id: string);
    next(targetID: string): Workflow;
    connectTo(targetID: string): Workflow;
    builder(): Workflow;
}
export declare class ServiceTaskBuilder {
    private workflow;
    private id;
    constructor(workflow: Workflow, id: string);
    wasmPath(path: string): ServiceTaskBuilder;
    wasm(alias: string): ServiceTaskBuilder;
    next(targetID: string): Workflow;
    connectTo(targetID: string): Workflow;
    builder(): Workflow;
}
export declare class AITaskBuilder {
    private workflow;
    private id;
    constructor(workflow: Workflow, id: string);
    provider(p: string): AITaskBuilder;
    model(m: string): AITaskBuilder;
    prompt(p: string): AITaskBuilder;
    systemInstruction(si: string): AITaskBuilder;
    responseSchema(rs: string): AITaskBuilder;
    temperature(t: number): AITaskBuilder;
    resultVar(rv: string): AITaskBuilder;
    next(targetID: string): Workflow;
    connectTo(targetID: string): Workflow;
    builder(): Workflow;
}
export declare class UserTaskBuilder {
    private workflow;
    private id;
    constructor(workflow: Workflow, id: string);
    assignee(a: string): UserTaskBuilder;
    candidateGroups(cg: string): UserTaskBuilder;
    dueDate(d: string): UserTaskBuilder;
    next(targetID: string): Workflow;
    connectTo(targetID: string): Workflow;
    builder(): Workflow;
}
export declare class ExclusiveGatewayBuilder {
    private workflow;
    private id;
    constructor(workflow: Workflow, id: string);
    next(targetID: string): Workflow;
    nextWithCondition(targetID: string, condition: string): Workflow;
    connectTo(targetID: string): Workflow;
    builder(): Workflow;
}
export declare class ParallelGatewayBuilder {
    private workflow;
    private id;
    constructor(workflow: Workflow, id: string);
    next(targetID: string): Workflow;
    connectTo(targetID: string): Workflow;
    builder(): Workflow;
}
export declare class EventBasedGatewayBuilder {
    private workflow;
    private id;
    constructor(workflow: Workflow, id: string);
    next(targetID: string): Workflow;
    connectTo(targetID: string): Workflow;
    builder(): Workflow;
}
export declare class CallActivityBuilder {
    private workflow;
    private id;
    constructor(workflow: Workflow, id: string);
    in(source: string, target: string): CallActivityBuilder;
    inAll(): CallActivityBuilder;
    out(source: string, target: string): CallActivityBuilder;
    outAll(): CallActivityBuilder;
    next(targetID: string): Workflow;
    connectTo(targetID: string): Workflow;
    builder(): Workflow;
}
export declare class BusinessRuleTaskBuilder {
    workflow: Workflow;
    id: string;
    constructor(workflow: Workflow, id: string);
    mapDecisionResult(mapDecisionResult: string): BusinessRuleTaskBuilder;
    resultVariable(resultVar: string): BusinessRuleTaskBuilder;
    hitPolicy(hitPolicy: string): BusinessRuleTaskBuilder;
    input(expression: string, type: string): BusinessRuleTaskBuilder;
    output(name: string, type: string): BusinessRuleTaskBuilder;
    rule(): DMNRuleBuilder;
    next(targetID: string): Workflow;
    connectTo(targetID: string): Workflow;
    builder(): Workflow;
}
export declare class DMNRuleBuilder {
    private taskBuilder;
    private inputs;
    private outputs;
    constructor(taskBuilder: BusinessRuleTaskBuilder);
    when(expression: string, val: any): DMNRuleBuilder;
    then(name: string, val: any): DMNRuleBuilder;
    private commit;
    rule(): DMNRuleBuilder;
    next(targetID: string): Workflow;
    connectTo(targetID: string): Workflow;
    builder(): Workflow;
    mapDecisionResult(mapDecisionResult: string): BusinessRuleTaskBuilder;
    resultVariable(resultVar: string): BusinessRuleTaskBuilder;
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
    user(id: string, name: string, config?: (t: UserTaskBuilder) => void): Branch;
    service(id: string, name: string, topic: string, config?: (t: ServiceTaskBuilder) => void): Branch;
    ai(id: string, name: string, config?: (t: AITaskBuilder) => void): Branch;
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
    otherwise(elseFn: (flow: Branch) => void): Branch;
}
export declare class Workflow {
    private id;
    private name;
    private nodes;
    private flows;
    private compiledModulePromise;
    private currentNodeID;
    private pendingMerges;
    constructor(id: string, name: string, wasmInput?: string | Uint8Array);
    private initCompiler;
    private connectNode;
    start(id?: string): Workflow;
    end(id: string, name: string): Workflow;
    user(id: string, name: string, config?: (t: UserTaskBuilder) => void): Workflow;
    service(id: string, name: string, topic: string, config?: (t: ServiceTaskBuilder) => void): Workflow;
    ai(id: string, name: string, config?: (t: AITaskBuilder) => void): Workflow;
    when(condition: string | {
        toString(): string;
    }): WhenBuilder;
    startEvent(id?: string): StartEventBuilder;
    endEvent(id: string, name: string): Workflow;
    serviceTask(id: string, name: string, topic: string): ServiceTaskBuilder;
    aiTask(id: string, name: string): AITaskBuilder;
    userTask(id: string, name: string): UserTaskBuilder;
    exclusiveGateway(id: string, name: string): ExclusiveGatewayBuilder;
    parallelGateway(id: string, name: string): ParallelGatewayBuilder;
    eventBasedGateway(id: string, name: string): EventBasedGatewayBuilder;
    callActivity(id: string, name: string, calledElement: string): CallActivityBuilder;
    businessRuleTask(id: string, name: string, decisionRef: string): BusinessRuleTaskBuilder;
    sequenceFlow(source: string, target: string): Workflow;
    sequenceFlowWithCondition(source: string, target: string, condition: string): Workflow;
    findNode(id: string): NodeAST | undefined;
    toAST(): WorkflowAST;
    buildXML(wasmInput?: string | Uint8Array): Promise<string>;
}
export declare class Expression {
    expr: string;
    constructor(expr: string);
    toString(): string;
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
