import unittest
import threading
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from nativebpm import (
    Client,
    Workflow,
    ProcessDefinition,
    ProcessInstance,
    HistoryRecord,
    IncidentRecord,
    TaskRecord,
    WebhookRecord,
    WebhookDeliveryRecord,
)

class MockHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Suppress logging

    def do_GET(self):
        auth = self.headers.get("Authorization")
        if auth != "Bearer test-token":
            self.send_response(401)
            self.end_headers()
            return

        if self.path == "/api/definitions":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps([{
                "hash": "abc",
                "id": "test-proc",
                "name": "Test Process",
                "xml_data": "dGVzdA==",
                "deployed_at": "2026-06-11T09:10:00Z"
            }]).encode())
            return

        if self.path == "/api/instances":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps([{
                "id": "00000000-0000-0000-0000-000000000001",
                "process_id": "test-proc",
                "definition_hash": "abc",
                "business_key": "key-123",
                "state": "{}",
                "version": 1,
                "completed": False,
                "updated_at": "2026-06-11T09:10:00Z",
                "tenant_id": "test-tenant"
            }]).encode())
            return

        if self.path == "/api/instances/00000000-0000-0000-0000-000000000001":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "id": "00000000-0000-0000-0000-000000000001",
                "process_id": "test-proc",
                "definition_hash": "abc",
                "business_key": "key-123",
                "state": "{}",
                "version": 1,
                "completed": False,
                "updated_at": "2026-06-11T09:10:00Z",
                "tenant_id": "test-tenant"
            }).encode())
            return

        if self.path == "/api/instances/00000000-0000-0000-0000-000000000001/history":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps([{
                "id": "00000000-0000-0000-0000-000000000002",
                "instance_id": "00000000-0000-0000-0000-000000000001",
                "node_id": "start",
                "node_name": "Start",
                "node_type": "startEvent",
                "action": "start",
                "timestamp": "2026-06-11T09:10:00Z"
            }]).encode())
            return

        if self.path == "/api/instances/00000000-0000-0000-0000-000000000001/incidents":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps([{
                "id": "00000000-0000-0000-0000-000000000003",
                "instance_id": "00000000-0000-0000-0000-000000000001",
                "activity_id": "task1",
                "error_message": "failure",
                "attempts_made": 1,
                "resolved": False,
                "created_at": "2026-06-11T09:10:00Z"
            }]).encode())
            return

        if self.path.startswith("/api/tasks"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps([{
                "id": "00000000-0000-0000-0000-000000000004",
                "instance_id": "00000000-0000-0000-0000-000000000001",
                "activity_id": "userTask",
                "name": "User Approval",
                "assignee": "boss",
                "candidate_groups": "admin",
                "status": "CREATED",
                "created_at": "2026-06-11T09:10:00Z"
            }]).encode())
            return

        if self.path == "/api/webhooks":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps([{
                "id": "00000000-0000-0000-0000-000000000005",
                "tenant_id": "test-tenant",
                "url": "http://hook.io",
                "events": ["instance.completed"],
                "is_active": True,
                "enable_audit": False,
                "status": "active",
                "created_at": "2026-06-11T09:10:00Z"
            }]).encode())
            return

        if self.path == "/api/webhooks/00000000-0000-0000-0000-000000000005/deliveries":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps([{
                "id": "00000000-0000-0000-0000-000000000006",
                "webhook_id": "00000000-0000-0000-0000-000000000005",
                "tenant_id": "test-tenant",
                "event_type": "instance.completed",
                "payload": "{}",
                "status": "success",
                "attempts": 1,
                "created_at": "2026-06-11T09:10:00Z"
            }]).encode())
            return

        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        auth = self.headers.get("Authorization")
        if auth != "Bearer test-token":
            self.send_response(401)
            self.end_headers()
            return

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode() if content_length > 0 else ""

        if self.path == "/api/deploy":
            self.send_response(201)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "hash": "abc",
                "id": "test-proc",
                "name": "Test Process",
                "xml_data": "dGVzdA==",
                "deployed_at": "2026-06-11T09:10:00Z"
            }).encode())
            return

        if self.path == "/api/definitions/test-proc/start":
            req_data = json.loads(body)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "id": req_data.get("instance_id") or "00000000-0000-0000-0000-000000000001",
                "process_id": "test-proc",
                "definition_hash": "abc",
                "business_key": req_data.get("business_key") or "key-123",
                "state": "{}",
                "version": 1,
                "completed": False,
                "updated_at": "2026-06-11T09:10:00Z",
                "tenant_id": "test-tenant"
            }).encode())
            return

        if self.path == "/api/instances/00000000-0000-0000-0000-000000000001/complete":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "id": "00000000-0000-0000-0000-000000000001",
                "process_id": "test-proc",
                "definition_hash": "abc",
                "business_key": "key-123",
                "state": "{}",
                "version": 1,
                "completed": True,
                "updated_at": "2026-06-11T09:10:00Z",
                "tenant_id": "test-tenant"
            }).encode())
            return

        if self.path == "/api/instances/00000000-0000-0000-0000-000000000001/resume":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "id": "00000000-0000-0000-0000-000000000001",
                "process_id": "test-proc",
                "definition_hash": "abc",
                "business_key": "key-123",
                "state": "{}",
                "version": 1,
                "completed": False,
                "updated_at": "2026-06-11T09:10:00Z",
                "tenant_id": "test-tenant"
            }).encode())
            return

        if self.path == "/api/instances/00000000-0000-0000-0000-000000000001/incidents/00000000-0000-0000-0000-000000000003/resolve":
            self.send_response(200)
            self.end_headers()
            return

        if self.path == "/api/tasks/00000000-0000-0000-0000-000000000004/claim":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "id": "00000000-0000-0000-0000-000000000004",
                "instance_id": "00000000-0000-0000-0000-000000000001",
                "activity_id": "userTask",
                "name": "User Approval",
                "assignee": "boss",
                "candidate_groups": "admin",
                "status": "CLAIMED",
                "created_at": "2026-06-11T09:10:00Z"
            }).encode())
            return

        if self.path == "/api/tasks/00000000-0000-0000-0000-000000000004/complete":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "id": "00000000-0000-0000-0000-000000000001",
                "process_id": "test-proc",
                "definition_hash": "abc",
                "business_key": "key-123",
                "state": "{}",
                "version": 1,
                "completed": True,
                "updated_at": "2026-06-11T09:10:00Z",
                "tenant_id": "test-tenant"
            }).encode())
            return

        if self.path == "/api/webhooks":
            req_data = json.loads(body)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "id": "00000000-0000-0000-0000-000000000005",
                "tenant_id": "test-tenant",
                "url": req_data["url"],
                "events": req_data["events"],
                "is_active": req_data.get("is_active", True),
                "enable_audit": req_data.get("enable_audit", False),
                "status": "active",
                "created_at": "2026-06-11T09:10:00Z"
            }).encode())
            return

        if self.path == "/api/webhooks/00000000-0000-0000-0000-000000000005/test":
            self.send_response(200)
            self.end_headers()
            return

        self.send_response(404)
        self.end_headers()

    def do_PUT(self):
        auth = self.headers.get("Authorization")
        if auth != "Bearer test-token":
            self.send_response(401)
            self.end_headers()
            return

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode() if content_length > 0 else ""

        if self.path == "/api/webhooks/00000000-0000-0000-0000-000000000005":
            req_data = json.loads(body)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "id": "00000000-0000-0000-0000-000000000005",
                "tenant_id": "test-tenant",
                "url": req_data["url"],
                "events": req_data["events"],
                "is_active": req_data.get("is_active", True),
                "enable_audit": req_data.get("enable_audit", False),
                "status": "active",
                "created_at": "2026-06-11T09:10:00Z"
            }).encode())
            return

        self.send_response(404)
        self.end_headers()

    def do_DELETE(self):
        auth = self.headers.get("Authorization")
        if auth != "Bearer test-token":
            self.send_response(401)
            self.end_headers()
            return

        if self.path == "/api/webhooks/00000000-0000-0000-0000-000000000005":
            self.send_response(200)
            self.end_headers()
            return

        self.send_response(404)
        self.end_headers()


class TestPythonClientFluentAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = HTTPServer(("localhost", 0), MockHandler)
        cls.port = cls.server.server_port
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.client = Client(f"http://localhost:{cls.port}", "test-token")

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()

    def test_definitions(self):
        # List definitions
        defs = self.client.definitions().list().send()
        self.assertEqual(len(defs), 1)
        self.assertEqual(defs[0].id, "test-proc")
        self.assertEqual(defs[0].name, "Test Process")

        # Deploy definition
        workflow = Workflow("test-proc", "Test Process")
        new_def = self.client.deploy(workflow)
        self.assertEqual(new_def.id, "test-proc")

    def test_instances(self):
        # List instances
        insts = self.client.instances().list().send()
        self.assertEqual(len(insts), 1)
        self.assertEqual(str(insts[0].id), "00000000-0000-0000-0000-000000000001")

        # Get instance
        inst = self.client.instances().get("00000000-0000-0000-0000-000000000001").send()
        self.assertEqual(str(inst.id), "00000000-0000-0000-0000-000000000001")

        # Start instance
        started = self.client.instances().start("test-proc")\
            .with_instance_id("00000000-0000-0000-0000-000000000001")\
            .with_business_key("key-123")\
            .with_variable("foo", "bar")\
            .send()
        self.assertEqual(str(started.id), "00000000-0000-0000-0000-000000000001")

        # Complete task in instance
        completed = self.client.instances().complete("00000000-0000-0000-0000-000000000001")\
            .with_node_id("task1")\
            .with_variable("isApproved", True)\
            .send()
        self.assertTrue(completed.completed)

        # Resume instance
        resumed = self.client.instances().resume("00000000-0000-0000-0000-000000000001").send()
        self.assertFalse(resumed.completed)

        # Get history
        hist = self.client.instances().history("00000000-0000-0000-0000-000000000001").send()
        self.assertEqual(len(hist), 1)
        self.assertEqual(hist[0].node_id, "start")

        # List incidents
        incidents = self.client.instances().incidents("00000000-0000-0000-0000-000000000001").send()
        self.assertEqual(len(incidents), 1)
        self.assertEqual(incidents[0].activity_id, "task1")

        # Resolve incident
        self.client.instances().resolve_incident("00000000-0000-0000-0000-000000000001", "00000000-0000-0000-0000-000000000003").send()

    def test_tasks(self):
        # List tasks
        tasks = self.client.tasks().list()\
            .with_assignee("boss")\
            .with_status("CREATED")\
            .send()
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0].assignee, "boss")

        # Claim task
        claimed = self.client.tasks().claim("00000000-0000-0000-0000-000000000004")\
            .with_assignee("boss")\
            .send()
        self.assertEqual(claimed.status, "CLAIMED")

        # Complete task
        inst = self.client.tasks().complete("00000000-0000-0000-0000-000000000004")\
            .with_variable("approved", True)\
            .send()
        self.assertTrue(inst.completed)

    def test_webhooks(self):
        # List webhooks
        hooks = self.client.webhooks().list().send()
        self.assertEqual(len(hooks), 1)
        self.assertEqual(hooks[0].url, "http://hook.io")

        # Create webhook
        created = self.client.webhooks().create()\
            .with_url("http://hook.io")\
            .with_events(["instance.completed"])\
            .send()
        self.assertEqual(created.url, "http://hook.io")

        # Update webhook
        updated = self.client.webhooks().update("00000000-0000-0000-0000-000000000005")\
            .with_url("http://hook.io")\
            .with_events(["instance.completed"])\
            .send()
        self.assertEqual(updated.url, "http://hook.io")

        # Delete webhook
        self.client.webhooks().delete("00000000-0000-0000-0000-000000000005").send()

        # Test webhook
        self.client.webhooks().test("00000000-0000-0000-0000-000000000005").send()

        # Webhook deliveries
        deliveries = self.client.webhooks().deliveries("00000000-0000-0000-0000-000000000005").send()
        self.assertEqual(len(deliveries), 1)
        self.assertEqual(deliveries[0].event_type, "instance.completed")

if __name__ == "__main__":
    unittest.main()
