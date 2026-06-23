# nativebpm_client.api.DefaultApi

## Load the API package
```dart
import 'package:nativebpm_client/api.dart';
```

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**claimTask**](DefaultApi.md#claimtask) | **POST** /api/tasks/{id}/claim | Claim human task
[**completeInstanceTask**](DefaultApi.md#completeinstancetask) | **POST** /api/instances/{id}/complete | Complete a wait state / task activity in process instance
[**completeTask**](DefaultApi.md#completetask) | **POST** /api/tasks/{id}/complete | Complete human task
[**createWebhook**](DefaultApi.md#createwebhook) | **POST** /api/webhooks | Create webhook target
[**deleteWebhook**](DefaultApi.md#deletewebhook) | **DELETE** /api/webhooks/{id} | Delete webhook target
[**deployDefinition**](DefaultApi.md#deploydefinition) | **POST** /api/deploy | Deploy process definition
[**getInstance**](DefaultApi.md#getinstance) | **GET** /api/instances/{id} | Get process instance
[**getInstanceHistory**](DefaultApi.md#getinstancehistory) | **GET** /api/instances/{id}/history | Get process instance execution history
[**getInstanceVisualization**](DefaultApi.md#getinstancevisualization) | **GET** /api/instances/{id}/visualization | Get process instance visualization data
[**getInstanceVisualizationWidget**](DefaultApi.md#getinstancevisualizationwidget) | **GET** /api/instances/{id}/visualization/widget | Get process instance visualization widget HTML
[**getSMTPConfig**](DefaultApi.md#getsmtpconfig) | **GET** /api/smtp-config | Get SMTP configuration
[**getUserGroups**](DefaultApi.md#getusergroups) | **GET** /api/users/{username}/groups | Get user groups
[**listDefinitions**](DefaultApi.md#listdefinitions) | **GET** /api/definitions | List process definitions
[**listIncidents**](DefaultApi.md#listincidents) | **GET** /api/instances/{id}/incidents | List incidents for process instance
[**listInstances**](DefaultApi.md#listinstances) | **GET** /api/instances | List process instances
[**listTasks**](DefaultApi.md#listtasks) | **GET** /api/tasks | List human/user tasks
[**listWebhookDeliveries**](DefaultApi.md#listwebhookdeliveries) | **GET** /api/webhooks/{id}/deliveries | List deliveries for webhook
[**listWebhooks**](DefaultApi.md#listwebhooks) | **GET** /api/webhooks | List configured outgoing webhooks
[**resolveIncident**](DefaultApi.md#resolveincident) | **POST** /api/instances/{id}/incidents/{incidentId}/resolve | Resolve process incident
[**resumeInstance**](DefaultApi.md#resumeinstance) | **POST** /api/instances/{id}/resume | Resume process instance
[**startInstance**](DefaultApi.md#startinstance) | **POST** /api/definitions/{id}/start | Start process instance
[**testWebhook**](DefaultApi.md#testwebhook) | **POST** /api/webhooks/{id}/test | Test webhook target
[**updateWebhook**](DefaultApi.md#updatewebhook) | **PUT** /api/webhooks/{id} | Update webhook target


# **claimTask**
> TaskRecord claimTask(id, claimTaskRequest)

Claim human task

Claim a task for a specific user assignee.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final id = id_example; // String | 
final claimTaskRequest = ClaimTaskRequest(); // ClaimTaskRequest | 

try {
    final result = api_instance.claimTask(id, claimTaskRequest);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->claimTask: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **claimTaskRequest** | [**ClaimTaskRequest**](ClaimTaskRequest.md)|  | 

### Return type

[**TaskRecord**](TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **completeInstanceTask**
> ProcessInstance completeInstanceTask(id, completeInstanceTaskRequest)

Complete a wait state / task activity in process instance

Complete a specific active node/wait state within a process instance.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final id = id_example; // String | 
final completeInstanceTaskRequest = CompleteInstanceTaskRequest(); // CompleteInstanceTaskRequest | 

try {
    final result = api_instance.completeInstanceTask(id, completeInstanceTaskRequest);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->completeInstanceTask: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **completeInstanceTaskRequest** | [**CompleteInstanceTaskRequest**](CompleteInstanceTaskRequest.md)|  | 

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **completeTask**
> ProcessInstance completeTask(id, completeTaskRequest)

Complete human task

Complete a claimed human task, providing results variables.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final id = id_example; // String | 
final completeTaskRequest = CompleteTaskRequest(); // CompleteTaskRequest | 

try {
    final result = api_instance.completeTask(id, completeTaskRequest);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->completeTask: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **completeTaskRequest** | [**CompleteTaskRequest**](CompleteTaskRequest.md)|  | [optional] 

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createWebhook**
> WebhookRecord createWebhook(createWebhookRequest)

Create webhook target

Register a new webhook target.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final createWebhookRequest = CreateWebhookRequest(); // CreateWebhookRequest | 

try {
    final result = api_instance.createWebhook(createWebhookRequest);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->createWebhook: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createWebhookRequest** | [**CreateWebhookRequest**](CreateWebhookRequest.md)|  | 

### Return type

[**WebhookRecord**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteWebhook**
> ResolveIncident200Response deleteWebhook(id)

Delete webhook target

Delete a webhook configuration.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final id = id_example; // String | 

try {
    final result = api_instance.deleteWebhook(id);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->deleteWebhook: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deployDefinition**
> ProcessDefinition deployDefinition(file)

Deploy process definition

Deploy a new BPMN 2.0 XML process definition.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final file = BINARY_DATA_HERE; // MultipartFile | BPMN 2.0 XML file content to deploy

try {
    final result = api_instance.deployDefinition(file);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->deployDefinition: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **file** | **MultipartFile**| BPMN 2.0 XML file content to deploy | [optional] 

### Return type

[**ProcessDefinition**](ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInstance**
> ProcessInstance getInstance(id)

Get process instance

Fetch a single process instance state by instance ID.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final id = id_example; // String | 

try {
    final result = api_instance.getInstance(id);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->getInstance: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInstanceHistory**
> List<HistoryRecord> getInstanceHistory(id)

Get process instance execution history

Fetch the audit trail / execution history log for a process instance.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final id = id_example; // String | 

try {
    final result = api_instance.getInstanceHistory(id);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->getInstanceHistory: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**List<HistoryRecord>**](HistoryRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInstanceVisualization**
> VisualizationData getInstanceVisualization(id)

Get process instance visualization data

Retrieve diagram XML, execution node status, and history events for visualization.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final id = id_example; // String | 

try {
    final result = api_instance.getInstanceVisualization(id);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->getInstanceVisualization: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**VisualizationData**](VisualizationData.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInstanceVisualizationWidget**
> String getInstanceVisualizationWidget(id)

Get process instance visualization widget HTML

Retrieve the ready-to-embed HTML process visualization widget.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final id = id_example; // String | 

try {
    final result = api_instance.getInstanceVisualizationWidget(id);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->getInstanceVisualizationWidget: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/html, application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSMTPConfig**
> SMTPConfig getSMTPConfig()

Get SMTP configuration

Retrieve the current SMTP mailer configuration (admin/developer only).

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();

try {
    final result = api_instance.getSMTPConfig();
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->getSMTPConfig: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**SMTPConfig**](SMTPConfig.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserGroups**
> List<String> getUserGroups(username)

Get user groups

Retrieve the list of groups (chats) the user is a member of.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final username = username_example; // String | The username to retrieve groups for

try {
    final result = api_instance.getUserGroups(username);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->getUserGroups: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **username** | **String**| The username to retrieve groups for | 

### Return type

**List<String>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listDefinitions**
> List<ProcessDefinition> listDefinitions()

List process definitions

Retrieve a list of all deployed process definitions.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();

try {
    final result = api_instance.listDefinitions();
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->listDefinitions: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List<ProcessDefinition>**](ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listIncidents**
> List<IncidentRecord> listIncidents(id)

List incidents for process instance

Get active execution incidents (failures) for a specific process instance.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final id = id_example; // String | 

try {
    final result = api_instance.listIncidents(id);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->listIncidents: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**List<IncidentRecord>**](IncidentRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listInstances**
> List<ProcessInstance> listInstances()

List process instances

Retrieve a list of active and completed process instances.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();

try {
    final result = api_instance.listInstances();
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->listInstances: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List<ProcessInstance>**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listTasks**
> List<TaskRecord> listTasks(assignee, candidateGroup, status)

List human/user tasks

Query tasks matching criteria (assignee, candidateGroup, status).

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final assignee = assignee_example; // String | 
final candidateGroup = candidateGroup_example; // String | 
final status = status_example; // String | 

try {
    final result = api_instance.listTasks(assignee, candidateGroup, status);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->listTasks: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **assignee** | **String**|  | [optional] 
 **candidateGroup** | **String**|  | [optional] 
 **status** | **String**|  | [optional] 

### Return type

[**List<TaskRecord>**](TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listWebhookDeliveries**
> List<WebhookDeliveryRecord> listWebhookDeliveries(id)

List deliveries for webhook

Get delivery audit logs and history queue for a specific webhook target.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final id = id_example; // String | 

try {
    final result = api_instance.listWebhookDeliveries(id);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->listWebhookDeliveries: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**List<WebhookDeliveryRecord>**](WebhookDeliveryRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listWebhooks**
> List<WebhookRecord> listWebhooks()

List configured outgoing webhooks

List all registered webhook targets.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();

try {
    final result = api_instance.listWebhooks();
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->listWebhooks: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List<WebhookRecord>**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **resolveIncident**
> ResolveIncident200Response resolveIncident(id, incidentId)

Resolve process incident

Resolve a process execution failure incident, triggering retry/resume.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final id = id_example; // String | 
final incidentId = incidentId_example; // String | 

try {
    final result = api_instance.resolveIncident(id, incidentId);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->resolveIncident: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **incidentId** | **String**|  | 

### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **resumeInstance**
> ProcessInstance resumeInstance(id)

Resume process instance

Manually trigger execution resumption of a process instance.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final id = id_example; // String | 

try {
    final result = api_instance.resumeInstance(id);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->resumeInstance: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **startInstance**
> ProcessInstance startInstance(id, startInstanceRequest)

Start process instance

Start a new workflow process instance by process definition ID.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final id = id_example; // String | The process definition ID (e.g., matching the BPMN process element ID)
final startInstanceRequest = StartInstanceRequest(); // StartInstanceRequest | 

try {
    final result = api_instance.startInstance(id, startInstanceRequest);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->startInstance: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| The process definition ID (e.g., matching the BPMN process element ID) | 
 **startInstanceRequest** | [**StartInstanceRequest**](StartInstanceRequest.md)|  | [optional] 

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **testWebhook**
> ResolveIncident200Response testWebhook(id)

Test webhook target

Send a test ping event delivery to verification URL.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final id = id_example; // String | 

try {
    final result = api_instance.testWebhook(id);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->testWebhook: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateWebhook**
> WebhookRecord updateWebhook(id, createWebhookRequest)

Update webhook target

Modify the configuration of an existing webhook.

### Example
```dart
import 'package:nativebpm_client/api.dart';

final api_instance = DefaultApi();
final id = id_example; // String | 
final createWebhookRequest = CreateWebhookRequest(); // CreateWebhookRequest | 

try {
    final result = api_instance.updateWebhook(id, createWebhookRequest);
    print(result);
} catch (e) {
    print('Exception when calling DefaultApi->updateWebhook: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **createWebhookRequest** | [**CreateWebhookRequest**](CreateWebhookRequest.md)|  | 

### Return type

[**WebhookRecord**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

