const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

let project = null;
let projectTasks = [];

const $ = (id) => document.getElementById(id);

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function formatDate(value) {
    if (!value) return "Chưa có";

    const parts = String(value).split("-");
    if (parts.length !== 3) return escapeHtml(value);

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function showError(message) {
    const element = $("error-message");
    if (!element) return;

    element.textContent = message;
    element.hidden = false;
}

function statusText(status) {
    const values = {
        PLANNING: "Planning",
        ACTIVE: "Active",
        IN_PROGRESS: "In progress",
        COMPLETED: "Completed",
        ON_HOLD: "On hold",
        TODO: "To do",
        DONE: "Done",
        CANCELLED: "Cancelled"
    };

    return values[status] || status || "Chưa xác định";
}

function taskStatusText(status) {
    const values = {
        TODO: "To do",
        IN_PROGRESS: "In progress",
        DONE: "Done"
    };

    return values[status] || status || "Chưa xác định";
}

function getProgress() {
    if (!projectTasks.length) return 0;

    const done = projectTasks.filter(task => task.status === "DONE").length;
    return Math.round(done / projectTasks.length * 100);
}

function renderProject() {
    if (!project) return;

    document.title = `${project.name} | FlowTask`;

    $("breadcrumb-name").textContent = project.name || "Project";
    $("project-name").textContent = project.name || "Chưa có tên";
    $("project-description").textContent =
        project.description || "Chưa có mô tả.";

    $("project-group").textContent = project.groupName || "Chưa có nhóm";
    $("project-deadline").textContent = formatDate(project.deadline);

    const color = /^#[0-9a-fA-F]{6}$/.test(project.color || "")
        ? project.color
        : "#6366f1";

    $("project-color-bar").style.background = color;

    const status = $("project-status");
    status.textContent = statusText(project.status);
    status.title = project.status || "";

    const done = projectTasks.filter(task => task.status === "DONE").length;
    const total = projectTasks.length;

    $("project-task-count").textContent = `${done}/${total}`;

    const progress = getProgress();
    $("progress-percent").textContent = `${progress}%`;
    $("progress-bar").style.width = `${progress}%`;

    renderTaskBreakdown();
    renderOverviewTasks();
    renderTasks();
    renderAnnouncements();
}

function renderTasks() {
    const list = $("project-task-list");
    if (!list) return;

    if (!projectTasks.length) {
        list.innerHTML = `
            <p class="empty-text">Dự án chưa có nhiệm vụ nào.</p>
        `;
        return;
    }

    list.innerHTML = projectTasks.map(task => `
        <article class="card" style="padding:16px;margin-top:12px">
            <div style="display:flex;justify-content:space-between;
                        align-items:flex-start;gap:12px;flex-wrap:wrap">
                <div style="min-width:0;flex:1">
                    <strong>${escapeHtml(task.title)}</strong>
                    <p style="color:#8b92b3;font-size:13px;overflow-wrap:anywhere">
                        ${escapeHtml(task.description || "Không có mô tả")}
                    </p>
                    <div style="color:#8b92b3;font-size:12px">
                        Người thực hiện: ${escapeHtml(task.assigneeName || "Chưa giao")}
                        · Hạn: ${formatDate(task.dueDate)}
                    </div>
                </div>

                <label style="font-size:12px">
                    Trạng thái
                    <select class="task-status-select"
                            data-task-id="${escapeHtml(task.id)}"
                            style="display:block;margin-top:6px;padding:7px;
                                   border-radius:8px;background:#1c2040;
                                   color:#f0f2ff;border:1px solid #373b60">
                        <option value="TODO" ${task.status === "TODO" ? "selected" : ""}>To do</option>
                        <option value="IN_PROGRESS" ${task.status === "IN_PROGRESS" ? "selected" : ""}>In progress</option>
                        <option value="DONE" ${task.status === "DONE" ? "selected" : ""}>Done</option>
                    </select>
                </label>
            </div>
        </article>
    `).join("");

    list.querySelectorAll(".task-status-select").forEach(select => {
        select.addEventListener("change", async () => {
            await updateTaskStatus(select);
        });
    });
}

function renderTaskBreakdown() {
    const container = $("task-breakdown");
    if (!container) return;

    const total = projectTasks.length;

    const items = [
        {
            name: "To do",
            count: projectTasks.filter(task => task.status === "TODO").length,
            className: "breakdown-todo"
        },
        {
            name: "In progress",
            count: projectTasks.filter(task => task.status === "IN_PROGRESS").length,
            className: "breakdown-progress"
        },
        {
            name: "Done",
            count: projectTasks.filter(task => task.status === "DONE").length,
            className: "breakdown-done"
        }
    ];

    container.innerHTML = items.map(item => {
        const percent = total
            ? Math.round(item.count / total * 100)
            : 0;

        return `
            <div class="task-breakdown-item">
                <div>
                    <span>${item.name}</span>
                    <strong>${item.count}</strong>
                </div>

                <div class="breakdown-track">
                    <div class="breakdown-fill ${item.className}"
                         style="width:${percent}%"></div>
                </div>
            </div>
        `;
    }).join("");
}

function renderOverviewTasks() {
    const container = $("overview-task-list");
    if (!container) return;

    const tasks = [...projectTasks]
        .sort((a, b) => {
            const order = { IN_PROGRESS: 0, TODO: 1, DONE: 2 };
            return (order[a.status] ?? 3) - (order[b.status] ?? 3);
        })
        .slice(0, 5);

    if (!tasks.length) {
        container.innerHTML = `
            <p class="empty-text">Chưa có nhiệm vụ nào trong dự án.</p>
        `;
        return;
    }

    container.innerHTML = tasks.map(task => `
        <article class="overview-task-item">
            <div>
                <strong>${escapeHtml(task.title)}</strong>
                <p>${escapeHtml(task.assigneeName || "Chưa giao")}</p>
            </div>
            <span class="task-status-badge">
                ${escapeHtml(taskStatusText(task.status))}
            </span>
        </article>
    `).join("");
}

function renderAnnouncements() {
    const container = $("announcement-list");
    if (!container) return;

    container.innerHTML = `
        <p class="empty-text">
            Chưa có thông báo chung cho dự án.
        </p>
    `;
}

async function loadProject() {
    if (!projectId || !/^\d+$/.test(projectId)) {
        showError("URL chưa có ID dự án hợp lệ. Hãy mở trang từ danh sách Projects.");
        return;
    }

    try {
        const [projectData, tasksData] = await Promise.all([
            api.get(`/api/projects/${encodeURIComponent(projectId)}`),
            api.get("/api/tasks")
        ]);

        project = projectData;

        if (!Array.isArray(tasksData)) {
            throw new Error("API /api/tasks không trả về danh sách task.");
        }

        projectTasks = tasksData.filter(
            task => String(task.projectId) === String(projectId)
        );

        renderProject();
        renderTeam();
    } catch (error) {
        console.error("Không thể tải Project Detail:", error);
        showError(
            `Không thể tải dự án: ${error.message}. Hãy kiểm tra đăng nhập và API backend.`
        );
    }
}

async function updateTaskStatus(select) {
    const taskId = select.dataset.taskId;
    const newStatus = select.value;

    select.disabled = true;

    try {
        await apiRequestStatus(taskId, newStatus);
        await loadProject();
    } catch (error) {
        console.error("Không thể cập nhật trạng thái task:", error);
        showError(`Cập nhật task thất bại: ${error.message}`);
        await loadProject();
    } finally {
        select.disabled = false;
    }
}

async function apiRequestStatus(taskId, status) {
    const token = localStorage.getItem("flowtask_token");
    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `http://localhost:8080/api/tasks/${encodeURIComponent(taskId)}/status`,
        {
            method: "PATCH",
            headers,
            body: JSON.stringify({
                status,
                position: projectTasks.find(
                    task => String(task.id) === String(taskId)
                )?.position ?? 0
            })
        }
    );

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `HTTP ${response.status}`);
    }

    return response.json();
}
 async function renderTeam() {
     const teamList = $("team-list");
     const avatars = $("member-avatars");

     if (!teamList) return;

     teamList.innerHTML = `
         <p class="team-loading">Đang tải thành viên...</p>
     `;

     if (avatars) avatars.innerHTML = "";

     try {
         const members = await api.get(
             `/api/projects/${encodeURIComponent(projectId)}/members`
         );

         if (!Array.isArray(members)) {
             throw new Error("Dữ liệu thành viên không hợp lệ.");
         }

         if (members.length === 0) {
             teamList.innerHTML = `
                 <div class="team-empty">
                     <p>Chưa có thành viên trong dự án.</p>
                 </div>
             `;
             return;
         }

         const avatarColors = [
             "#6366f1",
             "#0891b2",
             "#059669",
             "#d97706",
             "#db2777"
         ];

         teamList.innerHTML = members.map((member, index) => {
             const name = member.name || "Thành viên";
             const initials = member.initials ||
                 name.split(/\s+/).map(word => word[0]).slice(-2).join("").toUpperCase();

             return `
                 <div class="team-member">
                     <div class="team-avatar"
                          style="background:${avatarColors[index % avatarColors.length]}22;
                                 color:${avatarColors[index % avatarColors.length]}">
                         ${escapeHtml(initials)}
                     </div>

                     <div class="team-info">
                         <div class="team-name">
                             ${escapeHtml(name)}
                         </div>
                         <div class="team-role">
                             ${escapeHtml(member.email || "")}
                         </div>
                     </div>
                 </div>
             `;
         }).join("");

         if (avatars) {
             avatars.innerHTML = members.slice(0, 5).map((member, index) => `
                 <div class="member-avatar"
                      title="${escapeHtml(member.name || "")}"
                      style="background:${avatarColors[index % avatarColors.length]}22;
                             color:${avatarColors[index % avatarColors.length]}">
                     ${escapeHtml(member.initials || "?")}
                 </div>
             `).join("");
         }

     } catch (error) {
         console.error("Không thể tải thành viên dự án:", error);

         teamList.innerHTML = `
             <p class="team-error">
                 Không thể tải thành viên. ${escapeHtml(error.message)}
             </p>
         `;
     }
 }

function setupTabs() {
    const tabs = document.querySelectorAll(".project-tab");

    const panels = {
        Overview: $("overview-panel"),
        Tasks: $("tasks-panel"),
        Members: $("members-panel"),
        Settings: $("settings-panel")
    };

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const name = tab.dataset.tab;

            tabs.forEach(item => {
                item.classList.toggle("active", item === tab);
            });

            Object.entries(panels).forEach(([key, panel]) => {
                if (panel) panel.hidden = key !== name;
            });

            if (name === "Members") {
                renderTeam();

                if (panels.Members) {
                    panels.Members.innerHTML = `
                        <div class="card" style="padding:20px">
                            Backend chưa có API lấy thành viên dự án.
                        </div>
                    `;
                }
            }

            if (name === "Settings") {
                renderSettings(panels.Settings);
            }
            if (tabName === "Members") {
                renderTeam();
            }
        });
    });
}

function renderSettings(panel) {
    if (!project) return;

    panel.innerHTML = `
        <div class="card" style="padding:24px">
            <h2 class="card-heading">Project settings</h2>

            <form id="project-settings-form"
                  style="display:grid;gap:14px;margin-top:18px">
                <label>
                    Tên dự án
                    <input name="name" required maxlength="150"
                           value="${escapeHtml(project.name)}">
                </label>

                <label>
                    Mô tả
                    <textarea name="description" rows="3">${escapeHtml(project.description || "")}</textarea>
                </label>

                <label>
                    Group ID
                    <input name="groupId" type="number" min="1" required
                           value="${escapeHtml(project.groupId)}">
                </label>

                <label>
                    Trạng thái
                    <select name="status">
                        ${["PLANNING", "ACTIVE", "COMPLETED", "ON_HOLD"].map(value => `
                            <option value="${value}"
                                ${project.status === value ? "selected" : ""}>
                                ${value}
                            </option>
                        `).join("")}
                    </select>
                </label>

                <label>
                    Priority
                    <select name="priority">
                        ${["LOW", "MEDIUM", "HIGH", "URGENT"].map(value => `
                            <option value="${value}"
                                ${project.priority === value ? "selected" : ""}>
                                ${value}
                            </option>
                        `).join("")}
                    </select>
                </label>

                <label>
                    Màu dự án
                    <input name="color" type="color"
                           value="${/^#[0-9a-fA-F]{6}$/.test(project.color || "") ? project.color : "#6366f1"}">
                </label>

                <label>
                    Deadline
                    <input name="deadline" type="date"
                           value="${escapeHtml(project.deadline || "")}">
                </label>

                <button class="primary-btn" type="submit">
                    Lưu thay đổi
                </button>

                <button class="delete-project-btn" type="button">
                    Xóa dự án
                </button>
            </form>
        </div>
    `;

    const form = $("project-settings-form");

    form.addEventListener("submit", async event => {
        event.preventDefault();

        const data = new FormData(form);
        const deadline = data.get("deadline");

        const body = {
            name: String(data.get("name")).trim(),
            description: String(data.get("description")).trim(),
            groupId: Number(data.get("groupId")),
            status: data.get("status"),
            priority: data.get("priority"),
            color: data.get("color"),
            deadline: deadline || null
        };

        try {
            await api.put(`/api/projects/${encodeURIComponent(projectId)}`, body);
            await loadProject();
            showError("Đã lưu thay đổi dự án.");
        } catch (error) {
            console.error("Không thể cập nhật dự án:", error);
            showError(`Lưu dự án thất bại: ${error.message}`);
        }
    });

    form.querySelector(".delete-project-btn").addEventListener("click", async () => {
        if (!confirm("Bạn có chắc muốn xóa dự án này không?")) return;

        try {
            await api.delete(`/api/projects/${encodeURIComponent(projectId)}`);
            window.location.href = "projects.html";
        } catch (error) {
            console.error("Không thể xóa dự án:", error);
            showError(`Xóa dự án thất bại: ${error.message}`);
        }
    });
}

function addTask() {
    if (!project) return;

    if ($("add-task-form")) {
        $("add-task-form").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
        $("add-task-title")?.focus();
        return;
    }

    const panel = $("tasks-panel");
    if (!panel) return;

    const tasksTab = document.querySelector('[data-tab="Tasks"]');
    if (tasksTab) tasksTab.click();
    const formContainer = document.createElement("div");
    formContainer.id = "add-task-form";
    formContainer.className = "card";
    formContainer.style.cssText = "padding:24px;margin:16px 0";

    formContainer.innerHTML = `
        <h3 style="margin:0 0 18px;color:#f0f2ff">
            Thêm nhiệm vụ mới
        </h3>

        <form id="new-task-form" style="display:grid;gap:14px">
            <label>
                Tên nhiệm vụ *
                <input id="add-task-title" name="title"
                       required maxlength="200"
                       placeholder="Nhập tên nhiệm vụ">
            </label>

            <label>
                Mô tả
                <textarea name="description" rows="3"
                          placeholder="Mô tả nhiệm vụ..."></textarea>
            </label>

            <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px">
                <label>
                    Trạng thái
                    <select name="status">
                        <option value="TODO">To do</option>
                        <option value="IN_PROGRESS">In progress</option>
                        <option value="DONE">Done</option>
                    </select>
                </label>

                <label>
                    Độ ưu tiên
                    <select name="priority">
                        <option value="LOW">Low</option>
                        <option value="MEDIUM" selected>Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                    </select>
                </label>
            </div>

            <label>
                Hạn hoàn thành
                <input name="dueDate" type="date">
            </label>

            <div style="display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap">
                <button type="button" id="cancel-add-task"
                        class="delete-project-btn">
                    Hủy
                </button>
                <button type="submit" class="primary-btn">
                    Tạo nhiệm vụ
                </button>
            </div>
        </form>
    `;

    const list = $("project-task-list");
    if (list) {
        list.before(formContainer);
    } else {
        panel.appendChild(formContainer);
    }

    $("cancel-add-task").addEventListener("click", () => {
        formContainer.remove();
    });

    $("new-task-form").addEventListener("submit", async event => {
        event.preventDefault();

        const form = event.currentTarget;
        const data = new FormData(form);
        const title = String(data.get("title") || "").trim();

        if (!title) {
            $("add-task-title").focus();
            return;
        }

        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;
        button.textContent = "Đang tạo...";

        try {
            await api.post("/api/tasks", {
                projectId: Number(projectId),
                title,
                description: String(data.get("description") || "").trim(),
                assigneeId: null,
                status: data.get("status"),
                priority: data.get("priority"),
                tags: [],
                dueDate: data.get("dueDate") || null,
                position: projectTasks.length
            });

            formContainer.remove();
            await loadProject();

            const tasksTab = document.querySelector('[data-tab="Tasks"]');
            if (tasksTab) tasksTab.click();
        } catch (error) {
            console.error("Không thể tạo nhiệm vụ:", error);
            showError(`Tạo nhiệm vụ thất bại: ${error.message}`);
            button.disabled = false;
            button.textContent = "Tạo nhiệm vụ";
        }
    });

    $("add-task-title").focus();
}
function setupKanbanButton() {
    const button = $("open-kanban-btn");
    if (!button) return;

    button.addEventListener("click", () => {
        const tasksTab = document.querySelector('[data-tab="Tasks"]');
        if (tasksTab) tasksTab.click();
    });
}

const addTaskButton = $("add-task-btn");

if (addTaskButton) {
    addTaskButton.addEventListener("click", addTask);
}

setupTabs();
loadProject();
