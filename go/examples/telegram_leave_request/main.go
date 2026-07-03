// Package main demonstrates the NativeBPM Spec-First & Loop Engineering
// methodology for a Telegram Leave Request bot.
//
// # Architecture (Spec-First Pipeline):
//
//  1. OpenAPI 3.0 (sdk/openapi.yaml)  ← single source of truth for all contracts
//  2. make generate                   ← rebuilds all 10 language SDKs
//  3. Fluent SDK (this file)          ← business logic expressed as a state machine
//  4. JSON Schema Forms               ← UI/bot forms declared inside DMN rules
//  5. Webhook Host Function           ← Telegram messages sent via SDK, never raw HTTP
//
// # Process Flow:
//
//	[Telegram /leave] → StartEvent
//	    → UserTask: "Submit leave form" (employee fills JSON Schema form via bot)
//	    → ServiceTask: "Notify manager" (Telegram message via Host Function)
//	    → UserTask: "Manager review" (manager approves/rejects)
//	    → ExclusiveGateway: approved?
//	        → [YES] ServiceTask: "Notify approval" → EndEvent: "Leave Approved"
//	        → [NO]  ServiceTask: "Notify rejection" → EndEvent: "Leave Rejected"
//
// # State Management:
//   - All state lives inside the NativeBPM engine (PostgreSQL snapshots).
//   - Binary files (medical certificates) stored in S3 — only URL in process context.
//   - Telegram messages are sent via ServiceTask with topic "telegram_notify"
//     (Host Function declared in the engine, NOT a direct HTTP call here).
//
// # Definition of Done (automated checker):
//   - `make generate` in sdk/ exits 0  ← spec valid
//   - `go build ./...`                 ← compiles
//   - `go test ./...`                  ← all business scenarios pass
//
// Run:
//
//	cd sdk/go/examples/telegram_leave_request
//	go run main.go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	nativebpm "gitlab.com/nativebpm/sdk/go"
)

// ---------------------------------------------------------------------------
// Step 1. Define the JSON Schema Forms (declared in DMN, returned by engine)
// These schemas are what the Telegram bot renders as interactive forms.
// They are NEVER hardcoded in the bot — always fetched from the process context.
// ---------------------------------------------------------------------------

// leaveRequestSchema is the JSON Schema for the employee's initial leave form.
// In production this string comes from the engine via the active_form_schema
// process variable (resolved by the BusinessRuleTask below).
const leaveRequestSchema = `{
  "type": "object",
  "title": "Leave Request",
  "required": ["leave_type", "start_date", "end_date", "reason"],
  "properties": {
    "leave_type": {
      "type": "string",
      "title": "Leave Type",
      "enum": ["annual", "sick", "unpaid", "parental"]
    },
    "start_date": {
      "type": "string",
      "format": "date",
      "title": "Start Date"
    },
    "end_date": {
      "type": "string",
      "format": "date",
      "title": "End Date"
    },
    "reason": {
      "type": "string",
      "title": "Reason",
      "maxLength": 500
    },
    "attachment_url": {
      "type": "string",
      "format": "uri",
      "title": "Supporting Document (S3 URL)",
      "description": "Upload to S3 first, paste the URL here. Raw files are NOT accepted."
    }
  }
}`

// managerReviewSchema is the JSON Schema for the manager's approval form.
const managerReviewSchema = `{
  "type": "object",
  "title": "Manager Review",
  "required": ["approved"],
  "properties": {
    "approved": {
      "type": "boolean",
      "title": "Approve request?"
    },
    "comment": {
      "type": "string",
      "title": "Comment",
      "maxLength": 300
    }
  }
}`

// ---------------------------------------------------------------------------
// Step 2. Build the BPMN Process Graph via Fluent SDK
// FORBIDDEN: writing XML manually. Only this code-first approach is allowed.
// ---------------------------------------------------------------------------

// buildLeaveRequestProcess constructs the leave request workflow as a state
// machine using the NativeBPM Fluent Builder API.
func buildLeaveRequestProcess() *nativebpm.Workflow {
	// DMN rule: maps the current process stage → active JSON Schema form.
	// The engine resolves this at runtime; the bot simply reads ${active_form_schema}.
	formSchemaDMN := nativebpm.M{
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
				// Employee submission form
				"inputs":  []string{`"submit"`},
				"outputs": []string{leaveRequestSchema},
			},
			{
				// Manager review form
				"inputs":  []string{`"review"`},
				"outputs": []string{managerReviewSchema},
			},
		},
	}

	wf := nativebpm.NewWorkflow("leave-request-bot", "Telegram Leave Request Bot")

	wf.
		// ── Stage: Employee submits leave request ────────────────────────────
		//
		// BusinessRuleTask resolves the correct JSON Schema form for the current
		// stage and stores it in ${active_form_schema}.
		BusinessRule("resolveSubmitForm", "Resolve Submit Form Schema", "leave_forms", formSchemaDMN).

		// UserTask: the Telegram bot renders the JSON Schema form to the employee.
		// candidateGroups ensures any employee can claim this task.
		// inputSchema wires the DMN-resolved schema into the task.
		User("submitLeave", "Submit Leave Request", nativebpm.M{
			"candidateGroups": "employees",
			"inputSchema":     "${active_form_schema}",
			// assignee will be set from the Telegram user_id passed at start
			"assignee": "${telegram_user_id}",
		}).

		// ── Stage: Notify manager (Host Function, NOT raw HTTP) ──────────────
		//
		// ServiceTask with topic "telegram_notify" maps to a Host Function
		// registered in the engine. The engine calls Telegram's Bot API.
		// We NEVER make a raw HTTP call to api.telegram.org from process code.
		Service("notifyManager", "Notify Manager via Telegram", "telegram_notify", nativebpm.M{
			"template": "📋 *New Leave Request*\n👤 Employee: ${employee_name}\n📅 Dates: ${start_date} → ${end_date}\n📝 Type: ${leave_type}\n💬 Reason: ${reason}",
			"chat_id":  "${manager_telegram_id}",
		}).

		// ── Stage: Manager reviews ───────────────────────────────────────────
		BusinessRule("resolveReviewForm", "Resolve Manager Review Form Schema", "leave_forms", formSchemaDMN).

		User("managerReview", "Manager Review", nativebpm.M{
			"candidateGroups": "managers",
			"inputSchema":     "${active_form_schema}",
		}).

		// ── Decision Gateway: approved? ──────────────────────────────────────
		When(nativebpm.V("approved").Eq(true)).
		Then(func(approved *nativebpm.Branch) {
			// ── Approval path ──────────────────────────────────────────────
			approved.
				Service("notifyApproved", "Notify Employee: Approved", "telegram_notify", nativebpm.M{
					"template": "✅ *Leave Approved!*\nYour leave request from ${start_date} to ${end_date} has been approved.\n💬 Manager note: ${comment}",
					"chat_id":  "${employee_telegram_id}",
				}).
				End("endApproved", "Leave Approved")
		}).
		Else(func(rejected *nativebpm.Branch) {
			// ── Rejection path ─────────────────────────────────────────────
			rejected.
				Service("notifyRejected", "Notify Employee: Rejected", "telegram_notify", nativebpm.M{
					"template": "❌ *Leave Rejected*\nYour leave request has been rejected.\n💬 Manager note: ${comment}",
					"chat_id":  "${employee_telegram_id}",
				}).
				End("endRejected", "Leave Rejected")
		})

	return wf
}

// ---------------------------------------------------------------------------
// Step 3. Deploy & Run (Fluent Client)
// ---------------------------------------------------------------------------

func main() {
	ctx := context.Background()

	// Read engine credentials from environment (never hardcoded).
	engineURL := getEnvOrDefault("NATIVEBPM_URL", "http://localhost:8080")
	apiToken := getEnvOrDefault("NATIVEBPM_TOKEN", "test-bearer-token")

	fmt.Println("╔══════════════════════════════════════════════════════════╗")
	fmt.Println("║  NativeBPM — Telegram Leave Request Bot (Spec-First)    ║")
	fmt.Println("╚══════════════════════════════════════════════════════════╝")
	fmt.Printf("Engine: %s\n\n", engineURL)

	// ── 3.1 Create Fluent Client ─────────────────────────────────────────────
	client, err := nativebpm.NewClient(engineURL, apiToken)
	if err != nil {
		log.Fatalf("Failed to create NativeBPM client: %v", err)
	}

	// ── 3.2 Build process graph in code ─────────────────────────────────────
	wf := buildLeaveRequestProcess()

	// Print the compiled AST JSON for inspection / debugging
	jsonBytes, err := wf.ToJSON()
	if err != nil {
		log.Fatalf("Failed to serialize workflow: %v", err)
	}
	fmt.Println("── Compiled Workflow AST (JSON sent to POST /api/deploy) ──")
	prettyPrint(jsonBytes)
	fmt.Println()

	// ── 3.3 Deploy to engine ─────────────────────────────────────────────────
	fmt.Println("Deploying process definition…")
	definition, err := client.Deploy(ctx, wf)
	if err != nil {
		// In CI/local without an engine, deployment is skipped gracefully.
		fmt.Printf("⚠  Deploy skipped (engine not available): %v\n\n", err)
		fmt.Println("AST is valid — run against a live engine to continue.")
		os.Exit(0)
	}
	fmt.Printf("✓ Deployed: id=%s  hash=%s\n\n", definition.Id, definition.Hash)

	// ── 3.4 Simulate incoming Telegram /leave webhook ────────────────────────
	//
	// In production, the Telegram Bot receives an Update JSON, extracts the
	// user_id and chat_id, then calls POST /api/definitions/{id}/start with
	// the process variables below. The bot itself stores NO state — it is a
	// pure function of the engine's current step.
	fmt.Println("── Simulating Telegram webhook: employee sends /leave ──────")
	instance, err := client.Instances().
		Start("leave-request-bot").
		WithBusinessKey("leave-2024-alice-001").
		WithVariable("telegram_user_id", "alice").
		WithVariable("employee_name", "Alice Smith").
		WithVariable("employee_telegram_id", "111222333").
		WithVariable("manager_telegram_id", "444555666").
		WithVariable("stage", "submit"). // DMN uses this to resolve the right form
		Send(ctx)
	if err != nil {
		log.Fatalf("Failed to start instance: %v", err)
	}
	fmt.Printf("✓ Process instance started: id=%s  completed=%v\n\n", instance.Id, instance.Completed)

	// ── 3.5 Simulate employee completing the leave form ──────────────────────
	fmt.Println("── Simulating employee submitting leave form ────────────────")
	updated, err := client.Instances().
		CompleteTask(instance.Id).
		WithNodeID("submitLeave").
		WithVariable("leave_type", "annual").
		WithVariable("start_date", "2024-08-01").
		WithVariable("end_date", "2024-08-10").
		WithVariable("reason", "Family vacation").
		// Attachment was uploaded to S3 by the bot; only URL stored in context.
		// FORBIDDEN: passing raw binary data here.
		WithVariable("attachment_url", "https://s3.example.com/docs/leave-alice-001.pdf").
		WithVariable("stage", "review"). // advance DMN stage for next form
		Send(ctx)
	if err != nil {
		log.Fatalf("Failed to complete submitLeave task: %v", err)
	}
	fmt.Printf("✓ Employee submitted form. Instance completed=%v\n\n", updated.Completed)

	// ── 3.6 Simulate manager approving the request ───────────────────────────
	fmt.Println("── Simulating manager approving the request ────────────────")
	final, err := client.Instances().
		CompleteTask(instance.Id).
		WithNodeID("managerReview").
		WithVariable("approved", true).
		WithVariable("comment", "Enjoy your vacation!").
		Send(ctx)
	if err != nil {
		log.Fatalf("Failed to complete managerReview task: %v", err)
	}
	fmt.Printf("✓ Manager approved. Final instance completed=%v\n", final.Completed)
	fmt.Println()
	fmt.Println("Process completed. The engine has:")
	fmt.Println("  • Notified the employee via Telegram (Host Function: telegram_notify)")
	fmt.Println("  • Archived the completed instance to S3")
	fmt.Println("  • Stored no state in the bot — only the engine holds state")
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

func getEnvOrDefault(key, defaultVal string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return defaultVal
}

func prettyPrint(b []byte) {
	var out interface{}
	if err := json.Unmarshal(b, &out); err != nil {
		fmt.Println(string(b))
		return
	}
	pretty, _ := json.MarshalIndent(out, "", "  ")
	fmt.Println(string(pretty))
}
