import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

@available(macOS 10.15, iOS 13.0, tvOS 13.0, watchOS 6.0, *)
func runExample() async {
    print("=== NativeBPM Swift SDK Example ===")
    
    let client = Client(baseURL: "http://localhost:8080", apiToken: "test-token")
    
    let bpmnXml = """
        <?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Definitions_1">
          <bpmn:process id="native-demo" isExecutable="true">
            <bpmn:startEvent id="start"/>
          </bpmn:process>
        </bpmn:definitions>
    """
    
    do {
        print("Deploying workflow definition...")
        let definition = try await client.definitions().deploy()
            .withID("native-demo")
            .withName("Workflow as Code")
            .withBPMN(bpmnXml)
            .send()
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
