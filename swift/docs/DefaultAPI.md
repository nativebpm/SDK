# DefaultAPI

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**claimTask**](DefaultAPI.md#claimtask) | **POST** /api/tasks/{id}/claim | Claim human task
[**completeInstanceTask**](DefaultAPI.md#completeinstancetask) | **POST** /api/instances/{id}/complete | Complete a wait state / task activity in process instance
[**completeTask**](DefaultAPI.md#completetask) | **POST** /api/tasks/{id}/complete | Complete human task
[**createWebhook**](DefaultAPI.md#createwebhook) | **POST** /api/webhooks | Create webhook target
[**deleteWebhook**](DefaultAPI.md#deletewebhook) | **DELETE** /api/webhooks/{id} | Delete webhook target
[**deployDefinition**](DefaultAPI.md#deploydefinition) | **POST** /api/deploy | Deploy process definition
[**getInstance**](DefaultAPI.md#getinstance) | **GET** /api/instances/{id} | Get process instance
[**getInstanceHistory**](DefaultAPI.md#getinstancehistory) | **GET** /api/instances/{id}/history | Get process instance execution history
[**getInstanceVisualization**](DefaultAPI.md#getinstancevisualization) | **GET** /api/instances/{id}/visualization | Get process instance visualization data
[**getInstanceVisualizationWidget**](DefaultAPI.md#getinstancevisualizationwidget) | **GET** /api/instances/{id}/visualization/widget | Get process instance visualization widget HTML
[**listDefinitions**](DefaultAPI.md#listdefinitions) | **GET** /api/definitions | List process definitions
[**listIncidents**](DefaultAPI.md#listincidents) | **GET** /api/instances/{id}/incidents | List incidents for process instance
[**listInstances**](DefaultAPI.md#listinstances) | **GET** /api/instances | List process instances
[**listTasks**](DefaultAPI.md#listtasks) | **GET** /api/tasks | List human/user tasks
[**listWebhookDeliveries**](DefaultAPI.md#listwebhookdeliveries) | **GET** /api/webhooks/{id}/deliveries | List deliveries for webhook
[**listWebhooks**](DefaultAPI.md#listwebhooks) | **GET** /api/webhooks | List configured outgoing webhooks
[**resolveIncident**](DefaultAPI.md#resolveincident) | **POST** /api/instances/{id}/incidents/{incidentId}/resolve | Resolve process incident
[**resumeInstance**](DefaultAPI.md#resumeinstance) | **POST** /api/instances/{id}/resume | Resume process instance
[**startInstance**](DefaultAPI.md#startinstance) | **POST** /api/definitions/{id}/start | Start process instance
[**testWebhook**](DefaultAPI.md#testwebhook) | **POST** /api/webhooks/{id}/test | Test webhook target
[**updateWebhook**](DefaultAPI.md#updatewebhook) | **PUT** /api/webhooks/{id} | Update webhook target


# **claimTask**
```swift
    open class func claimTask(id: String, claimTaskRequest: ClaimTaskRequest, completion: @escaping (_ data: TaskRecord?, _ error: Error?) -> Void)
```

Claim human task

Claim a task for a specific user assignee.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let id = "id_example" // String | 
let claimTaskRequest = claimTask_request(assignee: "assignee_example") // ClaimTaskRequest | 

// Claim human task
DefaultAPI.claimTask(id: id, claimTaskRequest: claimTaskRequest) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String** |  | 
 **claimTaskRequest** | [**ClaimTaskRequest**](ClaimTaskRequest.md) |  | 

### Return type

[**TaskRecord**](TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **completeInstanceTask**
```swift
    open class func completeInstanceTask(id: String, completeInstanceTaskRequest: CompleteInstanceTaskRequest, completion: @escaping (_ data: ProcessInstance?, _ error: Error?) -> Void)
```

Complete a wait state / task activity in process instance

Complete a specific active node/wait state within a process instance.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let id = "id_example" // String | 
let completeInstanceTaskRequest = CompleteInstanceTaskRequest(nodeId: "nodeId_example", variables: "TODO") // CompleteInstanceTaskRequest | 

// Complete a wait state / task activity in process instance
DefaultAPI.completeInstanceTask(id: id, completeInstanceTaskRequest: completeInstanceTaskRequest) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String** |  | 
 **completeInstanceTaskRequest** | [**CompleteInstanceTaskRequest**](CompleteInstanceTaskRequest.md) |  | 

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **completeTask**
```swift
    open class func completeTask(id: String, completeTaskRequest: CompleteTaskRequest? = nil, completion: @escaping (_ data: ProcessInstance?, _ error: Error?) -> Void)
```

Complete human task

Complete a claimed human task, providing results variables.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let id = "id_example" // String | 
let completeTaskRequest = completeTask_request(variables: "TODO") // CompleteTaskRequest |  (optional)

// Complete human task
DefaultAPI.completeTask(id: id, completeTaskRequest: completeTaskRequest) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String** |  | 
 **completeTaskRequest** | [**CompleteTaskRequest**](CompleteTaskRequest.md) |  | [optional] 

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createWebhook**
```swift
    open class func createWebhook(createWebhookRequest: CreateWebhookRequest, completion: @escaping (_ data: WebhookRecord?, _ error: Error?) -> Void)
```

Create webhook target

Register a new webhook target.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let createWebhookRequest = CreateWebhookRequest(url: "url_example", secret: "secret_example", events: ["events_example"], processId: "processId_example", isActive: false, enableAudit: false) // CreateWebhookRequest | 

// Create webhook target
DefaultAPI.createWebhook(createWebhookRequest: createWebhookRequest) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createWebhookRequest** | [**CreateWebhookRequest**](CreateWebhookRequest.md) |  | 

### Return type

[**WebhookRecord**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteWebhook**
```swift
    open class func deleteWebhook(id: String, completion: @escaping (_ data: ResolveIncident200Response?, _ error: Error?) -> Void)
```

Delete webhook target

Delete a webhook configuration.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let id = "id_example" // String | 

// Delete webhook target
DefaultAPI.deleteWebhook(id: id) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String** |  | 

### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deployDefinition**
```swift
    open class func deployDefinition(file: URL? = nil, completion: @escaping (_ data: ProcessDefinition?, _ error: Error?) -> Void)
```

Deploy process definition

Deploy a new BPMN 2.0 XML process definition.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let file = URL(string: "https://example.com")! // URL | BPMN 2.0 XML file content to deploy (optional)

// Deploy process definition
DefaultAPI.deployDefinition(file: file) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **file** | **URL** | BPMN 2.0 XML file content to deploy | [optional] 

### Return type

[**ProcessDefinition**](ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInstance**
```swift
    open class func getInstance(id: String, completion: @escaping (_ data: ProcessInstance?, _ error: Error?) -> Void)
```

Get process instance

Fetch a single process instance state by instance ID.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let id = "id_example" // String | 

// Get process instance
DefaultAPI.getInstance(id: id) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String** |  | 

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInstanceHistory**
```swift
    open class func getInstanceHistory(id: String, completion: @escaping (_ data: [HistoryRecord]?, _ error: Error?) -> Void)
```

Get process instance execution history

Fetch the audit trail / execution history log for a process instance.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let id = "id_example" // String | 

// Get process instance execution history
DefaultAPI.getInstanceHistory(id: id) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String** |  | 

### Return type

[**[HistoryRecord]**](HistoryRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInstanceVisualization**
```swift
    open class func getInstanceVisualization(id: String, completion: @escaping (_ data: VisualizationData?, _ error: Error?) -> Void)
```

Get process instance visualization data

Retrieve diagram XML, execution node status, and history events for visualization.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let id = "id_example" // String | 

// Get process instance visualization data
DefaultAPI.getInstanceVisualization(id: id) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String** |  | 

### Return type

[**VisualizationData**](VisualizationData.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInstanceVisualizationWidget**
```swift
    open class func getInstanceVisualizationWidget(id: String, completion: @escaping (_ data: String?, _ error: Error?) -> Void)
```

Get process instance visualization widget HTML

Retrieve the ready-to-embed HTML process visualization widget.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let id = "id_example" // String | 

// Get process instance visualization widget HTML
DefaultAPI.getInstanceVisualizationWidget(id: id) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String** |  | 

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/html, application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listDefinitions**
```swift
    open class func listDefinitions(completion: @escaping (_ data: [ProcessDefinition]?, _ error: Error?) -> Void)
```

List process definitions

Retrieve a list of all deployed process definitions.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient


// List process definitions
DefaultAPI.listDefinitions() { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ProcessDefinition]**](ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listIncidents**
```swift
    open class func listIncidents(id: String, completion: @escaping (_ data: [IncidentRecord]?, _ error: Error?) -> Void)
```

List incidents for process instance

Get active execution incidents (failures) for a specific process instance.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let id = "id_example" // String | 

// List incidents for process instance
DefaultAPI.listIncidents(id: id) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String** |  | 

### Return type

[**[IncidentRecord]**](IncidentRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listInstances**
```swift
    open class func listInstances(completion: @escaping (_ data: [ProcessInstance]?, _ error: Error?) -> Void)
```

List process instances

Retrieve a list of active and completed process instances.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient


// List process instances
DefaultAPI.listInstances() { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[ProcessInstance]**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listTasks**
```swift
    open class func listTasks(assignee: String? = nil, candidateGroup: String? = nil, status: Status_listTasks? = nil, completion: @escaping (_ data: [TaskRecord]?, _ error: Error?) -> Void)
```

List human/user tasks

Query tasks matching criteria (assignee, candidateGroup, status).

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let assignee = "assignee_example" // String |  (optional)
let candidateGroup = "candidateGroup_example" // String |  (optional)
let status = "status_example" // String |  (optional)

// List human/user tasks
DefaultAPI.listTasks(assignee: assignee, candidateGroup: candidateGroup, status: status) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **assignee** | **String** |  | [optional] 
 **candidateGroup** | **String** |  | [optional] 
 **status** | **String** |  | [optional] 

### Return type

[**[TaskRecord]**](TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listWebhookDeliveries**
```swift
    open class func listWebhookDeliveries(id: String, completion: @escaping (_ data: [WebhookDeliveryRecord]?, _ error: Error?) -> Void)
```

List deliveries for webhook

Get delivery audit logs and history queue for a specific webhook target.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let id = "id_example" // String | 

// List deliveries for webhook
DefaultAPI.listWebhookDeliveries(id: id) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String** |  | 

### Return type

[**[WebhookDeliveryRecord]**](WebhookDeliveryRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listWebhooks**
```swift
    open class func listWebhooks(completion: @escaping (_ data: [WebhookRecord]?, _ error: Error?) -> Void)
```

List configured outgoing webhooks

List all registered webhook targets.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient


// List configured outgoing webhooks
DefaultAPI.listWebhooks() { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[WebhookRecord]**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **resolveIncident**
```swift
    open class func resolveIncident(id: String, incidentId: String, completion: @escaping (_ data: ResolveIncident200Response?, _ error: Error?) -> Void)
```

Resolve process incident

Resolve a process execution failure incident, triggering retry/resume.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let id = "id_example" // String | 
let incidentId = "incidentId_example" // String | 

// Resolve process incident
DefaultAPI.resolveIncident(id: id, incidentId: incidentId) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String** |  | 
 **incidentId** | **String** |  | 

### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **resumeInstance**
```swift
    open class func resumeInstance(id: String, completion: @escaping (_ data: ProcessInstance?, _ error: Error?) -> Void)
```

Resume process instance

Manually trigger execution resumption of a process instance.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let id = "id_example" // String | 

// Resume process instance
DefaultAPI.resumeInstance(id: id) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String** |  | 

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **startInstance**
```swift
    open class func startInstance(id: String, startInstanceRequest: StartInstanceRequest? = nil, completion: @escaping (_ data: ProcessInstance?, _ error: Error?) -> Void)
```

Start process instance

Start a new workflow process instance by process definition ID.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let id = "id_example" // String | The process definition ID (e.g., matching the BPMN process element ID)
let startInstanceRequest = StartInstanceRequest(instanceId: 123, businessKey: "businessKey_example", variables: "TODO") // StartInstanceRequest |  (optional)

// Start process instance
DefaultAPI.startInstance(id: id, startInstanceRequest: startInstanceRequest) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String** | The process definition ID (e.g., matching the BPMN process element ID) | 
 **startInstanceRequest** | [**StartInstanceRequest**](StartInstanceRequest.md) |  | [optional] 

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **testWebhook**
```swift
    open class func testWebhook(id: String, completion: @escaping (_ data: ResolveIncident200Response?, _ error: Error?) -> Void)
```

Test webhook target

Send a test ping event delivery to verification URL.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let id = "id_example" // String | 

// Test webhook target
DefaultAPI.testWebhook(id: id) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String** |  | 

### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateWebhook**
```swift
    open class func updateWebhook(id: String, createWebhookRequest: CreateWebhookRequest, completion: @escaping (_ data: WebhookRecord?, _ error: Error?) -> Void)
```

Update webhook target

Modify the configuration of an existing webhook.

### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import NativeBPMClient

let id = "id_example" // String | 
let createWebhookRequest = CreateWebhookRequest(url: "url_example", secret: "secret_example", events: ["events_example"], processId: "processId_example", isActive: false, enableAudit: false) // CreateWebhookRequest | 

// Update webhook target
DefaultAPI.updateWebhook(id: id, createWebhookRequest: createWebhookRequest) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String** |  | 
 **createWebhookRequest** | [**CreateWebhookRequest**](CreateWebhookRequest.md) |  | 

### Return type

[**WebhookRecord**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

