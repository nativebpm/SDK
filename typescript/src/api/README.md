# @nativebpm/client@1.0.0

A TypeScript SDK client for the localhost API.

## Usage

First, install the SDK from npm.

```bash
npm install @nativebpm/client --save
```

Next, try it out.


```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { ClaimTaskOperationRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: id_example,
    // ClaimTaskRequest
    claimTaskRequest: ...,
  } satisfies ClaimTaskOperationRequest;

  try {
    const data = await api.claimTask(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```


## Documentation

### API Endpoints

All URIs are relative to *http://localhost*

| Class | Method | HTTP request | Description
| ----- | ------ | ------------ | -------------
*DefaultApi* | [**claimTask**](docs/DefaultApi.md#claimtaskoperation) | **POST** /api/tasks/{id}/claim | Claim human task
*DefaultApi* | [**completeInstanceTask**](docs/DefaultApi.md#completeinstancetaskoperation) | **POST** /api/instances/{id}/complete | Complete a wait state / task activity in process instance
*DefaultApi* | [**completeTask**](docs/DefaultApi.md#completetaskoperation) | **POST** /api/tasks/{id}/complete | Complete human task
*DefaultApi* | [**createWebhook**](docs/DefaultApi.md#createwebhookoperation) | **POST** /api/webhooks | Create webhook target
*DefaultApi* | [**deleteWebhook**](docs/DefaultApi.md#deletewebhook) | **DELETE** /api/webhooks/{id} | Delete webhook target
*DefaultApi* | [**deployDefinition**](docs/DefaultApi.md#deploydefinition) | **POST** /api/deploy | Deploy process definition
*DefaultApi* | [**getInstance**](docs/DefaultApi.md#getinstance) | **GET** /api/instances/{id} | Get process instance
*DefaultApi* | [**getInstanceHistory**](docs/DefaultApi.md#getinstancehistory) | **GET** /api/instances/{id}/history | Get process instance execution history
*DefaultApi* | [**getInstanceVisualization**](docs/DefaultApi.md#getinstancevisualization) | **GET** /api/instances/{id}/visualization | Get process instance visualization data
*DefaultApi* | [**getInstanceVisualizationWidget**](docs/DefaultApi.md#getinstancevisualizationwidget) | **GET** /api/instances/{id}/visualization/widget | Get process instance visualization widget HTML
*DefaultApi* | [**getSMTPConfig**](docs/DefaultApi.md#getsmtpconfig) | **GET** /api/smtp-config | Get SMTP configuration
*DefaultApi* | [**getUserGroups**](docs/DefaultApi.md#getusergroups) | **GET** /api/users/{username}/groups | Get user groups
*DefaultApi* | [**listDefinitions**](docs/DefaultApi.md#listdefinitions) | **GET** /api/definitions | List process definitions
*DefaultApi* | [**listIncidents**](docs/DefaultApi.md#listincidents) | **GET** /api/instances/{id}/incidents | List incidents for process instance
*DefaultApi* | [**listInstances**](docs/DefaultApi.md#listinstances) | **GET** /api/instances | List process instances
*DefaultApi* | [**listTasks**](docs/DefaultApi.md#listtasks) | **GET** /api/tasks | List human/user tasks
*DefaultApi* | [**listWebhookDeliveries**](docs/DefaultApi.md#listwebhookdeliveries) | **GET** /api/webhooks/{id}/deliveries | List deliveries for webhook
*DefaultApi* | [**listWebhooks**](docs/DefaultApi.md#listwebhooks) | **GET** /api/webhooks | List configured outgoing webhooks
*DefaultApi* | [**resolveIncident**](docs/DefaultApi.md#resolveincident) | **POST** /api/instances/{id}/incidents/{incidentId}/resolve | Resolve process incident
*DefaultApi* | [**resumeInstance**](docs/DefaultApi.md#resumeinstance) | **POST** /api/instances/{id}/resume | Resume process instance
*DefaultApi* | [**startInstance**](docs/DefaultApi.md#startinstanceoperation) | **POST** /api/definitions/{id}/start | Start process instance
*DefaultApi* | [**testWebhook**](docs/DefaultApi.md#testwebhook) | **POST** /api/webhooks/{id}/test | Test webhook target
*DefaultApi* | [**updateWebhook**](docs/DefaultApi.md#updatewebhook) | **PUT** /api/webhooks/{id} | Update webhook target


### Models

- [ClaimTaskRequest](docs/ClaimTaskRequest.md)
- [CompleteInstanceTaskRequest](docs/CompleteInstanceTaskRequest.md)
- [CompleteTaskRequest](docs/CompleteTaskRequest.md)
- [CreateWebhookRequest](docs/CreateWebhookRequest.md)
- [HistoryRecord](docs/HistoryRecord.md)
- [IncidentRecord](docs/IncidentRecord.md)
- [ListDefinitions401Response](docs/ListDefinitions401Response.md)
- [ProcessDefinition](docs/ProcessDefinition.md)
- [ProcessInstance](docs/ProcessInstance.md)
- [ResolveIncident200Response](docs/ResolveIncident200Response.md)
- [SMTPConfig](docs/SMTPConfig.md)
- [StartInstanceRequest](docs/StartInstanceRequest.md)
- [TaskRecord](docs/TaskRecord.md)
- [VisualizationData](docs/VisualizationData.md)
- [WebhookDeliveryRecord](docs/WebhookDeliveryRecord.md)
- [WebhookRecord](docs/WebhookRecord.md)

### Authorization

Endpoints do not require authorization.


## About

This TypeScript SDK client supports the [Fetch API](https://fetch.spec.whatwg.org/)
and is automatically generated by the
[OpenAPI Generator](https://openapi-generator.tech) project:

- API version: `1.0.0`
- Package version: `1.0.0`
- Generator version: `7.24.0-SNAPSHOT`
- Build package: `org.openapitools.codegen.languages.TypeScriptFetchClientCodegen`

The generated npm module supports the following:

- Environments
  * Node.js
  * Webpack
  * Browserify
- Language levels
  * ES5 - you must have a Promises/A+ library installed
  * ES6
- Module systems
  * CommonJS
  * ES6 module system


## Development

### Building

To build the TypeScript source code, you need to have Node.js and npm installed.
After cloning the repository, navigate to the project directory and run:

```bash
npm install
npm run build
```

### Publishing

Once you've built the package, you can publish it to npm:

```bash
npm publish
```

## License

[]()
