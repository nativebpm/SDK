# Loop State Log — Telegram Leave Request Bot Example

This file is the **external memory** of the Loop Engineering orchestrator.
Updated after every iteration so the checker can track progress outside the model's context window.

---

### Iteration #1

- **Current hypothesis / task:** Create full working example — Telegram Leave Request Bot.
- **Generation / build status:** ❌ Build failed.
  - Error: `instance.Status undefined (type *nativebpm.ProcessInstance has no field or method Status)`
  - Root cause: Generated model uses `Completed bool` field, not a `Status string`.
    The spec (`openapi.yaml`) was checked: `ProcessInstance` has `completed: boolean`.
- **Process graph test result:** N/A — build failed before tests.
- **Next step:** Fix field reference: `.Status` → `.Completed`. Spec was NOT changed (no BC break).

---

### Iteration #2

- **Current hypothesis / task:** Fix `ProcessInstance.Status` → `ProcessInstance.Completed` in main.go.
- **Generation / build status:** ✅ `go build ./...` exit code 0.
- **Process graph test result:** ✅ ALL 12 scenarios PASS (`go test ./... -v`):
  - ✅ TestWorkflowCompilesToValidJSON
  - ✅ TestWorkflowID
  - ✅ TestRequiredNodesExist
  - ✅ TestSubmitLeaveUserTaskConfig
  - ✅ TestManagerNotificationUsesHostFunction
  - ✅ TestApprovalPath
  - ✅ TestRejectionPath
  - ✅ TestNoOrphanNodes
  - ✅ TestAttachmentMustBeS3URL
  - ✅ TestDMNFormSchemasAreValidJSON
  - ✅ TestStartAndEndEvents
  - ✅ TestVariableExpressionHelpers
- **Next step:** **DONE** — Definition of Done satisfied. Ready for human review (PR).
