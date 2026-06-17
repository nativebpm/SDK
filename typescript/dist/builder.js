// Zero-dependency AST Workflow builder
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
}
export class Workflow {
    id;
    name;
    nodes = [];
    flows = [];
    currentNodeID = '';
    pendingMerges = [];
    constructor(id, name) {
        this.id = id;
        this.name = name;
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
        if (this.findNode(id)) {
            this.currentNodeID = id;
            return this;
        }
        const node = { type: 'startEvent', id, name: 'Start' };
        this.nodes.push(node);
        this.currentNodeID = id;
        return this;
    }
    endEvent(id, name) {
        if (this.findNode(id))
            return this;
        const node = { type: 'endEvent', id, name };
        this.nodes.push(node);
        return this;
    }
    serviceTask(id, name, topic, opts) {
        if (this.findNode(id))
            return this;
        const node = { type: 'serviceTask', id, name, topic };
        populateNodeProperties(node, opts);
        this.nodes.push(node);
        return this;
    }
    aiTask(id, name, opts) {
        if (this.findNode(id))
            return this;
        const node = { type: 'aiServiceTask', id, name };
        populateNodeProperties(node, opts);
        this.nodes.push(node);
        return this;
    }
    userTask(id, name, opts) {
        if (this.findNode(id))
            return this;
        const node = { type: 'userTask', id, name };
        populateNodeProperties(node, opts);
        this.nodes.push(node);
        return this;
    }
    exclusiveGateway(id, name) {
        if (this.findNode(id))
            return this;
        const node = { type: 'exclusiveGateway', id, name };
        this.nodes.push(node);
        return this;
    }
    parallelGateway(id, name) {
        if (this.findNode(id))
            return this;
        const node = { type: 'parallelGateway', id, name };
        this.nodes.push(node);
        return this;
    }
    eventBasedGateway(id, name) {
        if (this.findNode(id))
            return this;
        const node = { type: 'eventBasedGateway', id, name };
        this.nodes.push(node);
        return this;
    }
    callActivity(id, name, calledElement, opts) {
        if (this.findNode(id))
            return this;
        const node = { type: 'callActivity', id, name, calledElement };
        populateNodeProperties(node, opts);
        this.nodes.push(node);
        return this;
    }
    businessRuleTask(id, name, decisionRef, opts) {
        if (this.findNode(id))
            return this;
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
    toJSON() {
        return JSON.stringify(this.toAST());
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
