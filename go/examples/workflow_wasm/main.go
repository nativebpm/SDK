package main

import (
	"context"
	"fmt"
	"os"

	"gitlab.com/nativebpm/sdk/go"
)

func main() {
	fmt.Println("=== NativeBPM Go SDK: Workflow as Code ===")
	ctx := context.Background()

	// 1. Build workflow as code (without WASM tasks) using Fluent API method chaining
	workflow := nativebpm.NewWorkflow("native-demo", "Workflow as Code")

	// Chain starting with dynamic when condition (auto-start will prepend start event)
	workflow.
		When(nativebpm.V("isUrgent").Eq(true)).
		Then(func(flow *nativebpm.Branch) {
			flow.User("reviewOrder", "Review Order Details", nativebpm.M{"assignee": "sales_representative"})
		}).
		Else(func(flow *nativebpm.Branch) {
			flow.Service("notifyCustomer", "Send Confirmation Email", "email_topic")
		})

	// Compile the workflow AST to standard BPMN 2.0 XML using the default embedded Go engine
	bpmnXML, err := workflow.BuildXML(ctx)
	if err != nil {
		fmt.Printf("Error compiling workflow: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("✓ Successfully compiled native workflow AST to BPMN 2.0 XML.")
	
	// Print a small snippet of the XML
	if len(bpmnXML) > 300 {
		fmt.Printf("XML snippet:\n%s...\n", bpmnXML[:300])
	} else {
		fmt.Printf("XML output:\n%s\n", bpmnXML)
	}

	// 2. Deploy and start process definition using the Fluent Client API
	client, err := nativebpm.NewClient("http://localhost:8080", "test-bearer-token")
	if err != nil {
		fmt.Printf("Error creating client: %v\n", err)
		return
	}

	fmt.Println("\nDeploying to NativeBPM engine...")
	// Deploy process definition
	definition, err := client.Definitions().Deploy().
		WithID("native-demo").
		WithName("Workflow as Code").
		WithBPMN([]byte(bpmnXML)).
		Send(ctx)
	if err != nil {
		fmt.Printf("Note: Local API Engine deployment skipped (ensure local server is running on :8080). Details: %v\n", err)
		return
	}
	fmt.Printf("✓ Deployed process definition (hash: %s)\n", definition.Hash)

	// Start a process instance with input variables
	instance, err := client.Instances().Start("native-demo").
		WithBusinessKey("order-5541").
		WithVariable("customerEmail", "customer@example.com").
		WithVariable("isUrgent", true).
		Send(ctx)
	if err != nil {
		fmt.Printf("Error starting instance: %v\n", err)
		return
	}
	fmt.Printf("✓ Started process instance ID: %s (completed: %t)\n", instance.Id, instance.Completed)
}
