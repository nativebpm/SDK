# CompleteInstanceTaskRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**NodeId** | **string** | BPMN task element identifier | 
**Variables** | Pointer to **map[string]interface{}** |  | [optional] 

## Methods

### NewCompleteInstanceTaskRequest

`func NewCompleteInstanceTaskRequest(nodeId string, ) *CompleteInstanceTaskRequest`

NewCompleteInstanceTaskRequest instantiates a new CompleteInstanceTaskRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewCompleteInstanceTaskRequestWithDefaults

`func NewCompleteInstanceTaskRequestWithDefaults() *CompleteInstanceTaskRequest`

NewCompleteInstanceTaskRequestWithDefaults instantiates a new CompleteInstanceTaskRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetNodeId

`func (o *CompleteInstanceTaskRequest) GetNodeId() string`

GetNodeId returns the NodeId field if non-nil, zero value otherwise.

### GetNodeIdOk

`func (o *CompleteInstanceTaskRequest) GetNodeIdOk() (*string, bool)`

GetNodeIdOk returns a tuple with the NodeId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNodeId

`func (o *CompleteInstanceTaskRequest) SetNodeId(v string)`

SetNodeId sets NodeId field to given value.


### GetVariables

`func (o *CompleteInstanceTaskRequest) GetVariables() map[string]interface{}`

GetVariables returns the Variables field if non-nil, zero value otherwise.

### GetVariablesOk

`func (o *CompleteInstanceTaskRequest) GetVariablesOk() (*map[string]interface{}, bool)`

GetVariablesOk returns a tuple with the Variables field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetVariables

`func (o *CompleteInstanceTaskRequest) SetVariables(v map[string]interface{})`

SetVariables sets Variables field to given value.

### HasVariables

`func (o *CompleteInstanceTaskRequest) HasVariables() bool`

HasVariables returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


