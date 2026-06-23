# WebhookDeliveryRecord

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**WebhookId** | **string** |  | 
**TenantId** | **string** |  | 
**EventType** | **string** |  | 
**Payload** | **string** |  | 
**Status** | **string** |  | 
**ResponseCode** | Pointer to **int32** |  | [optional] 
**ResponseBody** | Pointer to **string** |  | [optional] 
**Attempts** | **int32** |  | 
**NextRetry** | Pointer to **time.Time** |  | [optional] 
**CreatedAt** | **time.Time** |  | 
**ProcessedAt** | Pointer to **time.Time** |  | [optional] 

## Methods

### NewWebhookDeliveryRecord

`func NewWebhookDeliveryRecord(id string, webhookId string, tenantId string, eventType string, payload string, status string, attempts int32, createdAt time.Time, ) *WebhookDeliveryRecord`

NewWebhookDeliveryRecord instantiates a new WebhookDeliveryRecord object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewWebhookDeliveryRecordWithDefaults

`func NewWebhookDeliveryRecordWithDefaults() *WebhookDeliveryRecord`

NewWebhookDeliveryRecordWithDefaults instantiates a new WebhookDeliveryRecord object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *WebhookDeliveryRecord) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *WebhookDeliveryRecord) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *WebhookDeliveryRecord) SetId(v string)`

SetId sets Id field to given value.


### GetWebhookId

`func (o *WebhookDeliveryRecord) GetWebhookId() string`

GetWebhookId returns the WebhookId field if non-nil, zero value otherwise.

### GetWebhookIdOk

`func (o *WebhookDeliveryRecord) GetWebhookIdOk() (*string, bool)`

GetWebhookIdOk returns a tuple with the WebhookId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWebhookId

`func (o *WebhookDeliveryRecord) SetWebhookId(v string)`

SetWebhookId sets WebhookId field to given value.


### GetTenantId

`func (o *WebhookDeliveryRecord) GetTenantId() string`

GetTenantId returns the TenantId field if non-nil, zero value otherwise.

### GetTenantIdOk

`func (o *WebhookDeliveryRecord) GetTenantIdOk() (*string, bool)`

GetTenantIdOk returns a tuple with the TenantId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTenantId

`func (o *WebhookDeliveryRecord) SetTenantId(v string)`

SetTenantId sets TenantId field to given value.


### GetEventType

`func (o *WebhookDeliveryRecord) GetEventType() string`

GetEventType returns the EventType field if non-nil, zero value otherwise.

### GetEventTypeOk

`func (o *WebhookDeliveryRecord) GetEventTypeOk() (*string, bool)`

GetEventTypeOk returns a tuple with the EventType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventType

`func (o *WebhookDeliveryRecord) SetEventType(v string)`

SetEventType sets EventType field to given value.


### GetPayload

`func (o *WebhookDeliveryRecord) GetPayload() string`

GetPayload returns the Payload field if non-nil, zero value otherwise.

### GetPayloadOk

`func (o *WebhookDeliveryRecord) GetPayloadOk() (*string, bool)`

GetPayloadOk returns a tuple with the Payload field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayload

`func (o *WebhookDeliveryRecord) SetPayload(v string)`

SetPayload sets Payload field to given value.


### GetStatus

`func (o *WebhookDeliveryRecord) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *WebhookDeliveryRecord) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *WebhookDeliveryRecord) SetStatus(v string)`

SetStatus sets Status field to given value.


### GetResponseCode

`func (o *WebhookDeliveryRecord) GetResponseCode() int32`

GetResponseCode returns the ResponseCode field if non-nil, zero value otherwise.

### GetResponseCodeOk

`func (o *WebhookDeliveryRecord) GetResponseCodeOk() (*int32, bool)`

GetResponseCodeOk returns a tuple with the ResponseCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetResponseCode

`func (o *WebhookDeliveryRecord) SetResponseCode(v int32)`

SetResponseCode sets ResponseCode field to given value.

### HasResponseCode

`func (o *WebhookDeliveryRecord) HasResponseCode() bool`

HasResponseCode returns a boolean if a field has been set.

### GetResponseBody

`func (o *WebhookDeliveryRecord) GetResponseBody() string`

GetResponseBody returns the ResponseBody field if non-nil, zero value otherwise.

### GetResponseBodyOk

`func (o *WebhookDeliveryRecord) GetResponseBodyOk() (*string, bool)`

GetResponseBodyOk returns a tuple with the ResponseBody field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetResponseBody

`func (o *WebhookDeliveryRecord) SetResponseBody(v string)`

SetResponseBody sets ResponseBody field to given value.

### HasResponseBody

`func (o *WebhookDeliveryRecord) HasResponseBody() bool`

HasResponseBody returns a boolean if a field has been set.

### GetAttempts

`func (o *WebhookDeliveryRecord) GetAttempts() int32`

GetAttempts returns the Attempts field if non-nil, zero value otherwise.

### GetAttemptsOk

`func (o *WebhookDeliveryRecord) GetAttemptsOk() (*int32, bool)`

GetAttemptsOk returns a tuple with the Attempts field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAttempts

`func (o *WebhookDeliveryRecord) SetAttempts(v int32)`

SetAttempts sets Attempts field to given value.


### GetNextRetry

`func (o *WebhookDeliveryRecord) GetNextRetry() time.Time`

GetNextRetry returns the NextRetry field if non-nil, zero value otherwise.

### GetNextRetryOk

`func (o *WebhookDeliveryRecord) GetNextRetryOk() (*time.Time, bool)`

GetNextRetryOk returns a tuple with the NextRetry field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNextRetry

`func (o *WebhookDeliveryRecord) SetNextRetry(v time.Time)`

SetNextRetry sets NextRetry field to given value.

### HasNextRetry

`func (o *WebhookDeliveryRecord) HasNextRetry() bool`

HasNextRetry returns a boolean if a field has been set.

### GetCreatedAt

`func (o *WebhookDeliveryRecord) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *WebhookDeliveryRecord) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *WebhookDeliveryRecord) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.


### GetProcessedAt

`func (o *WebhookDeliveryRecord) GetProcessedAt() time.Time`

GetProcessedAt returns the ProcessedAt field if non-nil, zero value otherwise.

### GetProcessedAtOk

`func (o *WebhookDeliveryRecord) GetProcessedAtOk() (*time.Time, bool)`

GetProcessedAtOk returns a tuple with the ProcessedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProcessedAt

`func (o *WebhookDeliveryRecord) SetProcessedAt(v time.Time)`

SetProcessedAt sets ProcessedAt field to given value.

### HasProcessedAt

`func (o *WebhookDeliveryRecord) HasProcessedAt() bool`

HasProcessedAt returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


