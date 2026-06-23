# DefaultApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**claimTask**](DefaultApi.md#claimtaskoperation) | **POST** /api/tasks/{id}/claim | Claim human task |
| [**completeInstanceTask**](DefaultApi.md#completeinstancetaskoperation) | **POST** /api/instances/{id}/complete | Complete a wait state / task activity in process instance |
| [**completeTask**](DefaultApi.md#completetaskoperation) | **POST** /api/tasks/{id}/complete | Complete human task |
| [**createWebhook**](DefaultApi.md#createwebhookoperation) | **POST** /api/webhooks | Create webhook target |
| [**deleteWebhook**](DefaultApi.md#deletewebhook) | **DELETE** /api/webhooks/{id} | Delete webhook target |
| [**deployDefinition**](DefaultApi.md#deploydefinition) | **POST** /api/deploy | Deploy process definition |
| [**getInstance**](DefaultApi.md#getinstance) | **GET** /api/instances/{id} | Get process instance |
| [**getInstanceHistory**](DefaultApi.md#getinstancehistory) | **GET** /api/instances/{id}/history | Get process instance execution history |
| [**getInstanceVisualization**](DefaultApi.md#getinstancevisualization) | **GET** /api/instances/{id}/visualization | Get process instance visualization data |
| [**getInstanceVisualizationWidget**](DefaultApi.md#getinstancevisualizationwidget) | **GET** /api/instances/{id}/visualization/widget | Get process instance visualization widget HTML |
| [**getSMTPConfig**](DefaultApi.md#getsmtpconfig) | **GET** /api/smtp-config | Get SMTP configuration |
| [**getUserGroups**](DefaultApi.md#getusergroups) | **GET** /api/users/{username}/groups | Get user groups |
| [**listDefinitions**](DefaultApi.md#listdefinitions) | **GET** /api/definitions | List process definitions |
| [**listIncidents**](DefaultApi.md#listincidents) | **GET** /api/instances/{id}/incidents | List incidents for process instance |
| [**listInstances**](DefaultApi.md#listinstances) | **GET** /api/instances | List process instances |
| [**listTasks**](DefaultApi.md#listtasks) | **GET** /api/tasks | List human/user tasks |
| [**listWebhookDeliveries**](DefaultApi.md#listwebhookdeliveries) | **GET** /api/webhooks/{id}/deliveries | List deliveries for webhook |
| [**listWebhooks**](DefaultApi.md#listwebhooks) | **GET** /api/webhooks | List configured outgoing webhooks |
| [**resolveIncident**](DefaultApi.md#resolveincident) | **POST** /api/instances/{id}/incidents/{incidentId}/resolve | Resolve process incident |
| [**resumeInstance**](DefaultApi.md#resumeinstance) | **POST** /api/instances/{id}/resume | Resume process instance |
| [**startInstance**](DefaultApi.md#startinstanceoperation) | **POST** /api/definitions/{id}/start | Start process instance |
| [**testWebhook**](DefaultApi.md#testwebhook) | **POST** /api/webhooks/{id}/test | Test webhook target |
| [**updateWebhook**](DefaultApi.md#updatewebhook) | **PUT** /api/webhooks/{id} | Update webhook target |



## claimTask

> TaskRecord claimTask(id, claimTaskRequest)

Claim human task

Claim a task for a specific user assignee.

### Example

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

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **claimTaskRequest** | [ClaimTaskRequest](ClaimTaskRequest.md) |  | |

### Return type

[**TaskRecord**](TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Task claimed successfully |  -  |
| **400** | Task cannot be claimed |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **404** | Task not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## completeInstanceTask

> ProcessInstance completeInstanceTask(id, completeInstanceTaskRequest)

Complete a wait state / task activity in process instance

Complete a specific active node/wait state within a process instance.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { CompleteInstanceTaskOperationRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: id_example,
    // CompleteInstanceTaskRequest
    completeInstanceTaskRequest: ...,
  } satisfies CompleteInstanceTaskOperationRequest;

  try {
    const data = await api.completeInstanceTask(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **completeInstanceTaskRequest** | [CompleteInstanceTaskRequest](CompleteInstanceTaskRequest.md) |  | |

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Process instance state after completion |  -  |
| **400** | Missing parameter node_id or invalid payload |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## completeTask

> ProcessInstance completeTask(id, completeTaskRequest)

Complete human task

Complete a claimed human task, providing results variables.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { CompleteTaskOperationRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: id_example,
    // CompleteTaskRequest (optional)
    completeTaskRequest: ...,
  } satisfies CompleteTaskOperationRequest;

  try {
    const data = await api.completeTask(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **completeTaskRequest** | [CompleteTaskRequest](CompleteTaskRequest.md) |  | [Optional] |

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Task completed successfully |  -  |
| **400** | Task is not claimed |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **404** | Task not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createWebhook

> WebhookRecord createWebhook(createWebhookRequest)

Create webhook target

Register a new webhook target.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { CreateWebhookOperationRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // CreateWebhookRequest
    createWebhookRequest: ...,
  } satisfies CreateWebhookOperationRequest;

  try {
    const data = await api.createWebhook(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **createWebhookRequest** | [CreateWebhookRequest](CreateWebhookRequest.md) |  | |

### Return type

[**WebhookRecord**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Webhook created successfully |  -  |
| **400** | Invalid URL or events list |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteWebhook

> ResolveIncident200Response deleteWebhook(id)

Delete webhook target

Delete a webhook configuration.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { DeleteWebhookRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: id_example,
  } satisfies DeleteWebhookRequest;

  try {
    const data = await api.deleteWebhook(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Webhook deleted successfully |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **404** | Webhook not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deployDefinition

> ProcessDefinition deployDefinition(file)

Deploy process definition

Deploy a new BPMN 2.0 XML process definition.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { DeployDefinitionRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // Blob | BPMN 2.0 XML file content to deploy (optional)
    file: BINARY_DATA_HERE,
  } satisfies DeployDefinitionRequest;

  try {
    const data = await api.deployDefinition(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **file** | `Blob` | BPMN 2.0 XML file content to deploy | [Optional] [Defaults to `undefined`] |

### Return type

[**ProcessDefinition**](ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **400** | Invalid request body or malformed BPMN XML |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getInstance

> ProcessInstance getInstance(id)

Get process instance

Fetch a single process instance state by instance ID.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { GetInstanceRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: id_example,
  } satisfies GetInstanceRequest;

  try {
    const data = await api.getInstance(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **404** | Process instance not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getInstanceHistory

> Array&lt;HistoryRecord&gt; getInstanceHistory(id)

Get process instance execution history

Fetch the audit trail / execution history log for a process instance.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { GetInstanceHistoryRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: id_example,
  } satisfies GetInstanceHistoryRequest;

  try {
    const data = await api.getInstanceHistory(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Array&lt;HistoryRecord&gt;**](HistoryRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getInstanceVisualization

> VisualizationData getInstanceVisualization(id)

Get process instance visualization data

Retrieve diagram XML, execution node status, and history events for visualization.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { GetInstanceVisualizationRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: id_example,
  } satisfies GetInstanceVisualizationRequest;

  try {
    const data = await api.getInstanceVisualization(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**VisualizationData**](VisualizationData.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **404** | Process instance not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getInstanceVisualizationWidget

> string getInstanceVisualizationWidget(id)

Get process instance visualization widget HTML

Retrieve the ready-to-embed HTML process visualization widget.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { GetInstanceVisualizationWidgetRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: id_example,
  } satisfies GetInstanceVisualizationWidgetRequest;

  try {
    const data = await api.getInstanceVisualizationWidget(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/html`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **404** | Process instance not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSMTPConfig

> SMTPConfig getSMTPConfig()

Get SMTP configuration

Retrieve the current SMTP mailer configuration (admin/developer only).

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { GetSMTPConfigRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.getSMTPConfig();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**SMTPConfig**](SMTPConfig.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **404** | SMTP config not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getUserGroups

> Array&lt;string&gt; getUserGroups(username)

Get user groups

Retrieve the list of groups (chats) the user is a member of.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { GetUserGroupsRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string | The username to retrieve groups for
    username: username_example,
  } satisfies GetUserGroupsRequest;

  try {
    const data = await api.getUserGroups(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **username** | `string` | The username to retrieve groups for | [Defaults to `undefined`] |

### Return type

**Array<string>**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listDefinitions

> Array&lt;ProcessDefinition&gt; listDefinitions()

List process definitions

Retrieve a list of all deployed process definitions.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { ListDefinitionsRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.listDefinitions();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ProcessDefinition&gt;**](ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listIncidents

> Array&lt;IncidentRecord&gt; listIncidents(id)

List incidents for process instance

Get active execution incidents (failures) for a specific process instance.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { ListIncidentsRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: id_example,
  } satisfies ListIncidentsRequest;

  try {
    const data = await api.listIncidents(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Array&lt;IncidentRecord&gt;**](IncidentRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **404** | Process instance not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listInstances

> Array&lt;ProcessInstance&gt; listInstances()

List process instances

Retrieve a list of active and completed process instances.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { ListInstancesRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.listInstances();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ProcessInstance&gt;**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listTasks

> Array&lt;TaskRecord&gt; listTasks(assignee, candidateGroup, status)

List human/user tasks

Query tasks matching criteria (assignee, candidateGroup, status).

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { ListTasksRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string (optional)
    assignee: assignee_example,
    // string (optional)
    candidateGroup: candidateGroup_example,
    // 'CREATED' | 'CLAIMED' | 'COMPLETED' (optional)
    status: status_example,
  } satisfies ListTasksRequest;

  try {
    const data = await api.listTasks(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **assignee** | `string` |  | [Optional] [Defaults to `undefined`] |
| **candidateGroup** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `CREATED`, `CLAIMED`, `COMPLETED` |  | [Optional] [Defaults to `undefined`] [Enum: CREATED, CLAIMED, COMPLETED] |

### Return type

[**Array&lt;TaskRecord&gt;**](TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listWebhookDeliveries

> Array&lt;WebhookDeliveryRecord&gt; listWebhookDeliveries(id)

List deliveries for webhook

Get delivery audit logs and history queue for a specific webhook target.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { ListWebhookDeliveriesRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: id_example,
  } satisfies ListWebhookDeliveriesRequest;

  try {
    const data = await api.listWebhookDeliveries(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Array&lt;WebhookDeliveryRecord&gt;**](WebhookDeliveryRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **404** | Webhook not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listWebhooks

> Array&lt;WebhookRecord&gt; listWebhooks()

List configured outgoing webhooks

List all registered webhook targets.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { ListWebhooksRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.listWebhooks();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;WebhookRecord&gt;**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## resolveIncident

> ResolveIncident200Response resolveIncident(id, incidentId)

Resolve process incident

Resolve a process execution failure incident, triggering retry/resume.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { ResolveIncidentRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: id_example,
    // string
    incidentId: incidentId_example,
  } satisfies ResolveIncidentRequest;

  try {
    const data = await api.resolveIncident(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **incidentId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Incident resolved successfully |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## resumeInstance

> ProcessInstance resumeInstance(id)

Resume process instance

Manually trigger execution resumption of a process instance.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { ResumeInstanceRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: id_example,
  } satisfies ResumeInstanceRequest;

  try {
    const data = await api.resumeInstance(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Process instance state after resuming |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## startInstance

> ProcessInstance startInstance(id, startInstanceRequest)

Start process instance

Start a new workflow process instance by process definition ID.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { StartInstanceOperationRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string | The process definition ID (e.g., matching the BPMN process element ID)
    id: id_example,
    // StartInstanceRequest (optional)
    startInstanceRequest: ...,
  } satisfies StartInstanceOperationRequest;

  try {
    const data = await api.startInstance(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | The process definition ID (e.g., matching the BPMN process element ID) | [Defaults to `undefined`] |
| **startInstanceRequest** | [StartInstanceRequest](StartInstanceRequest.md) |  | [Optional] |

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **400** | Invalid variables or configuration |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## testWebhook

> ResolveIncident200Response testWebhook(id)

Test webhook target

Send a test ping event delivery to verification URL.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { TestWebhookRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: id_example,
  } satisfies TestWebhookRequest;

  try {
    const data = await api.testWebhook(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Test ping sent successfully |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **404** | Webhook not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateWebhook

> WebhookRecord updateWebhook(id, createWebhookRequest)

Update webhook target

Modify the configuration of an existing webhook.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '@nativebpm/client';
import type { UpdateWebhookRequest } from '@nativebpm/client';

async function example() {
  console.log("🚀 Testing @nativebpm/client SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: id_example,
    // CreateWebhookRequest
    createWebhookRequest: ...,
  } satisfies UpdateWebhookRequest;

  try {
    const data = await api.updateWebhook(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **createWebhookRequest** | [CreateWebhookRequest](CreateWebhookRequest.md) |  | |

### Return type

[**WebhookRecord**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Webhook updated successfully |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **404** | Webhook not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

