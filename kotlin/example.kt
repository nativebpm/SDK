package com.nativebpm.client

import com.nativebpm.client.builder.Workflow
import com.nativebpm.client.builder.Workflow.V

fun main() {
    println("=== NativeBPM Kotlin SDK Example ===")

    // 1. Build workflow dynamically using Workflow as Code Fluent API
    println("🔨 Building workflow dynamically using Fluent API...")
    val workflow = Workflow("native-demo", "Workflow as Code")

    // Chain starting with dynamic when condition (auto-start will prepend start event)
    workflow
        .when(V("isUrgent").eq(true)).then { b ->
            b.user("reviewOrder", "Review Order Details", mapOf("assignee" to "sales_representative"))
        }
        .Else { b ->
            b.service("notifyCustomer", "Send Confirmation Email", "email_topic")
        }

    val client = Client("http://localhost:8080", "test-token")

    try {
        println("Deploying workflow definition...")
        val definition = client.deploy(workflow)
        println("✓ Deployed process definition (hash: ${definition.hash})")

        println("Starting process instance...")
        val instance = client.instances().start(definition.id)
            .withBusinessKey("order-5541")
            .withVariable("isUrgent", true)
            .send()
        println("✓ Started process instance ID: ${instance.id} (completed: ${instance.completed})")
        
    } catch (e: Exception) {
        println("Note: Local API Engine deployment skipped. Details: ${e.message}")
    }
}
