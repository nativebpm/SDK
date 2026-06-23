# ProcessInstance

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **uuid::Uuid** |  | 
**process_id** | **String** |  | 
**definition_hash** | **String** |  | 
**business_key** | **String** |  | 
**state** | **serde_json::Value** | Raw JSON object representing internal Wazero process engine state representation | 
**version** | **i32** |  | 
**completed** | **bool** |  | 
**updated_at** | **chrono::DateTime<chrono::FixedOffset>** |  | 
**tenant_id** | **String** |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


