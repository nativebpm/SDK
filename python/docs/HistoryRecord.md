# HistoryRecord


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **UUID** |  | 
**instance_id** | **UUID** |  | 
**node_id** | **str** |  | 
**node_name** | **str** |  | 
**node_type** | **str** |  | 
**action** | **str** |  | 
**variables** | **object** | JSON encoded payload variables associated with this transition | [optional] 
**timestamp** | **datetime** |  | 

## Example

```python
from nativebpm_client.models.history_record import HistoryRecord

# TODO update the JSON string below
json = "{}"
# create an instance of HistoryRecord from a JSON string
history_record_instance = HistoryRecord.from_json(json)
# print the JSON string representation of the object
print(HistoryRecord.to_json())

# convert the object into a dict
history_record_dict = history_record_instance.to_dict()
# create an instance of HistoryRecord from a dict
history_record_from_dict = HistoryRecord.from_dict(history_record_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


