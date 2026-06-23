# ProcessInstance

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**ProcessId** | **string** |  | 
**DefinitionHash** | **string** |  | 
**BusinessKey** | **string** |  | 
**State** | **string** | Base64/raw JSON encoded internal Wazero process engine state representation | 
**Version** | **int32** |  | 
**Completed** | **bool** |  | 
**UpdatedAt** | **time.Time** |  | 
**TenantId** | **string** |  | 

## Methods

### NewProcessInstance

`func NewProcessInstance(id string, processId string, definitionHash string, businessKey string, state string, version int32, completed bool, updatedAt time.Time, tenantId string, ) *ProcessInstance`

NewProcessInstance instantiates a new ProcessInstance object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewProcessInstanceWithDefaults

`func NewProcessInstanceWithDefaults() *ProcessInstance`

NewProcessInstanceWithDefaults instantiates a new ProcessInstance object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *ProcessInstance) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *ProcessInstance) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *ProcessInstance) SetId(v string)`

SetId sets Id field to given value.


### GetProcessId

`func (o *ProcessInstance) GetProcessId() string`

GetProcessId returns the ProcessId field if non-nil, zero value otherwise.

### GetProcessIdOk

`func (o *ProcessInstance) GetProcessIdOk() (*string, bool)`

GetProcessIdOk returns a tuple with the ProcessId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProcessId

`func (o *ProcessInstance) SetProcessId(v string)`

SetProcessId sets ProcessId field to given value.


### GetDefinitionHash

`func (o *ProcessInstance) GetDefinitionHash() string`

GetDefinitionHash returns the DefinitionHash field if non-nil, zero value otherwise.

### GetDefinitionHashOk

`func (o *ProcessInstance) GetDefinitionHashOk() (*string, bool)`

GetDefinitionHashOk returns a tuple with the DefinitionHash field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDefinitionHash

`func (o *ProcessInstance) SetDefinitionHash(v string)`

SetDefinitionHash sets DefinitionHash field to given value.


### GetBusinessKey

`func (o *ProcessInstance) GetBusinessKey() string`

GetBusinessKey returns the BusinessKey field if non-nil, zero value otherwise.

### GetBusinessKeyOk

`func (o *ProcessInstance) GetBusinessKeyOk() (*string, bool)`

GetBusinessKeyOk returns a tuple with the BusinessKey field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBusinessKey

`func (o *ProcessInstance) SetBusinessKey(v string)`

SetBusinessKey sets BusinessKey field to given value.


### GetState

`func (o *ProcessInstance) GetState() string`

GetState returns the State field if non-nil, zero value otherwise.

### GetStateOk

`func (o *ProcessInstance) GetStateOk() (*string, bool)`

GetStateOk returns a tuple with the State field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetState

`func (o *ProcessInstance) SetState(v string)`

SetState sets State field to given value.


### GetVersion

`func (o *ProcessInstance) GetVersion() int32`

GetVersion returns the Version field if non-nil, zero value otherwise.

### GetVersionOk

`func (o *ProcessInstance) GetVersionOk() (*int32, bool)`

GetVersionOk returns a tuple with the Version field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetVersion

`func (o *ProcessInstance) SetVersion(v int32)`

SetVersion sets Version field to given value.


### GetCompleted

`func (o *ProcessInstance) GetCompleted() bool`

GetCompleted returns the Completed field if non-nil, zero value otherwise.

### GetCompletedOk

`func (o *ProcessInstance) GetCompletedOk() (*bool, bool)`

GetCompletedOk returns a tuple with the Completed field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCompleted

`func (o *ProcessInstance) SetCompleted(v bool)`

SetCompleted sets Completed field to given value.


### GetUpdatedAt

`func (o *ProcessInstance) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *ProcessInstance) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *ProcessInstance) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.


### GetTenantId

`func (o *ProcessInstance) GetTenantId() string`

GetTenantId returns the TenantId field if non-nil, zero value otherwise.

### GetTenantIdOk

`func (o *ProcessInstance) GetTenantIdOk() (*string, bool)`

GetTenantIdOk returns a tuple with the TenantId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTenantId

`func (o *ProcessInstance) SetTenantId(v string)`

SetTenantId sets TenantId field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


