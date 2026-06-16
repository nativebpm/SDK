package main

import (
	"context"
	"fmt"
	"os"

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

	// 2. Pre-compile the WebAssembly builder core at initialization (e.g. from local core.wasm.br or raw core.wasm)
	compilerPath := "../../core.wasm" // relative path to compiler binary in Go SDK folder
	if _, err := os.Stat(compilerPath); os.IsNotExist(err) {
		compilerPath = "core.wasm"
	}
	
	fmt.Printf("Initializing compiler from path: %s\n", compilerPath)
	_, err := workflow.WithCompilerPath(ctx, compilerPath)
	if err != nil {
		fmt.Printf("Note: Compiler file path not found. Falling back to embedded Go compiler. Details: %v\n", err)
	} else {
		defer workflow.Close(ctx)
	}

	// 3. Compile the workflow AST to standard BPMN 2.0 XML
	bpmnXML, err := workflow.BuildXML(ctx)
	if err != nil {
		fmt.Printf("Error compiling workflow: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("✓ Successfully compiled WASM workflow AST to BPMN 2.0 XML.")
	
	// Print a small snippet of the XML
	if len(bpmnXML) > 300 {
		fmt.Printf("XML snippet:\n%s...\n", bpmnXML[:300])
	} else {
		fmt.Printf("XML output:\n%s\n", bpmnXML)
	}
}
