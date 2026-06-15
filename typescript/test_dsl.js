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
  workflow.start()
    .user('task1', 'User Task')
    .if(v('approved').eq(true), (b) => {
      b.service('publish', 'Publish Page', 'publish-topic', (st) => {
        st.wasm('./publish.wasm');
      });
    })
    .else((b) => {
      b.service('reject', 'Notify Reject', 'reject-topic');
    });

  const xml = await workflow.buildXML(wasmPath);
  
  assert.ok(xml.includes('id="ts-closure-process"'), "XML should contain process ID");
  assert.ok(xml.includes('exclusiveGateway id="gw_task1_decision"'), "XML should contain decision gateway");
  assert.ok(xml.includes('serviceTask id="publish"'), "XML should contain publish service task");
  assert.ok(xml.includes('wasmPath="./publish.wasm"'), "XML should contain wasmPath on publish task");
  assert.ok(xml.includes('serviceTask id="reject"'), "XML should contain reject service task");
  
  console.log("✓ TypeScript closure block DSL tests passed!");
}

testDSL().catch(err => {
  console.error("TS DSL test failed:", err);
  process.exit(1);
});
