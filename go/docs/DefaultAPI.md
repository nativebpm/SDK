# \DefaultAPI

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ClaimTask**](DefaultAPI.md#ClaimTask) | **Post** /api/tasks/{id}/claim | Claim human task
[**CompleteInstanceTask**](DefaultAPI.md#CompleteInstanceTask) | **Post** /api/instances/{id}/complete | Complete a wait state / task activity in process instance
[**CompleteTask**](DefaultAPI.md#CompleteTask) | **Post** /api/tasks/{id}/complete | Complete human task
[**CreateWebhook**](DefaultAPI.md#CreateWebhook) | **Post** /api/webhooks | Create webhook target
[**DeleteWebhook**](DefaultAPI.md#DeleteWebhook) | **Delete** /api/webhooks/{id} | Delete webhook target
[**DeployDefinition**](DefaultAPI.md#DeployDefinition) | **Post** /api/deploy | Deploy process definition
[**GetInstance**](DefaultAPI.md#GetInstance) | **Get** /api/instances/{id} | Get process instance
[**GetInstanceHistory**](DefaultAPI.md#GetInstanceHistory) | **Get** /api/instances/{id}/history | Get process instance execution history
[**GetInstanceVisualization**](DefaultAPI.md#GetInstanceVisualization) | **Get** /api/instances/{id}/visualization | Get process instance visualization data
[**GetInstanceVisualizationWidget**](DefaultAPI.md#GetInstanceVisualizationWidget) | **Get** /api/instances/{id}/visualization/widget | Get process instance visualization widget HTML
[**GetSMTPConfig**](DefaultAPI.md#GetSMTPConfig) | **Get** /api/smtp-config | Get SMTP configuration
[**GetUserGroups**](DefaultAPI.md#GetUserGroups) | **Get** /api/users/{username}/groups | Get user groups
[**ListDefinitions**](DefaultAPI.md#ListDefinitions) | **Get** /api/definitions | List process definitions
[**ListIncidents**](DefaultAPI.md#ListIncidents) | **Get** /api/instances/{id}/incidents | List incidents for process instance
[**ListInstances**](DefaultAPI.md#ListInstances) | **Get** /api/instances | List process instances
[**ListTasks**](DefaultAPI.md#ListTasks) | **Get** /api/tasks | List human/user tasks
[**ListWebhookDeliveries**](DefaultAPI.md#ListWebhookDeliveries) | **Get** /api/webhooks/{id}/deliveries | List deliveries for webhook
[**ListWebhooks**](DefaultAPI.md#ListWebhooks) | **Get** /api/webhooks | List configured outgoing webhooks
[**ResolveIncident**](DefaultAPI.md#ResolveIncident) | **Post** /api/instances/{id}/incidents/{incidentId}/resolve | Resolve process incident
[**ResumeInstance**](DefaultAPI.md#ResumeInstance) | **Post** /api/instances/{id}/resume | Resume process instance
[**StartInstance**](DefaultAPI.md#StartInstance) | **Post** /api/definitions/{id}/start | Start process instance
[**TestWebhook**](DefaultAPI.md#TestWebhook) | **Post** /api/webhooks/{id}/test | Test webhook target
[**UpdateWebhook**](DefaultAPI.md#UpdateWebhook) | **Put** /api/webhooks/{id} | Update webhook target



## ClaimTask

> TaskRecord ClaimTask(ctx, id).ClaimTaskRequest(claimTaskRequest).Execute()

Claim human task



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	id := "id_example" // string | 
	claimTaskRequest := *openapiclient.NewClaimTaskRequest("Assignee_example") // ClaimTaskRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.ClaimTask(context.Background(), id).ClaimTaskRequest(claimTaskRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.ClaimTask``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ClaimTask`: TaskRecord
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.ClaimTask`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiClaimTaskRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **claimTaskRequest** | [**ClaimTaskRequest**](ClaimTaskRequest.md) |  | 

### Return type

[**TaskRecord**](TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## CompleteInstanceTask

> ProcessInstance CompleteInstanceTask(ctx, id).CompleteInstanceTaskRequest(completeInstanceTaskRequest).Execute()

Complete a wait state / task activity in process instance



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	id := "id_example" // string | 
	completeInstanceTaskRequest := *openapiclient.NewCompleteInstanceTaskRequest("NodeId_example") // CompleteInstanceTaskRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.CompleteInstanceTask(context.Background(), id).CompleteInstanceTaskRequest(completeInstanceTaskRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.CompleteInstanceTask``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CompleteInstanceTask`: ProcessInstance
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.CompleteInstanceTask`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiCompleteInstanceTaskRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **completeInstanceTaskRequest** | [**CompleteInstanceTaskRequest**](CompleteInstanceTaskRequest.md) |  | 

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## CompleteTask

> ProcessInstance CompleteTask(ctx, id).CompleteTaskRequest(completeTaskRequest).Execute()

Complete human task



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	id := "id_example" // string | 
	completeTaskRequest := *openapiclient.NewCompleteTaskRequest() // CompleteTaskRequest |  (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.CompleteTask(context.Background(), id).CompleteTaskRequest(completeTaskRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.CompleteTask``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CompleteTask`: ProcessInstance
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.CompleteTask`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiCompleteTaskRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **completeTaskRequest** | [**CompleteTaskRequest**](CompleteTaskRequest.md) |  | 

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## CreateWebhook

> WebhookRecord CreateWebhook(ctx).CreateWebhookRequest(createWebhookRequest).Execute()

Create webhook target



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	createWebhookRequest := *openapiclient.NewCreateWebhookRequest("Url_example", []string{"Events_example"}) // CreateWebhookRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.CreateWebhook(context.Background()).CreateWebhookRequest(createWebhookRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.CreateWebhook``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateWebhook`: WebhookRecord
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.CreateWebhook`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreateWebhookRequest struct via the builder pattern


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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DeleteWebhook

> ResolveIncident200Response DeleteWebhook(ctx, id).Execute()

Delete webhook target



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	id := "id_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.DeleteWebhook(context.Background(), id).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.DeleteWebhook``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `DeleteWebhook`: ResolveIncident200Response
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.DeleteWebhook`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeleteWebhookRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DeployDefinition

> ProcessDefinition DeployDefinition(ctx).File(file).Execute()

Deploy process definition



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	file := os.NewFile(1234, "some_file") // *os.File | BPMN 2.0 XML file content to deploy (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.DeployDefinition(context.Background()).File(file).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.DeployDefinition``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `DeployDefinition`: ProcessDefinition
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.DeployDefinition`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiDeployDefinitionRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **file** | ***os.File** | BPMN 2.0 XML file content to deploy | 

### Return type

[**ProcessDefinition**](ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: multipart/form-data
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetInstance

> ProcessInstance GetInstance(ctx, id).Execute()

Get process instance



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	id := "id_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.GetInstance(context.Background(), id).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.GetInstance``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetInstance`: ProcessInstance
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.GetInstance`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetInstanceRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetInstanceHistory

> []HistoryRecord GetInstanceHistory(ctx, id).Execute()

Get process instance execution history



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	id := "id_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.GetInstanceHistory(context.Background(), id).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.GetInstanceHistory``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetInstanceHistory`: []HistoryRecord
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.GetInstanceHistory`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetInstanceHistoryRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**[]HistoryRecord**](HistoryRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetInstanceVisualization

> VisualizationData GetInstanceVisualization(ctx, id).Execute()

Get process instance visualization data



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	id := "id_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.GetInstanceVisualization(context.Background(), id).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.GetInstanceVisualization``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetInstanceVisualization`: VisualizationData
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.GetInstanceVisualization`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetInstanceVisualizationRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**VisualizationData**](VisualizationData.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetInstanceVisualizationWidget

> string GetInstanceVisualizationWidget(ctx, id).Execute()

Get process instance visualization widget HTML



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	id := "id_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.GetInstanceVisualizationWidget(context.Background(), id).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.GetInstanceVisualizationWidget``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetInstanceVisualizationWidget`: string
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.GetInstanceVisualizationWidget`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetInstanceVisualizationWidgetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: text/html, application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetSMTPConfig

> SMTPConfig GetSMTPConfig(ctx).Execute()

Get SMTP configuration



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.GetSMTPConfig(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.GetSMTPConfig``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetSMTPConfig`: SMTPConfig
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.GetSMTPConfig`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiGetSMTPConfigRequest struct via the builder pattern


### Return type

[**SMTPConfig**](SMTPConfig.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetUserGroups

> []string GetUserGroups(ctx, username).Execute()

Get user groups



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	username := "username_example" // string | The username to retrieve groups for

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.GetUserGroups(context.Background(), username).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.GetUserGroups``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetUserGroups`: []string
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.GetUserGroups`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**username** | **string** | The username to retrieve groups for | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetUserGroupsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

**[]string**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListDefinitions

> []ProcessDefinition ListDefinitions(ctx).Execute()

List process definitions



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.ListDefinitions(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.ListDefinitions``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListDefinitions`: []ProcessDefinition
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.ListDefinitions`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiListDefinitionsRequest struct via the builder pattern


### Return type

[**[]ProcessDefinition**](ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListIncidents

> []IncidentRecord ListIncidents(ctx, id).Execute()

List incidents for process instance



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	id := "id_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.ListIncidents(context.Background(), id).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.ListIncidents``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListIncidents`: []IncidentRecord
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.ListIncidents`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiListIncidentsRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**[]IncidentRecord**](IncidentRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListInstances

> []ProcessInstance ListInstances(ctx).Execute()

List process instances



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.ListInstances(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.ListInstances``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListInstances`: []ProcessInstance
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.ListInstances`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiListInstancesRequest struct via the builder pattern


### Return type

[**[]ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListTasks

> []TaskRecord ListTasks(ctx).Assignee(assignee).CandidateGroup(candidateGroup).Status(status).Execute()

List human/user tasks



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	assignee := "assignee_example" // string |  (optional)
	candidateGroup := "candidateGroup_example" // string |  (optional)
	status := "status_example" // string |  (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.ListTasks(context.Background()).Assignee(assignee).CandidateGroup(candidateGroup).Status(status).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.ListTasks``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListTasks`: []TaskRecord
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.ListTasks`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListTasksRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **assignee** | **string** |  | 
 **candidateGroup** | **string** |  | 
 **status** | **string** |  | 

### Return type

[**[]TaskRecord**](TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListWebhookDeliveries

> []WebhookDeliveryRecord ListWebhookDeliveries(ctx, id).Execute()

List deliveries for webhook



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	id := "id_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.ListWebhookDeliveries(context.Background(), id).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.ListWebhookDeliveries``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListWebhookDeliveries`: []WebhookDeliveryRecord
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.ListWebhookDeliveries`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiListWebhookDeliveriesRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**[]WebhookDeliveryRecord**](WebhookDeliveryRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListWebhooks

> []WebhookRecord ListWebhooks(ctx).Execute()

List configured outgoing webhooks



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.ListWebhooks(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.ListWebhooks``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListWebhooks`: []WebhookRecord
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.ListWebhooks`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiListWebhooksRequest struct via the builder pattern


### Return type

[**[]WebhookRecord**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ResolveIncident

> ResolveIncident200Response ResolveIncident(ctx, id, incidentId).Execute()

Resolve process incident



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	id := "id_example" // string | 
	incidentId := "incidentId_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.ResolveIncident(context.Background(), id, incidentId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.ResolveIncident``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ResolveIncident`: ResolveIncident200Response
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.ResolveIncident`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 
**incidentId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiResolveIncidentRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------



### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ResumeInstance

> ProcessInstance ResumeInstance(ctx, id).Execute()

Resume process instance



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	id := "id_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.ResumeInstance(context.Background(), id).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.ResumeInstance``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ResumeInstance`: ProcessInstance
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.ResumeInstance`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiResumeInstanceRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## StartInstance

> ProcessInstance StartInstance(ctx, id).StartInstanceRequest(startInstanceRequest).Execute()

Start process instance



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	id := "id_example" // string | The process definition ID (e.g., matching the BPMN process element ID)
	startInstanceRequest := *openapiclient.NewStartInstanceRequest() // StartInstanceRequest |  (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.StartInstance(context.Background(), id).StartInstanceRequest(startInstanceRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.StartInstance``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `StartInstance`: ProcessInstance
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.StartInstance`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** | The process definition ID (e.g., matching the BPMN process element ID) | 

### Other Parameters

Other parameters are passed through a pointer to a apiStartInstanceRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **startInstanceRequest** | [**StartInstanceRequest**](StartInstanceRequest.md) |  | 

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## TestWebhook

> ResolveIncident200Response TestWebhook(ctx, id).Execute()

Test webhook target



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	id := "id_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.TestWebhook(context.Background(), id).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.TestWebhook``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `TestWebhook`: ResolveIncident200Response
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.TestWebhook`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiTestWebhookRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**ResolveIncident200Response**](ResolveIncident200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## UpdateWebhook

> WebhookRecord UpdateWebhook(ctx, id).CreateWebhookRequest(createWebhookRequest).Execute()

Update webhook target



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "gitlab.com/nativebpm/sdk/go"
)

func main() {
	id := "id_example" // string | 
	createWebhookRequest := *openapiclient.NewCreateWebhookRequest("Url_example", []string{"Events_example"}) // CreateWebhookRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DefaultAPI.UpdateWebhook(context.Background(), id).CreateWebhookRequest(createWebhookRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DefaultAPI.UpdateWebhook``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdateWebhook`: WebhookRecord
	fmt.Fprintf(os.Stdout, "Response from `DefaultAPI.UpdateWebhook`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdateWebhookRequest struct via the builder pattern


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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

