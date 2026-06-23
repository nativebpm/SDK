# TaskRecord

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**InstanceId** | **string** |  | 
**ActivityId** | **string** |  | 
**Name** | **string** |  | 
**Assignee** | **string** |  | 
**CandidateGroups** | **string** |  | 
**Status** | **string** |  | 
**DueDate** | Pointer to **time.Time** |  | [optional] 
**InputSchema** | Pointer to **string** | JSON schema definition of form widgets | [optional] 
**CreatedAt** | **time.Time** |  | 
**ClaimedAt** | Pointer to **time.Time** |  | [optional] 
**CompletedAt** | Pointer to **time.Time** |  | [optional] 
**CurrentStep** | Pointer to **int32** |  | [optional] 
**DraftVariables** | Pointer to **map[string]interface{}** |  | [optional] 

## Methods

### NewTaskRecord

`func NewTaskRecord(id string, instanceId string, activityId string, name string, assignee string, candidateGroups string, status string, createdAt time.Time, ) *TaskRecord`

NewTaskRecord instantiates a new TaskRecord object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewTaskRecordWithDefaults

`func NewTaskRecordWithDefaults() *TaskRecord`

NewTaskRecordWithDefaults instantiates a new TaskRecord object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *TaskRecord) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *TaskRecord) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *TaskRecord) SetId(v string)`

SetId sets Id field to given value.


### GetInstanceId

`func (o *TaskRecord) GetInstanceId() string`

GetInstanceId returns the InstanceId field if non-nil, zero value otherwise.

### GetInstanceIdOk

`func (o *TaskRecord) GetInstanceIdOk() (*string, bool)`

GetInstanceIdOk returns a tuple with the InstanceId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInstanceId

`func (o *TaskRecord) SetInstanceId(v string)`

SetInstanceId sets InstanceId field to given value.


### GetActivityId

`func (o *TaskRecord) GetActivityId() string`

GetActivityId returns the ActivityId field if non-nil, zero value otherwise.

### GetActivityIdOk

`func (o *TaskRecord) GetActivityIdOk() (*string, bool)`

GetActivityIdOk returns a tuple with the ActivityId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetActivityId

`func (o *TaskRecord) SetActivityId(v string)`

SetActivityId sets ActivityId field to given value.


### GetName

`func (o *TaskRecord) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *TaskRecord) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *TaskRecord) SetName(v string)`

SetName sets Name field to given value.


### GetAssignee

`func (o *TaskRecord) GetAssignee() string`

GetAssignee returns the Assignee field if non-nil, zero value otherwise.

### GetAssigneeOk

`func (o *TaskRecord) GetAssigneeOk() (*string, bool)`

GetAssigneeOk returns a tuple with the Assignee field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAssignee

`func (o *TaskRecord) SetAssignee(v string)`

SetAssignee sets Assignee field to given value.


### GetCandidateGroups

`func (o *TaskRecord) GetCandidateGroups() string`

GetCandidateGroups returns the CandidateGroups field if non-nil, zero value otherwise.

### GetCandidateGroupsOk

`func (o *TaskRecord) GetCandidateGroupsOk() (*string, bool)`

GetCandidateGroupsOk returns a tuple with the CandidateGroups field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCandidateGroups

`func (o *TaskRecord) SetCandidateGroups(v string)`

SetCandidateGroups sets CandidateGroups field to given value.


### GetStatus

`func (o *TaskRecord) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *TaskRecord) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *TaskRecord) SetStatus(v string)`

SetStatus sets Status field to given value.


### GetDueDate

`func (o *TaskRecord) GetDueDate() time.Time`

GetDueDate returns the DueDate field if non-nil, zero value otherwise.

### GetDueDateOk

`func (o *TaskRecord) GetDueDateOk() (*time.Time, bool)`

GetDueDateOk returns a tuple with the DueDate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDueDate

`func (o *TaskRecord) SetDueDate(v time.Time)`

SetDueDate sets DueDate field to given value.

### HasDueDate

`func (o *TaskRecord) HasDueDate() bool`

HasDueDate returns a boolean if a field has been set.

### GetInputSchema

`func (o *TaskRecord) GetInputSchema() string`

GetInputSchema returns the InputSchema field if non-nil, zero value otherwise.

### GetInputSchemaOk

`func (o *TaskRecord) GetInputSchemaOk() (*string, bool)`

GetInputSchemaOk returns a tuple with the InputSchema field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInputSchema

`func (o *TaskRecord) SetInputSchema(v string)`

SetInputSchema sets InputSchema field to given value.

### HasInputSchema

`func (o *TaskRecord) HasInputSchema() bool`

HasInputSchema returns a boolean if a field has been set.

### GetCreatedAt

`func (o *TaskRecord) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *TaskRecord) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *TaskRecord) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.


### GetClaimedAt

`func (o *TaskRecord) GetClaimedAt() time.Time`

GetClaimedAt returns the ClaimedAt field if non-nil, zero value otherwise.

### GetClaimedAtOk

`func (o *TaskRecord) GetClaimedAtOk() (*time.Time, bool)`

GetClaimedAtOk returns a tuple with the ClaimedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetClaimedAt

`func (o *TaskRecord) SetClaimedAt(v time.Time)`

SetClaimedAt sets ClaimedAt field to given value.

### HasClaimedAt

`func (o *TaskRecord) HasClaimedAt() bool`

HasClaimedAt returns a boolean if a field has been set.

### GetCompletedAt

`func (o *TaskRecord) GetCompletedAt() time.Time`

GetCompletedAt returns the CompletedAt field if non-nil, zero value otherwise.

### GetCompletedAtOk

`func (o *TaskRecord) GetCompletedAtOk() (*time.Time, bool)`

GetCompletedAtOk returns a tuple with the CompletedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCompletedAt

`func (o *TaskRecord) SetCompletedAt(v time.Time)`

SetCompletedAt sets CompletedAt field to given value.

### HasCompletedAt

`func (o *TaskRecord) HasCompletedAt() bool`

HasCompletedAt returns a boolean if a field has been set.

### GetCurrentStep

`func (o *TaskRecord) GetCurrentStep() int32`

GetCurrentStep returns the CurrentStep field if non-nil, zero value otherwise.

### GetCurrentStepOk

`func (o *TaskRecord) GetCurrentStepOk() (*int32, bool)`

GetCurrentStepOk returns a tuple with the CurrentStep field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrentStep

`func (o *TaskRecord) SetCurrentStep(v int32)`

SetCurrentStep sets CurrentStep field to given value.

### HasCurrentStep

`func (o *TaskRecord) HasCurrentStep() bool`

HasCurrentStep returns a boolean if a field has been set.

### GetDraftVariables

`func (o *TaskRecord) GetDraftVariables() map[string]interface{}`

GetDraftVariables returns the DraftVariables field if non-nil, zero value otherwise.

### GetDraftVariablesOk

`func (o *TaskRecord) GetDraftVariablesOk() (*map[string]interface{}, bool)`

GetDraftVariablesOk returns a tuple with the DraftVariables field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDraftVariables

`func (o *TaskRecord) SetDraftVariables(v map[string]interface{})`

SetDraftVariables sets DraftVariables field to given value.

### HasDraftVariables

`func (o *TaskRecord) HasDraftVariables() bool`

HasDraftVariables returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


