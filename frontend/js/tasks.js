const columnNames = ["Todo", "In Progress", "Done"];

const statusToColumn = {
    TODO: "Todo",
    IN_PROGRESS: "In Progress",
    DONE: "Done"
};
const columnToStatus = {
    Todo: "TODO",
    "In Progress": "IN_PROGRESS",
    Done: "DONE"
};

const columnConfig = {
    Todo: {
        color: "#8B92B3",
        accent: "rgba(139,146,179,0.12)"
    },
    "In Progress": {
        color: "#818CF8",
        accent: "rgba(99,102,241,0.12)"
    },
    Done: {
        color: "#34D399",
        accent: "rgba(52,211,153,0.12)"
    }
};
const priorityColors = {
    Urgent: "#F87171",
    High: "#FBBF24",
    Medium: "#6366F1",
    Low: "#8B92B3"
};

let columns = {
    Todo: [],
    "In Progress": [],
    Done: []
};

let groups = [];
let projects = [];
let draggingTask = null;
const board = document.getElementById("kanban-board");
const statsRow = document.getElementById("stats-row");
const totalTasksElement = document.getElementById("total-tasks");
const errorMessage = document.getElementById("error-message");

const modal = document.getElementById("task-modal");
const taskForm = document.getElementById("task-form");
const modalError = document.getElementById("modal-error");
const createTaskBtn = document.getElementById("create-task-btn");
const projectSelect = document.getElementById("task-project");
const assigneeSelect = document.getElementById("task-assignee");
const groupSelect = document.getElementById("task-group");
const prioritySelect = document.getElementById("task-priority");
const dueDateInput = document.getElementById("task-due-date");
function setMinDueDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dueDateInput.min = `${year}-${month}-${day}`;
}
function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function titleCase(value) {
    return String(value ?? "")
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, character => character.toUpperCase());
}

function showError(message) {
    errorMessage.textContent = message || "";
    errorMessage.hidden = !message;
}

function showModalError(message) {
    modalError.textContent = message || "";
    modalError.hidden = !message;
}

function toCard(task) {
    return {
        id: task.id,
        title: task.title,
        project: task.projectName || "No project",
        assignee: task.assigneeInitials || "",
        priority: titleCase(task.priority),
        dueDate: task.dueDate || null,
        tags: Array.isArray(task.tags) ? task.tags : [],
        color: task.color || "#6366F1"
    };
}

function getAllTasks() {
    return Object.values(columns).flat();
}

function updateStats() {
    const total = getAllTasks().length;
    totalTasksElement.textContent = total;

    statsRow.innerHTML = columnNames.map(column => {
        const config = columnConfig[column];

        return `
            <div class="stat-item">
                <span class="stat-dot" style="background:${config.color}"></span>
                <span>${column}</span>
                <span class="stat-count" style="color:${config.color}">
                    ${columns[column].length}
                </span>
            </div>
        `;
    }).join("");
}

function renderTask(task, column) {
    const priorityColor = priorityColors[task.priority] || "#8B92B3";
    const isDone = column === "Done";

const isOverdue = task.dueDate
    && task.dueDate < new Date().toLocaleDateString("en-CA")
    && !isDone;

const dueDateHtml = task.dueDate
    ? `
        <div class="task-due-date ${isOverdue ? "overdue" : ""}">
            <span>${isOverdue ? "⚠" : "▦"}</span>
            <span>${escapeHtml(formatDueDate(task.dueDate))}</span>
            ${isOverdue ? '<span class="overdue-label">Quá hạn</span>' : ""}
        </div>
    `
    : "";

    const tagsHtml = task.tags.map(tag => `
        <span class="task-tag" style="--task-color:${escapeHtml(task.color)}">
            ${escapeHtml(tag)}
        </span>
    `).join("");

    return `
        <article
            class="task-card"
            draggable="true"
            data-task-id="${escapeHtml(task.id)}"
            data-column="${escapeHtml(column)}"
            style="--task-color:${escapeHtml(task.color)}"
        >
            <div class="task-tags">${tagsHtml}</div>

            <p class="task-title ${isDone ? "done" : ""}">
                ${escapeHtml(task.title)}
            </p>

            ${dueDateHtml}

            <div class="task-footer">
                <span
                    class="priority-label"
                    style="
                        color:${priorityColor};
                        background:${priorityColor}20;
                    "
                >
                    ${escapeHtml(task.priority)}
                </span>

                <div class="task-footer-right">
                    <span class="task-project">
                        ${escapeHtml(task.project)}
                    </span>

                    <span class="assignee-avatar"
                          style="background:${escapeHtml(task.color)}25;color:${escapeHtml(task.color)}">
                        ${escapeHtml(task.assignee || "—")}
                    </span>
                </div>
            </div>
        </article>
    `;
}
function formatDueDate(value) {
    const date = String(value).split("T")[0];
    const parts = date.split("-");

    if (parts.length !== 3) {
        return value;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function renderBoard() {
    updateStats();

    board.innerHTML = columnNames.map(column => {
        const config = columnConfig[column];
        const displayed = columns[column];

        const cardsHtml = displayed.map(task => renderTask(task, column)).join("");

        return `
            <section
                class="kanban-column"
                data-drop-column="${escapeHtml(column)}"
            >
                <header class="column-header">
                    <div class="column-title">
                        <span
                            class="stat-dot"
                            style="width:10px;height:10px;background:${config.color}"
                        ></span>

                        <h2 style="color:${config.color}">
                            ${escapeHtml(column)}
                        </h2>

                        <span
                            class="column-count"
                            style="color:${config.color};background:${config.accent}"
                        >
                            ${displayed.length}
                        </span>
                    </div>

                    <button
                        type="button"
                        class="column-add-btn"
                        data-add-column="${escapeHtml(column)}"
                        aria-label="Add task to ${escapeHtml(column)}"
                    >＋</button>
                </header>

                <div class="task-list">
                    ${cardsHtml || '<div class="drop-zone">Drop tasks here</div>'}
                </div>
            </section>
        `;
    }).join("");

    attachBoardEvents();
}

function attachBoardEvents() {
    document.querySelectorAll(".task-card").forEach(card => {
        card.addEventListener("dragstart", event => {
            const taskId = Number(card.dataset.taskId);
            const from = card.dataset.column;

            const task = columns[from].find(item => item.id === taskId);

            if (!task) {
                event.preventDefault();
                return;
            }

            draggingTask = { task, from };

            card.classList.add("dragging");

            if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", String(taskId));
            }
        });

        card.addEventListener("dragend", () => {
            draggingTask = null;

            document.querySelectorAll(".task-card").forEach(item => {
                item.classList.remove("dragging");
            });

            document.querySelectorAll(".kanban-column").forEach(item => {
                item.classList.remove("drag-over");
            });
        });
    });

    document.querySelectorAll(".kanban-column").forEach(column => {
        column.addEventListener("dragover", event => {
            event.preventDefault();
            column.classList.add("drag-over");

            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = "move";
            }
        });

        column.addEventListener("dragleave", event => {
            if (!column.contains(event.relatedTarget)) {
                column.classList.remove("drag-over");
            }
        });

        column.addEventListener("drop", event => {
            event.preventDefault();

            const destination = column.dataset.dropColumn;
            column.classList.remove("drag-over");

            if (destination) {
                handleDrop(destination);
            }
        });
    });

    document.querySelectorAll("[data-add-column]").forEach(button => {
        button.addEventListener("click", () => {
            openModal(button.dataset.addColumn);
        });
    });
}
async function handleDrop(destination) {
    if (!draggingTask || draggingTask.from === destination) {
        return;
    }

    const { task, from } = draggingTask;

    const oldColumns = {
        ...columns,
        [from]: [...columns[from]],
        [destination]: [...columns[destination]]
    };

    columns[from] = columns[from].filter(item => item.id !== task.id);
    columns[destination] = [...columns[destination], task];

    renderBoard();
    showError("");

    try {
        await api.patch(`/api/tasks/${task.id}/status`, {
            status: columnToStatus[destination],
            position: columns[destination].length - 1
        });
    } catch (error) {
        columns = oldColumns;
        renderBoard();

        showError(
            error instanceof Error
                ? error.message
                : "Không thể cập nhật trạng thái nhiệm vụ"
        );
    }
}

function populateGroups() {
    groupSelect.innerHTML = '<option value="">Chọn nhóm</option>';

    groups.forEach(group => {
        const option = document.createElement("option");
        option.value = group.id;
        option.textContent = group.name;
        groupSelect.appendChild(option);
    });

    groupSelect.disabled = groups.length === 0;

    if (groups.length === 0) {
        groupSelect.innerHTML = '<option value="">Chưa có nhóm</option>';
    }
}

function populateProjects(groupId) {
    const groupProjects = projects.filter(
        project => String(project.groupId) === String(groupId)
    );

    projectSelect.innerHTML = '<option value="">Chọn dự án</option>';

    groupProjects.forEach(project => {
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.name;
        projectSelect.appendChild(option);
    });

    projectSelect.disabled = groupProjects.length === 0;

    if (!groupId) {
        projectSelect.innerHTML =
            '<option value="">Chọn nhóm trước</option>';
    } else if (groupProjects.length === 0) {
        projectSelect.innerHTML =
            '<option value="">Nhóm chưa có dự án</option>';
    }

    assigneeSelect.innerHTML =
        '<option value="">Chọn dự án trước</option>';
    assigneeSelect.disabled = true;

    return groupProjects;
}

function openModal(column = "Todo") {
    setMinDueDate();
    if (groups.length === 0) {
        showError("Vui lòng tạo nhóm trước khi thêm nhiệm vụ.");
        return;
    }

    taskForm.reset();
    showModalError("");
    showError("");

    groupSelect.value = "";
    projectSelect.innerHTML =
        '<option value="">Chọn nhóm trước</option>';
    projectSelect.disabled = true;

    assigneeSelect.innerHTML =
        '<option value="">Chọn dự án trước</option>';
    assigneeSelect.disabled = true;

    prioritySelect.value = "MEDIUM";
    dueDateInput.value = "";

    modal.dataset.column = column;
    modal.querySelector("#modal-title").textContent =
        column === "Todo" ? "Create Task" : `Create Task in ${column}`;

    modal.hidden = false;
    document.getElementById("task-title").focus();
}
function closeModal() {
    modal.hidden = true;
    showModalError("");
}

document.getElementById("open-modal-btn").addEventListener("click", () => {
    openModal("Todo");
});

document.getElementById("close-modal-btn").addEventListener("click", closeModal);
document.getElementById("cancel-modal-btn").addEventListener("click", closeModal);

modal.addEventListener("click", event => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) {
        closeModal();
    }
});

document.querySelectorAll(".member-filter").forEach(button => {
    button.addEventListener("click", () => {
        selectedMember = button.dataset.member;

        document.querySelectorAll(".member-filter").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        renderBoard();
    });
});


taskForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("task-title").value.trim();
    const description = document.getElementById("task-description").value.trim();
    const groupId = groupSelect.value;
    const projectId = projectSelect.value;
    const priority = prioritySelect.value;
    const assigneeId = assigneeSelect.value;
    const dueDate = dueDateInput.value || null;

    if (!title || !groupId || !projectId) {
        showModalError("Vui lòng nhập tên nhiệm vụ, chọn nhóm và dự án.");
        return;
    }

    if (dueDate) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const todayString = `${year}-${month}-${day}`;

        if (dueDate < todayString) {
            showModalError("Deadline không được trước ngày hôm nay!");
            return;
        }
    }

    try {
        createTaskBtn.disabled = true;
        createTaskBtn.textContent = "Đang tạo...";
        showModalError("");

        await api.post("/api/tasks", {
            title: title,
            description: description,
            projectId: Number(projectId),
            assigneeId: assigneeId ? Number(assigneeId) : null,
            status: columnToStatus[modal.dataset.column || "Todo"],
            priority: priority,
            dueDate: dueDate,
            tags: [],
            position: 0
        });

        closeModal();
        await loadTasks();
    } catch (error) {
        showModalError(error.message || "Không thể tạo nhiệm vụ.");
    } finally {
        createTaskBtn.disabled = false;
        createTaskBtn.textContent = "Create Task";
    }
});

async function loadTasks() {
    try {
        const [taskItems, projectItems] = await Promise.all([
            api.get("/api/tasks"),
            api.get("/api/projects")
        ]);

        const user = JSON.parse(
            localStorage.getItem("flowtask_user") || "null"
        );

        if (!user || user.id == null) {
            throw new Error("Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.");
        }

        const myTasks = taskItems

        columns = {
            Todo: [],
            "In Progress": [],
            Done: []
        };

        myTasks.forEach(task => {
            const column = statusToColumn[task.status];

            if (column) {
                columns[column].push(toCard(task));
            }
        });

        projects = projectItems;
        renderBoard();
        showError("");
    } catch (error) {
        board.innerHTML = '<p class="empty-message">Không tải được nhiệm vụ.</p>';

        showError(
            error instanceof Error
                ? error.message
                : "Không thể tải danh sách nhiệm vụ"
        );
    }
}

async function loadAssignees(projectId) {
    assigneeSelect.innerHTML = "";

    if (!projectId) {
        assigneeSelect.innerHTML =
            '<option value="">Chọn Project trước</option>';
        assigneeSelect.disabled = true;
        return;
    }

    assigneeSelect.disabled = true;
    assigneeSelect.innerHTML =
        '<option value="">Đang tải thành viên...</option>';

    try {
        const members = await api.get(
            `/api/projects/${projectId}/members`
        );

        assigneeSelect.innerHTML =
            '<option value="">Chưa giao nhiệm vụ</option>';

        members.forEach(member => {
            const option = document.createElement("option");
            option.value = member.id;
            option.textContent = member.name;
            assigneeSelect.appendChild(option);
        });

        assigneeSelect.disabled = false;
    } catch (error) {
        assigneeSelect.innerHTML =
            '<option value="">Không tải được thành viên</option>';
        console.error(error);
    }
}


async function loadGroups() {
    try {
        groups = await api.get("/api/groups");
        populateGroups();
    } catch (error) {
        groups = [];
        populateGroups();
        showError(error.message || "Không thể tải danh sách nhóm.");
    }
}

groupSelect.addEventListener("change", function () {
    populateProjects(this.value);
});

projectSelect.addEventListener("change", function () {
    loadAssignees(this.value);
});

async function initTasksPage() {
    await Promise.all([
        loadTasks(),
        loadGroups()
    ]);
}

initTasksPage();