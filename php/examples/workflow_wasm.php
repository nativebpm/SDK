<?php

require_once __DIR__ . '/../vendor/autoload.php';

use NativeBPM\Client\Builder\Workflow;

echo "=== NativeBPM PHP SDK: Workflow as Code ===\n";

// 1. Build workflow dynamically using Workflow as Code Fluent API
echo "🔨 Building workflow dynamically using Fluent API...\n";
$workflow = new Workflow("native-demo", "Workflow as Code");

// Chain starting with dynamic if statement (auto-start will prepend start event)
$workflow->when(Workflow::V('isUrgent')->eq(true))->then(function($b) {
        $b->user("reviewOrder", "Review Order Details", function($ut) {
            $ut->assignee("sales_representative");
        });
    })
    ->else(function($b) {
        $b->service("notifyCustomer", "Send Confirmation Email", "email_topic");
    });

$bpmnXml = $workflow->buildXML();
echo "✓ Successfully compiled native workflow AST to BPMN 2.0 XML.\n";

// Print a snippet of generated XML
if (strlen($bpmnXml) > 300) {
    echo "XML snippet:\n" . substr($bpmnXml, 0, 300) . "...\n";
} else {
    echo "XML output:\n" . $bpmnXml . "\n";
}
