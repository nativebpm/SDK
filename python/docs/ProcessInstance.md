# ProcessInstance


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **UUID** |  | 
**process_id** | **str** |  | 
**definition_hash** | **str** |  | 
**business_key** | **str** |  | 
**state** | **object** | Raw JSON object representing internal Wazero process engine state representation | 
**version** | **int** |  | 
**completed** | **bool** |  | 
**updated_at** | **datetime** |  | 
**tenant_id** | **str** |  | 

## Example

```python
from nativebpm_client.models.process_instance import ProcessInstance

# TODO update the JSON string below
json = "{}"
# create an instance of ProcessInstance from a JSON string
process_instance_instance = ProcessInstance.from_json(json)
# print the JSON string representation of the object
print(ProcessInstance.to_json())

# convert the object into a dict
process_instance_dict = process_instance_instance.to_dict()
# create an instance of ProcessInstance from a dict
process_instance_from_dict = ProcessInstance.from_dict(process_instance_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


