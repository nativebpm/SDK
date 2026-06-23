# \DefaultApi

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
[**get_smtp_config**](DefaultApi.md#get_smtp_config) | **GET** /api/smtp-config | Get SMTP configuration
[**get_user_groups**](DefaultApi.md#get_user_groups) | **GET** /api/users/{username}/groups | Get user groups
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



## claim_task

> models::TaskRecord claim_task(id, claim_task_request)
Claim human task

Claim a task for a specific user assignee.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** |  | [required] |
**claim_task_request** | [**ClaimTaskRequest**](ClaimTaskRequest.md) |  | [required] |

### Return type

[**models::TaskRecord**](TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## complete_instance_task

> models::ProcessInstance complete_instance_task(id, complete_instance_task_request)
Complete a wait state / task activity in process instance

Complete a specific active node/wait state within a process instance.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** |  | [required] |
**complete_instance_task_request** | [**CompleteInstanceTaskRequest**](CompleteInstanceTaskRequest.md) |  | [required] |

### Return type

[**models::ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## complete_task

> models::ProcessInstance complete_task(id, complete_task_request)
Complete human task

Complete a claimed human task, providing results variables.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** |  | [required] |
**complete_task_request** | Option<[**CompleteTaskRequest**](CompleteTaskRequest.md)> |  |  |

### Return type

[**models::ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## create_webhook

> models::WebhookRecord create_webhook(create_webhook_request)
Create webhook target

Register a new webhook target.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**create_webhook_request** | [**CreateWebhookRequest**](CreateWebhookRequest.md) |  | [required] |

### Return type

[**models::WebhookRecord**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## delete_webhook

> models::ResolveIncident200Response delete_webhook(id)
Delete webhook target

Delete a webhook configuration.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** |  | [required] |

### Return type

[**models::ResolveIncident200Response**](resolveIncident_200_response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## deploy_definition

> models::ProcessDefinition deploy_definition(file)
Deploy process definition

Deploy a new BPMN 2.0 XML process definition.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**file** | Option<**std::path::PathBuf**> | BPMN 2.0 XML file content to deploy |  |

### Return type

[**models::ProcessDefinition**](ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: multipart/form-data, application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## get_instance

> models::ProcessInstance get_instance(id)
Get process instance

Fetch a single process instance state by instance ID.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** |  | [required] |

### Return type

[**models::ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## get_instance_history

> Vec<models::HistoryRecord> get_instance_history(id)
Get process instance execution history

Fetch the audit trail / execution history log for a process instance.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** |  | [required] |

### Return type

[**Vec<models::HistoryRecord>**](HistoryRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## get_instance_visualization

> models::VisualizationData get_instance_visualization(id)
Get process instance visualization data

Retrieve diagram XML, execution node status, and history events for visualization.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** |  | [required] |

### Return type

[**models::VisualizationData**](VisualizationData.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## get_instance_visualization_widget

> String get_instance_visualization_widget(id)
Get process instance visualization widget HTML

Retrieve the ready-to-embed HTML process visualization widget.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** |  | [required] |

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: text/html, application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## get_smtp_config

> models::SmtpConfig get_smtp_config()
Get SMTP configuration

Retrieve the current SMTP mailer configuration (admin/developer only).

### Parameters

This endpoint does not need any parameter.

### Return type

[**models::SmtpConfig**](SMTPConfig.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## get_user_groups

> Vec<String> get_user_groups(username)
Get user groups

Retrieve the list of groups (chats) the user is a member of.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**username** | **String** | The username to retrieve groups for | [required] |

### Return type

**Vec<String>**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## list_definitions

> Vec<models::ProcessDefinition> list_definitions()
List process definitions

Retrieve a list of all deployed process definitions.

### Parameters

This endpoint does not need any parameter.

### Return type

[**Vec<models::ProcessDefinition>**](ProcessDefinition.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## list_incidents

> Vec<models::IncidentRecord> list_incidents(id)
List incidents for process instance

Get active execution incidents (failures) for a specific process instance.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** |  | [required] |

### Return type

[**Vec<models::IncidentRecord>**](IncidentRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## list_instances

> Vec<models::ProcessInstance> list_instances()
List process instances

Retrieve a list of active and completed process instances.

### Parameters

This endpoint does not need any parameter.

### Return type

[**Vec<models::ProcessInstance>**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## list_tasks

> Vec<models::TaskRecord> list_tasks(assignee, candidate_group, status)
List human/user tasks

Query tasks matching criteria (assignee, candidateGroup, status).

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**assignee** | Option<**String**> |  |  |
**candidate_group** | Option<**String**> |  |  |
**status** | Option<**String**> |  |  |

### Return type

[**Vec<models::TaskRecord>**](TaskRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## list_webhook_deliveries

> Vec<models::WebhookDeliveryRecord> list_webhook_deliveries(id)
List deliveries for webhook

Get delivery audit logs and history queue for a specific webhook target.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** |  | [required] |

### Return type

[**Vec<models::WebhookDeliveryRecord>**](WebhookDeliveryRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## list_webhooks

> Vec<models::WebhookRecord> list_webhooks()
List configured outgoing webhooks

List all registered webhook targets.

### Parameters

This endpoint does not need any parameter.

### Return type

[**Vec<models::WebhookRecord>**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## resolve_incident

> models::ResolveIncident200Response resolve_incident(id, incident_id)
Resolve process incident

Resolve a process execution failure incident, triggering retry/resume.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** |  | [required] |
**incident_id** | **String** |  | [required] |

### Return type

[**models::ResolveIncident200Response**](resolveIncident_200_response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## resume_instance

> models::ProcessInstance resume_instance(id)
Resume process instance

Manually trigger execution resumption of a process instance.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** |  | [required] |

### Return type

[**models::ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## start_instance

> models::ProcessInstance start_instance(id, start_instance_request)
Start process instance

Start a new workflow process instance by process definition ID.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** | The process definition ID (e.g., matching the BPMN process element ID) | [required] |
**start_instance_request** | Option<[**StartInstanceRequest**](StartInstanceRequest.md)> |  |  |

### Return type

[**models::ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## test_webhook

> models::ResolveIncident200Response test_webhook(id)
Test webhook target

Send a test ping event delivery to verification URL.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** |  | [required] |

### Return type

[**models::ResolveIncident200Response**](resolveIncident_200_response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## update_webhook

> models::WebhookRecord update_webhook(id, create_webhook_request)
Update webhook target

Modify the configuration of an existing webhook.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** |  | [required] |
**create_webhook_request** | [**CreateWebhookRequest**](CreateWebhookRequest.md) |  | [required] |

### Return type

[**models::WebhookRecord**](WebhookRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

