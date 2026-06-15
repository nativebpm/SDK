import { Workflow } from './dist/index.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as assert from 'node:assert';
import * as zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const wasmPath = path.resolve(__dirname, 'src/core.wasm');

async function testBuilder() {
  console.log("Running TypeScript workflow builder tests...");

  const workflow = new Workflow('ts-process', 'TS Process');
  workflow.startEvent('start');
  workflow.serviceTask('task1', 'Service Task', 'my-topic', { wasm: './payment.wasm' });
  workflow.endEvent('end', 'End');
  workflow.sequenceFlow('start', 'task1');

  // Verify compilation with raw wasm path
  const xmlRaw = await workflow.buildXML(wasmPath);
  assert.ok(xmlRaw.includes('id="ts-process"'), "XML should contain process ID");
  assert.ok(xmlRaw.includes('wasmPath="./payment.wasm"'), "XML should contain wasmPath");
  console.log("✓ buildXML with raw path passed");

  // Verify compilation with Uint8Array buffer directly
  const wasmBuffer = fs.readFileSync(wasmPath);
  const xmlBuffer = await workflow.buildXML(wasmBuffer);
  assert.ok(xmlBuffer.includes('id="ts-process"'), "XML should contain process ID");
  console.log("✓ buildXML with Uint8Array buffer passed");

  // Verify Brotli compression auto-decompression
  const brBuffer = zlib.brotliCompressSync(wasmBuffer);
  const xmlBr = await workflow.buildXML(brBuffer);
  assert.ok(xmlBr.includes('id="ts-process"'), "XML should contain process ID");
  console.log("✓ buildXML with Brotli compressed buffer passed");

  // Verify Gzip compression auto-decompression
  const gzBuffer = zlib.gzipSync(wasmBuffer);
  const xmlGz = await workflow.buildXML(gzBuffer);
  assert.ok(xmlGz.includes('id="ts-process"'), "XML should contain process ID");
  console.log("✓ buildXML with Gzip compressed buffer passed");

  // Verify constructor pre-compilation
  const wfConstructor = new Workflow('ts-init-process', 'TS Init Process', wasmPath);
  wfConstructor.startEvent('start');
  wfConstructor.endEvent('end', 'End');
  wfConstructor.sequenceFlow('start', 'end');
  const xmlInit = await wfConstructor.buildXML();
  assert.ok(xmlInit.includes('id="ts-init-process"'), "XML should contain process ID");
  console.log("✓ buildXML with constructor pre-compilation passed");

  // Verify BusinessRuleTask / DMN Rules Compiler
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

  const xmlDmn = await wfDmn.buildXML(wasmPath);
  assert.ok(xmlDmn.includes('businessRuleTask id="ruleTask"'), "XML should contain businessRuleTask");
  assert.ok(xmlDmn.includes('decisionRef="determine_discount"'), "XML should contain decisionRef");
  assert.ok(xmlDmn.includes('resultVariable="discountVar"'), "XML should contain resultVariable");
  assert.ok(xmlDmn.includes('mapDecisionResult="singleEntry"'), "XML should contain mapDecisionResult");
  console.log("✓ buildXML with businessRuleTask DMN compiler passed");

  // 6. Memory profiling & load test
  console.log("Starting load test & memory profiling for TypeScript SDK...");
  const startMem = process.memoryUsage().rss / (1024 * 1024);
  console.log(`Baseline Memory: ${startMem.toFixed(2)} MB`);

  for (let i = 0; i < 200; i++) {
    const wf = new Workflow(`ts-load-${i}`, `TS Load ${i}`);
    wf.startEvent('start');
    wf.endEvent('end', 'End');
    wf.sequenceFlow('start', 'end');
    await wf.buildXML(wasmPath);
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
