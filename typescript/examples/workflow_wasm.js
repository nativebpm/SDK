import { Workflow, Client, v } from '../dist/index.js';

export async function run() {
  console.log("=== NativeBPM TS SDK: Workflow as Code ===");

  // 1. Build workflow as code (without WASM tasks) using closure DSL
  const workflow = new Workflow('native-demo', 'Workflow as Code');
  workflow
    .when(v('isUrgent').eq(true))
    .then(flow => {
      flow.user('reviewOrder', 'Review Order Details', ut => {
        ut.assignee('sales_representative');
      });
    })
    .else(flow => {
      flow.service('notifyCustomer', 'Send Confirmation Email', 'email_topic');
    });
  
  // 2. Deploy and start process definition using the Fluent Client API
  const client = new Client("http://localhost:8080", "test-bearer-token");
  
  console.log("\nDeploying to NativeBPM engine (JSON AST compiled server-side)...");
  try {
    // Deploy process definition directly via Workflow object
    const definition = await client.deploy(workflow);
    console.log(`✓ Deployed process definition (hash: ${definition.hash})`);
    
    // Start a process instance with input variables
    const instance = await client.instances().start("native-demo")
      .withBusinessKey("order-5541")
      .withVariable("customerEmail", "customer@example.com")
      .withVariable("isUrgent", true)
      .send();
    console.log(`✓ Started process instance ID: ${instance.id} (completed: ${instance.completed})`);
    
  } catch (error) {
    console.log(`Note: Local API Engine deployment skipped (ensure local server is running on :8080). Details: ${error.message || error}`);
  }
}

// If run directly
if (import.meta.url.endsWith(process.argv[1])) {
  run();
}
