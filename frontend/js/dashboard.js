
document.addEventListener("DOMContentLoaded", function () {
    setCurrentDate();
    loadUserInfo();
    setupTabs();
    loadDashboard();

    const newTaskBtn = document.getElementById("new-task-btn");

    if (newTaskBtn) {
        newTaskBtn.addEventListener("click", function () {
            window.location.href = "tasks.html";
        });
    }
});

let allGroups = [];
let allProjects = [];
let allTasks = [];
let currentTab = "all";

async function loadDashboard() {
    showError("");

    try {
        const [groups, projects, tasks] = await Promise.all([
            api.get("/api/groups"),
            api.get("/api/projects"),
            api.get("/api/tasks")
        ]);

        allGroups = Array.isArray(groups) ? groups : [];
        allProjects = Array.isArray(projects) ? projects : [];
        allTasks = Array.isArray(tasks) ? tasks : [];

        renderStats();
        renderTasks();
        renderProjects();
        renderActivity();
    } catch (error) {
        console.error("Không thể tải Dashboard:", error);

        showError(
            "Không thể tải dữ liệu. Fen hãy kiểm tra đăng nhập và backend."
        );

        renderEmptyTasks("Unable to load tasks.");
        renderEmptyProjects("Unable to load projects.");
        renderEmptyActivity("Unable to load activity.");
    }
}

function loadUserInfo() {
    const rawUser = localStorage.getItem("flowtask_user");

    if (!rawUser) return;

    try {
        const user = JSON.parse(rawUser);
        const name = user.fullName || user.name || user.username;

        if (name) {
            setText("user-name", name);
        }
    } catch (error) {
        console.error("Không thể đọc thông tin người dùng:", error);
    }
}

function setCurrentDate() {
    const element = document.getElementById("current-date");

    if (element) {
        element.textContent = new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }).format(new Date());
    }
}

function renderStats() {
    const completed = allTasks.filter(isCompleted).length;
    const inProgress = allTasks.filter(isInProgress).length;
    const overdue = allTasks.filter(isOverdue).length;

    const grid = document.getElementById("stats-grid");

    if (!grid) return;

    const stats = [
        { label: "Total Groups", value: allGroups.length },
        { label: "Total Projects", value: allProjects.length },
        { label: "Total Tasks", value: allTasks.length },
        { label: "Completed", value: completed }
    ];

    grid.innerHTML = stats.map(stat => `
        <article class="stat-card">
            <span>${escapeHtml(stat.label)}</span>
            <strong>${stat.value}</strong>
        </article>
    `).join("");

    // Các ID này được cập nhật nếu HTML có phần tử tương ứng.
    setText("total-groups", allGroups.length);
    setText("total-projects", allProjects.length);
    setText("total-tasks", allTasks.length);
    setText("completed-tasks", completed);
    setText("in-progress-tasks", inProgress);
    setText("overdue-tasks", overdue);
}


function renderTasks() {
    const body = document.getElementById("task-table-body");

    if (!body) return;

    let tasks = allTasks.filter(task =>
        String(task.status || "").toUpperCase() !== "DONE"
    );

    if (currentTab === "mine") {
        const rawUser = localStorage.getItem("flowtask_user");
        let userId = null;

        try {
            userId = JSON.parse(rawUser || "{}").id;
        } catch (error) {
            console.error(error);
        }

        if (userId == null) {
            renderEmptyTasks("Cannot identify the current user.");
            return;
        }

        tasks = tasks.filter(task =>
            task.assigneeId != null &&
            String(task.assigneeId) === String(userId)
        );
    }

    tasks.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return String(a.dueDate).localeCompare(String(b.dueDate));
    });

    if (tasks.length === 0) {
        renderEmptyTasks(
            currentTab === "mine"
                ? "No unfinished tasks assigned to you."
                : "No unfinished tasks."
        );
        return;
    }

    body.innerHTML = tasks.slice(0, 8).map(task => {
        const overdue = isOverdue(task);

        return `
            <tr>
                <td>${escapeHtml(task.title || "Untitled task")}</td>
                <td>${escapeHtml(task.groupName || "—")}</td>
                <td>${escapeHtml(task.projectName || "—")}</td>
                <td>${escapeHtml(formatEnum(task.priority))}</td>
                <td>${escapeHtml(formatEnum(task.status))}</td>
                <td class="${overdue ? "overdue-date" : ""}">
                    ${overdue ? "⚠ " : ""}
                    ${escapeHtml(formatDate(task.dueDate))}
                    ${overdue ? " (Overdue)" : ""}
                </td>
            </tr>
        `;
    }).join("");
}


function renderProjects() {
    const container = document.getElementById("quick-projects");

    if (!container) return;

    if (allProjects.length === 0) {
        renderEmptyProjects("No projects yet.");
        return;
    }

    container.innerHTML = allProjects.slice(0, 4).map(project => {
        const progress = project.taskCount > 0
            ? Math.round(project.doneCount / project.taskCount * 100)
            : 0;

        return `
            <article class="quick-project-card">
                <h3>${escapeHtml(project.name || "Untitled project")}</h3>
                <p>${escapeHtml(project.description || "")}</p>
                <div class="project-progress">
                    <div class="progress-track">
                        <div class="progress-fill"
                             style="width: ${progress}%"></div>
                    </div>
                    <small>
                        ${progress}% · ${project.doneCount}/${project.taskCount} tasks
                    </small>
                </div>
                <span>${escapeHtml(formatEnum(project.status))}</span>
            </article>
        `;
    }).join("");
}

function renderActivity() {
    const container = document.getElementById("activity-list");

    if (!container) return;

    // TaskView hiện chưa có createdAt hoặc updatedAt.
    // Không giả lập hoạt động khi backend chưa cung cấp dữ liệu.
    renderEmptyActivity("Activity will appear when an activity API is available.");
}

function setupTabs() {
    document.querySelectorAll(".tab-btn").forEach(button => {
        button.addEventListener("click", function () {
            document.querySelectorAll(".tab-btn").forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");
            currentTab = button.dataset.tab || "all";
            renderTasks();
        });
    });
}

function isCompleted(task) {
    return String(task.status || "").toUpperCase() === "DONE";
}

function isInProgress(task) {
    return String(task.status || "").toUpperCase() === "IN_PROGRESS";
}

function isOverdue(task) {
    if (!task.dueDate || isCompleted(task)) return false;

    const due = new Date(task.dueDate + "T23:59:59");
    return !Number.isNaN(due.getTime()) && due < new Date();
}

function formatEnum(value) {
    if (!value) return "—";

    return String(value)
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value + "T00:00:00");

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-GB");
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function showError(message) {
    setText("dashboard-error", message);
}

function renderEmptyTasks(message) {
    const body = document.getElementById("task-table-body");

    if (body) {
        body.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    ${escapeHtml(message)}
                </td>
            </tr>
        `;
    }
}

function renderEmptyProjects(message) {
    const container = document.getElementById("quick-projects");

    if (container) {
        container.innerHTML =
            `<p class="muted">${escapeHtml(message)}</p>`;
    }
}

function renderEmptyActivity(message) {
    const container = document.getElementById("activity-list");

    if (container) {
        container.innerHTML =
            `<p class="empty-message">${escapeHtml(message)}</p>`;
    }
}
