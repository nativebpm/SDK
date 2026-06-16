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
}
