package main

import (
	"context"
	"fmt"

	"gitlab.com/nativebpm/sdk/go"
)

func main() {
	fmt.Println("=== NativeBPM Go SDK: Kanban Task Lifecycle Workflow ===")
	ctx := context.Background()

	// 1. Build workflow as code using closure-based DSL and loops
	workflow := nativebpm.NewWorkflow("kanban-task-lifecycle", "Kanban Task Lifecycle")

	workflow.
		// Initial stage: task in Backlog
		User("todo", "Task in Backlog", nativebpm.M{"candidateGroups": "developers"}).
		// Developer starts work (In Progress)
		User("inProgress", "Work on Task", nativebpm.M{"assignee": "${developer}"}).
		// Move to review phase
		User("review", "Code Review", nativebpm.M{"candidateGroups": "reviewers"}).
		// Check if task is approved
		When(nativebpm.V("approved").Eq(false)).
		Then(func(flow *nativebpm.Branch) {
			// Loop back-edge path: Notify rejection and return to 'inProgress' (implicit back-edge)
			flow.Service("notifyRejection", "Notify Rejection", "alerts_topic").
				User("inProgress", "Work on Task", nativebpm.M{})
		}).
		Else(func(flow *nativebpm.Branch) {
			// Success path: Complete task
			flow.Service("notifyApproval", "Notify Approval", "alerts_topic").
				End("done", "Task Completed")
		})

	// 2. Deploy and start using Fluent Client
	client, err := nativebpm.NewClient("http://localhost:8080", "test-bearer-token")
	if err != nil {
		fmt.Printf("Error creating client: %v\n", err)
		return
	}

	fmt.Println("\nDeploying Kanban workflow to NativeBPM engine...")
	definition, err := client.Deploy(ctx, workflow)
	if err != nil {
		fmt.Printf("Note: Local engine deploy skipped. Details: %v\n", err)
		return
	}
	fmt.Printf("✓ Kanban workflow deployed successfully (hash: %s)\n", definition.Hash)

	// Start a process instance for a specific task
	instance, err := client.Instances().Start("kanban-task-lifecycle").
		WithBusinessKey("task-1024").
		WithVariable("developer", "john_doe").
		WithVariable("approved", false).
		Send(ctx)
	if err != nil {
		fmt.Printf("Error starting instance: %v\n", err)
		return
	}
	fmt.Printf("✓ Started Kanban process instance ID: %s\n", instance.Id)
}
