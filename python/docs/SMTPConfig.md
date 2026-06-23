# SMTPConfig


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**host** | **str** |  | [optional] 
**port** | **int** |  | [optional] 
**username** | **str** |  | [optional] 
**password** | **str** |  | [optional] 
**var_from** | **str** |  | [optional] 
**from_name** | **str** |  | [optional] 
**use_ssl** | **bool** |  | [optional] 
**max_html_size** | **int** |  | [optional] 
**max_attachment_size** | **int** |  | [optional] 
**max_total_attachments_size** | **int** |  | [optional] 

## Example

```python
from nativebpm_client.models.smtp_config import SMTPConfig

# TODO update the JSON string below
json = "{}"
# create an instance of SMTPConfig from a JSON string
smtp_config_instance = SMTPConfig.from_json(json)
# print the JSON string representation of the object
print(SMTPConfig.to_json())

# convert the object into a dict
smtp_config_dict = smtp_config_instance.to_dict()
# create an instance of SMTPConfig from a dict
smtp_config_from_dict = SMTPConfig.from_dict(smtp_config_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


