import { Workflow } from './dist/index.js';
import * as assert from 'node:assert';

async function testBuilder() {
  console.log("Running TypeScript workflow builder tests...");

  const workflow = new Workflow('ts-process', 'TS Process');
  workflow.startEvent('start');
  workflow.serviceTask('task1', 'Service Task', 'my-topic', { wasm: './payment.wasm' });
  workflow.endEvent('end', 'End');
  workflow.sequenceFlow('start', 'task1');

  // Verify AST output
  const ast = workflow.toAST();
  assert.strictEqual(ast.id, 'ts-process', "AST should contain process ID");
  assert.strictEqual(ast.name, 'TS Process', "AST should contain process Name");
  
  const task1Node = ast.nodes.find(n => n.id === 'task1');
  assert.ok(task1Node, "AST should contain task1");
  assert.strictEqual(task1Node.wasmPath, './payment.wasm', "AST should contain wasmPath");
  console.log("✓ toAST structure passed");

  // Verify JSON output
  const jsonStr = workflow.toJSON();
  const parsed = JSON.parse(jsonStr);
  assert.strictEqual(parsed.id, 'ts-process');
  console.log("✓ toJSON serialization passed");

  // Verify BusinessRuleTask / DMN Rules AST
  console.log("Running TypeScript business rule task DMN test...");
  const wfDmn = new Workflow('ts-dmn-process', 'TS DMN Process');
  wfDmn.startEvent('start');
  wfDmn.businessRuleTask('ruleTask', 'Determine Discount', 'determine_discount', {
    hitPolicy: 'UNIQUE',
    inputs: [
      { expression: 'membership', type: 'string' },
      { expression: 'age', type: 'number' }
    ],
    outputs: [
      { name: 'discount', type: 'number' }
    ],
    rules: [
      { inputs: ['"gold"', '>= 18'], outputs: ['20.0'] },
      { inputs: ['"silver"', '-'], outputs: ['10.0'] }
    ],
    resultVar: 'discountVar',
    mapDecisionResult: 'singleEntry'
  });
  wfDmn.endEvent('end', 'End');
  wfDmn.sequenceFlow('start', 'ruleTask');
  wfDmn.sequenceFlow('ruleTask', 'end');

  const astDmn = wfDmn.toAST();
  const ruleNode = astDmn.nodes.find(n => n.id === 'ruleTask');
  assert.ok(ruleNode, "AST should contain ruleTask");
  assert.strictEqual(ruleNode.type, 'businessRuleTask');
  assert.strictEqual(ruleNode.decisionRef, 'determine_discount');
  assert.strictEqual(ruleNode.hitPolicy, 'UNIQUE');
  assert.strictEqual(ruleNode.resultVar, 'discountVar');
  assert.strictEqual(ruleNode.mapDecisionResult, 'singleEntry');
  assert.strictEqual(ruleNode.inputs.length, 2);
  assert.strictEqual(ruleNode.outputs.length, 1);
  assert.strictEqual(ruleNode.rules.length, 2);
  console.log("✓ businessRuleTask DMN AST validation passed");

  // Load test & memory profiling
  console.log("Starting load test & memory profiling for TypeScript SDK...");
  const startMem = process.memoryUsage().rss / (1024 * 1024);
  console.log(`Baseline Memory: ${startMem.toFixed(2)} MB`);

  for (let i = 0; i < 200; i++) {
    const wf = new Workflow(`ts-load-${i}`, `TS Load ${i}`);
    wf.startEvent('start');
    wf.endEvent('end', 'End');
    wf.sequenceFlow('start', 'end');
    wf.toJSON();
    if ((i + 1) % 50 === 0) {
      const currentMem = process.memoryUsage().rss / (1024 * 1024);
      console.log(`Iteration ${i + 1}/200 - Memory: ${currentMem.toFixed(2)} MB (Delta: ${(currentMem - startMem).toFixed(2)} MB)`);
    }
  }

  const endMem = process.memoryUsage().rss / (1024 * 1024);
  console.log(`Final Memory: ${endMem.toFixed(2)} MB (Delta: ${(endMem - startMem).toFixed(2)} MB)`);
  if (endMem - startMem > 15.0) {
    throw new Error("Memory leak detected in TypeScript SDK!");
  }

  console.log("All TypeScript workflow builder tests completed successfully!");
}

testBuilder().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
