# NativeBPM.Client.Api.DefaultApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|--------|--------------|-------------|
| [**ClaimTask**](DefaultApi.md#claimtask) | **POST** /api/tasks/{id}/claim | Claim human task |
| [**CompleteInstanceTask**](DefaultApi.md#completeinstancetask) | **POST** /api/instances/{id}/complete | Complete a wait state / task activity in process instance |
| [**CompleteTask**](DefaultApi.md#completetask) | **POST** /api/tasks/{id}/complete | Complete human task |
| [**CreateWebhook**](DefaultApi.md#createwebhook) | **POST** /api/webhooks | Create webhook target |
| [**DeleteWebhook**](DefaultApi.md#deletewebhook) | **DELETE** /api/webhooks/{id} | Delete webhook target |
| [**DeployDefinition**](DefaultApi.md#deploydefinition) | **POST** /api/deploy | Deploy process definition |
| [**GetInstance**](DefaultApi.md#getinstance) | **GET** /api/instances/{id} | Get process instance |
| [**GetInstanceHistory**](DefaultApi.md#getinstancehistory) | **GET** /api/instances/{id}/history | Get process instance execution history |
| [**GetInstanceVisualization**](DefaultApi.md#getinstancevisualization) | **GET** /api/instances/{id}/visualization | Get process instance visualization data |
| [**GetInstanceVisualizationWidget**](DefaultApi.md#getinstancevisualizationwidget) | **GET** /api/instances/{id}/visualization/widget | Get process instance visualization widget HTML |
| [**ListDefinitions**](DefaultApi.md#listdefinitions) | **GET** /api/definitions | List process definitions |
| [**ListIncidents**](DefaultApi.md#listincidents) | **GET** /api/instances/{id}/incidents | List incidents for process instance |
| [**ListInstances**](DefaultApi.md#listinstances) | **GET** /api/instances | List process instances |
| [**ListTasks**](DefaultApi.md#listtasks) | **GET** /api/tasks | List human/user tasks |
| [**ListWebhookDeliveries**](DefaultApi.md#listwebhookdeliveries) | **GET** /api/webhooks/{id}/deliveries | List deliveries for webhook |
| [**ListWebhooks**](DefaultApi.md#listwebhooks) | **GET** /api/webhooks | List configured outgoing webhooks |
| [**ResolveIncident**](DefaultApi.md#resolveincident) | **POST** /api/instances/{id}/incidents/{incidentId}/resolve | Resolve process incident |
| [**ResumeInstance**](DefaultApi.md#resumeinstance) | **POST** /api/instances/{id}/resume | Resume process instance |
| [**StartInstance**](DefaultApi.md#startinstance) | **POST** /api/definitions/{id}/start | Start process instance |
| [**TestWebhook**](DefaultApi.md#testwebhook) | **POST** /api/webhooks/{id}/test | Test webhook target |
| [**UpdateWebhook**](DefaultApi.md#updatewebhook) | **PUT** /api/webhooks/{id} | Update webhook target |

<a id="claimtask"></a>
# **ClaimTask**
> TaskRecord ClaimTask (string id, ClaimTaskRequest claimTaskRequest)

Claim human task

Claim a task for a specific user assignee.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** |  |  |
| **claimTaskRequest** | [**ClaimTaskRequest**](ClaimTaskRequest.md) |  |  |

### Return type

[**TaskRecord**](TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Task claimed successfully |  -  |
| **400** | Task cannot be claimed |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **404** | Task not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="completeinstancetask"></a>
# **CompleteInstanceTask**
> ProcessInstance CompleteInstanceTask (string id, CompleteInstanceTaskRequest completeInstanceTaskRequest)

Complete a wait state / task activity in process instance

Complete a specific active node/wait state within a process instance.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** |  |  |
| **completeInstanceTaskRequest** | [**CompleteInstanceTaskRequest**](CompleteInstanceTaskRequest.md) |  |  |

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Process instance state after completion |  -  |
| **400** | Missing parameter node_id or invalid payload |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="completetask"></a>
# **CompleteTask**
> ProcessInstance CompleteTask (string id, CompleteTaskRequest completeTaskRequest = null)

Complete human task

Complete a claimed human task, providing results variables.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** |  |  |
| **completeTaskRequest** | [**CompleteTaskRequest**](CompleteTaskRequest.md) |  | [optional]  |

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Task completed successfully |  -  |
| **400** | Task is not claimed |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **404** | Task not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="createwebhook"></a>
# **CreateWebhook**
> WebhookRecord CreateWebhook (CreateWebhookRequest createWebhookRequest)

Create webhook target

Register a new webhook target.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **createWebhookRequest** | [**CreateWebhookRequest**](CreateWebhookRequest.md) |  |  |

### Return type

[**WebhookRecord**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Webhook created successfully |  -  |
| **400** | Invalid URL or events list |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="deletewebhook"></a>
# **DeleteWebhook**
> ResolveIncident200Response DeleteWebhook (string id)

Delete webhook target

Delete a webhook configuration.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** |  |  |

### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Webhook deleted successfully |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **404** | Webhook not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="deploydefinition"></a>
# **DeployDefinition**
> ProcessDefinition DeployDefinition (System.IO.Stream file = null)

Deploy process definition

Deploy a new BPMN 2.0 XML process definition.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **file** | **System.IO.Stream****System.IO.Stream** | BPMN 2.0 XML file content to deploy | [optional]  |

### Return type

[**ProcessDefinition**](ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **400** | Invalid request body or malformed BPMN XML |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="getinstance"></a>
# **GetInstance**
> ProcessInstance GetInstance (string id)

Get process instance

Fetch a single process instance state by instance ID.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** |  |  |

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **404** | Process instance not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="getinstancehistory"></a>
# **GetInstanceHistory**
> List&lt;HistoryRecord&gt; GetInstanceHistory (string id)

Get process instance execution history

Fetch the audit trail / execution history log for a process instance.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** |  |  |

### Return type

[**List&lt;HistoryRecord&gt;**](HistoryRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="getinstancevisualization"></a>
# **GetInstanceVisualization**
> VisualizationData GetInstanceVisualization (string id)

Get process instance visualization data

Retrieve diagram XML, execution node status, and history events for visualization.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** |  |  |

### Return type

[**VisualizationData**](VisualizationData.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **404** | Process instance not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="getinstancevisualizationwidget"></a>
# **GetInstanceVisualizationWidget**
> string GetInstanceVisualizationWidget (string id)

Get process instance visualization widget HTML

Retrieve the ready-to-embed HTML process visualization widget.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** |  |  |

### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/html, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **404** | Process instance not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="listdefinitions"></a>
# **ListDefinitions**
> List&lt;ProcessDefinition&gt; ListDefinitions ()

List process definitions

Retrieve a list of all deployed process definitions.


### Parameters
This endpoint does not need any parameter.
### Return type

[**List&lt;ProcessDefinition&gt;**](ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="listincidents"></a>
# **ListIncidents**
> List&lt;IncidentRecord&gt; ListIncidents (string id)

List incidents for process instance

Get active execution incidents (failures) for a specific process instance.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** |  |  |

### Return type

[**List&lt;IncidentRecord&gt;**](IncidentRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **404** | Process instance not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="listinstances"></a>
# **ListInstances**
> List&lt;ProcessInstance&gt; ListInstances ()

List process instances

Retrieve a list of active and completed process instances.


### Parameters
This endpoint does not need any parameter.
### Return type

[**List&lt;ProcessInstance&gt;**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="listtasks"></a>
# **ListTasks**
> List&lt;TaskRecord&gt; ListTasks (string assignee = null, string candidateGroup = null, string status = null)

List human/user tasks

Query tasks matching criteria (assignee, candidateGroup, status).


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **assignee** | **string** |  | [optional]  |
| **candidateGroup** | **string** |  | [optional]  |
| **status** | **string** |  | [optional]  |

### Return type

[**List&lt;TaskRecord&gt;**](TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="listwebhookdeliveries"></a>
# **ListWebhookDeliveries**
> List&lt;WebhookDeliveryRecord&gt; ListWebhookDeliveries (string id)

List deliveries for webhook

Get delivery audit logs and history queue for a specific webhook target.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** |  |  |

### Return type

[**List&lt;WebhookDeliveryRecord&gt;**](WebhookDeliveryRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **404** | Webhook not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="listwebhooks"></a>
# **ListWebhooks**
> List&lt;WebhookRecord&gt; ListWebhooks ()

List configured outgoing webhooks

List all registered webhook targets.


### Parameters
This endpoint does not need any parameter.
### Return type

[**List&lt;WebhookRecord&gt;**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="resolveincident"></a>
# **ResolveIncident**
> ResolveIncident200Response ResolveIncident (string id, string incidentId)

Resolve process incident

Resolve a process execution failure incident, triggering retry/resume.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** |  |  |
| **incidentId** | **string** |  |  |

### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Incident resolved successfully |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="resumeinstance"></a>
# **ResumeInstance**
> ProcessInstance ResumeInstance (string id)

Resume process instance

Manually trigger execution resumption of a process instance.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** |  |  |

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Process instance state after resuming |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="startinstance"></a>
# **StartInstance**
> ProcessInstance StartInstance (string id, StartInstanceRequest startInstanceRequest = null)

Start process instance

Start a new workflow process instance by process definition ID.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** | The process definition ID (e.g., matching the BPMN process element ID) |  |
| **startInstanceRequest** | [**StartInstanceRequest**](StartInstanceRequest.md) |  | [optional]  |

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **400** | Invalid variables or configuration |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="testwebhook"></a>
# **TestWebhook**
> ResolveIncident200Response TestWebhook (string id)

Test webhook target

Send a test ping event delivery to verification URL.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** |  |  |

### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Test ping sent successfully |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **404** | Webhook not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="updatewebhook"></a>
# **UpdateWebhook**
> WebhookRecord UpdateWebhook (string id, CreateWebhookRequest createWebhookRequest)

Update webhook target

Modify the configuration of an existing webhook.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** |  |  |
| **createWebhookRequest** | [**CreateWebhookRequest**](CreateWebhookRequest.md) |  |  |

### Return type

[**WebhookRecord**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Webhook updated successfully |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **404** | Webhook not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

