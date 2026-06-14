<?php

require_once __DIR__ . '/../vendor/autoload.php';

use NativeBPM\Client\Builder\Workflow;

echo "=== NativeBPM PHP SDK: Workflow with Guest WASM Plugins ===\n";

// 1. Build workflow dynamically using Workflow as Code Fluent API
echo "🔨 Building workflow dynamically using Fluent API...\n";
$workflow = new Workflow("wasm-demo", "Workflow with Guest WASM Plugins");

// Chain starting from start event
$workflow->start("start")
    ->service("calculate", "Calculate Totals", "payment_topic", function($st) {
        $st->wasm("./calculate_total.wasm");
    })
    ->ai("aiCheck", "AI Fraud Guard", function($ait) {
        $ait->provider("google")
            ->model("gemini-2.5-flash")
            ->prompt('Analyze transaction for fraud: ${orderAmount}')
            ->resultVar("isFraudulent");
    })
    ->if('${isFraudulent == true}', function($b) {
        $b->user("userTask", "Manual Fraud Approval", function($ut) {
            $ut->assignee("security_officer");
        })->end("end_fraud", "Process Finished");
    })
    ->else(function($b) {
        $b->end("end_ok", "Process Finished");
    });

$bpmnXml = $workflow->buildXML();
echo "✓ Successfully compiled WASM workflow AST to BPMN 2.0 XML.\n";

// Print a snippet of generated XML
if (strlen($bpmnXml) > 300) {
    echo "XML snippet:\n" . substr($bpmnXml, 0, 300) . "...\n";
} else {
    echo "XML output:\n" . $bpmnXml . "\n";
}
