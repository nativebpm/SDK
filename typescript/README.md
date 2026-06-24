[← Back to Platform Root](../../README.md)

# NativeBPM TypeScript SDK

Official TypeScript Client SDK for NativeBPM Cloud-Native engine.

## Installation

To install the package from the GitLab npm Package Registry:

1. Configure your `.npmrc` file (replace `<your_gitlab_token>` if the repository or package registry requires private authentication, otherwise public access is open for reading):
```text
@nativebpm:registry=https://gitlab.com/api/v4/projects/nativebpm%2Fsdk/packages/npm/
//gitlab.com/api/v4/projects/nativebpm%2Fsdk/packages/npm/:_authToken="your_gitlab_token"
```

2. Install the dependency:
```bash
npm install @nativebpm/sdk
```

For local development and compilation:

```bash
npm install
npm run build
```

## Running Tests

To run the TypeScript unit tests locally:

```bash
npm test
```

## Usage Example

The TypeScript SDK provides a Fluent API client interface. It uses native `fetch` internally and is fully compatible with Node.js 18+, Edge environments, and browsers.

```typescript
import { Client } from "@nativebpm/sdk";

// Initialize the client
const client = new Client("http://localhost:8080", "your-api-token");

// 1. List definitions
const definitions = await client.definitions().list().send();
for (const d of definitions) {
    console.log(`Definition: ${d.name} (ID: ${d.id})`);
}

// 2. Start a new process instance
const variables = { approvalRequired: true, department: "Finance" };
const instance = await client.instances()
    .start("purchase-requisition")
    .businessKey("REQ-9901")
    .variables(variables)
    .send();

console.log(`Started process instance: ${instance.id}`);
```

## Workflow-as-Code (Workflow definition in TypeScript)

You can describe your business processes directly in TypeScript code:

```typescript
import { Workflow, v } from "@nativebpm/sdk";

// Define a process
const workflow = new Workflow('awesome-ts-process', 'Awesome TS Process');
workflow
  .when(v('isPremium').eq(true))
  .then(flow => {
    flow.user('vipService', 'VIP Customer Support', { assignee: 'vip_manager' });
  })
  .else(flow => {
    flow.service('standardNotify', 'Send Regular Notification', 'notification_topic');
  });

// Deploy the process using the client
const definition = await client.deploy(workflow);
```


## Developer Guide: Publishing to GitLab Package Registry

### Automated Publishing via CI/CD
This package is automatically built and published to the GitLab npm Package Registry whenever a git tag matching the pattern `sdk/typescript/v*` is pushed. For example:
```bash
git tag sdk/typescript/v1.0.0
git push origin sdk/typescript/v1.0.0
```

### Manual Publishing
To manually publish a release version:
1. Increment the version in `package.json` or run `npm version`:
   ```bash
   npm version 1.0.0 --no-git-tag-version
   ```
2. Configure authentication and publish:
   ```bash
   npm config set @nativebpm:registry https://gitlab.com/api/v4/projects/nativebpm%2Fsdk/packages/npm/
   npm config set -- //gitlab.com/api/v4/projects/nativebpm%2Fsdk/packages/npm/:_authToken your_personal_access_or_deploy_token
   npm publish
   ```

