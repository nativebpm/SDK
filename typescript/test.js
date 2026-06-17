import { Client, Workflow } from "./dist/index.js";
import * as http from "node:http";
import assert from "node:assert";

class MockServer {
  constructor() {
    this.server = http.createServer((req, res) => {
      const auth = req.headers["authorization"];
      if (auth !== "Bearer test-token") {
        res.writeHead(401);
        res.end();
        return;
      }

      let body = "";
      req.on("data", (chunk) => { body += chunk; });
      req.on("end", () => {
        if (req.url === "/api/definitions" && req.method === "GET") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify([{
            hash: "abc",
            id: "test-proc",
            name: "Test Process",
            xml_data: "dGVzdA==",
            deployed_at: "2026-06-11T09:10:00Z"
          }]));
          return;
        }

        if (req.url === "/api/deploy" && req.method === "POST") {
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            hash: "abc",
            id: "test-proc",
            name: "Test Process",
            xml_data: "dGVzdA==",
            deployed_at: "2026-06-11T09:10:00Z"
          }));
          return;
        }

        if (req.url === "/api/definitions/test-proc/start" && req.method === "POST") {
          const reqData = JSON.parse(body);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            id: reqData.instance_id || "00000000-0000-0000-0000-000000000001",
            process_id: "test-proc",
            definition_hash: "abc",
            business_key: reqData.business_key || "key-123",
            state: "{}",
            version: 1,
            completed: false,
            updated_at: "2026-06-11T09:10:00Z",
            tenant_id: "test-tenant"
          }));
          return;
        }

        if (req.url === "/api/instances/00000000-0000-0000-0000-000000000001/complete" && req.method === "POST") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            id: "00000000-0000-0000-0000-000000000001",
            process_id: "test-proc",
            definition_hash: "abc",
            business_key: "key-123",
            state: "{}",
            version: 1,
            completed: true,
            updated_at: "2026-06-11T09:10:00Z",
            tenant_id: "test-tenant"
          }));
          return;
        }

        if (req.url === "/api/tasks/00000000-0000-0000-0000-000000000004/claim" && req.method === "POST") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            id: "00000000-0000-0000-0000-000000000004",
            instance_id: "00000000-0000-0000-0000-000000000001",
            activity_id: "userTask",
            name: "User Approval",
            assignee: "boss",
            candidate_groups: "admin",
            status: "CLAIMED",
            created_at: "2026-06-11T09:10:00Z"
          }));
          return;
        }

        res.writeHead(404);
        res.end();
      });
    });
  }

  start() {
    return new Promise((resolve) => {
      this.server.listen(0, "localhost", () => {
        const addr = this.server.address();
        this.port = addr.port;
        resolve(this.port);
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      this.server.close(() => {
        resolve();
      });
    });
  }
}

async function runTests() {
  const server = new MockServer();
  const port = await server.start();
  console.log(`Mock server started on port ${port}`);

  const client = new Client(`http://localhost:${port}`, "test-token");

  try {
    // 1. Definitions List
    const defs = await client.definitions().list().send();
    assert.strictEqual(defs.length, 1);
    assert.strictEqual(defs[0].id, "test-proc");
    assert.strictEqual(defs[0].name, "Test Process");
    console.log("✓ definitions.list passed");

    // 2. Definitions Deploy
    const workflow = new Workflow("test-proc", "Test Process");
    const newDef = await client.deploy(workflow);
    assert.strictEqual(newDef.id, "test-proc");
    console.log("✓ definitions.deploy passed");

    // 3. Instances Start
    const started = await client.instances().start("test-proc")
      .withInstanceID("00000000-0000-0000-0000-000000000001")
      .withBusinessKey("key-123")
      .withVariable("foo", "bar")
      .send();
    assert.strictEqual(started.id, "00000000-0000-0000-0000-000000000001");
    assert.strictEqual(started.business_key, "key-123");
    console.log("✓ instances.start passed");

    // 4. Instances Complete Task
    const completed = await client.instances().complete("00000000-0000-0000-0000-000000000001")
      .withNodeID("task1")
      .withVariable("isApproved", true)
      .send();
    assert.strictEqual(completed.completed, true);
    console.log("✓ instances.complete passed");

    // 5. Tasks Claim
    const task = await client.tasks().claim("00000000-0000-0000-0000-000000000004")
      .withAssignee("boss")
      .send();
    assert.strictEqual(task.status, "CLAIMED");
    assert.strictEqual(task.assignee, "boss");
    console.log("✓ tasks.claim passed");

    console.log("All TypeScript Client Fluent API tests passed successfully!");
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  } finally {
    await server.stop();
  }
}

runTests();
