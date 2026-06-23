
# HistoryRecord


## Properties

Name | Type
------------ | -------------
`id` | string
`instanceId` | string
`nodeId` | string
`nodeName` | string
`nodeType` | string
`action` | string
`variables` | object
`timestamp` | Date

## Example

```typescript
import type { HistoryRecord } from '@nativebpm/client'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "instanceId": null,
  "nodeId": null,
  "nodeName": null,
  "nodeType": null,
  "action": start,
  "variables": null,
  "timestamp": null,
} satisfies HistoryRecord

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as HistoryRecord
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


