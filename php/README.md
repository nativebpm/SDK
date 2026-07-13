# nativebpm/client

REST API for managing, executing, and monitoring workflows, human tasks, incidents, and outgoing webhooks inside the NativeBPM Cloud-Native engine.

### Authentication
Requests must include a session cookie or a Bearer API token:
`Authorization: Bearer <API_TOKEN>`



## Installation & Usage

### Requirements

PHP 8.1 and later.

### Composer

To install the bindings via [Composer](https://getcomposer.org/), add the following to `composer.json`:

```json
{
  "repositories": [
    {
      "type": "vcs",
      "url": "https://github.com/GIT_USER_ID/GIT_REPO_ID.git"
    }
  ],
  "require": {
    "GIT_USER_ID/GIT_REPO_ID": "*@dev"
  }
}
```

Then run `composer install`

### Manual Installation

Download the files and include `autoload.php`:

```php
<?php
require_once('/path/to/nativebpm/client/vendor/autoload.php');
```

## Getting Started

Please follow the [installation procedure](#installation--usage) and then run the following:

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

## API Endpoints

All URIs are relative to *http://localhost*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*DefaultApi* | [**claimTask**](docs/Api/DefaultApi.md#claimtask) | **POST** /api/tasks/{id}/claim | Claim human task
*DefaultApi* | [**completeInstanceTask**](docs/Api/DefaultApi.md#completeinstancetask) | **POST** /api/instances/{id}/complete | Complete a wait state / task activity in process instance
*DefaultApi* | [**completeTask**](docs/Api/DefaultApi.md#completetask) | **POST** /api/tasks/{id}/complete | Complete human task
*DefaultApi* | [**createWebhook**](docs/Api/DefaultApi.md#createwebhook) | **POST** /api/webhooks | Create webhook target
*DefaultApi* | [**deleteWebhook**](docs/Api/DefaultApi.md#deletewebhook) | **DELETE** /api/webhooks/{id} | Delete webhook target
*DefaultApi* | [**deployDefinition**](docs/Api/DefaultApi.md#deploydefinition) | **POST** /api/deploy | Deploy process definition
*DefaultApi* | [**getInstance**](docs/Api/DefaultApi.md#getinstance) | **GET** /api/instances/{id} | Get process instance
*DefaultApi* | [**getInstanceHistory**](docs/Api/DefaultApi.md#getinstancehistory) | **GET** /api/instances/{id}/history | Get process instance execution history
*DefaultApi* | [**getInstanceVisualization**](docs/Api/DefaultApi.md#getinstancevisualization) | **GET** /api/instances/{id}/visualization | Get process instance visualization data
*DefaultApi* | [**getInstanceVisualizationWidget**](docs/Api/DefaultApi.md#getinstancevisualizationwidget) | **GET** /api/instances/{id}/visualization/widget | Get process instance visualization widget HTML
*DefaultApi* | [**getSMTPConfig**](docs/Api/DefaultApi.md#getsmtpconfig) | **GET** /api/smtp-config | Get SMTP configuration
*DefaultApi* | [**getUserGroups**](docs/Api/DefaultApi.md#getusergroups) | **GET** /api/users/{username}/groups | Get user groups
*DefaultApi* | [**listDefinitions**](docs/Api/DefaultApi.md#listdefinitions) | **GET** /api/definitions | List process definitions
*DefaultApi* | [**listIncidents**](docs/Api/DefaultApi.md#listincidents) | **GET** /api/instances/{id}/incidents | List incidents for process instance
*DefaultApi* | [**listInstances**](docs/Api/DefaultApi.md#listinstances) | **GET** /api/instances | List process instances
*DefaultApi* | [**listTasks**](docs/Api/DefaultApi.md#listtasks) | **GET** /api/tasks | List human/user tasks
*DefaultApi* | [**listWebhookDeliveries**](docs/Api/DefaultApi.md#listwebhookdeliveries) | **GET** /api/webhooks/{id}/deliveries | List deliveries for webhook
*DefaultApi* | [**listWebhooks**](docs/Api/DefaultApi.md#listwebhooks) | **GET** /api/webhooks | List configured outgoing webhooks
*DefaultApi* | [**resolveIncident**](docs/Api/DefaultApi.md#resolveincident) | **POST** /api/instances/{id}/incidents/{incidentId}/resolve | Resolve process incident
*DefaultApi* | [**resumeInstance**](docs/Api/DefaultApi.md#resumeinstance) | **POST** /api/instances/{id}/resume | Resume process instance
*DefaultApi* | [**startInstance**](docs/Api/DefaultApi.md#startinstance) | **POST** /api/definitions/{id}/start | Start process instance
*DefaultApi* | [**testWebhook**](docs/Api/DefaultApi.md#testwebhook) | **POST** /api/webhooks/{id}/test | Test webhook target
*DefaultApi* | [**updateWebhook**](docs/Api/DefaultApi.md#updatewebhook) | **PUT** /api/webhooks/{id} | Update webhook target

## Models

- [ClaimTaskRequest](docs/Model/ClaimTaskRequest.md)
- [CompleteInstanceTaskRequest](docs/Model/CompleteInstanceTaskRequest.md)
- [CompleteTaskRequest](docs/Model/CompleteTaskRequest.md)
- [CreateWebhookRequest](docs/Model/CreateWebhookRequest.md)
- [HistoryRecord](docs/Model/HistoryRecord.md)
- [IncidentRecord](docs/Model/IncidentRecord.md)
- [ListDefinitions401Response](docs/Model/ListDefinitions401Response.md)
- [ProcessDefinition](docs/Model/ProcessDefinition.md)
- [ProcessInstance](docs/Model/ProcessInstance.md)
- [ResolveIncident200Response](docs/Model/ResolveIncident200Response.md)
- [SMTPConfig](docs/Model/SMTPConfig.md)
- [StartInstanceRequest](docs/Model/StartInstanceRequest.md)
- [TaskRecord](docs/Model/TaskRecord.md)
- [VisualizationData](docs/Model/VisualizationData.md)
- [WebhookDeliveryRecord](docs/Model/WebhookDeliveryRecord.md)
- [WebhookRecord](docs/Model/WebhookRecord.md)

## Authorization
Endpoints do not require authorization.

## Tests

To run the tests, use:

```bash
composer install
vendor/bin/phpunit
```

## Author



## About this package

This PHP package is automatically generated by the [OpenAPI Generator](https://openapi-generator.tech) project:

- API version: `1.0.0`
    - Generator version: `7.24.0-SNAPSHOT`
- Build package: `org.openapitools.codegen.languages.PhpClientCodegen`
