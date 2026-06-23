# ProcessDefinition

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Hash** | **string** | MD5/SHA256 content hash of the process XML schema definition | 
**Id** | **string** | Unique process definition identifier | 
**Name** | **string** | Friendly name of the process | 
**XmlData** | **string** | Base64-encoded raw BPMN 2.0 XML schema data | 
**DeployedAt** | **time.Time** |  | 

## Methods

### NewProcessDefinition

`func NewProcessDefinition(hash string, id string, name string, xmlData string, deployedAt time.Time, ) *ProcessDefinition`

NewProcessDefinition instantiates a new ProcessDefinition object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewProcessDefinitionWithDefaults

`func NewProcessDefinitionWithDefaults() *ProcessDefinition`

NewProcessDefinitionWithDefaults instantiates a new ProcessDefinition object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetHash

`func (o *ProcessDefinition) GetHash() string`

GetHash returns the Hash field if non-nil, zero value otherwise.

### GetHashOk

`func (o *ProcessDefinition) GetHashOk() (*string, bool)`

GetHashOk returns a tuple with the Hash field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetHash

`func (o *ProcessDefinition) SetHash(v string)`

SetHash sets Hash field to given value.


### GetId

`func (o *ProcessDefinition) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *ProcessDefinition) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *ProcessDefinition) SetId(v string)`

SetId sets Id field to given value.


### GetName

`func (o *ProcessDefinition) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *ProcessDefinition) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *ProcessDefinition) SetName(v string)`

SetName sets Name field to given value.


### GetXmlData

`func (o *ProcessDefinition) GetXmlData() string`

GetXmlData returns the XmlData field if non-nil, zero value otherwise.

### GetXmlDataOk

`func (o *ProcessDefinition) GetXmlDataOk() (*string, bool)`

GetXmlDataOk returns a tuple with the XmlData field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetXmlData

`func (o *ProcessDefinition) SetXmlData(v string)`

SetXmlData sets XmlData field to given value.


### GetDeployedAt

`func (o *ProcessDefinition) GetDeployedAt() time.Time`

GetDeployedAt returns the DeployedAt field if non-nil, zero value otherwise.

### GetDeployedAtOk

`func (o *ProcessDefinition) GetDeployedAtOk() (*time.Time, bool)`

GetDeployedAtOk returns a tuple with the DeployedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDeployedAt

`func (o *ProcessDefinition) SetDeployedAt(v time.Time)`

SetDeployedAt sets DeployedAt field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


