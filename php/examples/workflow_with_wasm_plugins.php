<?php

require_once __DIR__ . '/../vendor/autoload.php';

use NativeBPM\Client\Builder\Workflow;
use NativeBPM\Client\Configuration;
use NativeBPM\Client\Api\DefaultApi;
use NativeBPM\Client\Model\StartInstanceRequest;

echo "=== NativeBPM PHP SDK: Workflow with Guest WASM Plugins ===\n";

// 1. Build workflow dynamically using Workflow as Code Fluent API
echo "🔨 Building workflow dynamically using Fluent API...\n";
$workflow = new Workflow("wasm-demo", "Workflow with Guest WASM Plugins");

// Chain starting from first service task
$workflow->start()
    ->service("calculate", "Calculate Totals", "payment_topic", ["wasmPath" => "./calculate_total.wasm"])
    ->ai("aiCheck", "AI Fraud Guard", [
        "provider" => "google",
        "model" => "gemini-2.5-flash",
        "prompt" => 'Analyze transaction for fraud: ${orderAmount}',
        "resultVar" => "isFraudulent"
    ])
    ->when(Workflow::V('isFraudulent')->eq(true))->then(function($b) {
        $b->user("userTask", "Manual Fraud Approval", ["assignee" => "security_officer"]);
    })
    ->else(function($b) {
        // empty branch (will auto-route to end event)
    });

// 2. Deploy and start process definition using the REST API client
$config = Configuration::getDefaultConfiguration()
    ->setHost("http://localhost:8080")
    ->setApiKey("Authorization", "Bearer test-bearer-token");

$api = new DefaultApi(new GuzzleHttp\Client(), $config);

echo "\nDeploying to NativeBPM engine (JSON AST compiled server-side)...\n";

try {
    // Deploy process definition directly via JSON AST
    $definition = $api->deployWorkflow($workflow);
    echo "✓ Deployed process definition (hash: " . $definition->getHash() . ")\n";

    // Start a process instance with input variables
    $startRequest = new StartInstanceRequest();
    $startRequest->setInstanceId(sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    ));
    $startRequest->setBusinessKey("tx-8837");
    $startRequest->setVariables([
        "orderAmount" => 2500
    ]);

    $instance = $api->startInstance($definition->getId(), $startRequest);
    echo "✓ Started process instance ID: " . $instance->getId() . " (completed: " . ($instance->getCompleted() ? 'true' : 'false') . ")\n";

} catch (Exception $e) {
    echo "Note: Local API Engine deployment skipped (ensure local server is running on :8080). Details: " . $e->getMessage() . "\n";
}
