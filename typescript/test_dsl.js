import { Workflow, v } from './dist/index.js';
import * as path from 'node:path';
import * as assert from 'node:assert';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const wasmPath = path.resolve(__dirname, 'src/core.wasm');

async function testDSL() {
  console.log("Running TypeScript closure block DSL tests...");

  const workflow = new Workflow('ts-closure-process', 'TS Closure Process');
  workflow
    .user('task1', 'User Task')
    .when(v('approved').eq(true))
    .then((flow) => {
      flow.service('publish', 'Publish Page', 'publish-topic', (st) => {
        st.wasm('./publish.wasm');
      });
    })
    .otherwise((flow) => {
      flow.service('reject', 'Notify Reject', 'reject-topic');
    });

  const xml = await workflow.buildXML(wasmPath);
  
  assert.ok(xml.includes('id="ts-closure-process"'), "XML should contain process ID");
  assert.ok(xml.includes('exclusiveGateway id="gw_task1_decision"'), "XML should contain decision gateway");
  assert.ok(xml.includes('serviceTask id="publish"'), "XML should contain publish service task");
  assert.ok(xml.includes('wasmPath="./publish.wasm"'), "XML should contain wasmPath on publish task");
  assert.ok(xml.includes('serviceTask id="reject"'), "XML should contain reject service task");
  
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

  const xml = await workflow.buildXML(wasmPath);

  const declCount = (xml.match(/<userTask id="step1"/g) || []).length;
  assert.strictEqual(declCount, 1, "Should declare userTask 'step1' exactly once");
  assert.ok(xml.includes('targetRef="step1"'), "Should contain back-edge sequence flow targeting step1");

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
