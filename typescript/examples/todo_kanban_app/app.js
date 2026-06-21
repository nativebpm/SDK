// Mock database for users and tenants
let usersDb = [
  { username: "admin", password: "admin-password-2026", tenantId: "acme_corp", mfa: false, role: "admin" },
  { username: "user", password: "user-password-2026", tenantId: "acme_corp", mfa: false, role: "user" },
  { username: "customer", password: "customer-2026", tenantId: "acme_corp", mfa: false, role: "customer" },
  { username: "l1_agent", password: "l1-agent-2026", tenantId: "acme_corp", mfa: false, role: "l1_support" },
  { username: "l2_engineer", password: "l2-engineer-2026", tenantId: "acme_corp", mfa: false, role: "l2_support" },
  { username: "manager", password: "manager-2026", tenantId: "acme_corp", mfa: false, role: "manager" }
];

// Seed tasks partitioned by tenant ID
let tenantWorkspaces = {
  acme_corp: [
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
  ]
};

// Seed ITIL Incidents partitioned by tenant ID
let tenantIncidents = {
  acme_corp: [
    {
      id: "INC-101",
      title: "VPN gateway connection timeout failures",
      desc: "Remote developers report continuous 504 Gateway Timeouts when attempting to authenticate on the corporate VPN endpoint.",
      priority: "Urgent",
      status: "New",
      assignee: null,
      reporter: "customer",
      reactionSLA: 30,
      reactionSLAMax: 30,
      resolutionSLA: 90,
      resolutionSLAMax: 90,
      reactionSlaBreached: false,
      resolutionSlaBreached: false,
      history: ["New"],
      reactionTimeSpent: null,
      resolutionTimeSpent: null,
      createdTime: Date.now() - 5000
    },
    {
      id: "INC-102",
      title: "Production database replica replication latency",
      desc: "PostgreSQL read-only replica shows replication delay growing past 600 seconds, affecting read query caches on the analytics console.",
      priority: "High",
      status: "Assigned",
      assignee: "l1_agent",
      reporter: "customer",
      reactionSLA: 0,
      reactionSLAMax: 60,
      resolutionSLA: 150,
      resolutionSLAMax: 180,
      reactionSlaBreached: false,
      resolutionSlaBreached: false,
      history: ["New", "Assigned"],
      reactionTimeSpent: 15,
      resolutionTimeSpent: null,
      createdTime: Date.now() - 30000
    }
  ]
};

let currentSession = null;
let selectedTaskId = null;
let selectedIncidentId = null;
let currentView = "kanban"; // kanban, todolist, servicedesk
let queueFilter = "all";
let mfaStepUser = null; // Temporary state for multi-step sign in

// Initialize app elements
document.addEventListener("DOMContentLoaded", () => {
  initAuthSwitcher();
  initAuthForms();
  checkSession();

  // Clear logs button
  document.getElementById("btn-clear-logs").addEventListener("click", () => {
    document.getElementById("terminal-logs").innerHTML = "";
  });

  // Logout button
  document.getElementById("btn-logout").addEventListener("click", handleLogout);

  // SLA background ticking loop (1s resolution)
  setInterval(tickSLATimers, 1000);
});

// Check if a session already exists
function checkSession() {
  const sessionData = sessionStorage.getItem("nativebpm_session");
  if (sessionData) {
    currentSession = JSON.parse(sessionData);
    enterDashboard();
  } else {
    document.getElementById("app-container").classList.add("auth-mode");
  }
}

// Custom log print inside simulated terminal
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

// Sign In / Sign Up Tabs switcher
function initAuthSwitcher() {
  const tabSignIn = document.getElementById("tab-signin");
  const tabSignUp = document.getElementById("tab-signup");
  const formSignIn = document.getElementById("form-signin");
  const formSignUp = document.getElementById("form-signup");

  tabSignIn.addEventListener("click", () => {
    tabSignIn.classList.add("active");
    tabSignUp.classList.remove("active");
    formSignIn.classList.add("active");
    formSignUp.classList.remove("active");
  });

  tabSignUp.addEventListener("click", () => {
    tabSignUp.classList.add("active");
    tabSignIn.classList.remove("active");
    formSignUp.classList.add("active");
    formSignIn.classList.remove("active");
  });
}

// Sign In and Sign Up Form submits
function initAuthForms() {
  const formSignIn = document.getElementById("form-signin");
  const formSignUp = document.getElementById("form-signup");
  const signinError = document.getElementById("signin-error");
  const signupError = document.getElementById("signup-error");

  // Sign In submit
  formSignIn.addEventListener("submit", (e) => {
    e.preventDefault();
    signinError.style.display = "none";

    const username = document.getElementById("signin-username").value.trim();
    const password = document.getElementById("signin-password").value;
    const otpInput = document.getElementById("signin-otp").value.trim();

    // Check user credentials
    const user = usersDb.find(u => u.username === username);
    if (!user || user.password !== password) {
      signinError.innerText = "Invalid username or password.";
      signinError.style.display = "block";
      logEngine("ERROR", `Auth failed: Invalid credentials for user '${username}'`);
      return;
    }

    // Handle MFA OTP step
    if (user.mfa && !mfaStepUser) {
      // Prompt for OTP code
      mfaStepUser = user;
      document.getElementById("signin-otp-group").style.display = "block";
      document.getElementById("signin-otp").required = true;
      logEngine("POST", `/login (username: '${username}', client: 'GoTrue')`);
      logEngine("SYSTEM", `Multi-Factor Authentication (MFA) required. Awaiting TOTP code.`);
      return;
    }

    if (user.mfa && mfaStepUser) {
      // Validate OTP code (mocking 6 digits)
      if (otpInput.length !== 6 || isNaN(otpInput)) {
        signinError.innerText = "Invalid TOTP code. Must be 6 digits.";
        signinError.style.display = "block";
        logEngine("ERROR", `MFA failed: Invalid TOTP verification code`);
        return;
      }
      logEngine("SYSTEM", `Validating TOTP code '${otpInput}' against GoTrue directory...`);
    } else {
      logEngine("POST", `/login (username: '${username}', client: 'GoTrue')`);
    }

    // Successful authentication
    currentSession = {
      username: user.username,
      tenantId: user.tenantId,
      mfa: user.mfa
    };
    
    sessionStorage.setItem("nativebpm_session", JSON.stringify(currentSession));
    
    logEngine("OK", `Session created successfully for user '${username}'`);
    logEngine("SYSTEM", `Scaffolding runtime workspace for tenant '${user.tenantId}' ...`);
    
    // Simulating age encryption key derivation
    logEngine("SYSTEM", `Deriving tenant secret symmetric key using passphrase PBKDF2...`);
    logEngine("OK", `Decrypted tenant snapshot database using Age ChaCha20-Poly1305.`);

    enterDashboard();
    
    // Reset inputs
    formSignIn.reset();
    mfaStepUser = null;
    document.getElementById("signin-otp-group").style.display = "none";
  });

  // Sign Up submit
  formSignUp.addEventListener("submit", (e) => {
    e.preventDefault();
    signupError.style.display = "none";

    const username = document.getElementById("signup-username").value.trim();
    const tenantId = document.getElementById("signup-tenant").value.trim().toLowerCase();
    const password = document.getElementById("signup-password").value;
    const mfa = document.getElementById("signup-mfa").checked;

    // Check if username already exists
    if (usersDb.some(u => u.username === username)) {
      signupError.innerText = "Username already exists.";
      signupError.style.display = "block";
      logEngine("ERROR", `Registration failed: Username '${username}' is already taken`);
      return;
    }

    // Register user
    const newUser = { username, password, tenantId, mfa };
    usersDb.push(newUser);

    logEngine("POST", `/register (username: '${username}', tenant: '${tenantId}')`);
    logEngine("SYSTEM", `Registering user credentials in GoTrue DB...`);
    
    // Simulating Age key-pair generation
    logEngine("SYSTEM", `Generating new Age X25519 key-pair for tenant '${tenantId}'...`);
    const mockPublicKey = "age1" + Math.random().toString(36).substring(2, 12) + "qazwsx";
    logEngine("OK", `Workspace key-pair generated. Public: '${mockPublicKey}'`);

    // Scaffold new workspace if tenant doesn't exist
    if (!tenantWorkspaces[tenantId]) {
      tenantWorkspaces[tenantId] = [
        {
          id: `NB-TASK-${tenantId.toUpperCase()}-1`,
          title: `Initialize ${tenantId} workspace`,
          desc: "First default workspace task representing initial setup.",
          assignee: username,
          priority: "Normal",
          status: "todo",
          approved: null,
          history: ["todo"]
        }
      ];
      logEngine("SYSTEM", `Scaffolding empty dataset for new tenant '${tenantId}'`);
    }

    logEngine("OK", `Tenant workspace '${tenantId}' registered successfully.`);

    // Switch to Sign In tab
    document.getElementById("tab-signin").click();
    document.getElementById("signin-username").value = username;
    document.getElementById("signin-password").value = password;
    
    logEngine("SYSTEM", `Please authenticate to access the '${tenantId}' workspace.`);
  });
}

// Redirect view to dashboard
function enterDashboard() {
  document.getElementById("app-container").classList.remove("auth-mode");
  document.getElementById("header-user-badge").innerText = `👤 ${currentSession.username} (${currentSession.tenantId})`;

  logEngine("SYSTEM", `Switched to active workspace: tenant='${currentSession.tenantId}'`);

  // Ensure incident templates database exists for the tenant
  if (!tenantIncidents[currentSession.tenantId]) {
    tenantIncidents[currentSession.tenantId] = [];
  }

  initViewSwitcher();
  initDslSwitcher();
  initModals();
  initQueueFilters();

  // Set default view on login
  setView("kanban");
}

// Handle Logout
function handleLogout() {
  logEngine("SYSTEM", `Destroying session cookies for user '${currentSession.username}'`);
  sessionStorage.removeItem("nativebpm_session");
  currentSession = null;
  selectedTaskId = null;
  mfaStepUser = null;
  
  document.getElementById("app-container").classList.add("auth-mode");
  logEngine("OK", "Logged out. Session destroyed.");
}

// Render Kanban board columns & Todo list table
function renderTasks() {
  if (!currentSession) return;

  const tenantId = currentSession.tenantId;
  const activeTasks = tenantWorkspaces[tenantId] || [];

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
  activeTasks.forEach(task => {
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

  if (activeTasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
    
    activeTasks.forEach(task => {
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
  if (!currentSession) return;

  const tenantId = currentSession.tenantId;
  const activeTasks = tenantWorkspaces[tenantId] || [];
  const task = activeTasks.find(t => t.id === taskId);
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
  if (!currentSession) return;

  const tenantId = currentSession.tenantId;
  const activeTasks = tenantWorkspaces[tenantId] || [];
  const task = activeTasks.find(t => t.id === taskId);
  if (!task) return;

  selectedTaskId = taskId;
  document.getElementById("review-task-title").innerText = task.title;
  document.getElementById("review-task-assignee").innerText = task.assignee;
  document.getElementById("modal-review").classList.add("active");
  
  updateSvgHighlights();
}

// BPMN SVG Process flow highlights based on selected/active task status
function updateSvgHighlights() {
  // 1. Kanban elements
  const kbNodes = ["node-start", "node-todo", "node-inProgress", "node-review", "node-gateway", "node-done"];
  const kbLines = ["line-start-todo", "line-todo-progress", "line-progress-review", "line-review-gateway", "line-gateway-done", "line-gateway-progress"];

  // 2. ServiceDesk elements
  const sdNodes = ["node-sd-start", "node-sd-triage", "node-sd-timer-reaction", "node-sd-l2", "node-sd-investigate", "node-sd-review", "node-sd-gateway", "node-sd-done"];
  const sdLines = ["line-sd-start-triage", "line-sd-triage-investigate", "line-sd-investigate-review", "line-sd-review-gateway", "line-sd-gateway-done", "line-sd-boundary-timer-l2", "line-sd-l2-review", "line-sd-gateway-reopen"];

  // Clear all classes
  kbNodes.concat(sdNodes).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute("class", el.getAttribute("class").replace(/\b(active|completed)\b/g, "").trim());
    }
  });

  kbLines.concat(sdLines).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute("class", el.getAttribute("class").replace(/\b(active|completed)\b/g, "").trim());
    }
  });

  if (!currentSession) return;

  if (currentView === "servicedesk") {
    const tenantId = currentSession.tenantId;
    const incidents = tenantIncidents[tenantId] || [];
    const ticket = incidents.find(i => i.id === selectedIncidentId) || incidents[incidents.length - 1];
    if (!ticket) return;

    const history = ticket.history;
    const current = ticket.status;

    // Start is completed
    document.getElementById("node-sd-start").classList.add("completed");
    document.getElementById("line-sd-start-triage").classList.add("completed");

    if (history.includes("New")) {
      document.getElementById("node-sd-triage").classList.add("completed");
    }
    if (history.includes("Assigned")) {
      document.getElementById("line-sd-triage-investigate").classList.add("completed");
      document.getElementById("node-sd-investigate").classList.add("completed");
    }
    if (history.includes("Resolved")) {
      document.getElementById("line-sd-investigate-review").classList.add("completed");
      document.getElementById("node-sd-review").classList.add("completed");
    }
    if (history.includes("Closed")) {
      document.getElementById("line-sd-review-gateway").classList.add("completed");
      document.getElementById("node-sd-gateway").classList.add("completed");
      document.getElementById("line-sd-gateway-done").classList.add("completed");
      document.getElementById("node-sd-done").classList.add("completed");
    }
    if (history.includes("Escalated")) {
      document.getElementById("node-sd-timer-reaction").classList.add("completed");
      document.getElementById("line-sd-boundary-timer-l2").classList.add("completed");
      document.getElementById("node-sd-l2").classList.add("completed");
      document.getElementById("line-sd-l2-review").classList.add("completed");
    }

    // Active highlights
    if (current === "New") {
      document.getElementById("node-sd-triage").classList.add("active");
      document.getElementById("line-sd-start-triage").classList.add("active");
    } 
    else if (current === "Escalated") {
      document.getElementById("node-sd-timer-reaction").classList.add("active");
      document.getElementById("line-sd-boundary-timer-l2").classList.add("active");
      document.getElementById("node-sd-l2").classList.add("active");
    }
    else if (current === "Assigned") {
      document.getElementById("node-sd-investigate").classList.add("active");
      document.getElementById("line-sd-triage-investigate").classList.add("active");
    }
    else if (current === "Resolved") {
      document.getElementById("node-sd-review").classList.add("active");
      document.getElementById("line-sd-investigate-review").classList.add("active");
    }
    else if (current === "Closed") {
      document.getElementById("node-sd-done").classList.add("active");
      document.getElementById("line-sd-gateway-done").classList.add("active");
    }
  } else {
    const tenantId = currentSession.tenantId;
    const activeTasks = tenantWorkspaces[tenantId] || [];
    const task = activeTasks.find(t => t.id === selectedTaskId) || activeTasks[activeTasks.length - 1];
    if (!task) return;

    const current = task.status;
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
}

// Initialize layout toggle view switcher
function initViewSwitcher() {
  const btnKanban = document.getElementById("btn-kanban");
  const btnTodoList = document.getElementById("btn-todolist");
  const btnServiceDesk = document.getElementById("btn-servicedesk");

  btnKanban.addEventListener("click", () => setView("kanban"));
  btnTodoList.addEventListener("click", () => setView("todolist"));
  btnServiceDesk.addEventListener("click", () => setView("servicedesk"));
}

// Unified view switching configuration router
function setView(view) {
  currentView = view;
  
  // Toggle switcher buttons styling
  document.getElementById("btn-kanban").classList.toggle("active", view === "kanban");
  document.getElementById("btn-todolist").classList.toggle("active", view === "todolist");
  document.getElementById("btn-servicedesk").classList.toggle("active", view === "servicedesk");
  
  // Toggle visibility of layout views
  document.getElementById("view-kanban-container").style.display = (view === "kanban") ? "flex" : "none";
  document.getElementById("view-todolist-container").style.display = (view === "todolist") ? "block" : "none";
  document.getElementById("view-servicedesk-container").style.display = (view === "servicedesk") ? "block" : "none";
  
  // Swap active BPMN SVGs on visual tracker panel
  document.getElementById("bpmn-svg").style.display = (view === "servicedesk") ? "none" : "block";
  document.getElementById("bpmn-svg-servicedesk").style.display = (view === "servicedesk") ? "block" : "none";
  
  // Toggle active text in DSL tabs header
  const activeDslTitle = document.getElementById("active-dsl-title");
  if (activeDslTitle) {
    activeDslTitle.innerText = (view === "servicedesk") ? "Process: ITIL Incident SLA" : "Process: Kanban Task Lifecycle";
  }
  
  // Fetch currently active tab lang (ts or go) and refresh editor visibility
  const activeTab = document.querySelector(".dsl-tab-btn.active");
  if (activeTab) {
    updateDslCodeVisibility(activeTab.dataset.lang);
  }

  // Refresh lists
  if (view === "servicedesk") {
    renderIncidents();
  } else {
    renderTasks();
  }
  updateSvgHighlights();
}

// Router helping toggle visibility of DSL code segments
function updateDslCodeVisibility(lang) {
  const codeTs = document.getElementById("code-ts");
  const codeGo = document.getElementById("code-go");
  const codeSdTs = document.getElementById("code-sd-ts");
  const codeSdGo = document.getElementById("code-sd-go");
  
  codeTs.style.display = "none";
  codeGo.style.display = "none";
  codeSdTs.style.display = "none";
  codeSdGo.style.display = "none";
  
  if (currentView === "servicedesk") {
    if (lang === "ts") codeSdTs.style.display = "block";
    if (lang === "go") codeSdGo.style.display = "block";
  } else {
    if (lang === "ts") codeTs.style.display = "block";
    if (lang === "go") codeGo.style.display = "block";
  }
}

// Initialize DSL Tabs
function initDslSwitcher() {
  const tabs = document.querySelectorAll(".dsl-tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      updateDslCodeVisibility(tab.dataset.lang);
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
    const heading = document.getElementById("modal-task-heading");
    const labelTitle = document.getElementById("label-task-title");
    const rowTaskFields = document.getElementById("form-row-task-fields");
    const rowSdFields = document.getElementById("form-row-sd-fields");

    if (currentView === "servicedesk") {
      heading.innerText = "Report ITIL Incident";
      labelTitle.innerText = "Incident Short Description";
      rowTaskFields.style.display = "none";
      rowSdFields.style.display = "block";
    } else {
      heading.innerText = "Create Kanban/Todo Task";
      labelTitle.innerText = "Task Title";
      rowTaskFields.style.display = "flex";
      rowSdFields.style.display = "none";
    }
    modalNewTask.classList.add("active");
  });

  // Close task modal
  const closeModal = () => modalNewTask.classList.remove("active");
  btnCloseTask.addEventListener("click", closeModal);
  btnCancelTask.addEventListener("click", closeModal);

  // Submit task form
  formTask.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!currentSession) return;

    const tenantId = currentSession.tenantId;
    const title = document.getElementById("task-title").value.trim();
    const desc = document.getElementById("task-desc").value.trim();

    if (currentView === "servicedesk") {
      const priority = document.getElementById("incident-priority").value;
      const activeIncidents = tenantIncidents[tenantId] || [];
      
      let reactionMax = 120;
      let resolutionMax = 360;
      if (priority === "Urgent") {
        reactionMax = 30;
        resolutionMax = 90;
      } else if (priority === "High") {
        reactionMax = 60;
        resolutionMax = 180;
      }

      const newIncident = {
        id: `INC-${100 + activeIncidents.length + 1}`,
        title,
        desc,
        priority,
        status: "New",
        assignee: null,
        reporter: currentSession.username,
        reactionSLA: reactionMax,
        reactionSLAMax: reactionMax,
        resolutionSLA: resolutionMax,
        resolutionSLAMax: resolutionMax,
        reactionSlaBreached: false,
        resolutionSlaBreached: false,
        history: ["New"],
        reactionTimeSpent: null,
        resolutionTimeSpent: null,
        createdTime: Date.now()
      };

      if (!tenantIncidents[tenantId]) {
        tenantIncidents[tenantId] = [];
      }
      tenantIncidents[tenantId].push(newIncident);
      selectedIncidentId = newIncident.id;

      logEngine("POST", `/instances/start (process: 'itil-incident-management', businessKey: '${newIncident.id}')`);
      logEngine("OK", `ITIL Workflow started. Awaiting L1 Triage claim. SLA Reaction: ${reactionMax}s`);

      renderIncidents();
      updateSvgHighlights();
      closeModal();
      formTask.reset();
    } else {
      const developer = document.getElementById("task-developer").value;
      const priority = document.getElementById("task-priority").value;
      const activeTasks = tenantWorkspaces[tenantId] || [];

      const newTask = {
        id: `NB-TASK-${tenantId.toUpperCase()}-${activeTasks.length + 1}`,
        title,
        desc,
        assignee: developer,
        priority,
        status: "todo",
        approved: null,
        history: ["todo"]
      };

      activeTasks.push(newTask);
      selectedTaskId = newTask.id;

      logEngine("POST", `/instances/start (process: 'kanban-task-lifecycle', businessKey: '${newTask.id}')`);
      logEngine("OK", `Process started successfully. Active task token: 'todo'`);

      renderTasks();
      updateSvgHighlights();
      closeModal();
      formTask.reset();
    }
  });

  // Review modal actions
  const modalReview = document.getElementById("modal-review");
  const btnApprove = document.getElementById("btn-review-approve");
  const btnReject = document.getElementById("btn-review-reject");

  const closeReviewModal = () => modalReview.classList.remove("active");

  btnApprove.addEventListener("click", () => {
    if (!currentSession) return;

    const tenantId = currentSession.tenantId;
    const activeTasks = tenantWorkspaces[tenantId] || [];
    const task = activeTasks.find(t => t.id === selectedTaskId);
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
    if (!currentSession) return;

    const tenantId = currentSession.tenantId;
    const activeTasks = tenantWorkspaces[tenantId] || [];
    const task = activeTasks.find(t => t.id === selectedTaskId);
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
    if (!currentSession) return;

    const taskId = e.dataTransfer.getData("text/plain");
    const targetStatus = column.dataset.status;

    const tenantId = currentSession.tenantId;
    const activeTasks = tenantWorkspaces[tenantId] || [];
    const task = activeTasks.find(t => t.id === taskId);
    
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

/* ==========================================
   ITIL ServiceDesk Simulation Logic & Functions
   ========================================== */

function initQueueFilters() {
  const chips = document.querySelectorAll("#queue-filters-container .filter-chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      queueFilter = chip.dataset.queueFilter;
      renderIncidents();
    });
  });
}

window.claimIncident = function(id) {
  if (!currentSession) return;
  const role = currentSession.role || "user";
  const tenantId = currentSession.tenantId;
  const activeIncidents = tenantIncidents[tenantId] || [];
  const ticket = activeIncidents.find(inc => inc.id === id);
  if (!ticket) return;

  if (ticket.status === "New") {
    if (role !== "l1_support" && role !== "admin") {
      alert(`Unauthorized: Claiming new tickets requires 'l1_support' role. Your current role is '${role}'.`);
      logEngine("ERROR", `Auth failed: User '${currentSession.username}' (role: '${role}') unauthorized to claim ticket ${id}`);
      return;
    }
    
    // Stop Reaction SLA (Reaction met)
    const elapsedReaction = Math.round((Date.now() - ticket.createdTime) / 1000);
    ticket.reactionTimeSpent = elapsedReaction;
    ticket.reactionSLA = 0; // stop countdown
    
    ticket.status = "Assigned";
    ticket.assignee = currentSession.username;
    ticket.history.push("Assigned");
    
    logEngine("POST", `/instances/${id}/tasks/triage/complete (assignee: '${currentSession.username}')`);
    logEngine("OK", `Ticket claimed by L1 agent. Reaction time: ${elapsedReaction}s. Resolution SLA started.`);
  } else if (ticket.status === "Escalated") {
    if (role !== "l2_support" && role !== "admin") {
      alert(`Unauthorized: Handling escalated tickets requires 'l2_support' role. Your current role is '${role}'.`);
      logEngine("ERROR", `Auth failed: User '${currentSession.username}' (role: '${role}') unauthorized to claim L2 ticket ${id}`);
      return;
    }
    
    ticket.status = "Assigned";
    ticket.assignee = currentSession.username;
    ticket.history.push("Assigned");
    
    logEngine("POST", `/instances/${id}/tasks/l2_support/claim (assignee: '${currentSession.username}')`);
    logEngine("OK", `Escalated ticket claimed by L2 engineer.`);
  }

  renderIncidents();
  updateSvgHighlights();
};

window.resolveIncident = function(id) {
  if (!currentSession) return;
  const tenantId = currentSession.tenantId;
  const activeIncidents = tenantIncidents[tenantId] || [];
  const ticket = activeIncidents.find(inc => inc.id === id);
  if (!ticket) return;

  // Authorization Gate check: Only assignee can resolve
  if (ticket.assignee !== currentSession.username && currentSession.role !== "admin") {
    alert(`Unauthorized: Only the assigned engineer (${ticket.assignee}) can resolve this ticket.`);
    return;
  }

  const note = prompt("Enter resolution notes:", "Rebooted VPN gateway node and verified routing tables.");
  if (note === null) return; // cancelled

  const elapsedTotal = Math.round((Date.now() - ticket.createdTime) / 1000);
  ticket.resolutionTimeSpent = elapsedTotal;
  ticket.resolutionSLA = 0; // stop countdown
  
  ticket.status = "Resolved";
  ticket.history.push("Resolved");
  
  logEngine("POST", `/instances/${id}/tasks/investigate/complete (resolution: '${note}')`);
  logEngine("OK", `Incident resolved in ${elapsedTotal}s. Sent to Customer Verification.`);

  renderIncidents();
  updateSvgHighlights();
};

window.verifyIncident = function(id, approve) {
  if (!currentSession) return;
  const tenantId = currentSession.tenantId;
  const activeIncidents = tenantIncidents[tenantId] || [];
  const ticket = activeIncidents.find(inc => inc.id === id);
  if (!ticket) return;

  // Authorization Gate check: Only customer or reporter can verify
  const role = currentSession.role || "user";
  if (role !== "customer" && role !== "admin" && currentSession.username !== ticket.reporter) {
    alert(`Unauthorized: Only the incident reporter/customer can verify the resolution.`);
    return;
  }

  if (approve) {
    ticket.status = "Closed";
    ticket.history.push("Closed");
    
    logEngine("POST", `/instances/${id}/tasks/review/complete (decision: 'approved')`);
    logEngine("OK", `Customer approved resolution. Ticket ${id} closed.`);
  } else {
    // Loopback path! Reopen & escalate
    ticket.status = "Escalated";
    ticket.assignee = null; // Escalate back to queue
    ticket.history.push("Escalated");
    
    // Reset Resolution SLA for L2 work
    ticket.resolutionSLA = ticket.resolutionSLAMax;
    ticket.resolutionSlaBreached = false;
    
    logEngine("POST", `/instances/${id}/tasks/review/complete (decision: 'reopened')`);
    logEngine("ERROR", `Customer rejected resolution. Reopen & loopback to L2 escalation triggered!`);

    // Run dynamic visual pulse animation on loopback path line
    const loopLine = document.getElementById("line-sd-gateway-reopen");
    if (loopLine) {
      loopLine.classList.add("active");
      setTimeout(() => {
        loopLine.classList.remove("active");
      }, 3000);
    }
  }

  renderIncidents();
  updateSvgHighlights();
};

function renderIncidents() {
  if (!currentSession) return;

  const tenantId = currentSession.tenantId;
  const activeIncidents = tenantIncidents[tenantId] || [];

  // Metrics calculations
  const openIncidents = activeIncidents.filter(inc => inc.status !== "Closed");
  const slaBreaches = activeIncidents.filter(inc => inc.reactionSlaBreached || inc.resolutionSlaBreached).length;
  
  const reactionTimes = activeIncidents
    .filter(inc => inc.reactionTimeSpent !== null)
    .map(inc => inc.reactionTimeSpent);
  const avgReaction = reactionTimes.length > 0 
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) + "s"
    : "0s";
    
  const resolvedCount = activeIncidents.filter(inc => inc.status === "Resolved" || inc.status === "Closed").length;
  const resolutionRate = activeIncidents.length > 0
    ? Math.round((resolvedCount / activeIncidents.length) * 100) + "%"
    : "0%";

  document.getElementById("metric-active-incidents").innerText = openIncidents.length;
  document.getElementById("metric-sla-breaches").innerText = slaBreaches;
  document.getElementById("metric-avg-reaction").innerText = avgReaction;
  document.getElementById("metric-resolution-rate").innerText = resolutionRate;

  // Render incidents list
  const listContainer = document.getElementById("incidents-list-container");
  listContainer.innerHTML = "";

  const filteredIncidents = activeIncidents.filter(inc => {
    if (queueFilter === "all") return true;
    if (queueFilter === "new") return inc.status === "New";
    if (queueFilter === "inProgress") return inc.status === "Assigned";
    if (queueFilter === "escalated") return inc.status === "Escalated";
    if (queueFilter === "resolved") return inc.status === "Resolved";
    return true;
  });

  if (filteredIncidents.length === 0) {
    listContainer.innerHTML = `<div class="empty-state">No incidents match the filter.</div>`;
  } else {
    filteredIncidents.forEach(inc => {
      const card = document.createElement("div");
      
      let priorityClass = "";
      if (inc.priority === "Urgent") priorityClass = "badge-urgent";
      if (inc.priority === "High") priorityClass = "badge-high";

      let stateClass = "status-todo";
      if (inc.status === "Assigned") stateClass = "status-progress";
      if (inc.status === "Escalated") stateClass = "status-review";
      if (inc.status === "Resolved") stateClass = "status-done";
      if (inc.status === "Closed") stateClass = "status-done";

      // SLA ticker display inside card
      let slaText = "";
      if (inc.status === "New") {
        if (inc.reactionSlaBreached) {
          slaText = `<span class="sla-badge-ticker breached">Reaction SLA Breached</span>`;
        } else {
          slaText = `<span class="sla-badge-ticker warning">React in ${inc.reactionSLA}s</span>`;
        }
      } else if (inc.status === "Assigned") {
        if (inc.resolutionSlaBreached) {
          slaText = `<span class="sla-badge-ticker breached">Resolution SLA Breached</span>`;
        } else {
          slaText = `<span class="sla-badge-ticker warning">Resolve in ${inc.resolutionSLA}s</span>`;
        }
      } else if (inc.status === "Escalated") {
        slaText = `<span class="sla-badge-ticker breached">Reaction SLA Breached</span>`;
      } else {
        slaText = `<span class="badge">SLA Met</span>`;
      }

      card.className = `incident-card ${inc.status === "Escalated" ? "escalated" : ""} ${selectedIncidentId === inc.id ? "active" : ""}`;
      card.dataset.id = inc.id;
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
          <h3 style="margin: 0; font-size: 0.9rem;">${inc.title}</h3>
          <span class="badge ${priorityClass}">${inc.priority}</span>
        </div>
        <p style="font-size: 0.75rem; opacity: 0.7; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${inc.desc}</p>
        <div class="ticket-meta">
          <span class="task-id">${inc.id}</span>
          <span class="badge" style="display: inline-flex; align-items: center; gap: 4px;">
            <span class="status-dot ${stateClass}"></span> ${inc.status}
          </span>
          ${slaText}
        </div>
      `;

      card.addEventListener("click", () => {
        selectedIncidentId = inc.id;
        renderIncidents();
        updateIncidentDetails(inc.id);
        updateSvgHighlights();
      });

      listContainer.appendChild(card);
    });
  }

  // Refresh details panel if selected incident is updated
  if (selectedIncidentId) {
    updateIncidentDetails(selectedIncidentId);
  } else {
    document.getElementById("incident-details-empty").style.display = "flex";
    document.getElementById("incident-details-content").style.display = "none";
  }
}

function updateIncidentDetails(id) {
  const tenantId = currentSession.tenantId;
  const activeIncidents = tenantIncidents[tenantId] || [];
  const inc = activeIncidents.find(i => i.id === id);
  
  const emptyPanel = document.getElementById("incident-details-empty");
  const contentPanel = document.getElementById("incident-details-content");

  if (!inc) {
    emptyPanel.style.display = "flex";
    contentPanel.style.display = "none";
    return;
  }

  emptyPanel.style.display = "none";
  contentPanel.style.display = "flex";

  // Set texts
  document.getElementById("details-id").innerText = inc.id;
  document.getElementById("details-title").innerText = inc.title;
  document.getElementById("details-desc").innerText = inc.desc;
  
  // Priority badge
  const priorityBadge = document.getElementById("details-priority");
  priorityBadge.className = "badge";
  if (inc.priority === "Urgent") priorityBadge.classList.add("badge-urgent");
  else if (inc.priority === "High") priorityBadge.classList.add("badge-high");
  priorityBadge.innerText = inc.priority;

  // Status and Assignee badges
  document.getElementById("details-status").innerText = inc.status;
  document.getElementById("details-assignee").innerText = inc.assignee ? inc.assignee : "Unassigned";

  // SLA timers progress bars
  const reactionTimer = document.getElementById("sla-reaction-timer");
  const reactionBar = document.getElementById("sla-reaction-bar");
  const resolutionTimer = document.getElementById("sla-resolution-timer");
  const resolutionBar = document.getElementById("sla-resolution-bar");

  // Reaction SLA bar
  if (inc.reactionSlaBreached) {
    reactionTimer.innerText = "BREACHED";
    reactionTimer.className = "sla-timer-countdown text-danger";
    reactionBar.style.width = "100%";
    reactionBar.style.backgroundColor = "var(--status-danger)";
  } else if (inc.status === "New") {
    reactionTimer.innerText = inc.reactionSLA + "s";
    reactionTimer.className = "sla-timer-countdown text-warning";
    const pct = Math.max(0, Math.min(100, (inc.reactionSLA / inc.reactionSLAMax) * 100));
    reactionBar.style.width = pct + "%";
    reactionBar.style.backgroundColor = "var(--color-primary)";
  } else {
    // Met or skipped
    reactionTimer.innerText = inc.reactionTimeSpent ? `Met (${inc.reactionTimeSpent}s)` : "Met";
    reactionTimer.className = "sla-timer-countdown text-success";
    reactionBar.style.width = "100%";
    reactionBar.style.backgroundColor = "var(--status-done)";
  }

  // Resolution SLA bar
  if (inc.resolutionSlaBreached) {
    resolutionTimer.innerText = "BREACHED";
    resolutionTimer.className = "sla-timer-countdown text-danger";
    resolutionBar.style.width = "100%";
    resolutionBar.style.backgroundColor = "var(--status-danger)";
  } else if (inc.status === "Assigned") {
    resolutionTimer.innerText = inc.resolutionSLA + "s";
    resolutionTimer.className = "sla-timer-countdown text-info";
    const pct = Math.max(0, Math.min(100, (inc.resolutionSLA / inc.resolutionSLAMax) * 100));
    resolutionBar.style.width = pct + "%";
    resolutionBar.style.backgroundColor = "#0ea5e9";
  } else if (inc.status === "New" || inc.status === "Escalated") {
    resolutionTimer.innerText = "--";
    resolutionTimer.className = "sla-timer-countdown";
    resolutionBar.style.width = "0%";
  } else {
    // Closed or Resolved
    resolutionTimer.innerText = inc.resolutionTimeSpent ? `Resolved (${inc.resolutionTimeSpent}s)` : "Resolved";
    resolutionTimer.className = "sla-timer-countdown text-success";
    resolutionBar.style.width = "100%";
    resolutionBar.style.backgroundColor = "var(--status-done)";
  }

  // Action Buttons Generation with Role Authorization
  const actionContainer = document.getElementById("incident-action-buttons");
  actionContainer.innerHTML = "";

  const role = currentSession ? currentSession.role : "user";

  if (inc.status === "New") {
    const claimBtn = document.createElement("button");
    claimBtn.className = "btn btn-primary";
    claimBtn.innerText = "Claim Incident (L1)";
    if (role !== "l1_support" && role !== "admin") {
      claimBtn.disabled = true;
      claimBtn.style.opacity = "0.5";
      claimBtn.style.cursor = "not-allowed";
      claimBtn.title = "Requires L1 Support Role";
      claimBtn.innerText += " 🔒";
    }
    claimBtn.addEventListener("click", () => claimIncident(inc.id));
    actionContainer.appendChild(claimBtn);
  } 
  else if (inc.status === "Escalated") {
    const claimBtn = document.createElement("button");
    claimBtn.className = "btn btn-primary";
    claimBtn.innerText = "Claim Escalated Incident (L2)";
    if (role !== "l2_support" && role !== "admin") {
      claimBtn.disabled = true;
      claimBtn.style.opacity = "0.5";
      claimBtn.style.cursor = "not-allowed";
      claimBtn.title = "Requires L2 Support Role";
      claimBtn.innerText += " 🔒";
    }
    claimBtn.addEventListener("click", () => claimIncident(inc.id));
    actionContainer.appendChild(claimBtn);
  }
  else if (inc.status === "Assigned") {
    const resolveBtn = document.createElement("button");
    resolveBtn.className = "btn btn-primary";
    resolveBtn.innerText = "Resolve Incident";
    if (inc.assignee !== currentSession.username && role !== "admin") {
      resolveBtn.disabled = true;
      resolveBtn.style.opacity = "0.5";
      resolveBtn.style.cursor = "not-allowed";
      resolveBtn.title = `Assigned to ${inc.assignee}`;
      resolveBtn.innerText += " 🔒";
    }
    resolveBtn.addEventListener("click", () => resolveIncident(inc.id));
    actionContainer.appendChild(resolveBtn);
  }
  else if (inc.status === "Resolved") {
    const approveBtn = document.createElement("button");
    approveBtn.className = "btn btn-success";
    approveBtn.innerText = "Approve & Close";
    if (role !== "customer" && role !== "admin") {
      approveBtn.disabled = true;
      approveBtn.style.opacity = "0.5";
      approveBtn.style.cursor = "not-allowed";
      approveBtn.title = "Only Customer can verify";
      approveBtn.innerText += " 🔒";
    }
    approveBtn.addEventListener("click", () => verifyIncident(inc.id, true));

    const rejectBtn = document.createElement("button");
    rejectBtn.className = "btn btn-danger";
    rejectBtn.innerText = "Reopen & Escalate";
    if (role !== "customer" && role !== "admin") {
      rejectBtn.disabled = true;
      rejectBtn.style.opacity = "0.5";
      rejectBtn.style.cursor = "not-allowed";
      rejectBtn.title = "Only Customer can verify";
      rejectBtn.innerText += " 🔒";
    }
    rejectBtn.addEventListener("click", () => verifyIncident(inc.id, false));

    actionContainer.appendChild(approveBtn);
    actionContainer.appendChild(rejectBtn);
  }
  else if (inc.status === "Closed") {
    actionContainer.innerHTML = `<span style="color: var(--status-done); font-weight: 600; display: inline-flex; align-items: center; gap: 5px;">✓ Ticket Closed & Finalized</span>`;
  }
}

function tickSLATimers() {
  if (!currentSession) return;
  const tenantId = currentSession.tenantId;
  const activeIncidents = tenantIncidents[tenantId] || [];

  activeIncidents.forEach(inc => {
    if (inc.status === "New") {
      if (inc.reactionSLA > 0) {
        inc.reactionSLA--;
        if (inc.reactionSLA === 0) {
          inc.reactionSlaBreached = true;
          inc.status = "Escalated";
          inc.history.push("Escalated");
          
          logEngine("BPMN EVENT", `Boundary Timer 'reactionSLA' fired for incident ${inc.id}.`);
          logEngine("ERROR", `SLA Breach! Escalated ticket ${inc.id} to L2 Support.`);
          
          if (inc.id === selectedIncidentId) {
            updateIncidentDetails(inc.id);
            updateSvgHighlights();
          }
        }
      }
    } else if (inc.status === "Assigned") {
      if (inc.resolutionSLA > 0) {
        inc.resolutionSLA--;
        if (inc.resolutionSLA === 0) {
          inc.resolutionSlaBreached = true;
          
          logEngine("BPMN EVENT", `Boundary Timer 'resolutionSLA' fired for incident ${inc.id}.`);
          logEngine("ERROR", `SLA Breach Alert! Escalated resolution failure of ticket ${inc.id} to Manager.`);
          
          if (inc.id === selectedIncidentId) {
            updateIncidentDetails(inc.id);
            updateSvgHighlights();
          }
        }
      }
    }
  });

  if (currentView === "servicedesk") {
    // Refresh SLA lists displays in real-time
    activeIncidents.forEach(inc => {
      const cardEl = document.querySelector(`.incident-card[data-id="${inc.id}"]`);
      if (cardEl) {
        const timerBadge = cardEl.querySelector(`.sla-badge-ticker`);
        if (timerBadge) {
          if (inc.status === "New") {
            if (inc.reactionSlaBreached) {
              timerBadge.className = "sla-badge-ticker breached";
              timerBadge.innerText = "Reaction SLA Breached";
            } else {
              timerBadge.className = "sla-badge-ticker warning";
              timerBadge.innerText = `React in ${inc.reactionSLA}s`;
            }
          } else if (inc.status === "Assigned") {
            if (inc.resolutionSlaBreached) {
              timerBadge.className = "sla-badge-ticker breached";
              timerBadge.innerText = "Resolution SLA Breached";
            } else {
              timerBadge.className = "sla-badge-ticker warning";
              timerBadge.innerText = `Resolve in ${inc.resolutionSLA}s`;
            }
          }
        }
      }
    });

    if (selectedIncidentId) {
      updateIncidentDetails(selectedIncidentId);
    }
  }
}
