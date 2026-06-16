package com.nativebpm.client

import java.io.IOException

fun main() {
    println("=== NativeBPM Kotlin SDK Example ===")

    val client = Client("http://localhost:8080", "test-token")
    
    val bpmnXml = """
        <?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Definitions_1">
          <bpmn:process id="native-demo" isExecutable="true">
            <bpmn:startEvent id="start"/>
          </bpmn:process>
        </bpmn:definitions>
    """.trimIndent()

    try {
        println("Deploying workflow definition...")
        val definition = client.definitions().deploy()
            .withID("native-demo")
            .withName("Workflow as Code")
            .withBPMN(bpmnXml)
            .send()
        println("✓ Deployed process definition (hash: ${definition.hash})")

        println("Starting process instance...")
        val instance = client.instances().start("native-demo")
            .withBusinessKey("order-5541")
            .withVariable("isUrgent", true)
            .send()
        println("✓ Started process instance ID: ${instance.id} (completed: ${instance.completed})")
        
    } catch (e: Exception) {
        println("Note: Local API Engine deployment skipped. Details: ${e.message}")
    }
}
