
# WebhookDeliveryRecord

## Properties
| Name | Type | Description | Notes |
| ------------ | ------------- | ------------- | ------------- |
| **id** | [**java.util.UUID**](java.util.UUID.md) |  |  |
| **webhookId** | [**java.util.UUID**](java.util.UUID.md) |  |  |
| **tenantId** | **kotlin.String** |  |  |
| **eventType** | **kotlin.String** |  |  |
| **payload** | **kotlin.ByteArray** |  |  |
| **status** | **kotlin.String** |  |  |
| **attempts** | **kotlin.Int** |  |  |
| **createdAt** | [**java.time.OffsetDateTime**](java.time.OffsetDateTime.md) |  |  |
| **responseCode** | **kotlin.Int** |  |  [optional] |
| **responseBody** | **kotlin.String** |  |  [optional] |
| **nextRetry** | [**java.time.OffsetDateTime**](java.time.OffsetDateTime.md) |  |  [optional] |
| **processedAt** | [**java.time.OffsetDateTime**](java.time.OffsetDateTime.md) |  |  [optional] |



