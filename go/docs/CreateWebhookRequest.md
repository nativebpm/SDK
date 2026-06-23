# CreateWebhookRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Url** | **string** |  | 
**Secret** | Pointer to **string** |  | [optional] 
**Events** | **[]string** |  | 
**ProcessId** | Pointer to **string** |  | [optional] 
**IsActive** | Pointer to **bool** |  | [optional] 
**EnableAudit** | Pointer to **bool** |  | [optional] 

## Methods

### NewCreateWebhookRequest

`func NewCreateWebhookRequest(url string, events []string, ) *CreateWebhookRequest`

NewCreateWebhookRequest instantiates a new CreateWebhookRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewCreateWebhookRequestWithDefaults

`func NewCreateWebhookRequestWithDefaults() *CreateWebhookRequest`

NewCreateWebhookRequestWithDefaults instantiates a new CreateWebhookRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetUrl

`func (o *CreateWebhookRequest) GetUrl() string`

GetUrl returns the Url field if non-nil, zero value otherwise.

### GetUrlOk

`func (o *CreateWebhookRequest) GetUrlOk() (*string, bool)`

GetUrlOk returns a tuple with the Url field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUrl

`func (o *CreateWebhookRequest) SetUrl(v string)`

SetUrl sets Url field to given value.


### GetSecret

`func (o *CreateWebhookRequest) GetSecret() string`

GetSecret returns the Secret field if non-nil, zero value otherwise.

### GetSecretOk

`func (o *CreateWebhookRequest) GetSecretOk() (*string, bool)`

GetSecretOk returns a tuple with the Secret field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSecret

`func (o *CreateWebhookRequest) SetSecret(v string)`

SetSecret sets Secret field to given value.

### HasSecret

`func (o *CreateWebhookRequest) HasSecret() bool`

HasSecret returns a boolean if a field has been set.

### GetEvents

`func (o *CreateWebhookRequest) GetEvents() []string`

GetEvents returns the Events field if non-nil, zero value otherwise.

### GetEventsOk

`func (o *CreateWebhookRequest) GetEventsOk() (*[]string, bool)`

GetEventsOk returns a tuple with the Events field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEvents

`func (o *CreateWebhookRequest) SetEvents(v []string)`

SetEvents sets Events field to given value.


### GetProcessId

`func (o *CreateWebhookRequest) GetProcessId() string`

GetProcessId returns the ProcessId field if non-nil, zero value otherwise.

### GetProcessIdOk

`func (o *CreateWebhookRequest) GetProcessIdOk() (*string, bool)`

GetProcessIdOk returns a tuple with the ProcessId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProcessId

`func (o *CreateWebhookRequest) SetProcessId(v string)`

SetProcessId sets ProcessId field to given value.

### HasProcessId

`func (o *CreateWebhookRequest) HasProcessId() bool`

HasProcessId returns a boolean if a field has been set.

### GetIsActive

`func (o *CreateWebhookRequest) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *CreateWebhookRequest) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *CreateWebhookRequest) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.

### HasIsActive

`func (o *CreateWebhookRequest) HasIsActive() bool`

HasIsActive returns a boolean if a field has been set.

### GetEnableAudit

`func (o *CreateWebhookRequest) GetEnableAudit() bool`

GetEnableAudit returns the EnableAudit field if non-nil, zero value otherwise.

### GetEnableAuditOk

`func (o *CreateWebhookRequest) GetEnableAuditOk() (*bool, bool)`

GetEnableAuditOk returns a tuple with the EnableAudit field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnableAudit

`func (o *CreateWebhookRequest) SetEnableAudit(v bool)`

SetEnableAudit sets EnableAudit field to given value.

### HasEnableAudit

`func (o *CreateWebhookRequest) HasEnableAudit() bool`

HasEnableAudit returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


