import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

@available(macOS 10.15, iOS 13.0, tvOS 13.0, watchOS 6.0, *)
func runExample() async {
    print("=== NativeBPM Swift SDK Example ===")
    
    let client = Client(baseURL: "http://localhost:8080", apiToken: "test-token")
    
    // 1. Build workflow dynamically using Fluent API
    let workflow = Workflow(id: "native-demo", name: "Workflow as Code")
    workflow
        .when(V("isUrgent").eq(true)).then { b in
            b.user("reviewOrder", name: "Review Order Details", options: ["assignee": "sales_representative"])
        }.else { b in
            b.service("notifyCustomer", name: "Send Confirmation Email", topic: "email_topic")
        }
    
    do {
        print("Deploying workflow definition...")
        let definition = try await client.deploy(workflow)
        print("✓ Deployed process definition (hash: \(definition.hash))")
        
        print("Starting process instance...")
        let instance = try await client.instances().start("native-demo")
            .withBusinessKey("order-5541")
            .withVariable("isUrgent", AnyCodable(true))
            .send()
        print("✓ Started process instance ID: \(instance.id) (completed: \(instance.completed))")
        
    } catch {
        print("Note: Local API Engine deployment skipped. Details: \(error.localizedDescription)")
    }
}

// Start the async task
Task {
    if #available(macOS 10.15, iOS 13.0, tvOS 13.0, watchOS 6.0, *) {
        await runExample()
    }
}
