# Example: Telegram Leave Request Bot (Spec-First & Loop Engineering)

A **full working example** demonstrating the NativeBPM Autonomous Expert methodology:

- ✅ **Spec-First Pipeline** — JSON Schema forms declared in DMN, not in the bot
- ✅ **State Management** — all state in the engine; bot is a pure function of the BPMN step
- ✅ **Host Functions** — Telegram messages sent via `topic=telegram_notify`, not raw HTTP
- ✅ **S3 constraint** — binary attachments stored in S3; only URL enters the process payload
- ✅ **11 automated tests** — cover all business scenarios without a live engine
- ✅ **loopstate.md** — external memory for the Loop Engineering orchestrator

---

## Process Flow

```
[Telegram /leave]
       │
       ▼
[BusinessRuleTask] resolveSubmitForm
  → DMN resolves JSON Schema for stage="submit"
  → stores result in ${active_form_schema}
       │
       ▼
[UserTask] submitLeave
  → Bot renders ${active_form_schema} as interactive form to employee
  → Employee fills: leave_type, start_date, end_date, reason, attachment_url (S3)
       │
       ▼
[ServiceTask] notifyManager  (topic: telegram_notify → Host Function)
  → Engine calls Telegram Bot API via registered Host Function
  → Message sent to ${manager_telegram_id}
       │
       ▼
[BusinessRuleTask] resolveReviewForm
  → DMN resolves JSON Schema for stage="review"
       │
       ▼
[UserTask] managerReview
  → Bot renders review form to manager
  → Manager sets: approved=true/false, comment
       │
       ▼
[ExclusiveGateway] approved?
   ├──[approved == true]──► [ServiceTask] notifyApproved ──► [EndEvent] Leave Approved
   └──[default]────────────► [ServiceTask] notifyRejected ──► [EndEvent] Leave Rejected
```

---

## Architecture Constraints (from AGENTS.md)

| Rule | Implementation |
|---|---|
| No XML BPMN | Fluent Builder API only (`buildLeaveRequestProcess()`) |
| No state in bot | All variables stored in engine; bot calls `GET /tasks` on each update |
| No raw HTTP to Telegram | `ServiceTask(topic: "telegram_notify")` → registered Host Function |
| No binary in payload | `attachment_url` holds S3 URL; bot uploads file to S3 first |
| Spec-First | JSON Schema forms live in DMN rules, resolved dynamically |

---

## Files

| File | Purpose |
|---|---|
| `main.go` | Workflow definition + deploy + lifecycle simulation |
| `main_test.go` | 11 automated tests — all business scenarios in-memory |
| `loopstate.md` | External memory log for the Loop Engineering orchestrator |

---

## Running the Tests (Definition of Done)

```bash
# From the sdk/go directory — compiles the SDK and example
go build ./...

# Run all 11 scenario tests (no engine required)
go test ./examples/telegram_leave_request/... -v

# Run against a live engine
NATIVEBPM_URL=http://localhost:8080 NATIVEBPM_TOKEN=your-token \
  go run ./examples/telegram_leave_request/main.go
```

---

## Key SDK Patterns Used

### 1. Fluent Workflow Builder

```go
wf := nativebpm.NewWorkflow("leave-request-bot", "Telegram Leave Request Bot")

wf.
    BusinessRule("resolveSubmitForm", "Resolve Submit Form", "leave_forms", dmnOptions).
    User("submitLeave", "Submit Leave", nativebpm.M{
        "candidateGroups": "employees",
        "inputSchema":     "${active_form_schema}",  // ← DMN-resolved, never hardcoded
    }).
    Service("notifyManager", "Notify Manager", "telegram_notify", nativebpm.M{
        "template": "...",
        "chat_id":  "${manager_telegram_id}",        // ← from process context
    }).
    When(nativebpm.V("approved").Eq(true)).
    Then(func(b *nativebpm.Branch) {
        b.Service(...).End("endApproved", "Leave Approved")
    }).
    Else(func(b *nativebpm.Branch) {
        b.Service(...).End("endRejected", "Leave Rejected")
    })
```

### 2. Deploy & Start

```go
client, _ := nativebpm.NewClient(engineURL, apiToken)

definition, _ := client.Deploy(ctx, wf)

instance, _ := client.Instances().
    Start("leave-request-bot").
    WithBusinessKey("leave-2024-alice-001").
    WithVariable("telegram_user_id", "alice").
    WithVariable("stage", "submit").
    Send(ctx)
```

### 3. Complete a Task (bot receives callback)

```go
client.Instances().
    CompleteTask(instance.Id).
    WithNodeID("submitLeave").
    WithVariable("leave_type", "annual").
    WithVariable("attachment_url", "https://s3.example.com/docs/cert.pdf"). // S3 URL only!
    Send(ctx)
```
