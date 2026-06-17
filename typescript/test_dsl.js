import { Workflow, v } from './dist/index.js';
import * as assert from 'node:assert';

async function testDSL() {
  console.log("Running TypeScript closure block DSL tests...");

  const workflow = new Workflow('ts-closure-process', 'TS Closure Process');
  workflow
    .user('task1', 'User Task')
    .when(v('approved').eq(true))
    .then((flow) => {
      flow.service('publish', 'Publish Page', 'publish-topic', { wasm: './publish.wasm' });
    })
    .otherwise((flow) => {
      flow.service('reject', 'Notify Reject', 'reject-topic');
    });

  const ast = workflow.toAST();
  
  assert.strictEqual(ast.id, 'ts-closure-process', "AST should contain process ID");
  
  const gatewayNode = ast.nodes.find(n => n.id === 'gw_task1_decision');
  assert.ok(gatewayNode, "AST should contain decision gateway");
  assert.strictEqual(gatewayNode.type, 'exclusiveGateway');

  const publishNode = ast.nodes.find(n => n.id === 'publish');
  assert.ok(publishNode, "AST should contain publish service task");
  assert.strictEqual(publishNode.wasmPath, './publish.wasm', "AST should contain wasmPath on publish task");

  const rejectNode = ast.nodes.find(n => n.id === 'reject');
  assert.ok(rejectNode, "AST should contain reject service task");
  
  console.log("✓ TypeScript closure block DSL tests passed!");
}

async function testImplicitBackEdges() {
  console.log("Running TypeScript implicit back-edges tests...");

  const workflow = new Workflow('ts-back-edge-process', 'TS Back Edge Process');
  workflow
    .user('step1', 'User Step 1')
    .user('step2', 'User Step 2')
    .when(v('approved').eq(false))
    .then((flow) => {
      flow.user('step1', 'User Step 1');
    })
    .otherwise((flow) => {
      flow.end('end', 'End Process');
    });

  const ast = workflow.toAST();

  const step1Nodes = ast.nodes.filter(n => n.id === 'step1');
  assert.strictEqual(step1Nodes.length, 1, "Should declare userTask 'step1' exactly once");

  const flowsToStep1 = ast.flows.filter(f => f.target === 'step1');
  assert.ok(flowsToStep1.length > 0, "Should contain back-edge sequence flow targeting step1");

  console.log("✓ TypeScript implicit back-edges tests passed!");
}

async function main() {
  await testDSL();
  await testImplicitBackEdges();
}

main().catch(err => {
  console.error("TS DSL test failed:", err);
  process.exit(1);
});
