import 'package:nativebpm_client/nativebpm_client.dart';

void main() async {
  print('=== NativeBPM Dart/Flutter SDK Example ===');

  // 1. Build workflow dynamically using Workflow as Code Fluent API
  print('🔨 Building workflow dynamically using Fluent API...');
  final workflow = Workflow('native-demo', 'Workflow as Code');

  // Chain starting with dynamic when condition (auto-start will prepend start event)
  workflow
      .when(V('isUrgent').eq(true))
      .then((flow) {
        flow.user('reviewOrder', 'Review Order Details', {'assignee': 'sales_representative'});
      })
      .Else((flow) {
        flow.service('notifyCustomer', 'Send Confirmation Email', 'email_topic');
      });

  final client = Client('http://localhost:8080', 'test-token');

  try {
    print('Deploying workflow definition...');
    final definition = await client.deploy(workflow);
    print('✓ Deployed process definition (hash: ${definition.hash})');

    print('Starting process instance...');
    final instance = await client.instances().start(definition.id)
        .withBusinessKey('order-5541')
        .withVariable('isUrgent', true)
        .send();
    print('✓ Started process instance ID: ${instance.id} (completed: ${instance.completed})');
  } catch (e) {
    print('Note: Local API Engine deployment skipped. Details: $e');
  }
}
