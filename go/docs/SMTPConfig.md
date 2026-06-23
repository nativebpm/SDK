# SMTPConfig

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Host** | Pointer to **string** |  | [optional] 
**Port** | Pointer to **int32** |  | [optional] 
**Username** | Pointer to **string** |  | [optional] 
**Password** | Pointer to **string** |  | [optional] 
**From** | Pointer to **string** |  | [optional] 
**FromName** | Pointer to **string** |  | [optional] 
**UseSsl** | Pointer to **bool** |  | [optional] 
**MaxHtmlSize** | Pointer to **int64** |  | [optional] 
**MaxAttachmentSize** | Pointer to **int64** |  | [optional] 
**MaxTotalAttachmentsSize** | Pointer to **int64** |  | [optional] 

## Methods

### NewSMTPConfig

`func NewSMTPConfig() *SMTPConfig`

NewSMTPConfig instantiates a new SMTPConfig object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSMTPConfigWithDefaults

`func NewSMTPConfigWithDefaults() *SMTPConfig`

NewSMTPConfigWithDefaults instantiates a new SMTPConfig object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetHost

`func (o *SMTPConfig) GetHost() string`

GetHost returns the Host field if non-nil, zero value otherwise.

### GetHostOk

`func (o *SMTPConfig) GetHostOk() (*string, bool)`

GetHostOk returns a tuple with the Host field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetHost

`func (o *SMTPConfig) SetHost(v string)`

SetHost sets Host field to given value.

### HasHost

`func (o *SMTPConfig) HasHost() bool`

HasHost returns a boolean if a field has been set.

### GetPort

`func (o *SMTPConfig) GetPort() int32`

GetPort returns the Port field if non-nil, zero value otherwise.

### GetPortOk

`func (o *SMTPConfig) GetPortOk() (*int32, bool)`

GetPortOk returns a tuple with the Port field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPort

`func (o *SMTPConfig) SetPort(v int32)`

SetPort sets Port field to given value.

### HasPort

`func (o *SMTPConfig) HasPort() bool`

HasPort returns a boolean if a field has been set.

### GetUsername

`func (o *SMTPConfig) GetUsername() string`

GetUsername returns the Username field if non-nil, zero value otherwise.

### GetUsernameOk

`func (o *SMTPConfig) GetUsernameOk() (*string, bool)`

GetUsernameOk returns a tuple with the Username field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsername

`func (o *SMTPConfig) SetUsername(v string)`

SetUsername sets Username field to given value.

### HasUsername

`func (o *SMTPConfig) HasUsername() bool`

HasUsername returns a boolean if a field has been set.

### GetPassword

`func (o *SMTPConfig) GetPassword() string`

GetPassword returns the Password field if non-nil, zero value otherwise.

### GetPasswordOk

`func (o *SMTPConfig) GetPasswordOk() (*string, bool)`

GetPasswordOk returns a tuple with the Password field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPassword

`func (o *SMTPConfig) SetPassword(v string)`

SetPassword sets Password field to given value.

### HasPassword

`func (o *SMTPConfig) HasPassword() bool`

HasPassword returns a boolean if a field has been set.

### GetFrom

`func (o *SMTPConfig) GetFrom() string`

GetFrom returns the From field if non-nil, zero value otherwise.

### GetFromOk

`func (o *SMTPConfig) GetFromOk() (*string, bool)`

GetFromOk returns a tuple with the From field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFrom

`func (o *SMTPConfig) SetFrom(v string)`

SetFrom sets From field to given value.

### HasFrom

`func (o *SMTPConfig) HasFrom() bool`

HasFrom returns a boolean if a field has been set.

### GetFromName

`func (o *SMTPConfig) GetFromName() string`

GetFromName returns the FromName field if non-nil, zero value otherwise.

### GetFromNameOk

`func (o *SMTPConfig) GetFromNameOk() (*string, bool)`

GetFromNameOk returns a tuple with the FromName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFromName

`func (o *SMTPConfig) SetFromName(v string)`

SetFromName sets FromName field to given value.

### HasFromName

`func (o *SMTPConfig) HasFromName() bool`

HasFromName returns a boolean if a field has been set.

### GetUseSsl

`func (o *SMTPConfig) GetUseSsl() bool`

GetUseSsl returns the UseSsl field if non-nil, zero value otherwise.

### GetUseSslOk

`func (o *SMTPConfig) GetUseSslOk() (*bool, bool)`

GetUseSslOk returns a tuple with the UseSsl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUseSsl

`func (o *SMTPConfig) SetUseSsl(v bool)`

SetUseSsl sets UseSsl field to given value.

### HasUseSsl

`func (o *SMTPConfig) HasUseSsl() bool`

HasUseSsl returns a boolean if a field has been set.

### GetMaxHtmlSize

`func (o *SMTPConfig) GetMaxHtmlSize() int64`

GetMaxHtmlSize returns the MaxHtmlSize field if non-nil, zero value otherwise.

### GetMaxHtmlSizeOk

`func (o *SMTPConfig) GetMaxHtmlSizeOk() (*int64, bool)`

GetMaxHtmlSizeOk returns a tuple with the MaxHtmlSize field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaxHtmlSize

`func (o *SMTPConfig) SetMaxHtmlSize(v int64)`

SetMaxHtmlSize sets MaxHtmlSize field to given value.

### HasMaxHtmlSize

`func (o *SMTPConfig) HasMaxHtmlSize() bool`

HasMaxHtmlSize returns a boolean if a field has been set.

### GetMaxAttachmentSize

`func (o *SMTPConfig) GetMaxAttachmentSize() int64`

GetMaxAttachmentSize returns the MaxAttachmentSize field if non-nil, zero value otherwise.

### GetMaxAttachmentSizeOk

`func (o *SMTPConfig) GetMaxAttachmentSizeOk() (*int64, bool)`

GetMaxAttachmentSizeOk returns a tuple with the MaxAttachmentSize field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaxAttachmentSize

`func (o *SMTPConfig) SetMaxAttachmentSize(v int64)`

SetMaxAttachmentSize sets MaxAttachmentSize field to given value.

### HasMaxAttachmentSize

`func (o *SMTPConfig) HasMaxAttachmentSize() bool`

HasMaxAttachmentSize returns a boolean if a field has been set.

### GetMaxTotalAttachmentsSize

`func (o *SMTPConfig) GetMaxTotalAttachmentsSize() int64`

GetMaxTotalAttachmentsSize returns the MaxTotalAttachmentsSize field if non-nil, zero value otherwise.

### GetMaxTotalAttachmentsSizeOk

`func (o *SMTPConfig) GetMaxTotalAttachmentsSizeOk() (*int64, bool)`

GetMaxTotalAttachmentsSizeOk returns a tuple with the MaxTotalAttachmentsSize field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaxTotalAttachmentsSize

`func (o *SMTPConfig) SetMaxTotalAttachmentsSize(v int64)`

SetMaxTotalAttachmentsSize sets MaxTotalAttachmentsSize field to given value.

### HasMaxTotalAttachmentsSize

`func (o *SMTPConfig) HasMaxTotalAttachmentsSize() bool`

HasMaxTotalAttachmentsSize returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


