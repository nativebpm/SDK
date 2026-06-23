# WebhookRecord

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**TenantId** | **string** |  | 
**Url** | **string** |  | 
**Secret** | Pointer to **string** |  | [optional] 
**Events** | **[]string** |  | 
**ProcessId** | Pointer to **string** |  | [optional] 
**IsActive** | **bool** |  | 
**EnableAudit** | **bool** |  | 
**Status** | **string** |  | 
**CreatedAt** | **time.Time** |  | 

## Methods

### NewWebhookRecord

`func NewWebhookRecord(id string, tenantId string, url string, events []string, isActive bool, enableAudit bool, status string, createdAt time.Time, ) *WebhookRecord`

NewWebhookRecord instantiates a new WebhookRecord object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewWebhookRecordWithDefaults

`func NewWebhookRecordWithDefaults() *WebhookRecord`

NewWebhookRecordWithDefaults instantiates a new WebhookRecord object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *WebhookRecord) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *WebhookRecord) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *WebhookRecord) SetId(v string)`

SetId sets Id field to given value.


### GetTenantId

`func (o *WebhookRecord) GetTenantId() string`

GetTenantId returns the TenantId field if non-nil, zero value otherwise.

### GetTenantIdOk

`func (o *WebhookRecord) GetTenantIdOk() (*string, bool)`

GetTenantIdOk returns a tuple with the TenantId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTenantId

`func (o *WebhookRecord) SetTenantId(v string)`

SetTenantId sets TenantId field to given value.


### GetUrl

`func (o *WebhookRecord) GetUrl() string`

GetUrl returns the Url field if non-nil, zero value otherwise.

### GetUrlOk

`func (o *WebhookRecord) GetUrlOk() (*string, bool)`

GetUrlOk returns a tuple with the Url field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUrl

`func (o *WebhookRecord) SetUrl(v string)`

SetUrl sets Url field to given value.


### GetSecret

`func (o *WebhookRecord) GetSecret() string`

GetSecret returns the Secret field if non-nil, zero value otherwise.

### GetSecretOk

`func (o *WebhookRecord) GetSecretOk() (*string, bool)`

GetSecretOk returns a tuple with the Secret field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSecret

`func (o *WebhookRecord) SetSecret(v string)`

SetSecret sets Secret field to given value.

### HasSecret

`func (o *WebhookRecord) HasSecret() bool`

HasSecret returns a boolean if a field has been set.

### GetEvents

`func (o *WebhookRecord) GetEvents() []string`

GetEvents returns the Events field if non-nil, zero value otherwise.

### GetEventsOk

`func (o *WebhookRecord) GetEventsOk() (*[]string, bool)`

GetEventsOk returns a tuple with the Events field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEvents

`func (o *WebhookRecord) SetEvents(v []string)`

SetEvents sets Events field to given value.


### GetProcessId

`func (o *WebhookRecord) GetProcessId() string`

GetProcessId returns the ProcessId field if non-nil, zero value otherwise.

### GetProcessIdOk

`func (o *WebhookRecord) GetProcessIdOk() (*string, bool)`

GetProcessIdOk returns a tuple with the ProcessId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProcessId

`func (o *WebhookRecord) SetProcessId(v string)`

SetProcessId sets ProcessId field to given value.

### HasProcessId

`func (o *WebhookRecord) HasProcessId() bool`

HasProcessId returns a boolean if a field has been set.

### GetIsActive

`func (o *WebhookRecord) GetIsActive() bool`

GetIsActive returns the IsActive field if non-nil, zero value otherwise.

### GetIsActiveOk

`func (o *WebhookRecord) GetIsActiveOk() (*bool, bool)`

GetIsActiveOk returns a tuple with the IsActive field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActive

`func (o *WebhookRecord) SetIsActive(v bool)`

SetIsActive sets IsActive field to given value.


### GetEnableAudit

`func (o *WebhookRecord) GetEnableAudit() bool`

GetEnableAudit returns the EnableAudit field if non-nil, zero value otherwise.

### GetEnableAuditOk

`func (o *WebhookRecord) GetEnableAuditOk() (*bool, bool)`

GetEnableAuditOk returns a tuple with the EnableAudit field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnableAudit

`func (o *WebhookRecord) SetEnableAudit(v bool)`

SetEnableAudit sets EnableAudit field to given value.


### GetStatus

`func (o *WebhookRecord) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *WebhookRecord) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *WebhookRecord) SetStatus(v string)`

SetStatus sets Status field to given value.


### GetCreatedAt

`func (o *WebhookRecord) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *WebhookRecord) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *WebhookRecord) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


