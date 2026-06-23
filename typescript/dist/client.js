import * as http from "node:http";
import * as https from "node:https";
export class Client {
    baseUrl;
    apiToken;
    constructor(baseUrl, apiToken) {
        this.baseUrl = baseUrl.replace(/\/$/, "");
        this.apiToken = apiToken;
    }
    getHeaders() {
        return {
            "Authorization": `Bearer ${this.apiToken}`,
        };
    }
    getBaseUrl() {
        return this.baseUrl;
    }
    deploy(workflow) {
        return this.definitions().deploy().withWorkflow(workflow).send();
    }
    definitions() {
        return new DefinitionsService(this);
    }
    instances() {
        return new InstancesService(this);
    }
    tasks() {
        return new TasksService(this);
    }
    webhooks() {
        return new WebhooksService(this);
    }
}
export class DefinitionsService {
    client;
    constructor(client) {
        this.client = client;
    }
    list() {
        return new ListDefinitionsBuilder(this.client);
    }
    deploy() {
        return new DeployDefinitionBuilder(this.client);
    }
}
export class ListDefinitionsBuilder {
    client;
    constructor(client) {
        this.client = client;
    }
    async send() {
        const res = await fetch(`${this.client.getBaseUrl()}/api/definitions`, {
            method: "GET",
            headers: this.client.getHeaders()
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to list definitions: ${text}`);
        }
        return res.json();
    }
}
export class DeployDefinitionBuilder {
    client;
    id;
    name;
    bpmnXML;
    workflow;
    constructor(client) {
        this.client = client;
    }
    withID(id) {
        this.id = id;
        return this;
    }
    withName(name) {
        this.name = name;
        return this;
    }
    withBPMN(xml) {
        if (typeof xml === "string") {
            this.bpmnXML = new Blob([xml], { type: "application/xml" });
        }
        else {
            this.bpmnXML = xml;
        }
        return this;
    }
    withWorkflow(workflow) {
        this.workflow = workflow;
        return this;
    }
    async send() {
        if (this.workflow) {
            const astJson = this.workflow.toJSON();
            const headers = {
                ...this.client.getHeaders(),
                "Content-Type": "application/json"
            };
            const res = await fetch(`${this.client.getBaseUrl()}/api/deploy`, {
                method: "POST",
                headers,
                body: astJson
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Failed to deploy definition: ${text}`);
            }
            return res.json();
        }
        if (!this.id)
            throw new Error("missing deployment field: ID");
        if (!this.name)
            throw new Error("missing deployment field: Name");
        if (!this.bpmnXML)
            throw new Error("missing deployment field: BPMN XML data");
        const formData = new FormData();
        formData.append("id", this.id);
        formData.append("name", this.name);
        let fileBlob = this.bpmnXML;
        if (!(this.bpmnXML instanceof Blob)) {
            fileBlob = new Blob([this.bpmnXML], { type: "application/xml" });
        }
        formData.append("file", fileBlob, `${this.name}.bpmn`);
        const res = await fetch(`${this.client.getBaseUrl()}/api/deploy`, {
            method: "POST",
            headers: this.client.getHeaders(),
            body: formData
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to deploy definition: ${text}`);
        }
        return res.json();
    }
}
export class InstancesService {
    client;
    constructor(client) {
        this.client = client;
    }
    list() {
        return new ListInstancesBuilder(this.client);
    }
    get(id) {
        return new GetInstanceBuilder(this.client, id);
    }
    start(processID) {
        return new StartInstanceBuilder(this.client, processID);
    }
    complete(id) {
        return new CompleteInstanceTaskBuilder(this.client, id);
    }
    resume(id) {
        return new ResumeInstanceBuilder(this.client, id);
    }
    history(id) {
        return new GetInstanceHistoryBuilder(this.client, id);
    }
    incidents(id) {
        return new ListIncidentsBuilder(this.client, id);
    }
    resolveIncident(id, incidentID) {
        return new ResolveIncidentBuilder(this.client, id, incidentID);
    }
    async getVisualization(instanceID) {
        const res = await fetch(`${this.client.getBaseUrl()}/api/instances/${instanceID}/visualization`, {
            method: "GET",
            headers: this.client.getHeaders()
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to get visualization: ${text}`);
        }
        return res.json();
    }
    async getVisualizationHTML(instanceID) {
        const res = await fetch(`${this.client.getBaseUrl()}/api/instances/${instanceID}/visualization/widget`, {
            method: "GET",
            headers: {
                ...this.client.getHeaders(),
                "Accept": "text/html"
            }
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to get visualization HTML: ${text}`);
        }
        return res.text();
    }
    subscribe(instanceID, onUpdate) {
        const targetUrl = `${this.client.getBaseUrl()}/ui/instances/${instanceID}/stream`;
        const clientModule = targetUrl.startsWith("https") ? https : http;
        const req = clientModule.request(targetUrl, {
            method: "GET",
            headers: {
                ...this.client.getHeaders(),
                "Accept": "text/event-stream"
            }
        }, (res) => {
            res.on("data", (chunk) => {
                const lines = chunk.toString().split("\n");
                for (const line of lines) {
                    if (line.startsWith("data: refresh")) {
                        onUpdate();
                    }
                }
            });
        });
        req.on("error", () => {
            // Catch stream errors silently
        });
        req.end();
        return () => {
            req.destroy();
        };
    }
}
export class ListInstancesBuilder {
    client;
    constructor(client) {
        this.client = client;
    }
    async send() {
        const res = await fetch(`${this.client.getBaseUrl()}/api/instances`, {
            method: "GET",
            headers: this.client.getHeaders()
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to list instances: ${text}`);
        }
        return res.json();
    }
}
export class GetInstanceBuilder {
    client;
    id;
    constructor(client, id) {
        this.client = client;
        this.id = id;
    }
    async send() {
        const res = await fetch(`${this.client.getBaseUrl()}/api/instances/${this.id}`, {
            method: "GET",
            headers: this.client.getHeaders()
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to get instance: ${text}`);
        }
        return res.json();
    }
}
export class StartInstanceBuilder {
    client;
    processID;
    instanceID;
    businessKey;
    variables = {};
    constructor(client, processID) {
        this.client = client;
        this.processID = processID;
    }
    withInstanceID(id) {
        this.instanceID = id;
        return this;
    }
    withBusinessKey(key) {
        this.businessKey = key;
        return this;
    }
    withVariable(name, value) {
        this.variables[name] = value;
        return this;
    }
    withVariables(variables) {
        Object.assign(this.variables, variables);
        return this;
    }
    async send() {
        const res = await fetch(`${this.client.getBaseUrl()}/api/definitions/${this.processID}/start`, {
            method: "POST",
            headers: {
                ...this.client.getHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                instance_id: this.instanceID,
                business_key: this.businessKey,
                variables: this.variables
            })
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to start instance: ${text}`);
        }
        return res.json();
    }
}
export class CompleteInstanceTaskBuilder {
    client;
    instanceID;
    nodeID;
    variables = {};
    constructor(client, instanceID) {
        this.client = client;
        this.instanceID = instanceID;
    }
    withNodeID(nodeID) {
        this.nodeID = nodeID;
        return this;
    }
    withVariable(name, value) {
        this.variables[name] = value;
        return this;
    }
    withVariables(variables) {
        Object.assign(this.variables, variables);
        return this;
    }
    async send() {
        if (!this.nodeID)
            throw new Error("missing required field: nodeID");
        const res = await fetch(`${this.client.getBaseUrl()}/api/instances/${this.instanceID}/complete`, {
            method: "POST",
            headers: {
                ...this.client.getHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                node_id: this.nodeID,
                variables: this.variables
            })
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to complete task: ${text}`);
        }
        return res.json();
    }
}
export class ResumeInstanceBuilder {
    client;
    id;
    constructor(client, id) {
        this.client = client;
        this.id = id;
    }
    async send() {
        const res = await fetch(`${this.client.getBaseUrl()}/api/instances/${this.id}/resume`, {
            method: "POST",
            headers: this.client.getHeaders()
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to resume instance: ${text}`);
        }
        return res.json();
    }
}
export class GetInstanceHistoryBuilder {
    client;
    id;
    constructor(client, id) {
        this.client = client;
        this.id = id;
    }
    async send() {
        const res = await fetch(`${this.client.getBaseUrl()}/api/instances/${this.id}/history`, {
            method: "GET",
            headers: this.client.getHeaders()
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to get history: ${text}`);
        }
        return res.json();
    }
}
export class ListIncidentsBuilder {
    client;
    id;
    constructor(client, id) {
        this.client = client;
        this.id = id;
    }
    async send() {
        const res = await fetch(`${this.client.getBaseUrl()}/api/instances/${this.id}/incidents`, {
            method: "GET",
            headers: this.client.getHeaders()
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to list incidents: ${text}`);
        }
        return res.json();
    }
}
export class ResolveIncidentBuilder {
    client;
    id;
    incidentID;
    constructor(client, id, incidentID) {
        this.client = client;
        this.id = id;
        this.incidentID = incidentID;
    }
    async send() {
        const res = await fetch(`${this.client.getBaseUrl()}/api/instances/${this.id}/incidents/${this.incidentID}/resolve`, {
            method: "POST",
            headers: this.client.getHeaders()
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to resolve incident: ${text}`);
        }
    }
}
export class TasksService {
    client;
    constructor(client) {
        this.client = client;
    }
    list() {
        return new ListTasksBuilder(this.client);
    }
    claim(id) {
        return new ClaimTaskBuilder(this.client, id);
    }
    complete(id) {
        return new CompleteTaskBuilder(this.client, id);
    }
}
export class ListTasksBuilder {
    client;
    assignee;
    candidateGroup;
    status;
    constructor(client) {
        this.client = client;
    }
    withAssignee(assignee) {
        this.assignee = assignee;
        return this;
    }
    withCandidateGroup(candidateGroup) {
        this.candidateGroup = candidateGroup;
        return this;
    }
    withStatus(status) {
        this.status = status;
        return this;
    }
    async send() {
        const queryParams = new URLSearchParams();
        if (this.assignee)
            queryParams.set("assignee", this.assignee);
        if (this.candidateGroup)
            queryParams.set("candidateGroup", this.candidateGroup);
        if (this.status)
            queryParams.set("status", this.status);
        const queryStr = queryParams.toString();
        const url = `${this.client.getBaseUrl()}/api/tasks${queryStr ? "?" + queryStr : ""}`;
        const res = await fetch(url, {
            method: "GET",
            headers: this.client.getHeaders()
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to list tasks: ${text}`);
        }
        return res.json();
    }
}
export class ClaimTaskBuilder {
    client;
    id;
    assignee;
    constructor(client, id) {
        this.client = client;
        this.id = id;
    }
    withAssignee(assignee) {
        this.assignee = assignee;
        return this;
    }
    async send() {
        if (!this.assignee)
            throw new Error("missing required field: assignee");
        const res = await fetch(`${this.client.getBaseUrl()}/api/tasks/${this.id}/claim`, {
            method: "POST",
            headers: {
                ...this.client.getHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ assignee: this.assignee })
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to claim task: ${text}`);
        }
        return res.json();
    }
}
export class CompleteTaskBuilder {
    client;
    id;
    variables = {};
    constructor(client, id) {
        this.client = client;
        this.id = id;
    }
    withVariable(name, value) {
        this.variables[name] = value;
        return this;
    }
    withVariables(variables) {
        Object.assign(this.variables, variables);
        return this;
    }
    async send() {
        const res = await fetch(`${this.client.getBaseUrl()}/api/tasks/${this.id}/complete`, {
            method: "POST",
            headers: {
                ...this.client.getHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ variables: this.variables })
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to complete task: ${text}`);
        }
        return res.json();
    }
}
export class WebhooksService {
    client;
    constructor(client) {
        this.client = client;
    }
    list() {
        return new ListWebhooksBuilder(this.client);
    }
    create() {
        return new CreateWebhookBuilder(this.client);
    }
    update(id) {
        return new UpdateWebhookBuilder(this.client, id);
    }
    delete(id) {
        return new DeleteWebhookBuilder(this.client, id);
    }
    test(id) {
        return new TestWebhookBuilder(this.client, id);
    }
    deliveries(id) {
        return new ListWebhookDeliveriesBuilder(this.client, id);
    }
}
export class ListWebhooksBuilder {
    client;
    constructor(client) {
        this.client = client;
    }
    async send() {
        const res = await fetch(`${this.client.getBaseUrl()}/api/webhooks`, {
            method: "GET",
            headers: this.client.getHeaders()
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to list webhooks: ${text}`);
        }
        return res.json();
    }
}
export class CreateWebhookBuilder {
    client;
    url;
    secret;
    events = [];
    processID;
    isActive;
    enableAudit;
    constructor(client) {
        this.client = client;
    }
    withURL(url) {
        this.url = url;
        return this;
    }
    withSecret(secret) {
        this.secret = secret;
        return this;
    }
    withEvents(events) {
        this.events = events;
        return this;
    }
    withProcessID(id) {
        this.processID = id;
        return this;
    }
    withActive(active) {
        this.isActive = active;
        return this;
    }
    withAudit(audit) {
        this.enableAudit = audit;
        return this;
    }
    async send() {
        if (!this.url)
            throw new Error("missing required field: url");
        const res = await fetch(`${this.client.getBaseUrl()}/api/webhooks`, {
            method: "POST",
            headers: {
                ...this.client.getHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: this.url,
                secret: this.secret,
                events: this.events,
                process_id: this.processID,
                is_active: this.isActive,
                enable_audit: this.enableAudit
            })
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to create webhook: ${text}`);
        }
        return res.json();
    }
}
export class UpdateWebhookBuilder {
    client;
    id;
    url;
    secret;
    events = [];
    processID;
    isActive;
    enableAudit;
    constructor(client, id) {
        this.client = client;
        this.id = id;
    }
    withURL(url) {
        this.url = url;
        return this;
    }
    withSecret(secret) {
        this.secret = secret;
        return this;
    }
    withEvents(events) {
        this.events = events;
        return this;
    }
    withProcessID(id) {
        this.processID = id;
        return this;
    }
    withActive(active) {
        this.isActive = active;
        return this;
    }
    withAudit(audit) {
        this.enableAudit = audit;
        return this;
    }
    async send() {
        if (!this.url)
            throw new Error("missing required field: url");
        const res = await fetch(`${this.client.getBaseUrl()}/api/webhooks/${this.id}`, {
            method: "PUT",
            headers: {
                ...this.client.getHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: this.url,
                secret: this.secret,
                events: this.events,
                process_id: this.processID,
                is_active: this.isActive,
                enable_audit: this.enableAudit
            })
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to update webhook: ${text}`);
        }
        return res.json();
    }
}
export class DeleteWebhookBuilder {
    client;
    id;
    constructor(client, id) {
        this.client = client;
        this.id = id;
    }
    async send() {
        const res = await fetch(`${this.client.getBaseUrl()}/api/webhooks/${this.id}`, {
            method: "DELETE",
            headers: this.client.getHeaders()
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to delete webhook: ${text}`);
        }
    }
}
export class TestWebhookBuilder {
    client;
    id;
    constructor(client, id) {
        this.client = client;
        this.id = id;
    }
    async send() {
        const res = await fetch(`${this.client.getBaseUrl()}/api/webhooks/${this.id}/test`, {
            method: "POST",
            headers: this.client.getHeaders()
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to test webhook: ${text}`);
        }
    }
}
export class ListWebhookDeliveriesBuilder {
    client;
    id;
    constructor(client, id) {
        this.client = client;
        this.id = id;
    }
    async send() {
        const res = await fetch(`${this.client.getBaseUrl()}/api/webhooks/${this.id}/deliveries`, {
            method: "GET",
            headers: this.client.getHeaders()
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to list webhook deliveries: ${text}`);
        }
        return res.json();
    }
}
