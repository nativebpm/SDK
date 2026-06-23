# VisualizationData

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**InstanceId** | **string** |  | 
**DefinitionId** | **string** |  | 
**Xml** | **string** |  | 
**ActiveNodes** | **[]string** |  | 
**WaitingNodes** | **[]string** |  | 
**CompletedNodes** | **[]string** |  | 
**History** | [**[]HistoryRecord**](HistoryRecord.md) |  | 
**Completed** | **bool** |  | 

## Methods

### NewVisualizationData

`func NewVisualizationData(instanceId string, definitionId string, xml string, activeNodes []string, waitingNodes []string, completedNodes []string, history []HistoryRecord, completed bool, ) *VisualizationData`

NewVisualizationData instantiates a new VisualizationData object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewVisualizationDataWithDefaults

`func NewVisualizationDataWithDefaults() *VisualizationData`

NewVisualizationDataWithDefaults instantiates a new VisualizationData object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetInstanceId

`func (o *VisualizationData) GetInstanceId() string`

GetInstanceId returns the InstanceId field if non-nil, zero value otherwise.

### GetInstanceIdOk

`func (o *VisualizationData) GetInstanceIdOk() (*string, bool)`

GetInstanceIdOk returns a tuple with the InstanceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInstanceId

`func (o *VisualizationData) SetInstanceId(v string)`

SetInstanceId sets InstanceId field to given value.


### GetDefinitionId

`func (o *VisualizationData) GetDefinitionId() string`

GetDefinitionId returns the DefinitionId field if non-nil, zero value otherwise.

### GetDefinitionIdOk

`func (o *VisualizationData) GetDefinitionIdOk() (*string, bool)`

GetDefinitionIdOk returns a tuple with the DefinitionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDefinitionId

`func (o *VisualizationData) SetDefinitionId(v string)`

SetDefinitionId sets DefinitionId field to given value.


### GetXml

`func (o *VisualizationData) GetXml() string`

GetXml returns the Xml field if non-nil, zero value otherwise.

### GetXmlOk

`func (o *VisualizationData) GetXmlOk() (*string, bool)`

GetXmlOk returns a tuple with the Xml field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetXml

`func (o *VisualizationData) SetXml(v string)`

SetXml sets Xml field to given value.


### GetActiveNodes

`func (o *VisualizationData) GetActiveNodes() []string`

GetActiveNodes returns the ActiveNodes field if non-nil, zero value otherwise.

### GetActiveNodesOk

`func (o *VisualizationData) GetActiveNodesOk() (*[]string, bool)`

GetActiveNodesOk returns a tuple with the ActiveNodes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetActiveNodes

`func (o *VisualizationData) SetActiveNodes(v []string)`

SetActiveNodes sets ActiveNodes field to given value.


### GetWaitingNodes

`func (o *VisualizationData) GetWaitingNodes() []string`

GetWaitingNodes returns the WaitingNodes field if non-nil, zero value otherwise.

### GetWaitingNodesOk

`func (o *VisualizationData) GetWaitingNodesOk() (*[]string, bool)`

GetWaitingNodesOk returns a tuple with the WaitingNodes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWaitingNodes

`func (o *VisualizationData) SetWaitingNodes(v []string)`

SetWaitingNodes sets WaitingNodes field to given value.


### GetCompletedNodes

`func (o *VisualizationData) GetCompletedNodes() []string`

GetCompletedNodes returns the CompletedNodes field if non-nil, zero value otherwise.

### GetCompletedNodesOk

`func (o *VisualizationData) GetCompletedNodesOk() (*[]string, bool)`

GetCompletedNodesOk returns a tuple with the CompletedNodes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCompletedNodes

`func (o *VisualizationData) SetCompletedNodes(v []string)`

SetCompletedNodes sets CompletedNodes field to given value.


### GetHistory

`func (o *VisualizationData) GetHistory() []HistoryRecord`

GetHistory returns the History field if non-nil, zero value otherwise.

### GetHistoryOk

`func (o *VisualizationData) GetHistoryOk() (*[]HistoryRecord, bool)`

GetHistoryOk returns a tuple with the History field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetHistory

`func (o *VisualizationData) SetHistory(v []HistoryRecord)`

SetHistory sets History field to given value.


### GetCompleted

`func (o *VisualizationData) GetCompleted() bool`

GetCompleted returns the Completed field if non-nil, zero value otherwise.

### GetCompletedOk

`func (o *VisualizationData) GetCompletedOk() (*bool, bool)`

GetCompletedOk returns a tuple with the Completed field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCompleted

`func (o *VisualizationData) SetCompleted(v bool)`

SetCompleted sets Completed field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


