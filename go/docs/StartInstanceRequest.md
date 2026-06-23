# StartInstanceRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**InstanceId** | Pointer to **string** | Optional user-generated UUID to enforce idempotency | [optional] 
**BusinessKey** | Pointer to **string** | Business tracking keyword | [optional] 
**Variables** | Pointer to **map[string]interface{}** |  | [optional] 

## Methods

### NewStartInstanceRequest

`func NewStartInstanceRequest() *StartInstanceRequest`

NewStartInstanceRequest instantiates a new StartInstanceRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewStartInstanceRequestWithDefaults

`func NewStartInstanceRequestWithDefaults() *StartInstanceRequest`

NewStartInstanceRequestWithDefaults instantiates a new StartInstanceRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetInstanceId

`func (o *StartInstanceRequest) GetInstanceId() string`

GetInstanceId returns the InstanceId field if non-nil, zero value otherwise.

### GetInstanceIdOk

`func (o *StartInstanceRequest) GetInstanceIdOk() (*string, bool)`

GetInstanceIdOk returns a tuple with the InstanceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInstanceId

`func (o *StartInstanceRequest) SetInstanceId(v string)`

SetInstanceId sets InstanceId field to given value.

### HasInstanceId

`func (o *StartInstanceRequest) HasInstanceId() bool`

HasInstanceId returns a boolean if a field has been set.

### GetBusinessKey

`func (o *StartInstanceRequest) GetBusinessKey() string`

GetBusinessKey returns the BusinessKey field if non-nil, zero value otherwise.

### GetBusinessKeyOk

`func (o *StartInstanceRequest) GetBusinessKeyOk() (*string, bool)`

GetBusinessKeyOk returns a tuple with the BusinessKey field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBusinessKey

`func (o *StartInstanceRequest) SetBusinessKey(v string)`

SetBusinessKey sets BusinessKey field to given value.

### HasBusinessKey

`func (o *StartInstanceRequest) HasBusinessKey() bool`

HasBusinessKey returns a boolean if a field has been set.

### GetVariables

`func (o *StartInstanceRequest) GetVariables() map[string]interface{}`

GetVariables returns the Variables field if non-nil, zero value otherwise.

### GetVariablesOk

`func (o *StartInstanceRequest) GetVariablesOk() (*map[string]interface{}, bool)`

GetVariablesOk returns a tuple with the Variables field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetVariables

`func (o *StartInstanceRequest) SetVariables(v map[string]interface{})`

SetVariables sets Variables field to given value.

### HasVariables

`func (o *StartInstanceRequest) HasVariables() bool`

HasVariables returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


