# DefaultApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**claimTask**](DefaultApi.md#claimTask) | **POST** /api/tasks/{id}/claim | Claim human task |
| [**completeInstanceTask**](DefaultApi.md#completeInstanceTask) | **POST** /api/instances/{id}/complete | Complete a wait state / task activity in process instance |
| [**completeTask**](DefaultApi.md#completeTask) | **POST** /api/tasks/{id}/complete | Complete human task |
| [**createWebhook**](DefaultApi.md#createWebhook) | **POST** /api/webhooks | Create webhook target |
| [**deleteWebhook**](DefaultApi.md#deleteWebhook) | **DELETE** /api/webhooks/{id} | Delete webhook target |
| [**deployDefinition**](DefaultApi.md#deployDefinition) | **POST** /api/deploy | Deploy process definition |
| [**getInstance**](DefaultApi.md#getInstance) | **GET** /api/instances/{id} | Get process instance |
| [**getInstanceHistory**](DefaultApi.md#getInstanceHistory) | **GET** /api/instances/{id}/history | Get process instance execution history |
| [**getInstanceVisualization**](DefaultApi.md#getInstanceVisualization) | **GET** /api/instances/{id}/visualization | Get process instance visualization data |
| [**getInstanceVisualizationWidget**](DefaultApi.md#getInstanceVisualizationWidget) | **GET** /api/instances/{id}/visualization/widget | Get process instance visualization widget HTML |
| [**getSMTPConfig**](DefaultApi.md#getSMTPConfig) | **GET** /api/smtp-config | Get SMTP configuration |
| [**getUserGroups**](DefaultApi.md#getUserGroups) | **GET** /api/users/{username}/groups | Get user groups |
| [**listDefinitions**](DefaultApi.md#listDefinitions) | **GET** /api/definitions | List process definitions |
| [**listIncidents**](DefaultApi.md#listIncidents) | **GET** /api/instances/{id}/incidents | List incidents for process instance |
| [**listInstances**](DefaultApi.md#listInstances) | **GET** /api/instances | List process instances |
| [**listTasks**](DefaultApi.md#listTasks) | **GET** /api/tasks | List human/user tasks |
| [**listWebhookDeliveries**](DefaultApi.md#listWebhookDeliveries) | **GET** /api/webhooks/{id}/deliveries | List deliveries for webhook |
| [**listWebhooks**](DefaultApi.md#listWebhooks) | **GET** /api/webhooks | List configured outgoing webhooks |
| [**resolveIncident**](DefaultApi.md#resolveIncident) | **POST** /api/instances/{id}/incidents/{incidentId}/resolve | Resolve process incident |
| [**resumeInstance**](DefaultApi.md#resumeInstance) | **POST** /api/instances/{id}/resume | Resume process instance |
| [**startInstance**](DefaultApi.md#startInstance) | **POST** /api/definitions/{id}/start | Start process instance |
| [**testWebhook**](DefaultApi.md#testWebhook) | **POST** /api/webhooks/{id}/test | Test webhook target |
| [**updateWebhook**](DefaultApi.md#updateWebhook) | **PUT** /api/webhooks/{id} | Update webhook target |


<a id="claimTask"></a>
# **claimTask**
> TaskRecord claimTask(id, claimTaskRequest)

Claim human task

Claim a task for a specific user assignee.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val id : kotlin.String = id_example // kotlin.String | 
val claimTaskRequest : ClaimTaskRequest =  // ClaimTaskRequest | 
try {
    val result : TaskRecord = apiInstance.claimTask(id, claimTaskRequest)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#claimTask")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#claimTask")
    e.printStackTrace()
}
```

### Parameters
| **id** | **kotlin.String**|  | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **claimTaskRequest** | [**ClaimTaskRequest**](ClaimTaskRequest.md)|  | |

### Return type

[**TaskRecord**](TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="completeInstanceTask"></a>
# **completeInstanceTask**
> ProcessInstance completeInstanceTask(id, completeInstanceTaskRequest)

Complete a wait state / task activity in process instance

Complete a specific active node/wait state within a process instance.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val id : kotlin.String = id_example // kotlin.String | 
val completeInstanceTaskRequest : CompleteInstanceTaskRequest =  // CompleteInstanceTaskRequest | 
try {
    val result : ProcessInstance = apiInstance.completeInstanceTask(id, completeInstanceTaskRequest)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#completeInstanceTask")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#completeInstanceTask")
    e.printStackTrace()
}
```

### Parameters
| **id** | **kotlin.String**|  | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **completeInstanceTaskRequest** | [**CompleteInstanceTaskRequest**](CompleteInstanceTaskRequest.md)|  | |

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="completeTask"></a>
# **completeTask**
> ProcessInstance completeTask(id, completeTaskRequest)

Complete human task

Complete a claimed human task, providing results variables.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val id : kotlin.String = id_example // kotlin.String | 
val completeTaskRequest : CompleteTaskRequest =  // CompleteTaskRequest | 
try {
    val result : ProcessInstance = apiInstance.completeTask(id, completeTaskRequest)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#completeTask")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#completeTask")
    e.printStackTrace()
}
```

### Parameters
| **id** | **kotlin.String**|  | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **completeTaskRequest** | [**CompleteTaskRequest**](CompleteTaskRequest.md)|  | [optional] |

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="createWebhook"></a>
# **createWebhook**
> WebhookRecord createWebhook(createWebhookRequest)

Create webhook target

Register a new webhook target.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val createWebhookRequest : CreateWebhookRequest =  // CreateWebhookRequest | 
try {
    val result : WebhookRecord = apiInstance.createWebhook(createWebhookRequest)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#createWebhook")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#createWebhook")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **createWebhookRequest** | [**CreateWebhookRequest**](CreateWebhookRequest.md)|  | |

### Return type

[**WebhookRecord**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="deleteWebhook"></a>
# **deleteWebhook**
> ResolveIncident200Response deleteWebhook(id)

Delete webhook target

Delete a webhook configuration.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val id : kotlin.String = id_example // kotlin.String | 
try {
    val result : ResolveIncident200Response = apiInstance.deleteWebhook(id)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#deleteWebhook")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#deleteWebhook")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **kotlin.String**|  | |

### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="deployDefinition"></a>
# **deployDefinition**
> ProcessDefinition deployDefinition(file)

Deploy process definition

Deploy a new BPMN 2.0 XML process definition.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val file : java.io.File = BINARY_DATA_HERE // java.io.File | BPMN 2.0 XML file content to deploy
try {
    val result : ProcessDefinition = apiInstance.deployDefinition(file)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#deployDefinition")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#deployDefinition")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **file** | **java.io.File**| BPMN 2.0 XML file content to deploy | [optional] |

### Return type

[**ProcessDefinition**](ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json

<a id="getInstance"></a>
# **getInstance**
> ProcessInstance getInstance(id)

Get process instance

Fetch a single process instance state by instance ID.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val id : kotlin.String = id_example // kotlin.String | 
try {
    val result : ProcessInstance = apiInstance.getInstance(id)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#getInstance")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#getInstance")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **kotlin.String**|  | |

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getInstanceHistory"></a>
# **getInstanceHistory**
> kotlin.collections.List&lt;HistoryRecord&gt; getInstanceHistory(id)

Get process instance execution history

Fetch the audit trail / execution history log for a process instance.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val id : kotlin.String = id_example // kotlin.String | 
try {
    val result : kotlin.collections.List<HistoryRecord> = apiInstance.getInstanceHistory(id)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#getInstanceHistory")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#getInstanceHistory")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **kotlin.String**|  | |

### Return type

[**kotlin.collections.List&lt;HistoryRecord&gt;**](HistoryRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getInstanceVisualization"></a>
# **getInstanceVisualization**
> VisualizationData getInstanceVisualization(id)

Get process instance visualization data

Retrieve diagram XML, execution node status, and history events for visualization.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val id : kotlin.String = id_example // kotlin.String | 
try {
    val result : VisualizationData = apiInstance.getInstanceVisualization(id)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#getInstanceVisualization")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#getInstanceVisualization")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **kotlin.String**|  | |

### Return type

[**VisualizationData**](VisualizationData.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getInstanceVisualizationWidget"></a>
# **getInstanceVisualizationWidget**
> kotlin.String getInstanceVisualizationWidget(id)

Get process instance visualization widget HTML

Retrieve the ready-to-embed HTML process visualization widget.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val id : kotlin.String = id_example // kotlin.String | 
try {
    val result : kotlin.String = apiInstance.getInstanceVisualizationWidget(id)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#getInstanceVisualizationWidget")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#getInstanceVisualizationWidget")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **kotlin.String**|  | |

### Return type

**kotlin.String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="getSMTPConfig"></a>
# **getSMTPConfig**
> SMTPConfig getSMTPConfig()

Get SMTP configuration

Retrieve the current SMTP mailer configuration (admin/developer only).

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
try {
    val result : SMTPConfig = apiInstance.getSMTPConfig()
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#getSMTPConfig")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#getSMTPConfig")
    e.printStackTrace()
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

<a id="getUserGroups"></a>
# **getUserGroups**
> kotlin.collections.List&lt;kotlin.String&gt; getUserGroups(username)

Get user groups

Retrieve the list of groups (chats) the user is a member of.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val username : kotlin.String = username_example // kotlin.String | The username to retrieve groups for
try {
    val result : kotlin.collections.List<kotlin.String> = apiInstance.getUserGroups(username)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#getUserGroups")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#getUserGroups")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **username** | **kotlin.String**| The username to retrieve groups for | |

### Return type

**kotlin.collections.List&lt;kotlin.String&gt;**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="listDefinitions"></a>
# **listDefinitions**
> kotlin.collections.List&lt;ProcessDefinition&gt; listDefinitions()

List process definitions

Retrieve a list of all deployed process definitions.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
try {
    val result : kotlin.collections.List<ProcessDefinition> = apiInstance.listDefinitions()
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#listDefinitions")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#listDefinitions")
    e.printStackTrace()
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**kotlin.collections.List&lt;ProcessDefinition&gt;**](ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="listIncidents"></a>
# **listIncidents**
> kotlin.collections.List&lt;IncidentRecord&gt; listIncidents(id)

List incidents for process instance

Get active execution incidents (failures) for a specific process instance.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val id : kotlin.String = id_example // kotlin.String | 
try {
    val result : kotlin.collections.List<IncidentRecord> = apiInstance.listIncidents(id)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#listIncidents")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#listIncidents")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **kotlin.String**|  | |

### Return type

[**kotlin.collections.List&lt;IncidentRecord&gt;**](IncidentRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="listInstances"></a>
# **listInstances**
> kotlin.collections.List&lt;ProcessInstance&gt; listInstances()

List process instances

Retrieve a list of active and completed process instances.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
try {
    val result : kotlin.collections.List<ProcessInstance> = apiInstance.listInstances()
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#listInstances")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#listInstances")
    e.printStackTrace()
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**kotlin.collections.List&lt;ProcessInstance&gt;**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="listTasks"></a>
# **listTasks**
> kotlin.collections.List&lt;TaskRecord&gt; listTasks(assignee, candidateGroup, status)

List human/user tasks

Query tasks matching criteria (assignee, candidateGroup, status).

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val assignee : kotlin.String = assignee_example // kotlin.String | 
val candidateGroup : kotlin.String = candidateGroup_example // kotlin.String | 
val status : kotlin.String = status_example // kotlin.String | 
try {
    val result : kotlin.collections.List<TaskRecord> = apiInstance.listTasks(assignee, candidateGroup, status)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#listTasks")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#listTasks")
    e.printStackTrace()
}
```

### Parameters
| **assignee** | **kotlin.String**|  | [optional] |
| **candidateGroup** | **kotlin.String**|  | [optional] |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **status** | **kotlin.String**|  | [optional] [enum: CREATED, CLAIMED, COMPLETED] |

### Return type

[**kotlin.collections.List&lt;TaskRecord&gt;**](TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="listWebhookDeliveries"></a>
# **listWebhookDeliveries**
> kotlin.collections.List&lt;WebhookDeliveryRecord&gt; listWebhookDeliveries(id)

List deliveries for webhook

Get delivery audit logs and history queue for a specific webhook target.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val id : kotlin.String = id_example // kotlin.String | 
try {
    val result : kotlin.collections.List<WebhookDeliveryRecord> = apiInstance.listWebhookDeliveries(id)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#listWebhookDeliveries")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#listWebhookDeliveries")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **kotlin.String**|  | |

### Return type

[**kotlin.collections.List&lt;WebhookDeliveryRecord&gt;**](WebhookDeliveryRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="listWebhooks"></a>
# **listWebhooks**
> kotlin.collections.List&lt;WebhookRecord&gt; listWebhooks()

List configured outgoing webhooks

List all registered webhook targets.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
try {
    val result : kotlin.collections.List<WebhookRecord> = apiInstance.listWebhooks()
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#listWebhooks")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#listWebhooks")
    e.printStackTrace()
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**kotlin.collections.List&lt;WebhookRecord&gt;**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="resolveIncident"></a>
# **resolveIncident**
> ResolveIncident200Response resolveIncident(id, incidentId)

Resolve process incident

Resolve a process execution failure incident, triggering retry/resume.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val id : kotlin.String = id_example // kotlin.String | 
val incidentId : kotlin.String = incidentId_example // kotlin.String | 
try {
    val result : ResolveIncident200Response = apiInstance.resolveIncident(id, incidentId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#resolveIncident")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#resolveIncident")
    e.printStackTrace()
}
```

### Parameters
| **id** | **kotlin.String**|  | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **incidentId** | **kotlin.String**|  | |

### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="resumeInstance"></a>
# **resumeInstance**
> ProcessInstance resumeInstance(id)

Resume process instance

Manually trigger execution resumption of a process instance.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val id : kotlin.String = id_example // kotlin.String | 
try {
    val result : ProcessInstance = apiInstance.resumeInstance(id)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#resumeInstance")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#resumeInstance")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **kotlin.String**|  | |

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="startInstance"></a>
# **startInstance**
> ProcessInstance startInstance(id, startInstanceRequest)

Start process instance

Start a new workflow process instance by process definition ID.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val id : kotlin.String = id_example // kotlin.String | The process definition ID (e.g., matching the BPMN process element ID)
val startInstanceRequest : StartInstanceRequest =  // StartInstanceRequest | 
try {
    val result : ProcessInstance = apiInstance.startInstance(id, startInstanceRequest)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#startInstance")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#startInstance")
    e.printStackTrace()
}
```

### Parameters
| **id** | **kotlin.String**| The process definition ID (e.g., matching the BPMN process element ID) | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **startInstanceRequest** | [**StartInstanceRequest**](StartInstanceRequest.md)|  | [optional] |

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a id="testWebhook"></a>
# **testWebhook**
> ResolveIncident200Response testWebhook(id)

Test webhook target

Send a test ping event delivery to verification URL.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val id : kotlin.String = id_example // kotlin.String | 
try {
    val result : ResolveIncident200Response = apiInstance.testWebhook(id)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#testWebhook")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#testWebhook")
    e.printStackTrace()
}
```

### Parameters
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **kotlin.String**|  | |

### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a id="updateWebhook"></a>
# **updateWebhook**
> WebhookRecord updateWebhook(id, createWebhookRequest)

Update webhook target

Modify the configuration of an existing webhook.

### Example
```kotlin
// Import classes:
//import com.nativebpm.client.infrastructure.*
//import com.nativebpm.client.models.*

val apiInstance = DefaultApi()
val id : kotlin.String = id_example // kotlin.String | 
val createWebhookRequest : CreateWebhookRequest =  // CreateWebhookRequest | 
try {
    val result : WebhookRecord = apiInstance.updateWebhook(id, createWebhookRequest)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling DefaultApi#updateWebhook")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling DefaultApi#updateWebhook")
    e.printStackTrace()
}
```

### Parameters
| **id** | **kotlin.String**|  | |
| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **createWebhookRequest** | [**CreateWebhookRequest**](CreateWebhookRequest.md)|  | |

### Return type

[**WebhookRecord**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

