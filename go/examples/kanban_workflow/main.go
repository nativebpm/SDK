package main

import (
	"context"
	"fmt"

	"gitlab.com/nativebpm/sdk/go"
)

func main() {
	fmt.Println("=== NativeBPM Go SDK: Kanban Task Lifecycle Workflow ===")
	ctx := context.Background()

	// DMN rules mapping stage to JSON form schema
	dmnFormsOptions := nativebpm.M{
		"hitPolicy":         "UNIQUE",
		"resultVar":         "active_form_schema",
		"mapDecisionResult": "singleEntry",
		"inputs": []nativebpm.M{
			{"expression": "stage", "type": "string"},
		},
		"outputs": []nativebpm.M{
			{"name": "schema", "type": "string"},
		},
		"rules": []nativebpm.M{
			{
				"inputs": []string{`"todo"`},
				"outputs": []string{`{"type":"object","required":["taskName","priority"],"properties":{"taskName":{"type":"string","title":"Task Name"},"priority":{"type":"string","enum":["low","medium","high"],"title":"Task Priority"}}}`},
			},
			{
				"inputs": []string{`"inProgress"`},
				"outputs": []string{`{"type":"object","required":["taskName","completionDate","developerNotes"],"properties":{"taskName":{"type":"string","title":"Task Name"},"completionDate":{"type":"string","format":"date","title":"Estimated Completion Date"},"developerNotes":{"type":"string","title":"Developer Notes"}}}`},
			},
			{
				"inputs": []string{`"review"`},
				"outputs": []string{`{"type":"object","required":["approved","reviewerComments"],"properties":{"approved":{"type":"boolean","title":"Approved?"},"reviewerComments":{"type":"string","title":"Reviewer Comments"}}}`},
			},
		},
	}

	// 1. Build workflow as code using closure-based DSL and loops
	workflow := nativebpm.NewWorkflow("kanban-task-lifecycle", "Kanban Task Lifecycle")

	workflow.
		// Resolve form schema for the Backlog stage (stage="todo")
		BusinessRule("resolveTodoForm", "Resolve Todo Form", "kanban_forms", dmnFormsOptions).
		// Initial stage: task in Backlog
		User("todo", "Task in Backlog", nativebpm.M{"candidateGroups": "developers", "inputSchema": "${active_form_schema}"}).
		
		// Resolve form schema for Work stage (stage="inProgress")
		BusinessRule("resolveInProgressForm", "Resolve In Progress Form", "kanban_forms", dmnFormsOptions).
		// Developer starts work (In Progress)
		User("inProgress", "Work on Task", nativebpm.M{"assignee": "${developer}", "inputSchema": "${active_form_schema}"}).
		
		// Resolve form schema for Review stage (stage="review")
		BusinessRule("resolveReviewForm", "Resolve Review Form", "kanban_forms", dmnFormsOptions).
		// Move to review phase
		User("review", "Code Review", nativebpm.M{"candidateGroups": "reviewers", "inputSchema": "${active_form_schema}"}).
		
		// Check if task is approved
		When(nativebpm.V("approved").Eq(false)).
		Then(func(flow *nativebpm.Branch) {
			// Loop back-edge path: Notify rejection and return to 'inProgress' (implicit back-edge)
			flow.Service("notifyRejection", "Notify Rejection", "alerts_topic").
				BusinessRule("resolveInProgressFormReentry", "Resolve In Progress Form Reentry", "kanban_forms", dmnFormsOptions).
				User("inProgress", "Work on Task", nativebpm.M{"inputSchema": "${active_form_schema}"})
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
		WithVariable("stage", "todo").
		Send(ctx)
	if err != nil {
		fmt.Printf("Error starting instance: %v\n", err)
		return
	}
	fmt.Printf("✓ Started Kanban process instance ID: %s\n", instance.Id)
}
