# nativebpm_client.model.TaskRecord

## Load the model package
```dart
import 'package:nativebpm_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** |  | 
**instanceId** | **String** |  | 
**activityId** | **String** |  | 
**name** | **String** |  | 
**assignee** | **String** |  | 
**candidateGroups** | **String** |  | 
**status** | **String** |  | 
**dueDate** | [**DateTime**](DateTime.md) |  | [optional] 
**inputSchema** | **String** | JSON schema definition of form widgets | [optional] 
**createdAt** | [**DateTime**](DateTime.md) |  | 
**claimedAt** | [**DateTime**](DateTime.md) |  | [optional] 
**completedAt** | [**DateTime**](DateTime.md) |  | [optional] 
**currentStep** | **int** |  | [optional] 
**draftVariables** | **Map<String, Object>** |  | [optional] [default to const {}]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


