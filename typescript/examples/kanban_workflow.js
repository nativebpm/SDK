import { Workflow, Client, v } from '../dist/index.js';

export async function run() {
  console.log("=== NativeBPM TS SDK: Kanban Task Lifecycle Workflow ===");

  // 1. Build a Kanban process definition
  // Process: To Do -> In Progress (Dev) -> Review (QA) -> (If Rejected -> back to In Progress) -> Done
  const workflow = new Workflow('kanban-task-lifecycle', 'Kanban Task Lifecycle');
  
  workflow
    // Initial stage: task created and placed in the backlog / To Do list
    .user('todo', 'Task in Backlog', ut => {
      ut.candidateGroups('developers');
    })
    // Second stage: developer takes the task (In Progress)
    .user('inProgress', 'Work on Task', ut => {
      ut.assignee('${developer}'); // Dynamic assignee set at runtime
    })
    // Third stage: task is moved to review (QA / Code Review)
    .user('review', 'Code Review', ut => {
      ut.candidateGroups('reviewers');
    })
    // Decision gateway: check if code review was approved
    .when(v('approved').eq(false))
    .then(flow => {
      // Loop back-edge: Rejecting the task returns it to 'inProgress' (using the same ID)
      console.log("Adding rejection path loopback to 'inProgress'...");
      flow.service('notifyRejection', 'Notify Rejection', 'alerts_topic')
          .user('inProgress', 'Work on Task'); // Implicit back-edge
    })
    .else(flow => {
      // Success path: Approved task is completed and archived
      flow.service('notifyApproval', 'Notify Approval', 'alerts_topic')
          .end('done', 'Task Completed');
    });

  // 2. Deploy and start using Fluent Client
  const client = new Client("http://localhost:8080", "test-bearer-token");

  console.log("\nDeploying Kanban workflow to NativeBPM engine...");
  try {
    const definition = await client.deploy(workflow);
    console.log(`✓ Kanban workflow deployed successfully (hash: ${definition.hash})`);

    // Start a process instance for a specific task
    const instance = await client.instances().start("kanban-task-lifecycle")
      .withBusinessKey("task-1024")
      .withVariable("developer", "john_doe")
      .withVariable("approved", false) // Will loop back to 'inProgress' on first review
      .send();
      
    console.log(`✓ Started Kanban process instance ID: ${instance.id}`);
  } catch (error) {
    console.log(`Note: Local engine deploy skipped. Details: ${error.message || error}`);
  }
}

if (import.meta.url.endsWith(process.argv[1])) {
  run();
}
