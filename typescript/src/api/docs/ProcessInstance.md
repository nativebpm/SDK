
# ProcessInstance


## Properties

Name | Type
------------ | -------------
`id` | string
`processId` | string
`definitionHash` | string
`businessKey` | string
`state` | object
`version` | number
`completed` | boolean
`updatedAt` | Date
`tenantId` | string

## Example

```typescript
import type { ProcessInstance } from '@nativebpm/client'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "processId": null,
  "definitionHash": null,
  "businessKey": null,
  "state": null,
  "version": null,
  "completed": null,
  "updatedAt": null,
  "tenantId": null,
} satisfies ProcessInstance

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProcessInstance
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


