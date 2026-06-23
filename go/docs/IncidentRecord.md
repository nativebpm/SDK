# IncidentRecord

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**InstanceId** | **string** |  | 
**ActivityId** | **string** |  | 
**ErrorMessage** | **string** |  | 
**StackTrace** | Pointer to **string** |  | [optional] 
**AttemptsMade** | **int32** |  | 
**Resolved** | **bool** |  | 
**CreatedAt** | **time.Time** |  | 
**ResolvedAt** | Pointer to **time.Time** |  | [optional] 

## Methods

### NewIncidentRecord

`func NewIncidentRecord(id string, instanceId string, activityId string, errorMessage string, attemptsMade int32, resolved bool, createdAt time.Time, ) *IncidentRecord`

NewIncidentRecord instantiates a new IncidentRecord object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewIncidentRecordWithDefaults

`func NewIncidentRecordWithDefaults() *IncidentRecord`

NewIncidentRecordWithDefaults instantiates a new IncidentRecord object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *IncidentRecord) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *IncidentRecord) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *IncidentRecord) SetId(v string)`

SetId sets Id field to given value.


### GetInstanceId

`func (o *IncidentRecord) GetInstanceId() string`

GetInstanceId returns the InstanceId field if non-nil, zero value otherwise.

### GetInstanceIdOk

`func (o *IncidentRecord) GetInstanceIdOk() (*string, bool)`

GetInstanceIdOk returns a tuple with the InstanceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInstanceId

`func (o *IncidentRecord) SetInstanceId(v string)`

SetInstanceId sets InstanceId field to given value.


### GetActivityId

`func (o *IncidentRecord) GetActivityId() string`

GetActivityId returns the ActivityId field if non-nil, zero value otherwise.

### GetActivityIdOk

`func (o *IncidentRecord) GetActivityIdOk() (*string, bool)`

GetActivityIdOk returns a tuple with the ActivityId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetActivityId

`func (o *IncidentRecord) SetActivityId(v string)`

SetActivityId sets ActivityId field to given value.


### GetErrorMessage

`func (o *IncidentRecord) GetErrorMessage() string`

GetErrorMessage returns the ErrorMessage field if non-nil, zero value otherwise.

### GetErrorMessageOk

`func (o *IncidentRecord) GetErrorMessageOk() (*string, bool)`

GetErrorMessageOk returns a tuple with the ErrorMessage field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetErrorMessage

`func (o *IncidentRecord) SetErrorMessage(v string)`

SetErrorMessage sets ErrorMessage field to given value.


### GetStackTrace

`func (o *IncidentRecord) GetStackTrace() string`

GetStackTrace returns the StackTrace field if non-nil, zero value otherwise.

### GetStackTraceOk

`func (o *IncidentRecord) GetStackTraceOk() (*string, bool)`

GetStackTraceOk returns a tuple with the StackTrace field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStackTrace

`func (o *IncidentRecord) SetStackTrace(v string)`

SetStackTrace sets StackTrace field to given value.

### HasStackTrace

`func (o *IncidentRecord) HasStackTrace() bool`

HasStackTrace returns a boolean if a field has been set.

### GetAttemptsMade

`func (o *IncidentRecord) GetAttemptsMade() int32`

GetAttemptsMade returns the AttemptsMade field if non-nil, zero value otherwise.

### GetAttemptsMadeOk

`func (o *IncidentRecord) GetAttemptsMadeOk() (*int32, bool)`

GetAttemptsMadeOk returns a tuple with the AttemptsMade field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAttemptsMade

`func (o *IncidentRecord) SetAttemptsMade(v int32)`

SetAttemptsMade sets AttemptsMade field to given value.


### GetResolved

`func (o *IncidentRecord) GetResolved() bool`

GetResolved returns the Resolved field if non-nil, zero value otherwise.

### GetResolvedOk

`func (o *IncidentRecord) GetResolvedOk() (*bool, bool)`

GetResolvedOk returns a tuple with the Resolved field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetResolved

`func (o *IncidentRecord) SetResolved(v bool)`

SetResolved sets Resolved field to given value.


### GetCreatedAt

`func (o *IncidentRecord) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *IncidentRecord) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *IncidentRecord) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.


### GetResolvedAt

`func (o *IncidentRecord) GetResolvedAt() time.Time`

GetResolvedAt returns the ResolvedAt field if non-nil, zero value otherwise.

### GetResolvedAtOk

`func (o *IncidentRecord) GetResolvedAtOk() (*time.Time, bool)`

GetResolvedAtOk returns a tuple with the ResolvedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetResolvedAt

`func (o *IncidentRecord) SetResolvedAt(v time.Time)`

SetResolvedAt sets ResolvedAt field to given value.

### HasResolvedAt

`func (o *IncidentRecord) HasResolvedAt() bool`

HasResolvedAt returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


