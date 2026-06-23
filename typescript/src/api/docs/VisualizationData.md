
# VisualizationData


## Properties

Name | Type
------------ | -------------
`instanceId` | string
`definitionId` | string
`xml` | string
`activeNodes` | Array&lt;string&gt;
`waitingNodes` | Array&lt;string&gt;
`completedNodes` | Array&lt;string&gt;
`history` | [Array&lt;HistoryRecord&gt;](HistoryRecord.md)
`completed` | boolean

## Example

```typescript
import type { VisualizationData } from '@nativebpm/client'

// TODO: Update the object below with actual values
const example = {
  "instanceId": null,
  "definitionId": null,
  "xml": null,
  "activeNodes": null,
  "waitingNodes": null,
  "completedNodes": null,
  "history": null,
  "completed": null,
} satisfies VisualizationData

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as VisualizationData
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


