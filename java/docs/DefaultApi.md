# DefaultApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
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
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String id = "id_example"; // String | 
    ClaimTaskRequest claimTaskRequest = new ClaimTaskRequest(); // ClaimTaskRequest | 
    try {
      TaskRecord result = apiInstance.claimTask(id, claimTaskRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#claimTask");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**|  | |
| **claimTaskRequest** | [**ClaimTaskRequest**](ClaimTaskRequest.md)|  | |

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

<a id="completeInstanceTask"></a>
# **completeInstanceTask**
> ProcessInstance completeInstanceTask(id, completeInstanceTaskRequest)

Complete a wait state / task activity in process instance

Complete a specific active node/wait state within a process instance.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String id = "id_example"; // String | 
    CompleteInstanceTaskRequest completeInstanceTaskRequest = new CompleteInstanceTaskRequest(); // CompleteInstanceTaskRequest | 
    try {
      ProcessInstance result = apiInstance.completeInstanceTask(id, completeInstanceTaskRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#completeInstanceTask");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**|  | |
| **completeInstanceTaskRequest** | [**CompleteInstanceTaskRequest**](CompleteInstanceTaskRequest.md)|  | |

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

<a id="completeTask"></a>
# **completeTask**
> ProcessInstance completeTask(id, completeTaskRequest)

Complete human task

Complete a claimed human task, providing results variables.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String id = "id_example"; // String | 
    CompleteTaskRequest completeTaskRequest = new CompleteTaskRequest(); // CompleteTaskRequest | 
    try {
      ProcessInstance result = apiInstance.completeTask(id, completeTaskRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#completeTask");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**|  | |
| **completeTaskRequest** | [**CompleteTaskRequest**](CompleteTaskRequest.md)|  | [optional] |

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

<a id="createWebhook"></a>
# **createWebhook**
> WebhookRecord createWebhook(createWebhookRequest)

Create webhook target

Register a new webhook target.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    CreateWebhookRequest createWebhookRequest = new CreateWebhookRequest(); // CreateWebhookRequest | 
    try {
      WebhookRecord result = apiInstance.createWebhook(createWebhookRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#createWebhook");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **createWebhookRequest** | [**CreateWebhookRequest**](CreateWebhookRequest.md)|  | |

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

<a id="deleteWebhook"></a>
# **deleteWebhook**
> ResolveIncident200Response deleteWebhook(id)

Delete webhook target

Delete a webhook configuration.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String id = "id_example"; // String | 
    try {
      ResolveIncident200Response result = apiInstance.deleteWebhook(id);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#deleteWebhook");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**|  | |

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

<a id="deployDefinition"></a>
# **deployDefinition**
> ProcessDefinition deployDefinition(_file)

Deploy process definition

Deploy a new BPMN 2.0 XML process definition.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    File _file = new File("/path/to/file"); // File | BPMN 2.0 XML file content to deploy
    try {
      ProcessDefinition result = apiInstance.deployDefinition(_file);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#deployDefinition");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **_file** | **File**| BPMN 2.0 XML file content to deploy | [optional] |

### Return type

[**ProcessDefinition**](ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data, application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **400** | Invalid request body or malformed BPMN XML |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

<a id="getInstance"></a>
# **getInstance**
> ProcessInstance getInstance(id)

Get process instance

Fetch a single process instance state by instance ID.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String id = "id_example"; // String | 
    try {
      ProcessInstance result = apiInstance.getInstance(id);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#getInstance");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**|  | |

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

<a id="getInstanceHistory"></a>
# **getInstanceHistory**
> List&lt;HistoryRecord&gt; getInstanceHistory(id)

Get process instance execution history

Fetch the audit trail / execution history log for a process instance.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String id = "id_example"; // String | 
    try {
      List<HistoryRecord> result = apiInstance.getInstanceHistory(id);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#getInstanceHistory");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**|  | |

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

<a id="getInstanceVisualization"></a>
# **getInstanceVisualization**
> VisualizationData getInstanceVisualization(id)

Get process instance visualization data

Retrieve diagram XML, execution node status, and history events for visualization.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String id = "id_example"; // String | 
    try {
      VisualizationData result = apiInstance.getInstanceVisualization(id);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#getInstanceVisualization");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**|  | |

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

<a id="getInstanceVisualizationWidget"></a>
# **getInstanceVisualizationWidget**
> String getInstanceVisualizationWidget(id)

Get process instance visualization widget HTML

Retrieve the ready-to-embed HTML process visualization widget.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String id = "id_example"; // String | 
    try {
      String result = apiInstance.getInstanceVisualizationWidget(id);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#getInstanceVisualizationWidget");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**|  | |

### Return type

**String**

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

<a id="getSMTPConfig"></a>
# **getSMTPConfig**
> SMTPConfig getSMTPConfig()

Get SMTP configuration

Retrieve the current SMTP mailer configuration (admin/developer only).

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    try {
      SMTPConfig result = apiInstance.getSMTPConfig();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#getSMTPConfig");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
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

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
| **403** | Forbidden - insufficient operator permissions or role level |  -  |
| **404** | SMTP config not found |  -  |
| **500** | Internal Server Error - database failure or execution crash |  -  |

<a id="getUserGroups"></a>
# **getUserGroups**
> List&lt;String&gt; getUserGroups(username)

Get user groups

Retrieve the list of groups (chats) the user is a member of.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String username = "username_example"; // String | The username to retrieve groups for
    try {
      List<String> result = apiInstance.getUserGroups(username);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#getUserGroups");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **username** | **String**| The username to retrieve groups for | |

### Return type

**List&lt;String&gt;**

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

<a id="listDefinitions"></a>
# **listDefinitions**
> List&lt;ProcessDefinition&gt; listDefinitions()

List process definitions

Retrieve a list of all deployed process definitions.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    try {
      List<ProcessDefinition> result = apiInstance.listDefinitions();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#listDefinitions");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

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

<a id="listIncidents"></a>
# **listIncidents**
> List&lt;IncidentRecord&gt; listIncidents(id)

List incidents for process instance

Get active execution incidents (failures) for a specific process instance.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String id = "id_example"; // String | 
    try {
      List<IncidentRecord> result = apiInstance.listIncidents(id);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#listIncidents");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**|  | |

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

<a id="listInstances"></a>
# **listInstances**
> List&lt;ProcessInstance&gt; listInstances()

List process instances

Retrieve a list of active and completed process instances.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    try {
      List<ProcessInstance> result = apiInstance.listInstances();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#listInstances");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

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

<a id="listTasks"></a>
# **listTasks**
> List&lt;TaskRecord&gt; listTasks(assignee, candidateGroup, status)

List human/user tasks

Query tasks matching criteria (assignee, candidateGroup, status).

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String assignee = "assignee_example"; // String | 
    String candidateGroup = "candidateGroup_example"; // String | 
    String status = "CREATED"; // String | 
    try {
      List<TaskRecord> result = apiInstance.listTasks(assignee, candidateGroup, status);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#listTasks");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **assignee** | **String**|  | [optional] |
| **candidateGroup** | **String**|  | [optional] |
| **status** | **String**|  | [optional] [enum: CREATED, CLAIMED, COMPLETED] |

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

<a id="listWebhookDeliveries"></a>
# **listWebhookDeliveries**
> List&lt;WebhookDeliveryRecord&gt; listWebhookDeliveries(id)

List deliveries for webhook

Get delivery audit logs and history queue for a specific webhook target.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String id = "id_example"; // String | 
    try {
      List<WebhookDeliveryRecord> result = apiInstance.listWebhookDeliveries(id);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#listWebhookDeliveries");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**|  | |

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

<a id="listWebhooks"></a>
# **listWebhooks**
> List&lt;WebhookRecord&gt; listWebhooks()

List configured outgoing webhooks

List all registered webhook targets.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    try {
      List<WebhookRecord> result = apiInstance.listWebhooks();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#listWebhooks");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

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

<a id="resolveIncident"></a>
# **resolveIncident**
> ResolveIncident200Response resolveIncident(id, incidentId)

Resolve process incident

Resolve a process execution failure incident, triggering retry/resume.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String id = "id_example"; // String | 
    String incidentId = "incidentId_example"; // String | 
    try {
      ResolveIncident200Response result = apiInstance.resolveIncident(id, incidentId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#resolveIncident");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**|  | |
| **incidentId** | **String**|  | |

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

<a id="resumeInstance"></a>
# **resumeInstance**
> ProcessInstance resumeInstance(id)

Resume process instance

Manually trigger execution resumption of a process instance.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String id = "id_example"; // String | 
    try {
      ProcessInstance result = apiInstance.resumeInstance(id);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#resumeInstance");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**|  | |

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

<a id="startInstance"></a>
# **startInstance**
> ProcessInstance startInstance(id, startInstanceRequest)

Start process instance

Start a new workflow process instance by process definition ID.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String id = "id_example"; // String | The process definition ID (e.g., matching the BPMN process element ID)
    StartInstanceRequest startInstanceRequest = new StartInstanceRequest(); // StartInstanceRequest | 
    try {
      ProcessInstance result = apiInstance.startInstance(id, startInstanceRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#startInstance");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**| The process definition ID (e.g., matching the BPMN process element ID) | |
| **startInstanceRequest** | [**StartInstanceRequest**](StartInstanceRequest.md)|  | [optional] |

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

<a id="testWebhook"></a>
# **testWebhook**
> ResolveIncident200Response testWebhook(id)

Test webhook target

Send a test ping event delivery to verification URL.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String id = "id_example"; // String | 
    try {
      ResolveIncident200Response result = apiInstance.testWebhook(id);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#testWebhook");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**|  | |

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

<a id="updateWebhook"></a>
# **updateWebhook**
> WebhookRecord updateWebhook(id, createWebhookRequest)

Update webhook target

Modify the configuration of an existing webhook.

### Example
```java
// Import classes:
import com.nativebpm.client.ApiClient;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.Configuration;
import com.nativebpm.client.models.*;
import com.nativebpm.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    String id = "id_example"; // String | 
    CreateWebhookRequest createWebhookRequest = new CreateWebhookRequest(); // CreateWebhookRequest | 
    try {
      WebhookRecord result = apiInstance.updateWebhook(id, createWebhookRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#updateWebhook");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**|  | |
| **createWebhookRequest** | [**CreateWebhookRequest**](CreateWebhookRequest.md)|  | |

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

