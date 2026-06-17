import * as api from "./api/src/index.js";
import { Workflow } from "./builder.js";
export type ProcessDefinition = api.ProcessDefinition;
export type ProcessInstance = api.ProcessInstance;
export type HistoryRecord = api.HistoryRecord;
export type IncidentRecord = api.IncidentRecord;
export type TaskRecord = api.TaskRecord;
export type WebhookRecord = api.WebhookRecord;
export type WebhookDeliveryRecord = api.WebhookDeliveryRecord;
export declare class Client {
    private baseUrl;
    private apiToken;
    constructor(baseUrl: string, apiToken: string);
    getHeaders(): Record<string, string>;
    getBaseUrl(): string;
    definitions(): DefinitionsService;
    instances(): InstancesService;
    tasks(): TasksService;
    webhooks(): WebhooksService;
}
export declare class DefinitionsService {
    private client;
    constructor(client: Client);
    list(): ListDefinitionsBuilder;
    deploy(): DeployDefinitionBuilder;
}
export declare class ListDefinitionsBuilder {
    private client;
    constructor(client: Client);
    send(): Promise<ProcessDefinition[]>;
}
export declare class DeployDefinitionBuilder {
    private client;
    private id?;
    private name?;
    private bpmnXML?;
    private workflow?;
    constructor(client: Client);
    withID(id: string): this;
    withName(name: string): this;
    withBPMN(xml: string | Blob | Uint8Array | Buffer): this;
    withWorkflow(workflow: Workflow): this;
    send(): Promise<ProcessDefinition>;
}
export declare class InstancesService {
    private client;
    constructor(client: Client);
    list(): ListInstancesBuilder;
    get(id: string): GetInstanceBuilder;
    start(processID: string): StartInstanceBuilder;
    complete(id: string): CompleteInstanceTaskBuilder;
    resume(id: string): ResumeInstanceBuilder;
    history(id: string): GetInstanceHistoryBuilder;
    incidents(id: string): ListIncidentsBuilder;
    resolveIncident(id: string, incidentID: string): ResolveIncidentBuilder;
    subscribe(instanceID: string, onUpdate: () => void): () => void;
}
export declare class ListInstancesBuilder {
    private client;
    constructor(client: Client);
    send(): Promise<ProcessInstance[]>;
}
export declare class GetInstanceBuilder {
    private client;
    private id;
    constructor(client: Client, id: string);
    send(): Promise<ProcessInstance>;
}
export declare class StartInstanceBuilder {
    private client;
    private processID;
    private instanceID?;
    private businessKey?;
    private variables;
    constructor(client: Client, processID: string);
    withInstanceID(id: string): this;
    withBusinessKey(key: string): this;
    withVariable(name: string, value: any): this;
    withVariables(variables: Record<string, any>): this;
    send(): Promise<ProcessInstance>;
}
export declare class CompleteInstanceTaskBuilder {
    private client;
    private instanceID;
    private nodeID?;
    private variables;
    constructor(client: Client, instanceID: string);
    withNodeID(nodeID: string): this;
    withVariable(name: string, value: any): this;
    withVariables(variables: Record<string, any>): this;
    send(): Promise<ProcessInstance>;
}
export declare class ResumeInstanceBuilder {
    private client;
    private id;
    constructor(client: Client, id: string);
    send(): Promise<ProcessInstance>;
}
export declare class GetInstanceHistoryBuilder {
    private client;
    private id;
    constructor(client: Client, id: string);
    send(): Promise<HistoryRecord[]>;
}
export declare class ListIncidentsBuilder {
    private client;
    private id;
    constructor(client: Client, id: string);
    send(): Promise<IncidentRecord[]>;
}
export declare class ResolveIncidentBuilder {
    private client;
    private id;
    private incidentID;
    constructor(client: Client, id: string, incidentID: string);
    send(): Promise<void>;
}
export declare class TasksService {
    private client;
    constructor(client: Client);
    list(): ListTasksBuilder;
    claim(id: string): ClaimTaskBuilder;
    complete(id: string): CompleteTaskBuilder;
}
export declare class ListTasksBuilder {
    private client;
    private assignee?;
    private candidateGroup?;
    private status?;
    constructor(client: Client);
    withAssignee(assignee: string): this;
    withCandidateGroup(candidateGroup: string): this;
    withStatus(status: string): this;
    send(): Promise<TaskRecord[]>;
}
export declare class ClaimTaskBuilder {
    private client;
    private id;
    private assignee?;
    constructor(client: Client, id: string);
    withAssignee(assignee: string): this;
    send(): Promise<TaskRecord>;
}
export declare class CompleteTaskBuilder {
    private client;
    private id;
    private variables;
    constructor(client: Client, id: string);
    withVariable(name: string, value: any): this;
    withVariables(variables: Record<string, any>): this;
    send(): Promise<ProcessInstance>;
}
export declare class WebhooksService {
    private client;
    constructor(client: Client);
    list(): ListWebhooksBuilder;
    create(): CreateWebhookBuilder;
    update(id: string): UpdateWebhookBuilder;
    delete(id: string): DeleteWebhookBuilder;
    test(id: string): TestWebhookBuilder;
    deliveries(id: string): ListWebhookDeliveriesBuilder;
}
export declare class ListWebhooksBuilder {
    private client;
    constructor(client: Client);
    send(): Promise<WebhookRecord[]>;
}
export declare class CreateWebhookBuilder {
    private client;
    private url?;
    private secret?;
    private events;
    private processID?;
    private isActive?;
    private enableAudit?;
    constructor(client: Client);
    withURL(url: string): this;
    withSecret(secret: string): this;
    withEvents(events: string[]): this;
    withProcessID(id: string): this;
    withActive(active: boolean): this;
    withAudit(audit: boolean): this;
    send(): Promise<WebhookRecord>;
}
export declare class UpdateWebhookBuilder {
    private client;
    private id;
    private url?;
    private secret?;
    private events;
    private processID?;
    private isActive?;
    private enableAudit?;
    constructor(client: Client, id: string);
    withURL(url: string): this;
    withSecret(secret: string): this;
    withEvents(events: string[]): this;
    withProcessID(id: string): this;
    withActive(active: boolean): this;
    withAudit(audit: boolean): this;
    send(): Promise<WebhookRecord>;
}
export declare class DeleteWebhookBuilder {
    private client;
    private id;
    constructor(client: Client, id: string);
    send(): Promise<void>;
}
export declare class TestWebhookBuilder {
    private client;
    private id;
    constructor(client: Client, id: string);
    send(): Promise<void>;
}
export declare class ListWebhookDeliveriesBuilder {
    private client;
    private id;
    constructor(client: Client, id: string);
    send(): Promise<WebhookDeliveryRecord[]>;
}
