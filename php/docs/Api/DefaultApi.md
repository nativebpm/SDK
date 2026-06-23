# NativeBPM\Client\DefaultApi



All URIs are relative to http://localhost, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**claimTask()**](DefaultApi.md#claimTask) | **POST** /api/tasks/{id}/claim | Claim human task |
| [**completeInstanceTask()**](DefaultApi.md#completeInstanceTask) | **POST** /api/instances/{id}/complete | Complete a wait state / task activity in process instance |
| [**completeTask()**](DefaultApi.md#completeTask) | **POST** /api/tasks/{id}/complete | Complete human task |
| [**createWebhook()**](DefaultApi.md#createWebhook) | **POST** /api/webhooks | Create webhook target |
| [**deleteWebhook()**](DefaultApi.md#deleteWebhook) | **DELETE** /api/webhooks/{id} | Delete webhook target |
| [**deployDefinition()**](DefaultApi.md#deployDefinition) | **POST** /api/deploy | Deploy process definition |
| [**getInstance()**](DefaultApi.md#getInstance) | **GET** /api/instances/{id} | Get process instance |
| [**getInstanceHistory()**](DefaultApi.md#getInstanceHistory) | **GET** /api/instances/{id}/history | Get process instance execution history |
| [**getInstanceVisualization()**](DefaultApi.md#getInstanceVisualization) | **GET** /api/instances/{id}/visualization | Get process instance visualization data |
| [**getInstanceVisualizationWidget()**](DefaultApi.md#getInstanceVisualizationWidget) | **GET** /api/instances/{id}/visualization/widget | Get process instance visualization widget HTML |
| [**getSMTPConfig()**](DefaultApi.md#getSMTPConfig) | **GET** /api/smtp-config | Get SMTP configuration |
| [**getUserGroups()**](DefaultApi.md#getUserGroups) | **GET** /api/users/{username}/groups | Get user groups |
| [**listDefinitions()**](DefaultApi.md#listDefinitions) | **GET** /api/definitions | List process definitions |
| [**listIncidents()**](DefaultApi.md#listIncidents) | **GET** /api/instances/{id}/incidents | List incidents for process instance |
| [**listInstances()**](DefaultApi.md#listInstances) | **GET** /api/instances | List process instances |
| [**listTasks()**](DefaultApi.md#listTasks) | **GET** /api/tasks | List human/user tasks |
| [**listWebhookDeliveries()**](DefaultApi.md#listWebhookDeliveries) | **GET** /api/webhooks/{id}/deliveries | List deliveries for webhook |
| [**listWebhooks()**](DefaultApi.md#listWebhooks) | **GET** /api/webhooks | List configured outgoing webhooks |
| [**resolveIncident()**](DefaultApi.md#resolveIncident) | **POST** /api/instances/{id}/incidents/{incidentId}/resolve | Resolve process incident |
| [**resumeInstance()**](DefaultApi.md#resumeInstance) | **POST** /api/instances/{id}/resume | Resume process instance |
| [**startInstance()**](DefaultApi.md#startInstance) | **POST** /api/definitions/{id}/start | Start process instance |
| [**testWebhook()**](DefaultApi.md#testWebhook) | **POST** /api/webhooks/{id}/test | Test webhook target |
| [**updateWebhook()**](DefaultApi.md#updateWebhook) | **PUT** /api/webhooks/{id} | Update webhook target |


## `claimTask()`

```php
claimTask($id, $claim_task_request): \NativeBPM\Client\Model\TaskRecord
```

Claim human task

Claim a task for a specific user assignee.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 'id_example'; // string
$claim_task_request = new \NativeBPM\Client\Model\ClaimTaskRequest(); // \NativeBPM\Client\Model\ClaimTaskRequest

try {
    $result = $apiInstance->claimTask($id, $claim_task_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->claimTask: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |
| **claim_task_request** | [**\NativeBPM\Client\Model\ClaimTaskRequest**](../Model/ClaimTaskRequest.md)|  | |

### Return type

[**\NativeBPM\Client\Model\TaskRecord**](../Model/TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `completeInstanceTask()`

```php
completeInstanceTask($id, $complete_instance_task_request): \NativeBPM\Client\Model\ProcessInstance
```

Complete a wait state / task activity in process instance

Complete a specific active node/wait state within a process instance.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 'id_example'; // string
$complete_instance_task_request = new \NativeBPM\Client\Model\CompleteInstanceTaskRequest(); // \NativeBPM\Client\Model\CompleteInstanceTaskRequest

try {
    $result = $apiInstance->completeInstanceTask($id, $complete_instance_task_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->completeInstanceTask: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |
| **complete_instance_task_request** | [**\NativeBPM\Client\Model\CompleteInstanceTaskRequest**](../Model/CompleteInstanceTaskRequest.md)|  | |

### Return type

[**\NativeBPM\Client\Model\ProcessInstance**](../Model/ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `completeTask()`

```php
completeTask($id, $complete_task_request): \NativeBPM\Client\Model\ProcessInstance
```

Complete human task

Complete a claimed human task, providing results variables.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 'id_example'; // string
$complete_task_request = new \NativeBPM\Client\Model\CompleteTaskRequest(); // \NativeBPM\Client\Model\CompleteTaskRequest

try {
    $result = $apiInstance->completeTask($id, $complete_task_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->completeTask: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |
| **complete_task_request** | [**\NativeBPM\Client\Model\CompleteTaskRequest**](../Model/CompleteTaskRequest.md)|  | [optional] |

### Return type

[**\NativeBPM\Client\Model\ProcessInstance**](../Model/ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `createWebhook()`

```php
createWebhook($create_webhook_request): \NativeBPM\Client\Model\WebhookRecord
```

Create webhook target

Register a new webhook target.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$create_webhook_request = new \NativeBPM\Client\Model\CreateWebhookRequest(); // \NativeBPM\Client\Model\CreateWebhookRequest

try {
    $result = $apiInstance->createWebhook($create_webhook_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->createWebhook: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **create_webhook_request** | [**\NativeBPM\Client\Model\CreateWebhookRequest**](../Model/CreateWebhookRequest.md)|  | |

### Return type

[**\NativeBPM\Client\Model\WebhookRecord**](../Model/WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `deleteWebhook()`

```php
deleteWebhook($id): \NativeBPM\Client\Model\ResolveIncident200Response
```

Delete webhook target

Delete a webhook configuration.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 'id_example'; // string

try {
    $result = $apiInstance->deleteWebhook($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->deleteWebhook: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |

### Return type

[**\NativeBPM\Client\Model\ResolveIncident200Response**](../Model/ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `deployDefinition()`

```php
deployDefinition($file): \NativeBPM\Client\Model\ProcessDefinition
```

Deploy process definition

Deploy a new BPMN 2.0 XML process definition.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$file = '/path/to/file.txt'; // \SplFileObject | BPMN 2.0 XML file content to deploy

try {
    $result = $apiInstance->deployDefinition($file);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->deployDefinition: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **file** | **\SplFileObject****\SplFileObject**| BPMN 2.0 XML file content to deploy | [optional] |

### Return type

[**\NativeBPM\Client\Model\ProcessDefinition**](../Model/ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `multipart/form-data`, `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getInstance()`

```php
getInstance($id): \NativeBPM\Client\Model\ProcessInstance
```

Get process instance

Fetch a single process instance state by instance ID.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 'id_example'; // string

try {
    $result = $apiInstance->getInstance($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->getInstance: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |

### Return type

[**\NativeBPM\Client\Model\ProcessInstance**](../Model/ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getInstanceHistory()`

```php
getInstanceHistory($id): \NativeBPM\Client\Model\HistoryRecord[]
```

Get process instance execution history

Fetch the audit trail / execution history log for a process instance.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 'id_example'; // string

try {
    $result = $apiInstance->getInstanceHistory($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->getInstanceHistory: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |

### Return type

[**\NativeBPM\Client\Model\HistoryRecord[]**](../Model/HistoryRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getInstanceVisualization()`

```php
getInstanceVisualization($id): \NativeBPM\Client\Model\VisualizationData
```

Get process instance visualization data

Retrieve diagram XML, execution node status, and history events for visualization.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 'id_example'; // string

try {
    $result = $apiInstance->getInstanceVisualization($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->getInstanceVisualization: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |

### Return type

[**\NativeBPM\Client\Model\VisualizationData**](../Model/VisualizationData.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getInstanceVisualizationWidget()`

```php
getInstanceVisualizationWidget($id, $title): string
```

Get process instance visualization widget HTML

Retrieve the ready-to-embed HTML process visualization widget.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 'id_example'; // string
$title = 'title_example'; // string | Optional custom title for the visualization widget. If empty, the title header is hidden.

try {
    $result = $apiInstance->getInstanceVisualizationWidget($id, $title);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->getInstanceVisualizationWidget: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |
| **title** | **string**| Optional custom title for the visualization widget. If empty, the title header is hidden. | [optional] |

### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/html`, `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getSMTPConfig()`

```php
getSMTPConfig(): \NativeBPM\Client\Model\SMTPConfig
```

Get SMTP configuration

Retrieve the current SMTP mailer configuration (admin/developer only).

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);

try {
    $result = $apiInstance->getSMTPConfig();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->getSMTPConfig: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**\NativeBPM\Client\Model\SMTPConfig**](../Model/SMTPConfig.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getUserGroups()`

```php
getUserGroups($username): string[]
```

Get user groups

Retrieve the list of groups (chats) the user is a member of.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$username = 'username_example'; // string | The username to retrieve groups for

try {
    $result = $apiInstance->getUserGroups($username);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->getUserGroups: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **username** | **string**| The username to retrieve groups for | |

### Return type

**string[]**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listDefinitions()`

```php
listDefinitions(): \NativeBPM\Client\Model\ProcessDefinition[]
```

List process definitions

Retrieve a list of all deployed process definitions.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);

try {
    $result = $apiInstance->listDefinitions();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->listDefinitions: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**\NativeBPM\Client\Model\ProcessDefinition[]**](../Model/ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listIncidents()`

```php
listIncidents($id): \NativeBPM\Client\Model\IncidentRecord[]
```

List incidents for process instance

Get active execution incidents (failures) for a specific process instance.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 'id_example'; // string

try {
    $result = $apiInstance->listIncidents($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->listIncidents: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |

### Return type

[**\NativeBPM\Client\Model\IncidentRecord[]**](../Model/IncidentRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listInstances()`

```php
listInstances(): \NativeBPM\Client\Model\ProcessInstance[]
```

List process instances

Retrieve a list of active and completed process instances.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);

try {
    $result = $apiInstance->listInstances();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->listInstances: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**\NativeBPM\Client\Model\ProcessInstance[]**](../Model/ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listTasks()`

```php
listTasks($assignee, $candidate_group, $status): \NativeBPM\Client\Model\TaskRecord[]
```

List human/user tasks

Query tasks matching criteria (assignee, candidateGroup, status).

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$assignee = 'assignee_example'; // string
$candidate_group = 'candidate_group_example'; // string
$status = 'status_example'; // string

try {
    $result = $apiInstance->listTasks($assignee, $candidate_group, $status);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->listTasks: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **assignee** | **string**|  | [optional] |
| **candidate_group** | **string**|  | [optional] |
| **status** | **string**|  | [optional] |

### Return type

[**\NativeBPM\Client\Model\TaskRecord[]**](../Model/TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listWebhookDeliveries()`

```php
listWebhookDeliveries($id): \NativeBPM\Client\Model\WebhookDeliveryRecord[]
```

List deliveries for webhook

Get delivery audit logs and history queue for a specific webhook target.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 'id_example'; // string

try {
    $result = $apiInstance->listWebhookDeliveries($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->listWebhookDeliveries: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |

### Return type

[**\NativeBPM\Client\Model\WebhookDeliveryRecord[]**](../Model/WebhookDeliveryRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listWebhooks()`

```php
listWebhooks(): \NativeBPM\Client\Model\WebhookRecord[]
```

List configured outgoing webhooks

List all registered webhook targets.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);

try {
    $result = $apiInstance->listWebhooks();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->listWebhooks: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**\NativeBPM\Client\Model\WebhookRecord[]**](../Model/WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `resolveIncident()`

```php
resolveIncident($id, $incident_id): \NativeBPM\Client\Model\ResolveIncident200Response
```

Resolve process incident

Resolve a process execution failure incident, triggering retry/resume.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 'id_example'; // string
$incident_id = 'incident_id_example'; // string

try {
    $result = $apiInstance->resolveIncident($id, $incident_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->resolveIncident: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |
| **incident_id** | **string**|  | |

### Return type

[**\NativeBPM\Client\Model\ResolveIncident200Response**](../Model/ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `resumeInstance()`

```php
resumeInstance($id): \NativeBPM\Client\Model\ProcessInstance
```

Resume process instance

Manually trigger execution resumption of a process instance.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 'id_example'; // string

try {
    $result = $apiInstance->resumeInstance($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->resumeInstance: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |

### Return type

[**\NativeBPM\Client\Model\ProcessInstance**](../Model/ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `startInstance()`

```php
startInstance($id, $start_instance_request): \NativeBPM\Client\Model\ProcessInstance
```

Start process instance

Start a new workflow process instance by process definition ID.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 'id_example'; // string | The process definition ID (e.g., matching the BPMN process element ID)
$start_instance_request = new \NativeBPM\Client\Model\StartInstanceRequest(); // \NativeBPM\Client\Model\StartInstanceRequest

try {
    $result = $apiInstance->startInstance($id, $start_instance_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->startInstance: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The process definition ID (e.g., matching the BPMN process element ID) | |
| **start_instance_request** | [**\NativeBPM\Client\Model\StartInstanceRequest**](../Model/StartInstanceRequest.md)|  | [optional] |

### Return type

[**\NativeBPM\Client\Model\ProcessInstance**](../Model/ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `testWebhook()`

```php
testWebhook($id): \NativeBPM\Client\Model\ResolveIncident200Response
```

Test webhook target

Send a test ping event delivery to verification URL.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 'id_example'; // string

try {
    $result = $apiInstance->testWebhook($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->testWebhook: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |

### Return type

[**\NativeBPM\Client\Model\ResolveIncident200Response**](../Model/ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `updateWebhook()`

```php
updateWebhook($id, $create_webhook_request): \NativeBPM\Client\Model\WebhookRecord
```

Update webhook target

Modify the configuration of an existing webhook.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new NativeBPM\Client\Api\DefaultApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 'id_example'; // string
$create_webhook_request = new \NativeBPM\Client\Model\CreateWebhookRequest(); // \NativeBPM\Client\Model\CreateWebhookRequest

try {
    $result = $apiInstance->updateWebhook($id, $create_webhook_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DefaultApi->updateWebhook: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**|  | |
| **create_webhook_request** | [**\NativeBPM\Client\Model\CreateWebhookRequest**](../Model/CreateWebhookRequest.md)|  | |

### Return type

[**\NativeBPM\Client\Model\WebhookRecord**](../Model/WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
