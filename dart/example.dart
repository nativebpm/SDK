import 'dart:convert';
import 'package:nativebpm_client/nativebpm_client.dart';

void main() async {
  print('======================================================================');
  print('⚡ NATIVEBPM DART/FLUTTER WORKFLOW AS CODE DEMO ⚡');
  print('======================================================================\n');

  // 1. Build a realistic Order Fulfillment Workflow using the Fluent DSL
  print('🔨 Building "order_fulfillment" workflow using Fluent API...');
  final workflow = Workflow('order_fulfillment', 'Order Fulfillment Process');

  workflow
      .service('check_stock', 'Check Stock Availability', 'stock_topic')
      .when(V('in_stock').eq(true))
      .then((flow) {
        flow
            .service('charge_card', 'Charge Credit Card', 'payment_topic')
            .service('ship_order', 'Ship Order to Customer', 'ship_topic')
            .end('success_end', 'Order Fulfilled');
      })
      .Else((flow) {
        flow
            .service('cancel_order', 'Cancel Order & Notify', 'cancel_topic')
            .end('failed_end', 'Order Failed');
      });

  // 2. Output the compiled AST JSON structure to demonstrate the build result
  print('\n📦 Compiled BPMN AST JSON Structure:');
  const encoder = JsonEncoder.withIndent('  ');
  print(encoder.convert(workflow.toJSON()));
  print('----------------------------------------------------------------------\n');

  // 3. Initialize the Client
  print('🔌 Connecting to NativeBPM Engine...');
  final client = Client('http://localhost:8080', 'demo-token-123');

  try {
    // 4. Deploy the Workflow definition
    print('🚀 Deploying workflow definition to NativeBPM...');
    final definition = await client.deploy(workflow);
    print('✓ Deployment successful!');
    print('  - Definition ID: ${definition.id}');
    print('  - Name:          ${definition.name}');
    print('  - Hash:          ${definition.hash}');
    print('  - Deployed At:   ${definition.deployedAt}\n');

    // 5. Run Scenario 1: Standard Order (In Stock)
    print('----------------------------------------------------------------------');
    print('🏃 RUNNING SCENARIO 1: Standard Order (In Stock)');
    print('----------------------------------------------------------------------');
    final instance1 = await client.instances().start(definition.id)
        .withBusinessKey('order-101')
        .withVariables({
          'item': 'premium_keyboard',
          'price': 120.0,
          'in_stock': true,
        })
        .send();
    print('✓ Process instance started successfully!');
    print('  - Instance ID:   ${instance1.id}');
    print('  - Completed:     ${instance1.completed}\n');

    // 6. Run Scenario 2: Out of Stock Order
    print('----------------------------------------------------------------------');
    print('🏃 RUNNING SCENARIO 2: Out of Stock Order');
    print('----------------------------------------------------------------------');
    final instance2 = await client.instances().start(definition.id)
        .withBusinessKey('order-102')
        .withVariables({
          'item': 'out_of_stock_item',
          'price': 45.0,
          'in_stock': false,
        })
        .send();
    print('✓ Process instance started successfully!');
    print('  - Instance ID:   ${instance2.id}');
    print('  - Completed:     ${instance2.completed}\n');

  } catch (e) {
    print('⚠️ Note: Engine deployment skipped. Details: $e');
    print('  Ensure that a local NativeBPM instance is running on http://localhost:8080.');
  }

  print('======================================================================');
  print('🎉 WORKFLOW AS CODE DEMO COMPLETED 🎉');
  print('======================================================================');
}
