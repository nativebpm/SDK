package main

import (
	"context"
	"fmt"

	"gitlab.com/nativebpm/sdk/go"
)

func main() {
	fmt.Println("=== NativeBPM Go SDK: Workflow as Code ===")
	ctx := context.Background()

	// 1. Build workflow as code using Fluent API method chaining
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

	// 2. Deploy and start process definition using the Fluent Client API
	client, err := nativebpm.NewClient("http://localhost:8080", "test-bearer-token")
	if err != nil {
		fmt.Printf("Error creating client: %v\n", err)
		return
	}

	fmt.Println("\nDeploying to NativeBPM engine (JSON AST compiled server-side)...")
	// Deploy process definition directly via Workflow object
	definition, err := client.Definitions().Deploy().
		WithWorkflow(workflow).
		Send(ctx)
	if err != nil {
		fmt.Printf("Note: Local API Engine deployment skipped. Details: %v\n", err)
		return
	}
	fmt.Printf("✓ Deployed process definition (hash: %s)\n", definition.Hash)

	// Start a process instance, initializing variables
	instance, err := client.Instances().Start("native-demo").
		WithBusinessKey("order-5541").
		WithVariable("isUrgent", true). // Process variable evaluated in gateway
		Send(ctx)
	if err != nil {
		fmt.Printf("Error starting instance: %v\n", err)
		return
	}
	fmt.Printf("✓ Started process instance ID: %s (completed: %t)\n", instance.Id, instance.Completed)
}
