# VisualizationData


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**instance_id** | **str** |  | 
**definition_id** | **str** |  | 
**xml** | **str** |  | 
**active_nodes** | **List[str]** |  | 
**waiting_nodes** | **List[str]** |  | 
**completed_nodes** | **List[str]** |  | 
**history** | [**List[HistoryRecord]**](HistoryRecord.md) |  | 
**completed** | **bool** |  | 

## Example

```python
from nativebpm_client.models.visualization_data import VisualizationData

# TODO update the JSON string below
json = "{}"
# create an instance of VisualizationData from a JSON string
visualization_data_instance = VisualizationData.from_json(json)
# print the JSON string representation of the object
print(VisualizationData.to_json())

# convert the object into a dict
visualization_data_dict = visualization_data_instance.to_dict()
# create an instance of VisualizationData from a dict
visualization_data_from_dict = VisualizationData.from_dict(visualization_data_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


