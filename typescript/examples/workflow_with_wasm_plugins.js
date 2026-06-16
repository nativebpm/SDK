import { Workflow, Client, v } from '../dist/index.js';

export async function run() {
  console.log("=== NativeBPM TS SDK: Workflow with Guest WASM Plugins ===");

  // 1. Build workflow as code using closure DSL
  const workflow = new Workflow('wasm-demo', 'Workflow with Guest WASM Plugins', './src/core.wasm');
  workflow
    .service('calculate', 'Calculate Totals', 'payment_topic', st => {
      st.wasm('./calculate_total.wasm');
    })
    .ai('aiCheck', 'AI Fraud Guard', ait => {
      ait.provider('google')
        .model('gemini-2.5-flash')
        .prompt('Analyze transaction for fraud: ${orderAmount}')
        .resultVar('isFraudulent');
    })
    .when(v('isFraudulent').eq(true))
    .then(flow => {
      flow.user('userTask', 'Manual Fraud Approval', ut => {
        ut.assignee('security_officer');
      });
    })
    .else(flow => {
      // empty default else
    });
  
  // Compile the workflow AST to standard BPMN 2.0 XML using the embedded Go engine
  const bpmnXML = await workflow.buildXML();
  console.log("✓ Successfully compiled WASM workflow AST to BPMN 2.0 XML.");
  
  // 2. Deploy and start process definition using the Fluent Client API
  const client = new Client("http://localhost:8080", "test-bearer-token");
  
  console.log("\nDeploying to NativeBPM engine...");
  try {
    // Deploy process definition
    const definition = await client.definitions().deploy()
      .withID("wasm-demo")
      .withName("Workflow with Guest WASM Plugins")
      .withBPMN(bpmnXML)
      .send();
    console.log(`✓ Deployed process definition (hash: ${definition.hash})`);
    
    // Start a process instance with input variables
    const instance = await client.instances().start("wasm-demo")
      .withBusinessKey("tx-8837")
      .withVariable("orderAmount", 2500)
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
