
# SMTPConfig


## Properties

Name | Type
------------ | -------------
`host` | string
`port` | number
`username` | string
`password` | string
`from` | string
`fromName` | string
`useSsl` | boolean
`maxHtmlSize` | number
`maxAttachmentSize` | number
`maxTotalAttachmentsSize` | number

## Example

```typescript
import type { SMTPConfig } from '@nativebpm/client'

// TODO: Update the object below with actual values
const example = {
  "host": null,
  "port": null,
  "username": null,
  "password": null,
  "from": null,
  "fromName": null,
  "useSsl": null,
  "maxHtmlSize": null,
  "maxAttachmentSize": null,
  "maxTotalAttachmentsSize": null,
} satisfies SMTPConfig

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SMTPConfig
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


