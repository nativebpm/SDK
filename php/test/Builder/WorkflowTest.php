<?php

namespace NativeBPM\Client\Test\Builder;

use PHPUnit\Framework\TestCase;
use NativeBPM\Client\Builder\Workflow;

class WorkflowTest extends TestCase
{
    private function getWasmBytes(): string
    {
        $path = __DIR__ . '/../../lib/core.wasm';
        if (!file_exists($path)) {
            throw new \Exception("core.wasm not found at $path");
        }
        return file_get_contents($path);
    }

    public function testWorkflowXmlGeneration()
    {
        echo "Running PHP SDK workflow compilation test...\n";
        $workflow = new Workflow("test-process", "Test Process Schema");

        $workflow->startEvent("start");

        $workflow->serviceTask("task1", "Service Task 1", "service-topic")
            ->wasm("./my_task.wasm");

        $workflow->exclusiveGateway("gateway", "Join/Split");

        $workflow->userTask("userTask", "User Task Approve")
            ->assignee("boss");

        $workflow->endEvent("end", "Process Completed");

        // Connect them
        $workflow->sequenceFlow("start", "task1");
        $workflow->sequenceFlow("task1", "gateway");
        $workflow->sequenceFlowWithCondition("gateway", "userTask", '${isApproved == true}');
        $workflow->sequenceFlowWithCondition("gateway", "end", '${isApproved == false}');
        $workflow->sequenceFlow("userTask", "end");

        $xml = $workflow->buildXML();
        self::assertNotNull($xml);
        self::assertStringContainsString("id=\"test-process\"", $xml);
        self::assertStringContainsString("name=\"Test Process Schema\"", $xml);
        self::assertStringContainsString("<startEvent id=\"start\"", $xml);
        self::assertStringContainsString("<serviceTask id=\"task1\" name=\"Service Task 1\"", $xml);
        self::assertStringContainsString("topic=\"service-topic\"", $xml);
        self::assertStringContainsString("wasmPath=\"./my_task.wasm\"", $xml);
        self::assertStringContainsString("<userTask id=\"userTask\" name=\"User Task Approve\"", $xml);
        self::assertStringContainsString("assignee=\"boss\"", $xml);
        self::assertStringContainsString("<exclusiveGateway id=\"gateway\" name=\"Join/Split\"", $xml);
        self::assertStringContainsString("isApproved == true", $xml);
        self::assertStringContainsString("isApproved == false", $xml);
        self::assertStringContainsString("<endEvent id=\"end\" name=\"Process Completed\"", $xml);
        echo "✓ PHP SDK assertions passed successfully!\n";
    }

    public function testCompressedFormats()
    {
        echo "Running PHP SDK compressed formats test...\n";
        $rawBytes = $this->getWasmBytes();

        // 1. Gzip
        $gzBytes = gzencode($rawBytes);

        // 2. Zip
        $tempFile = tempnam(sys_get_temp_dir(), 'wasm_zip');
        $zip = new \ZipArchive();
        if ($zip->open($tempFile, \ZipArchive::CREATE) === true) {
            $zip->addFromString('core.wasm', $rawBytes);
            $zip->close();
        }
        $zipBytes = file_get_contents($tempFile);
        unlink($tempFile);

        $workflow = new Workflow("compressed-test", "Compressed Test");
        $workflow->startEvent("start")->next("end");
        $workflow->endEvent("end", "End");

        $xmlGz = $workflow->buildXML($gzBytes);
        self::assertStringContainsString("id=\"compressed-test\"", $xmlGz);
        echo "✓ PHP SDK successfully compiled process using Gzip compressed bytes.\n";

        $xmlZip = $workflow->buildXML($zipBytes);
        self::assertStringContainsString("id=\"compressed-test\"", $xmlZip);
        echo "✓ PHP SDK successfully compiled process using Zip compressed bytes.\n";
    }

    public function testConstructorCompilation()
    {
        echo "Running PHP SDK constructor compilation test...\n";
        $rawBytes = $this->getWasmBytes();
        $workflow = new Workflow("init-test", "Init Test", $rawBytes);
        $workflow->startEvent("start")->next("end");
        $workflow->endEvent("end", "End");

        $xml = $workflow->buildXML();
        self::assertStringContainsString("id=\"init-test\"", $xml);
        echo "✓ PHP SDK constructor compilation verified successfully.\n";
    }

    public function testBusinessRuleTask()
    {
        echo "Running PHP SDK business rule task test...\n";
        $workflow = new Workflow("dmn-test", "DMN Test Process");

        $workflow->startEvent("start")
            ->next("ruleTask");

        $workflow->businessRuleTask("ruleTask", "Determine Discount", "determine_discount")
            ->hitPolicy("UNIQUE")
            ->input("membership", "string")
            ->input("age", "number")
            ->output("discount", "number")
            ->rule()
                ->when("membership", "gold")
                ->when("age", ">= 18")
                ->then("discount", 20.0)
            ->rule()
                ->when("membership", "silver")
                ->then("discount", 10.0)
            ->resultVariable("discountVar")
            ->mapDecisionResult("singleEntry")
            ->next("end");

        $workflow->endEvent("end", "End");

        $xml = $workflow->buildXML();
        self::assertNotNull($xml);
        self::assertStringContainsString("businessRuleTask id=\"ruleTask\"", $xml);
        self::assertStringContainsString("decisionRef=\"determine_discount\"", $xml);
        self::assertStringContainsString("resultVariable=\"discountVar\"", $xml);
        self::assertStringContainsString("mapDecisionResult=\"singleEntry\"", $xml);
        echo "✓ PHP SDK business rule task verified successfully!\n";
    }

    public function testClosureDsl()
    {
        echo "Running PHP SDK closure DSL test...\n";
        $workflow = new Workflow("test-process-dsl", "Test Process DSL");

        $workflow->user("task1", "User Task 1", function($ut) {
                $ut->assignee("admin");
            })
            ->when(Workflow::v('is_urgent')->eq(true))->then(function($b) {
                $b->service("task2", "Urgent Task", "urgent_topic");
            })
            ->otherwise(function($b) {
                $b->service("task3", "Normal Task", "normal_topic");
            });

        $xml = $workflow->buildXML();
        self::assertNotNull($xml);
        self::assertStringContainsString("id=\"test-process-dsl\"", $xml);
        self::assertStringContainsString("<startEvent id=\"start\"", $xml);
        self::assertStringContainsString("<userTask id=\"task1\"", $xml);
        self::assertStringContainsString("assignee=\"admin\"", $xml);
        self::assertStringContainsString("<serviceTask id=\"task2\"", $xml);
        self::assertStringContainsString("<serviceTask id=\"task3\"", $xml);
        echo "✓ PHP SDK closure DSL assertions passed successfully!\n";
    }
}

