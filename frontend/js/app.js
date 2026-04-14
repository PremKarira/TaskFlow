const API = "http://localhost:8080";
let currentProject = null;

/* AUTH */
function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  updateNavbar();
  showView("login");
}

/* VIEW SWITCH */
function showView(view) {
  ["loginView","registerView","projectView","taskView"].forEach(v => {
    document.getElementById(v).style.display = "none";
  });

  if (view === "login") document.getElementById("loginView").style.display = "block";
  if (view === "register") document.getElementById("registerView").style.display = "block";
  if (view === "projects") {
    document.getElementById("projectView").style.display = "block";
    loadProjects();
  }
}

/* LOGIN */
async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  });

  const data = await res.json();

  if (!res.ok) {
    document.getElementById("loginError").innerText = data.error;
    return;
  }

  localStorage.setItem("token", data.token);
  updateNavbar();
  showView("projects");
}

/* REGISTER */
async function register() {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      name: document.getElementById("rname").value,
      email: document.getElementById("remail").value,
      password: document.getElementById("rpassword").value
    })
  });

  const data = await res.json();

  if (!res.ok) {
    document.getElementById("registerError").innerText = data.error;
    return;
  }

  localStorage.setItem("token", data.token);
  updateNavbar();
  showView("projects");
}

/* PROJECTS */
async function loadProjects() {
  const res = await fetch(`${API}/projects`, {
    headers: { Authorization: "Bearer " + getToken() }
  });

  const data = await res.json();
  const container = document.getElementById("projects");
  container.innerHTML = "";

  if (!data.projects || data.projects.length === 0) {
    container.innerHTML = "<div class='empty'>No projects</div>";
    return;
  }

  data.projects.forEach(p => {
    const div = document.createElement("div");
    div.className = "project";
    div.innerText = p.name;
    div.onclick = () => openProject(p.id);
    container.appendChild(div);
  });
}

async function createProject() {
  await fetch(`${API}/projects`, {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      Authorization:"Bearer " + getToken()
    },
    body: JSON.stringify({
      name: document.getElementById("pname").value
    })
  });

  document.getElementById("pname").value = "";
  loadProjects();
}

/* TASKS */
function openProject(id) {
  currentProject = id;
  document.getElementById("projectView").style.display = "none";
  document.getElementById("taskView").style.display = "block";
  loadTasks();
}

async function loadTasks() {
  const res = await fetch(`${API}/tasks/project/${currentProject}`, {
    headers: { Authorization: "Bearer " + getToken() }
  });

  const data = await res.json();

  ["todo","in_progress","done"].forEach(s => {
    document.getElementById(s).innerHTML = "";
  });

  data.tasks.forEach(t => {
    const div = document.createElement("div");
    div.className = "task";

    div.innerHTML = `
  <div class="task-header">
    <div>
      <b>${t.title}</b><br>
      <span class="badge ${t.priority}">${t.priority}</span>
    </div>

    <button class="delete-btn" onclick="deleteTask('${t.id}')">
      🗑️
    </button>
  </div>

  <select onchange="update('${t.id}', this.value)">
    <option ${t.status==='todo'?'selected':''}>todo</option>
    <option ${t.status==='in_progress'?'selected':''}>in_progress</option>
    <option ${t.status==='done'?'selected':''}>done</option>
  </select>
`;

    document.getElementById(t.status).appendChild(div);
  });
}

async function createTask() {
  await fetch(`${API}/tasks/project/${currentProject}`, {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      Authorization:"Bearer " + getToken()
    },
    body: JSON.stringify({
      title: document.getElementById("title").value,
      priority: document.getElementById("priority").value
    })
  });

  document.getElementById("title").value = "";
  loadTasks();
}

async function update(id, status) {
  await fetch(`${API}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type":"application/json",
      Authorization:"Bearer " + getToken()
    },
    body: JSON.stringify({ status })
  });

  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization:"Bearer " + getToken()
    }
  });

  loadTasks();
}


function updateNavbar() {
  const nav = document.querySelector("nav");
  const token = getToken();

  if (!token) {
    nav.innerHTML = `
      <a href="#" id="loginTab">Login</a>
      <a href="#" id="registerTab">Register</a>
    `;

    document.getElementById("loginTab").onclick = () => showView("login");
    document.getElementById("registerTab").onclick = () => showView("register");

  } else {
    nav.innerHTML = `
      <a href="#" id="projectsTab">Projects</a>
      <a href="#" id="logoutTab">Logout</a>
    `;

    document.getElementById("projectsTab").onclick = () => showView("projects");
    document.getElementById("logoutTab").onclick = logout;
  }
}
/* INIT */
window.onload = () => {
  updateNavbar();

  if (getToken()) showView("projects");
  else showView("login");
};