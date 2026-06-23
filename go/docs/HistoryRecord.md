# HistoryRecord

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**InstanceId** | **string** |  | 
**NodeId** | **string** |  | 
**NodeName** | **string** |  | 
**NodeType** | **string** |  | 
**Action** | **string** |  | 
**Variables** | Pointer to **string** | JSON encoded payload variables associated with this transition | [optional] 
**Timestamp** | **time.Time** |  | 

## Methods

### NewHistoryRecord

`func NewHistoryRecord(id string, instanceId string, nodeId string, nodeName string, nodeType string, action string, timestamp time.Time, ) *HistoryRecord`

NewHistoryRecord instantiates a new HistoryRecord object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewHistoryRecordWithDefaults

`func NewHistoryRecordWithDefaults() *HistoryRecord`

NewHistoryRecordWithDefaults instantiates a new HistoryRecord object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *HistoryRecord) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *HistoryRecord) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *HistoryRecord) SetId(v string)`

SetId sets Id field to given value.


### GetInstanceId

`func (o *HistoryRecord) GetInstanceId() string`

GetInstanceId returns the InstanceId field if non-nil, zero value otherwise.

### GetInstanceIdOk

`func (o *HistoryRecord) GetInstanceIdOk() (*string, bool)`

GetInstanceIdOk returns a tuple with the InstanceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInstanceId

`func (o *HistoryRecord) SetInstanceId(v string)`

SetInstanceId sets InstanceId field to given value.


### GetNodeId

`func (o *HistoryRecord) GetNodeId() string`

GetNodeId returns the NodeId field if non-nil, zero value otherwise.

### GetNodeIdOk

`func (o *HistoryRecord) GetNodeIdOk() (*string, bool)`

GetNodeIdOk returns a tuple with the NodeId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNodeId

`func (o *HistoryRecord) SetNodeId(v string)`

SetNodeId sets NodeId field to given value.


### GetNodeName

`func (o *HistoryRecord) GetNodeName() string`

GetNodeName returns the NodeName field if non-nil, zero value otherwise.

### GetNodeNameOk

`func (o *HistoryRecord) GetNodeNameOk() (*string, bool)`

GetNodeNameOk returns a tuple with the NodeName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNodeName

`func (o *HistoryRecord) SetNodeName(v string)`

SetNodeName sets NodeName field to given value.


### GetNodeType

`func (o *HistoryRecord) GetNodeType() string`

GetNodeType returns the NodeType field if non-nil, zero value otherwise.

### GetNodeTypeOk

`func (o *HistoryRecord) GetNodeTypeOk() (*string, bool)`

GetNodeTypeOk returns a tuple with the NodeType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNodeType

`func (o *HistoryRecord) SetNodeType(v string)`

SetNodeType sets NodeType field to given value.


### GetAction

`func (o *HistoryRecord) GetAction() string`

GetAction returns the Action field if non-nil, zero value otherwise.

### GetActionOk

`func (o *HistoryRecord) GetActionOk() (*string, bool)`

GetActionOk returns a tuple with the Action field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAction

`func (o *HistoryRecord) SetAction(v string)`

SetAction sets Action field to given value.


### GetVariables

`func (o *HistoryRecord) GetVariables() string`

GetVariables returns the Variables field if non-nil, zero value otherwise.

### GetVariablesOk

`func (o *HistoryRecord) GetVariablesOk() (*string, bool)`

GetVariablesOk returns a tuple with the Variables field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetVariables

`func (o *HistoryRecord) SetVariables(v string)`

SetVariables sets Variables field to given value.

### HasVariables

`func (o *HistoryRecord) HasVariables() bool`

HasVariables returns a boolean if a field has been set.

### GetTimestamp

`func (o *HistoryRecord) GetTimestamp() time.Time`

GetTimestamp returns the Timestamp field if non-nil, zero value otherwise.

### GetTimestampOk

`func (o *HistoryRecord) GetTimestampOk() (*time.Time, bool)`

GetTimestampOk returns a tuple with the Timestamp field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTimestamp

`func (o *HistoryRecord) SetTimestamp(v time.Time)`

SetTimestamp sets Timestamp field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


