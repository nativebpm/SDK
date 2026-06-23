# nativebpm_client.DefaultApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**claim_task**](DefaultApi.md#claim_task) | **POST** /api/tasks/{id}/claim | Claim human task
[**complete_instance_task**](DefaultApi.md#complete_instance_task) | **POST** /api/instances/{id}/complete | Complete a wait state / task activity in process instance
[**complete_task**](DefaultApi.md#complete_task) | **POST** /api/tasks/{id}/complete | Complete human task
[**create_webhook**](DefaultApi.md#create_webhook) | **POST** /api/webhooks | Create webhook target
[**delete_webhook**](DefaultApi.md#delete_webhook) | **DELETE** /api/webhooks/{id} | Delete webhook target
[**deploy_definition**](DefaultApi.md#deploy_definition) | **POST** /api/deploy | Deploy process definition
[**get_instance**](DefaultApi.md#get_instance) | **GET** /api/instances/{id} | Get process instance
[**get_instance_history**](DefaultApi.md#get_instance_history) | **GET** /api/instances/{id}/history | Get process instance execution history
[**get_instance_visualization**](DefaultApi.md#get_instance_visualization) | **GET** /api/instances/{id}/visualization | Get process instance visualization data
[**get_instance_visualization_widget**](DefaultApi.md#get_instance_visualization_widget) | **GET** /api/instances/{id}/visualization/widget | Get process instance visualization widget HTML
[**list_definitions**](DefaultApi.md#list_definitions) | **GET** /api/definitions | List process definitions
[**list_incidents**](DefaultApi.md#list_incidents) | **GET** /api/instances/{id}/incidents | List incidents for process instance
[**list_instances**](DefaultApi.md#list_instances) | **GET** /api/instances | List process instances
[**list_tasks**](DefaultApi.md#list_tasks) | **GET** /api/tasks | List human/user tasks
[**list_webhook_deliveries**](DefaultApi.md#list_webhook_deliveries) | **GET** /api/webhooks/{id}/deliveries | List deliveries for webhook
[**list_webhooks**](DefaultApi.md#list_webhooks) | **GET** /api/webhooks | List configured outgoing webhooks
[**resolve_incident**](DefaultApi.md#resolve_incident) | **POST** /api/instances/{id}/incidents/{incidentId}/resolve | Resolve process incident
[**resume_instance**](DefaultApi.md#resume_instance) | **POST** /api/instances/{id}/resume | Resume process instance
[**start_instance**](DefaultApi.md#start_instance) | **POST** /api/definitions/{id}/start | Start process instance
[**test_webhook**](DefaultApi.md#test_webhook) | **POST** /api/webhooks/{id}/test | Test webhook target
[**update_webhook**](DefaultApi.md#update_webhook) | **PUT** /api/webhooks/{id} | Update webhook target


# **claim_task**
> TaskRecord claim_task(id, claim_task_request)

Claim human task

Claim a task for a specific user assignee.

### Example


```python
import nativebpm_client
from nativebpm_client.models.claim_task_request import ClaimTaskRequest
from nativebpm_client.models.task_record import TaskRecord
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    id = 'id_example' # str | 
    claim_task_request = nativebpm_client.ClaimTaskRequest() # ClaimTaskRequest | 

    try:
        # Claim human task
        api_response = api_instance.claim_task(id, claim_task_request)
        print("The response of DefaultApi->claim_task:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->claim_task: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 
 **claim_task_request** | [**ClaimTaskRequest**](ClaimTaskRequest.md)|  | 

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
**200** | Task claimed successfully |  -  |
**400** | Task cannot be claimed |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**403** | Forbidden - insufficient operator permissions or role level |  -  |
**404** | Task not found |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **complete_instance_task**
> ProcessInstance complete_instance_task(id, complete_instance_task_request)

Complete a wait state / task activity in process instance

Complete a specific active node/wait state within a process instance.

### Example


```python
import nativebpm_client
from nativebpm_client.models.complete_instance_task_request import CompleteInstanceTaskRequest
from nativebpm_client.models.process_instance import ProcessInstance
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    id = 'id_example' # str | 
    complete_instance_task_request = nativebpm_client.CompleteInstanceTaskRequest() # CompleteInstanceTaskRequest | 

    try:
        # Complete a wait state / task activity in process instance
        api_response = api_instance.complete_instance_task(id, complete_instance_task_request)
        print("The response of DefaultApi->complete_instance_task:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->complete_instance_task: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 
 **complete_instance_task_request** | [**CompleteInstanceTaskRequest**](CompleteInstanceTaskRequest.md)|  | 

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
**200** | Process instance state after completion |  -  |
**400** | Missing parameter node_id or invalid payload |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**403** | Forbidden - insufficient operator permissions or role level |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **complete_task**
> ProcessInstance complete_task(id, complete_task_request=complete_task_request)

Complete human task

Complete a claimed human task, providing results variables.

### Example


```python
import nativebpm_client
from nativebpm_client.models.complete_task_request import CompleteTaskRequest
from nativebpm_client.models.process_instance import ProcessInstance
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    id = 'id_example' # str | 
    complete_task_request = nativebpm_client.CompleteTaskRequest() # CompleteTaskRequest |  (optional)

    try:
        # Complete human task
        api_response = api_instance.complete_task(id, complete_task_request=complete_task_request)
        print("The response of DefaultApi->complete_task:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->complete_task: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 
 **complete_task_request** | [**CompleteTaskRequest**](CompleteTaskRequest.md)|  | [optional] 

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
**200** | Task completed successfully |  -  |
**400** | Task is not claimed |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**403** | Forbidden - insufficient operator permissions or role level |  -  |
**404** | Task not found |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **create_webhook**
> WebhookRecord create_webhook(create_webhook_request)

Create webhook target

Register a new webhook target.

### Example


```python
import nativebpm_client
from nativebpm_client.models.create_webhook_request import CreateWebhookRequest
from nativebpm_client.models.webhook_record import WebhookRecord
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    create_webhook_request = nativebpm_client.CreateWebhookRequest() # CreateWebhookRequest | 

    try:
        # Create webhook target
        api_response = api_instance.create_webhook(create_webhook_request)
        print("The response of DefaultApi->create_webhook:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->create_webhook: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **create_webhook_request** | [**CreateWebhookRequest**](CreateWebhookRequest.md)|  | 

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
**200** | Webhook created successfully |  -  |
**400** | Invalid URL or events list |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**403** | Forbidden - insufficient operator permissions or role level |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_webhook**
> ResolveIncident200Response delete_webhook(id)

Delete webhook target

Delete a webhook configuration.

### Example


```python
import nativebpm_client
from nativebpm_client.models.resolve_incident200_response import ResolveIncident200Response
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    id = 'id_example' # str | 

    try:
        # Delete webhook target
        api_response = api_instance.delete_webhook(id)
        print("The response of DefaultApi->delete_webhook:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->delete_webhook: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 

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
**200** | Webhook deleted successfully |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**403** | Forbidden - insufficient operator permissions or role level |  -  |
**404** | Webhook not found |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deploy_definition**
> ProcessDefinition deploy_definition(file=file)

Deploy process definition

Deploy a new BPMN 2.0 XML process definition.

### Example


```python
import nativebpm_client
from nativebpm_client.models.process_definition import ProcessDefinition
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    file = None # bytes | BPMN 2.0 XML file content to deploy (optional)

    try:
        # Deploy process definition
        api_response = api_instance.deploy_definition(file=file)
        print("The response of DefaultApi->deploy_definition:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->deploy_definition: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **file** | **bytes**| BPMN 2.0 XML file content to deploy | [optional] 

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
**200** | Successful response |  -  |
**400** | Invalid request body or malformed BPMN XML |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**403** | Forbidden - insufficient operator permissions or role level |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_instance**
> ProcessInstance get_instance(id)

Get process instance

Fetch a single process instance state by instance ID.

### Example


```python
import nativebpm_client
from nativebpm_client.models.process_instance import ProcessInstance
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    id = 'id_example' # str | 

    try:
        # Get process instance
        api_response = api_instance.get_instance(id)
        print("The response of DefaultApi->get_instance:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->get_instance: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 

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
**200** | Successful response |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**404** | Process instance not found |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_instance_history**
> List[HistoryRecord] get_instance_history(id)

Get process instance execution history

Fetch the audit trail / execution history log for a process instance.

### Example


```python
import nativebpm_client
from nativebpm_client.models.history_record import HistoryRecord
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    id = 'id_example' # str | 

    try:
        # Get process instance execution history
        api_response = api_instance.get_instance_history(id)
        print("The response of DefaultApi->get_instance_history:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->get_instance_history: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 

### Return type

[**List[HistoryRecord]**](HistoryRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_instance_visualization**
> VisualizationData get_instance_visualization(id)

Get process instance visualization data

Retrieve diagram XML, execution node status, and history events for visualization.

### Example


```python
import nativebpm_client
from nativebpm_client.models.visualization_data import VisualizationData
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    id = 'id_example' # str | 

    try:
        # Get process instance visualization data
        api_response = api_instance.get_instance_visualization(id)
        print("The response of DefaultApi->get_instance_visualization:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->get_instance_visualization: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 

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
**200** | Successful response |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**404** | Process instance not found |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_instance_visualization_widget**
> str get_instance_visualization_widget(id)

Get process instance visualization widget HTML

Retrieve the ready-to-embed HTML process visualization widget.

### Example


```python
import nativebpm_client
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    id = 'id_example' # str | 

    try:
        # Get process instance visualization widget HTML
        api_response = api_instance.get_instance_visualization_widget(id)
        print("The response of DefaultApi->get_instance_visualization_widget:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->get_instance_visualization_widget: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 

### Return type

**str**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/html, application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**404** | Process instance not found |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_definitions**
> List[ProcessDefinition] list_definitions()

List process definitions

Retrieve a list of all deployed process definitions.

### Example


```python
import nativebpm_client
from nativebpm_client.models.process_definition import ProcessDefinition
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)

    try:
        # List process definitions
        api_response = api_instance.list_definitions()
        print("The response of DefaultApi->list_definitions:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->list_definitions: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[ProcessDefinition]**](ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_incidents**
> List[IncidentRecord] list_incidents(id)

List incidents for process instance

Get active execution incidents (failures) for a specific process instance.

### Example


```python
import nativebpm_client
from nativebpm_client.models.incident_record import IncidentRecord
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    id = 'id_example' # str | 

    try:
        # List incidents for process instance
        api_response = api_instance.list_incidents(id)
        print("The response of DefaultApi->list_incidents:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->list_incidents: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 

### Return type

[**List[IncidentRecord]**](IncidentRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**404** | Process instance not found |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_instances**
> List[ProcessInstance] list_instances()

List process instances

Retrieve a list of active and completed process instances.

### Example


```python
import nativebpm_client
from nativebpm_client.models.process_instance import ProcessInstance
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)

    try:
        # List process instances
        api_response = api_instance.list_instances()
        print("The response of DefaultApi->list_instances:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->list_instances: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[ProcessInstance]**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_tasks**
> List[TaskRecord] list_tasks(assignee=assignee, candidate_group=candidate_group, status=status)

List human/user tasks

Query tasks matching criteria (assignee, candidateGroup, status).

### Example


```python
import nativebpm_client
from nativebpm_client.models.task_record import TaskRecord
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    assignee = 'assignee_example' # str |  (optional)
    candidate_group = 'candidate_group_example' # str |  (optional)
    status = 'status_example' # str |  (optional)

    try:
        # List human/user tasks
        api_response = api_instance.list_tasks(assignee=assignee, candidate_group=candidate_group, status=status)
        print("The response of DefaultApi->list_tasks:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->list_tasks: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **assignee** | **str**|  | [optional] 
 **candidate_group** | **str**|  | [optional] 
 **status** | **str**|  | [optional] 

### Return type

[**List[TaskRecord]**](TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_webhook_deliveries**
> List[WebhookDeliveryRecord] list_webhook_deliveries(id)

List deliveries for webhook

Get delivery audit logs and history queue for a specific webhook target.

### Example


```python
import nativebpm_client
from nativebpm_client.models.webhook_delivery_record import WebhookDeliveryRecord
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    id = 'id_example' # str | 

    try:
        # List deliveries for webhook
        api_response = api_instance.list_webhook_deliveries(id)
        print("The response of DefaultApi->list_webhook_deliveries:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->list_webhook_deliveries: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 

### Return type

[**List[WebhookDeliveryRecord]**](WebhookDeliveryRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**403** | Forbidden - insufficient operator permissions or role level |  -  |
**404** | Webhook not found |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_webhooks**
> List[WebhookRecord] list_webhooks()

List configured outgoing webhooks

List all registered webhook targets.

### Example


```python
import nativebpm_client
from nativebpm_client.models.webhook_record import WebhookRecord
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)

    try:
        # List configured outgoing webhooks
        api_response = api_instance.list_webhooks()
        print("The response of DefaultApi->list_webhooks:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->list_webhooks: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[WebhookRecord]**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**403** | Forbidden - insufficient operator permissions or role level |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **resolve_incident**
> ResolveIncident200Response resolve_incident(id, incident_id)

Resolve process incident

Resolve a process execution failure incident, triggering retry/resume.

### Example


```python
import nativebpm_client
from nativebpm_client.models.resolve_incident200_response import ResolveIncident200Response
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    id = 'id_example' # str | 
    incident_id = 'incident_id_example' # str | 

    try:
        # Resolve process incident
        api_response = api_instance.resolve_incident(id, incident_id)
        print("The response of DefaultApi->resolve_incident:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->resolve_incident: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 
 **incident_id** | **str**|  | 

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
**200** | Incident resolved successfully |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**403** | Forbidden - insufficient operator permissions or role level |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **resume_instance**
> ProcessInstance resume_instance(id)

Resume process instance

Manually trigger execution resumption of a process instance.

### Example


```python
import nativebpm_client
from nativebpm_client.models.process_instance import ProcessInstance
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    id = 'id_example' # str | 

    try:
        # Resume process instance
        api_response = api_instance.resume_instance(id)
        print("The response of DefaultApi->resume_instance:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->resume_instance: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 

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
**200** | Process instance state after resuming |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**403** | Forbidden - insufficient operator permissions or role level |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **start_instance**
> ProcessInstance start_instance(id, start_instance_request=start_instance_request)

Start process instance

Start a new workflow process instance by process definition ID.

### Example


```python
import nativebpm_client
from nativebpm_client.models.process_instance import ProcessInstance
from nativebpm_client.models.start_instance_request import StartInstanceRequest
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    id = 'id_example' # str | The process definition ID (e.g., matching the BPMN process element ID)
    start_instance_request = nativebpm_client.StartInstanceRequest() # StartInstanceRequest |  (optional)

    try:
        # Start process instance
        api_response = api_instance.start_instance(id, start_instance_request=start_instance_request)
        print("The response of DefaultApi->start_instance:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->start_instance: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The process definition ID (e.g., matching the BPMN process element ID) | 
 **start_instance_request** | [**StartInstanceRequest**](StartInstanceRequest.md)|  | [optional] 

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
**200** | Successful response |  -  |
**400** | Invalid variables or configuration |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**403** | Forbidden - insufficient operator permissions or role level |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **test_webhook**
> ResolveIncident200Response test_webhook(id)

Test webhook target

Send a test ping event delivery to verification URL.

### Example


```python
import nativebpm_client
from nativebpm_client.models.resolve_incident200_response import ResolveIncident200Response
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    id = 'id_example' # str | 

    try:
        # Test webhook target
        api_response = api_instance.test_webhook(id)
        print("The response of DefaultApi->test_webhook:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->test_webhook: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 

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
**200** | Test ping sent successfully |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**403** | Forbidden - insufficient operator permissions or role level |  -  |
**404** | Webhook not found |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update_webhook**
> WebhookRecord update_webhook(id, create_webhook_request)

Update webhook target

Modify the configuration of an existing webhook.

### Example


```python
import nativebpm_client
from nativebpm_client.models.create_webhook_request import CreateWebhookRequest
from nativebpm_client.models.webhook_record import WebhookRecord
from nativebpm_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = nativebpm_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with nativebpm_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = nativebpm_client.DefaultApi(api_client)
    id = 'id_example' # str | 
    create_webhook_request = nativebpm_client.CreateWebhookRequest() # CreateWebhookRequest | 

    try:
        # Update webhook target
        api_response = api_instance.update_webhook(id, create_webhook_request)
        print("The response of DefaultApi->update_webhook:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->update_webhook: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 
 **create_webhook_request** | [**CreateWebhookRequest**](CreateWebhookRequest.md)|  | 

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
**200** | Webhook updated successfully |  -  |
**401** | Unauthorized - missing or invalid session cookie / API Bearer Token |  -  |
**403** | Forbidden - insufficient operator permissions or role level |  -  |
**404** | Webhook not found |  -  |
**500** | Internal Server Error - database failure or execution crash |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

