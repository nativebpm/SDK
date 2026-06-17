import * as api from "./api/src/index.js";
import * as http from "node:http";
import * as https from "node:https";
import { Workflow } from "./builder.js";

// Export type shortcuts
export type ProcessDefinition = api.ProcessDefinition;
export type ProcessInstance = api.ProcessInstance;
export type HistoryRecord = api.HistoryRecord;
export type IncidentRecord = api.IncidentRecord;
export type TaskRecord = api.TaskRecord;
export type WebhookRecord = api.WebhookRecord;
export type WebhookDeliveryRecord = api.WebhookDeliveryRecord;

export class Client {
  private baseUrl: string;
  private apiToken: string;

  constructor(baseUrl: string, apiToken: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiToken = apiToken;
  }

  public getHeaders(): Record<string, string> {
    return {
      "Authorization": `Bearer ${this.apiToken}`,
    };
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public deploy(workflow: Workflow): Promise<ProcessDefinition> {
    return this.definitions().deploy().withWorkflow(workflow).send();
  }

  public definitions(): DefinitionsService {
    return new DefinitionsService(this);
  }

  public instances(): InstancesService {
    return new InstancesService(this);
  }

  public tasks(): TasksService {
    return new TasksService(this);
  }

  public webhooks(): WebhooksService {
    return new WebhooksService(this);
  }
}


export class DefinitionsService {
  constructor(private client: Client) {}

  public list(): ListDefinitionsBuilder {
    return new ListDefinitionsBuilder(this.client);
  }

  public deploy(): DeployDefinitionBuilder {
    return new DeployDefinitionBuilder(this.client);
  }
}

export class ListDefinitionsBuilder {
  constructor(private client: Client) {}

  public async send(): Promise<ProcessDefinition[]> {
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
  private id?: string;
  private name?: string;
  private bpmnXML?: Blob | Buffer | Uint8Array;
  private workflow?: Workflow;

  constructor(private client: Client) {}

  public withID(id: string): this {
    this.id = id;
    return this;
  }

  public withName(name: string): this {
    this.name = name;
    return this;
  }

  public withBPMN(xml: string | Blob | Uint8Array | Buffer): this {
    if (typeof xml === "string") {
      this.bpmnXML = new Blob([xml], { type: "application/xml" });
    } else {
      this.bpmnXML = xml as any;
    }
    return this;
  }

  public withWorkflow(workflow: Workflow): this {
    this.workflow = workflow;
    return this;
  }

  public async send(): Promise<ProcessDefinition> {
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

    if (!this.id) throw new Error("missing deployment field: ID");
    if (!this.name) throw new Error("missing deployment field: Name");
    if (!this.bpmnXML) throw new Error("missing deployment field: BPMN XML data");

    const formData = new FormData();
    formData.append("id", this.id);
    formData.append("name", this.name);
    
    let fileBlob: any = this.bpmnXML;
    if (!(this.bpmnXML instanceof Blob)) {
      fileBlob = new Blob([this.bpmnXML as any], { type: "application/xml" });
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
  constructor(private client: Client) {}

  public list(): ListInstancesBuilder {
    return new ListInstancesBuilder(this.client);
  }

  public get(id: string): GetInstanceBuilder {
    return new GetInstanceBuilder(this.client, id);
  }

  public start(processID: string): StartInstanceBuilder {
    return new StartInstanceBuilder(this.client, processID);
  }

  public complete(id: string): CompleteInstanceTaskBuilder {
    return new CompleteInstanceTaskBuilder(this.client, id);
  }

  public resume(id: string): ResumeInstanceBuilder {
    return new ResumeInstanceBuilder(this.client, id);
  }

  public history(id: string): GetInstanceHistoryBuilder {
    return new GetInstanceHistoryBuilder(this.client, id);
  }

  public incidents(id: string): ListIncidentsBuilder {
    return new ListIncidentsBuilder(this.client, id);
  }

  public resolveIncident(id: string, incidentID: string): ResolveIncidentBuilder {
    return new ResolveIncidentBuilder(this.client, id, incidentID);
  }

  public subscribe(instanceID: string, onUpdate: () => void): () => void {
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
  constructor(private client: Client) {}

  public async send(): Promise<ProcessInstance[]> {
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
  constructor(private client: Client, private id: string) {}

  public async send(): Promise<ProcessInstance> {
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
  private instanceID?: string;
  private businessKey?: string;
  private variables: Record<string, any> = {};

  constructor(private client: Client, private processID: string) {}

  public withInstanceID(id: string): this {
    this.instanceID = id;
    return this;
  }

  public withBusinessKey(key: string): this {
    this.businessKey = key;
    return this;
  }

  public withVariable(name: string, value: any): this {
    this.variables[name] = value;
    return this;
  }

  public withVariables(variables: Record<string, any>): this {
    Object.assign(this.variables, variables);
    return this;
  }

  public async send(): Promise<ProcessInstance> {
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
  private nodeID?: string;
  private variables: Record<string, any> = {};

  constructor(private client: Client, private instanceID: string) {}

  public withNodeID(nodeID: string): this {
    this.nodeID = nodeID;
    return this;
  }

  public withVariable(name: string, value: any): this {
    this.variables[name] = value;
    return this;
  }

  public withVariables(variables: Record<string, any>): this {
    Object.assign(this.variables, variables);
    return this;
  }

  public async send(): Promise<ProcessInstance> {
    if (!this.nodeID) throw new Error("missing required field: nodeID");
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
  constructor(private client: Client, private id: string) {}

  public async send(): Promise<ProcessInstance> {
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
  constructor(private client: Client, private id: string) {}

  public async send(): Promise<HistoryRecord[]> {
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
  constructor(private client: Client, private id: string) {}

  public async send(): Promise<IncidentRecord[]> {
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
  constructor(private client: Client, private id: string, private incidentID: string) {}

  public async send(): Promise<void> {
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
  constructor(private client: Client) {}

  public list(): ListTasksBuilder {
    return new ListTasksBuilder(this.client);
  }

  public claim(id: string): ClaimTaskBuilder {
    return new ClaimTaskBuilder(this.client, id);
  }

  public complete(id: string): CompleteTaskBuilder {
    return new CompleteTaskBuilder(this.client, id);
  }
}

export class ListTasksBuilder {
  private assignee?: string;
  private candidateGroup?: string;
  private status?: string;

  constructor(private client: Client) {}

  public withAssignee(assignee: string): this {
    this.assignee = assignee;
    return this;
  }

  public withCandidateGroup(candidateGroup: string): this {
    this.candidateGroup = candidateGroup;
    return this;
  }

  public withStatus(status: string): this {
    this.status = status;
    return this;
  }

  public async send(): Promise<TaskRecord[]> {
    const queryParams = new URLSearchParams();
    if (this.assignee) queryParams.set("assignee", this.assignee);
    if (this.candidateGroup) queryParams.set("candidateGroup", this.candidateGroup);
    if (this.status) queryParams.set("status", this.status);

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
  private assignee?: string;

  constructor(private client: Client, private id: string) {}

  public withAssignee(assignee: string): this {
    this.assignee = assignee;
    return this;
  }

  public async send(): Promise<TaskRecord> {
    if (!this.assignee) throw new Error("missing required field: assignee");
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
  private variables: Record<string, any> = {};

  constructor(private client: Client, private id: string) {}

  public withVariable(name: string, value: any): this {
    this.variables[name] = value;
    return this;
  }

  public withVariables(variables: Record<string, any>): this {
    Object.assign(this.variables, variables);
    return this;
  }

  public async send(): Promise<ProcessInstance> {
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
  constructor(private client: Client) {}

  public list(): ListWebhooksBuilder {
    return new ListWebhooksBuilder(this.client);
  }

  public create(): CreateWebhookBuilder {
    return new CreateWebhookBuilder(this.client);
  }

  public update(id: string): UpdateWebhookBuilder {
    return new UpdateWebhookBuilder(this.client, id);
  }

  public delete(id: string): DeleteWebhookBuilder {
    return new DeleteWebhookBuilder(this.client, id);
  }

  public test(id: string): TestWebhookBuilder {
    return new TestWebhookBuilder(this.client, id);
  }

  public deliveries(id: string): ListWebhookDeliveriesBuilder {
    return new ListWebhookDeliveriesBuilder(this.client, id);
  }
}

export class ListWebhooksBuilder {
  constructor(private client: Client) {}

  public async send(): Promise<WebhookRecord[]> {
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
  private url?: string;
  private secret?: string;
  private events: string[] = [];
  private processID?: string;
  private isActive?: boolean;
  private enableAudit?: boolean;

  constructor(private client: Client) {}

  public withURL(url: string): this {
    this.url = url;
    return this;
  }

  public withSecret(secret: string): this {
    this.secret = secret;
    return this;
  }

  public withEvents(events: string[]): this {
    this.events = events;
    return this;
  }

  public withProcessID(id: string): this {
    this.processID = id;
    return this;
  }

  public withActive(active: boolean): this {
    this.isActive = active;
    return this;
  }

  public withAudit(audit: boolean): this {
    this.enableAudit = audit;
    return this;
  }

  public async send(): Promise<WebhookRecord> {
    if (!this.url) throw new Error("missing required field: url");
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
  private url?: string;
  private secret?: string;
  private events: string[] = [];
  private processID?: string;
  private isActive?: boolean;
  private enableAudit?: boolean;

  constructor(private client: Client, private id: string) {}

  public withURL(url: string): this {
    this.url = url;
    return this;
  }

  public withSecret(secret: string): this {
    this.secret = secret;
    return this;
  }

  public withEvents(events: string[]): this {
    this.events = events;
    return this;
  }

  public withProcessID(id: string): this {
    this.processID = id;
    return this;
  }

  public withActive(active: boolean): this {
    this.isActive = active;
    return this;
  }

  public withAudit(audit: boolean): this {
    this.enableAudit = audit;
    return this;
  }

  public async send(): Promise<WebhookRecord> {
    if (!this.url) throw new Error("missing required field: url");
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
  constructor(private client: Client, private id: string) {}

  public async send(): Promise<void> {
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
  constructor(private client: Client, private id: string) {}

  public async send(): Promise<void> {
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
  constructor(private client: Client, private id: string) {}

  public async send(): Promise<WebhookDeliveryRecord[]> {
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
