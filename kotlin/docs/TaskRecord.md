
# TaskRecord

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **id** | [**java.util.UUID**](java.util.UUID.md) |  |  |
| **instanceId** | [**java.util.UUID**](java.util.UUID.md) |  |  |
| **activityId** | **kotlin.String** |  |  |
| **name** | **kotlin.String** |  |  |
| **assignee** | **kotlin.String** |  |  |
| **candidateGroups** | **kotlin.String** |  |  |
| **status** | **kotlin.String** |  |  |
| **createdAt** | [**java.time.OffsetDateTime**](java.time.OffsetDateTime.md) |  |  |
| **dueDate** | [**java.time.OffsetDateTime**](java.time.OffsetDateTime.md) |  |  [optional] |
| **inputSchema** | **kotlin.String** | JSON schema definition of form widgets |  [optional] |
| **claimedAt** | [**java.time.OffsetDateTime**](java.time.OffsetDateTime.md) |  |  [optional] |
| **completedAt** | [**java.time.OffsetDateTime**](java.time.OffsetDateTime.md) |  |  [optional] |
| **currentStep** | **kotlin.Int** |  |  [optional] |
| **draftVariables** | [**kotlin.collections.Map&lt;kotlin.String, kotlin.Any&gt;**](kotlin.Any.md) |  |  [optional] |



