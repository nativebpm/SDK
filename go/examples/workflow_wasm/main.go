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

	// Chain starting from the start event
	workflow.
		If(nativebpm.V("isUrgent").Eq(true), func(b *nativebpm.Branch) {
			b.User("reviewOrder", "Review Order Details", func(ut *nativebpm.UserTaskBuilder) {
				ut.Assignee("sales_representative")
			})
		}).
		Else(func(b *nativebpm.Branch) {
			b.Service("notifyCustomer", "Send Confirmation Email", "email_topic")
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
