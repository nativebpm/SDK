package main

import (
	"context"
	"fmt"

	"gitlab.com/nativebpm/sdk/go"
)

func main() {
	fmt.Println("=== NativeBPM Go SDK: Workflow with Guest WASM Plugins ===")
	ctx := context.Background()

	// 1. Build workflow as code using Fluent API method chaining
	workflow := nativebpm.NewWorkflow("wasm-demo", "Workflow with Guest WASM Plugins")

	// Chain starting from first service task (auto-start will prepend start event)
	workflow.
		Service("calculate", "Calculate Totals", "payment_topic", nativebpm.M{"wasm": "./calculate_total.wasm"}).
		AI("aiCheck", "AI Fraud Guard", nativebpm.M{
			"provider":    "google",
			"model":       "gemini-2.5-flash",
			"prompt":      "Analyze transaction for fraud: ${orderAmount}",
			"resultVar":   "isFraudulent",
		}).
		When(nativebpm.V("isFraudulent").Eq(true)).
		Then(func(flow *nativebpm.Branch) {
			flow.User("userTask", "Manual Fraud Approval", nativebpm.M{"assignee": "security_officer"})
		}).
		Else(func(flow *nativebpm.Branch) {
			// empty default else
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

	// Start a process instance with input variables
	instance, err := client.Instances().Start("wasm-demo").
		WithBusinessKey("tx-8837").
		WithVariable("orderAmount", 2500).
		Send(ctx)
	if err != nil {
		fmt.Printf("Error starting instance: %v\n", err)
		return
	}
	fmt.Printf("✓ Started process instance ID: %s (completed: %t)\n", instance.Id, instance.Completed)
}
