//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:nativebpm_client/api.dart';
import 'package:test/test.dart';


/// tests for DefaultApi
void main() {
  // final instance = DefaultApi();

  group('tests for DefaultApi', () {
    // Claim human task
    //
    // Claim a task for a specific user assignee.
    //
    //Future<TaskRecord> claimTask(String id, ClaimTaskRequest claimTaskRequest) async
    test('test claimTask', () async {
      // TODO
    });

    // Complete a wait state / task activity in process instance
    //
    // Complete a specific active node/wait state within a process instance.
    //
    //Future<ProcessInstance> completeInstanceTask(String id, CompleteInstanceTaskRequest completeInstanceTaskRequest) async
    test('test completeInstanceTask', () async {
      // TODO
    });

    // Complete human task
    //
    // Complete a claimed human task, providing results variables.
    //
    //Future<ProcessInstance> completeTask(String id, { CompleteTaskRequest completeTaskRequest }) async
    test('test completeTask', () async {
      // TODO
    });

    // Create webhook target
    //
    // Register a new webhook target.
    //
    //Future<WebhookRecord> createWebhook(CreateWebhookRequest createWebhookRequest) async
    test('test createWebhook', () async {
      // TODO
    });

    // Delete webhook target
    //
    // Delete a webhook configuration.
    //
    //Future<ResolveIncident200Response> deleteWebhook(String id) async
    test('test deleteWebhook', () async {
      // TODO
    });

    // Deploy process definition
    //
    // Deploy a new BPMN 2.0 XML process definition.
    //
    //Future<ProcessDefinition> deployDefinition({ MultipartFile file }) async
    test('test deployDefinition', () async {
      // TODO
    });

    // Get process instance
    //
    // Fetch a single process instance state by instance ID.
    //
    //Future<ProcessInstance> getInstance(String id) async
    test('test getInstance', () async {
      // TODO
    });

    // Get process instance execution history
    //
    // Fetch the audit trail / execution history log for a process instance.
    //
    //Future<List<HistoryRecord>> getInstanceHistory(String id) async
    test('test getInstanceHistory', () async {
      // TODO
    });

    // List process definitions
    //
    // Retrieve a list of all deployed process definitions.
    //
    //Future<List<ProcessDefinition>> listDefinitions() async
    test('test listDefinitions', () async {
      // TODO
    });

    // List incidents for process instance
    //
    // Get active execution incidents (failures) for a specific process instance.
    //
    //Future<List<IncidentRecord>> listIncidents(String id) async
    test('test listIncidents', () async {
      // TODO
    });

    // List process instances
    //
    // Retrieve a list of active and completed process instances.
    //
    //Future<List<ProcessInstance>> listInstances() async
    test('test listInstances', () async {
      // TODO
    });

    // List human/user tasks
    //
    // Query tasks matching criteria (assignee, candidateGroup, status).
    //
    //Future<List<TaskRecord>> listTasks({ String assignee, String candidateGroup, String status }) async
    test('test listTasks', () async {
      // TODO
    });

    // List deliveries for webhook
    //
    // Get delivery audit logs and history queue for a specific webhook target.
    //
    //Future<List<WebhookDeliveryRecord>> listWebhookDeliveries(String id) async
    test('test listWebhookDeliveries', () async {
      // TODO
    });

    // List configured outgoing webhooks
    //
    // List all registered webhook targets.
    //
    //Future<List<WebhookRecord>> listWebhooks() async
    test('test listWebhooks', () async {
      // TODO
    });

    // Resolve process incident
    //
    // Resolve a process execution failure incident, triggering retry/resume.
    //
    //Future<ResolveIncident200Response> resolveIncident(String id, String incidentId) async
    test('test resolveIncident', () async {
      // TODO
    });

    // Resume process instance
    //
    // Manually trigger execution resumption of a process instance.
    //
    //Future<ProcessInstance> resumeInstance(String id) async
    test('test resumeInstance', () async {
      // TODO
    });

    // Start process instance
    //
    // Start a new workflow process instance by process definition ID.
    //
    //Future<ProcessInstance> startInstance(String id, { StartInstanceRequest startInstanceRequest }) async
    test('test startInstance', () async {
      // TODO
    });

    // Test webhook target
    //
    // Send a test ping event delivery to verification URL.
    //
    //Future<ResolveIncident200Response> testWebhook(String id) async
    test('test testWebhook', () async {
      // TODO
    });

    // Update webhook target
    //
    // Modify the configuration of an existing webhook.
    //
    //Future<WebhookRecord> updateWebhook(String id, CreateWebhookRequest createWebhookRequest) async
    test('test updateWebhook', () async {
      // TODO
    });

  });
}
