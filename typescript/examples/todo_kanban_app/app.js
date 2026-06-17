// Simulated NativeBPM Engine state & task database
let tasks = [
  {
    id: "NB-TASK-101",
    title: "Design process engine auth bindings",
    desc: "Implement JWT validation middleware and API keys support for microservices communication.",
    assignee: "alice_smith",
    priority: "High",
    status: "done",
    approved: true,
    history: ["todo", "inProgress", "review", "done"]
  },
  {
    id: "NB-TASK-102",
    title: "Optimize hot warmup JIT latency",
    desc: "Verify memory leaks and speed up initial preheating times for WASM sandboxed executors.",
    assignee: "john_doe",
    priority: "Urgent",
    status: "review",
    approved: null,
    history: ["todo", "inProgress", "review"]
  },
  {
    id: "NB-TASK-103",
    title: "Support flat configs in client models",
    desc: "Refactor nested properties parsing inside Go and TypeScript SDK workflow builders.",
    assignee: "bob_jones",
    priority: "Normal",
    status: "inProgress",
    approved: null,
    history: ["todo", "inProgress"]
  }
];

let selectedTaskId = null;

// Initialize app elements
document.addEventListener("DOMContentLoaded", () => {
  logEngine("SYSTEM", "Engine preheated. Deploying process definitions...");
  logEngine("POST", "/definitions/deploy (schema: 'kanban-task-lifecycle')");
  logEngine("OK", "Workflow deployed successfully (hash: 8f9b2c3a5e1d7f6c)");

  renderTasks();
  initViewSwitcher();
  initDslSwitcher();
  initModals();
  updateSvgHighlights();

  // Clear logs button
  document.getElementById("btn-clear-logs").addEventListener("click", () => {
    document.getElementById("terminal-logs").innerHTML = "";
  });
});

// Helper: Format & output logs to simulated terminal
function logEngine(type, message) {
  const terminal = document.getElementById("terminal-logs");
  const time = new Date().toLocaleTimeString();
  
  let typeClass = "log-sys";
  if (type === "POST") typeClass = "log-post";
  if (type === "OK") typeClass = "log-ok";
  if (type === "ERROR") typeClass = "log-err";

  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.innerHTML = `<span class="log-time">[${time}]</span><span class="${typeClass}">[${type}]</span> ${message}`;
  
  terminal.appendChild(entry);
  terminal.scrollTop = terminal.scrollHeight;
}

// Render Kanban board columns & Todo list table
function renderTasks() {
  // Clear lists
  const lists = {
    todo: document.getElementById("list-todo"),
    inProgress: document.getElementById("list-progress"),
    review: document.getElementById("list-review"),
    done: document.getElementById("list-done")
  };

  Object.values(lists).forEach(list => list.innerHTML = "");

  // Clear counters
  const counts = { todo: 0, inProgress: 0, review: 0, done: 0 };

  // Render cards
  tasks.forEach(task => {
    counts[task.status]++;
    const listEl = lists[task.status];
    
    if (listEl) {
      const card = document.createElement("div");
      card.className = "task-card";
      card.draggable = true;
      card.dataset.id = task.id;
      
      let priorityClass = "";
      if (task.priority === "Urgent") priorityClass = "badge-urgent";
      if (task.priority === "High") priorityClass = "badge-high";

      // Render inner content
      let actionHtml = "";
      if (task.status === "todo") {
        actionHtml = `<button class="card-btn primary" onclick="moveTask('${task.id}', 'inProgress')">Start Dev</button>`;
      } else if (task.status === "inProgress") {
        actionHtml = `<button class="card-btn primary" onclick="moveTask('${task.id}', 'review')">Submit PR</button>`;
      } else if (task.status === "review") {
        actionHtml = `<button class="card-btn primary" onclick="openReviewModal('${task.id}')">Review PR</button>`;
      }

      card.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.desc}</p>
        <div class="task-meta">
          <span class="task-id">${task.id}</span>
          <span class="badge ${priorityClass}">${task.priority}</span>
          <span class="badge assignee-badge">👤 ${task.assignee}</span>
        </div>
        <div class="card-actions">
          ${actionHtml}
        </div>
      `;

      // Set active highlight on click
      card.addEventListener("click", () => {
        selectedTaskId = task.id;
        updateActiveCardHighlight(task.id);
        updateSvgHighlights();
      });

      // Add HTML5 Drag & Drop handlers
      card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", task.id);
        card.style.opacity = "0.5";
      });

      card.addEventListener("dragend", () => {
        card.style.opacity = "1";
      });

      listEl.appendChild(card);
    }
  });

  // Set counters
  document.getElementById("count-todo").innerText = counts.todo;
  document.getElementById("count-progress").innerText = counts.inProgress;
  document.getElementById("count-review").innerText = counts.review;
  document.getElementById("count-done").innerText = counts.done;

  // Render table view
  const tableBody = document.getElementById("todo-table-body");
  const emptyState = document.getElementById("todo-empty-state");
  tableBody.innerHTML = "";

  if (tasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
    
    tasks.forEach(task => {
      const tr = document.createElement("tr");
      let stageLabel = task.status;
      if (task.status === "inProgress") stageLabel = "In Progress";
      if (task.status === "review") stageLabel = "Code Review";
      
      let actionBtn = "";
      if (task.status === "todo") {
        actionBtn = `<button class="btn btn-secondary btn-sm" onclick="moveTask('${task.id}', 'inProgress')">Start Dev</button>`;
      } else if (task.status === "inProgress") {
        actionBtn = `<button class="btn btn-secondary btn-sm" onclick="moveTask('${task.id}', 'review')">Submit PR</button>`;
      } else if (task.status === "review") {
        actionBtn = `<button class="btn btn-secondary btn-sm" onclick="openReviewModal('${task.id}')">Review</button>`;
      } else {
        actionBtn = `<span class="badge">Completed</span>`;
      }

      tr.innerHTML = `
        <td class="task-id">${task.id}</td>
        <td><strong>${task.title}</strong></td>
        <td><span class="status-dot status-${task.status}"></span> ${stageLabel}</td>
        <td>👤 ${task.assignee}</td>
        <td>${task.history[task.history.length - 1] || "created"}</td>
        <td>${actionBtn}</td>
      `;
      tableBody.appendChild(tr);
    });
  }
}

// Highlight active card border
function updateActiveCardHighlight(activeId) {
  document.querySelectorAll(".task-card").forEach(card => {
    if (card.dataset.id === activeId) {
      card.style.borderColor = "var(--color-primary)";
      card.style.boxShadow = "0 0 10px rgba(99, 102, 241, 0.15)";
    } else {
      card.style.borderColor = "var(--border-color)";
      card.style.boxShadow = "none";
    }
  });
}

// Move task state in workflow & log simulate calls
window.moveTask = function(taskId, nextStatus) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  const previousStatus = task.status;
  task.status = nextStatus;
  task.history.push(nextStatus);

  logEngine("POST", `/instances/${task.id}/tasks/complete (current_step: '${previousStatus}')`);
  logEngine("OK", `Transitioned task ${task.id} to state '${nextStatus}'`);

  selectedTaskId = task.id;
  renderTasks();
  updateSvgHighlights();
}

// Open Code Review Decision dialog
window.openReviewModal = function(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  selectedTaskId = taskId;
  document.getElementById("review-task-title").innerText = task.title;
  document.getElementById("review-task-assignee").innerText = task.assignee;
  document.getElementById("modal-review").classList.add("active");
  
  updateSvgHighlights();
}

// BPMN SVG Process flow highlights based on selected/active task status
function updateSvgHighlights() {
  // Clear all active/completed classes from SVG nodes & lines
  const nodes = ["node-start", "node-todo", "node-inProgress", "node-review", "node-gateway", "node-done"];
  const lines = ["line-start-todo", "line-todo-progress", "line-progress-review", "line-review-gateway", "line-gateway-done", "line-gateway-progress"];

  nodes.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.setAttribute("class", el.getAttribute("class").replace(/\b(active|completed)\b/g, "").trim());
  });

  lines.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.setAttribute("class", el.getAttribute("class").replace(/\b(active|completed)\b/g, "").trim());
  });

  // Get selected task
  const task = tasks.find(t => t.id === selectedTaskId) || tasks[tasks.length - 1];
  if (!task) return;

  // Render nodes status
  const current = task.status;

  // Set completed statuses up to current step
  const history = task.history;
  
  if (history.includes("todo")) {
    document.getElementById("node-start").classList.add("completed");
    document.getElementById("line-start-todo").classList.add("completed");
    document.getElementById("node-todo").classList.add("completed");
  }
  if (history.includes("inProgress")) {
    document.getElementById("line-todo-progress").classList.add("completed");
    document.getElementById("node-inProgress").classList.add("completed");
  }
  if (history.includes("review")) {
    document.getElementById("line-progress-review").classList.add("completed");
    document.getElementById("node-review").classList.add("completed");
  }
  if (history.includes("done")) {
    document.getElementById("line-review-gateway").classList.add("completed");
    document.getElementById("node-gateway").classList.add("completed");
    document.getElementById("line-gateway-done").classList.add("completed");
    document.getElementById("node-done").classList.add("completed");
  }

  // Set active element classes
  if (current === "todo") {
    document.getElementById("node-todo").classList.add("active");
    document.getElementById("line-start-todo").classList.add("active");
  } else if (current === "inProgress") {
    document.getElementById("node-inProgress").classList.add("active");
    document.getElementById("line-todo-progress").classList.add("active");
  } else if (current === "review") {
    document.getElementById("node-review").classList.add("active");
    document.getElementById("line-progress-review").classList.add("active");
  } else if (current === "done") {
    document.getElementById("node-done").classList.add("active");
    document.getElementById("line-gateway-done").classList.add("active");
  }
}

// Initialize layout toggle view switcher
function initViewSwitcher() {
  const btnKanban = document.getElementById("btn-kanban");
  const btnTodoList = document.getElementById("btn-todolist");
  const viewKanban = document.getElementById("view-kanban-container");
  const viewTodo = document.getElementById("view-todolist-container");

  btnKanban.addEventListener("click", () => {
    btnKanban.classList.add("active");
    btnTodoList.classList.remove("active");
    viewKanban.classList.add("active");
    viewTodo.classList.remove("active");
  });

  btnTodoList.addEventListener("click", () => {
    btnTodoList.classList.add("active");
    btnKanban.classList.remove("active");
    viewTodo.classList.add("active");
    viewKanban.classList.remove("active");
  });
}

// Initialize DSL Tabs
function initDslSwitcher() {
  const tabs = document.querySelectorAll(".dsl-tab-btn");
  const codeBlocks = {
    ts: document.getElementById("code-ts"),
    go: document.getElementById("code-go")
  };

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const lang = tab.dataset.lang;
      Object.values(codeBlocks).forEach(block => block.classList.remove("active"));
      codeBlocks[lang].classList.add("active");
    });
  });
}

// Initialize Modals open/close handlers
function initModals() {
  const modalNewTask = document.getElementById("modal-task");
  const btnNewTask = document.getElementById("btn-new-task");
  const btnCloseTask = document.getElementById("btn-close-modal");
  const btnCancelTask = document.getElementById("btn-cancel-task");
  const formTask = document.getElementById("form-task");

  // Open task modal
  btnNewTask.addEventListener("click", () => {
    modalNewTask.classList.add("active");
  });

  // Close task modal
  const closeModal = () => modalNewTask.classList.remove("active");
  btnCloseTask.addEventListener("click", closeModal);
  btnCancelTask.addEventListener("click", closeModal);

  // Submit task form
  formTask.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("task-title").value;
    const desc = document.getElementById("task-desc").value;
    const developer = document.getElementById("task-developer").value;
    const priority = document.getElementById("task-priority").value;
    
    const newTask = {
      id: `NB-TASK-${100 + tasks.length + 1}`,
      title,
      desc,
      assignee: developer,
      priority,
      status: "todo",
      approved: null,
      history: ["todo"]
    };

    tasks.push(newTask);
    selectedTaskId = newTask.id;

    logEngine("POST", `/instances/start (process: 'kanban-task-lifecycle', businessKey: '${newTask.id}')`);
    logEngine("OK", `Process started successfully. Active task token: 'todo'`);

    renderTasks();
    updateSvgHighlights();
    closeModal();
    formTask.reset();
  });

  // Review modal actions
  const modalReview = document.getElementById("modal-review");
  const btnApprove = document.getElementById("btn-review-approve");
  const btnReject = document.getElementById("btn-review-reject");

  const closeReviewModal = () => modalReview.classList.remove("active");

  btnApprove.addEventListener("click", () => {
    const task = tasks.find(t => t.id === selectedTaskId);
    if (task) {
      task.approved = true;
      task.status = "done";
      task.history.push("done");
      
      logEngine("POST", `/instances/${task.id}/tasks/complete (gateway: 'approved == true')`);
      logEngine("OK", `Code review approved. Task ${task.id} finalized successfully.`);
      
      renderTasks();
      updateSvgHighlights();
    }
    closeReviewModal();
  });

  btnReject.addEventListener("click", () => {
    const task = tasks.find(t => t.id === selectedTaskId);
    if (task) {
      task.approved = false;
      task.status = "inProgress";
      task.history.push("inProgress"); // Loops back to In Progress
      
      logEngine("POST", `/instances/${task.id}/tasks/complete (gateway: 'approved == false')`);
      logEngine("ERROR", `Code review rejected. Process token loopback to 'inProgress' triggered!`);

      // Run dynamic visual pulse animation on loopback path line
      const loopLine = document.getElementById("line-gateway-progress");
      if (loopLine) {
        loopLine.classList.add("active");
        setTimeout(() => {
          loopLine.classList.remove("active");
        }, 3000);
      }

      renderTasks();
      updateSvgHighlights();
    }
    closeReviewModal();
  });
}

// Drag over & Drop column handlers
document.querySelectorAll(".kanban-column").forEach(column => {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    column.style.background = "rgba(255, 255, 255, 0.03)";
  });

  column.addEventListener("dragleave", () => {
    column.style.background = "rgba(255, 255, 255, 0.01)";
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.style.background = "rgba(255, 255, 255, 0.01)";
    const taskId = e.dataTransfer.getData("text/plain");
    const targetStatus = column.dataset.status;

    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== targetStatus) {
      if (targetStatus === "review" && task.status !== "inProgress") {
        logEngine("ERROR", `Transition failed: must complete 'inProgress' developer coding before submitting to review.`);
        return;
      }
      if (targetStatus === "done" && task.status !== "review") {
        logEngine("ERROR", `Transition failed: must get approval in Code Review before moving to Done.`);
        return;
      }
      
      if (targetStatus === "review") {
        openReviewModal(taskId);
      } else {
        moveTask(taskId, targetStatus);
      }
    }
  });
});
