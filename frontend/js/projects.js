const statusStyle = {
    ACTIVE: { bg: "rgba(52,211,153,0.12)", text: "#34D399" },
    REVIEW: { bg: "rgba(251,191,36,0.12)", text: "#FBBF24" },
    PLANNING: { bg: "rgba(99,102,241,0.12)", text: "#818CF8" },
    PAUSED: { bg: "rgba(255,255,255,0.06)", text: "#8B92B3" }
};

const priorityColor = {
    CRITICAL: "#F87171",
    HIGH: "#FBBF24",
    MEDIUM: "#8B92B3",
    LOW: "#8B92B3"
};

let projects = [];
let groups = [];
let view = "grid";

const container = document.getElementById("projects-container");
const searchInput = document.getElementById("search-input");
const countElement = document.getElementById("project-count");
const errorElement = document.getElementById("error-message");
const emptyState = document.getElementById("empty-state");
const modal = document.getElementById("project-modal");
const form = document.getElementById("project-form");
const groupSelect = document.getElementById("form-group");
const createButton = document.getElementById("create-project-btn");
const modalError = document.getElementById("modal-error");

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function titleCase(value) {
    if (!value) return "";

    return String(value)
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
}

function getStatusStyle(status) {
    return statusStyle[String(status || "").toUpperCase()] ||
        statusStyle.PAUSED;
}

function getPriorityColor(priority) {
    return priorityColor[String(priority || "").toUpperCase()] ||
        "#8B92B3";
}

function getProgress(project) {
    const total = Number(project.taskCount) || 0;
    const done = Number(project.doneCount) || 0;

    if (total <= 0) return 0;

    return Math.max(0, Math.min(100, Math.round(done / total * 100)));
}

function formatDeadline(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return escapeHtml(value);
    }

    return date.toLocaleDateString();
}

function setError(message) {
    errorElement.textContent = message || "";
    errorElement.hidden = !message;
}

function setModalError(message) {
    modalError.textContent = message || "";
    modalError.hidden = !message;
}

function getFilteredProjects() {
    const keyword = searchInput.value.trim().toLowerCase();

    return projects.filter(project =>
        String(project.name || "").toLowerCase().includes(keyword)
    );
}

function renderProjects() {
    const filtered = getFilteredProjects();

    countElement.textContent =
        `${projects.length} projects across all groups`;

    container.classList.toggle("list-view", view === "list");
    container.innerHTML = "";

    emptyState.hidden = filtered.length > 0;

    if (view === "grid") {
        container.className = "projects-grid";
        renderGrid(filtered);
    } else {
        container.className = "projects-grid list-view";
        renderList(filtered);
    }

    document.querySelectorAll(".view-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.view === view
        );
    });
}

function renderGrid(items) {
    container.innerHTML = items.map(project => {
        const color = project.color || "#6366F1";
        const status = String(project.status || "").toUpperCase();
        const style = getStatusStyle(status);
        const progress = getProgress(project);
        const priority = String(project.priority || "MEDIUM").toUpperCase();
        const groupName = project.groupName || "No group";

        return `
            <article
                class="project-card"
                data-project-id="${escapeHtml(project.id)}"
                tabindex="0"
                role="link"
                aria-label="Open project ${escapeHtml(project.name)}"
                style="--project-color: ${escapeHtml(color)}"
            >
                <div class="project-card-bar"></div>

                <div class="project-card-top">
                    <span
                        class="status-badge"
                        style="background:${style.bg};color:${style.text}"
                    >${escapeHtml(titleCase(status))}</span>

                    <span
                        class="priority-label"
                        style="color:${getPriorityColor(priority)}"
                    >${escapeHtml(titleCase(priority))}</span>
                </div>

                <h3>${escapeHtml(project.name)}</h3>
                <p class="project-group-name">${escapeHtml(groupName)}</p>

                <div class="project-progress">
                    <div class="progress-info">
                        <span>Progress</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-bar" style="width:${progress}%"></div>
                    </div>
                </div>

                <div class="project-card-footer">
                    <div
                        class="project-group-avatar"
                        title="${escapeHtml(groupName)}"
                    >${escapeHtml(groupName.slice(0, 2).toUpperCase())}</div>

                    <span class="project-deadline">
                        Due ${formatDeadline(project.deadline)}
                    </span>
                </div>
            </article>
        `;
    }).join("");
}

function renderList(items) {
    container.innerHTML = `
        <table class="projects-table">
            <thead>
                <tr>
                    <th>Project</th>
                    <th>Group</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Progress</th>
                    <th>Deadline</th>
                    <th>Team</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(project => {
                    const color = project.color || "#6366F1";
                    const status = String(project.status || "").toUpperCase();
                    const style = getStatusStyle(status);
                    const priority = String(project.priority || "MEDIUM").toUpperCase();
                    const groupName = project.groupName || "No group";
                    const progress = getProgress(project);

                    return `
                        <tr
                            data-project-id="${escapeHtml(project.id)}"
                            tabindex="0"
                            role="link"
                            aria-label="Open project ${escapeHtml(project.name)}"
                            style="--project-color:${escapeHtml(color)}"
                        >
                            <td>
                                <div class="table-project-name">
                                    <span class="table-project-dot"></span>
                                    <span>${escapeHtml(project.name)}</span>
                                </div>
                            </td>

                            <td style="color:#8B92B3">
                                ${escapeHtml(groupName)}
                            </td>

                            <td>
                                <span
                                    class="status-badge"
                                    style="background:${style.bg};color:${style.text}"
                                >${escapeHtml(titleCase(status))}</span>
                            </td>

                            <td>
                                <span
                                    style="color:${getPriorityColor(priority)};font-weight:600"
                                >${escapeHtml(titleCase(priority))}</span>
                            </td>

                            <td>
                                <div class="table-progress">
                                    <div class="progress-track">
                                        <div class="progress-bar" style="width:${progress}%"></div>
                                    </div>
                                    <span>${progress}%</span>
                                </div>
                            </td>

                            <td style="color:#8B92B3">
                                ${formatDeadline(project.deadline)}
                            </td>

                            <td>
                                <div
                                    class="project-group-avatar"
                                    title="${escapeHtml(groupName)}"
                                >${escapeHtml(groupName.slice(0, 2).toUpperCase())}</div>
                            </td>
                        </tr>
                    `;
                }).join("")}
            </tbody>
        </table>
    `;
}

function openProject(id) {
    window.location.href =
        `project-detail.html?id=${encodeURIComponent(id)}`;
}

async function loadProjects() {
    try {
        const [projectItems, groupItems] = await Promise.all([
            api.get("/api/projects"),
            api.get("/api/groups")
        ]);

        projects = Array.isArray(projectItems) ? projectItems : [];
        groups = Array.isArray(groupItems) ? groupItems : [];

        groupSelect.innerHTML = `
            <option value="">Select a group</option>
            ${groups.map(group => `
                <option value="${escapeHtml(group.id)}">
                    ${escapeHtml(group.name)}
                </option>
            `).join("")}
        `;

        if (groups.length > 0) {
            groupSelect.value = String(groups[0].id);
        }

        setError("");
        renderProjects();
    } catch (error) {
        setError(
            error instanceof Error
                ? error.message
                : "Unable to load projects"
        );

        projects = [];
        renderProjects();
    }
}

function openModal() {
    setModalError("");
    modal.hidden = false;
    document.getElementById("form-name").focus();
}

function closeModal() {
    modal.hidden = true;
    setModalError("");
}


async function createProject(event) {
    event.preventDefault();
    setModalError("");

    const name = document.getElementById("form-name").value.trim();
    const description =
        document.getElementById("form-description").value.trim();
    const groupId = groupSelect.value;
    const priority = document.getElementById("form-priority").value;
    const deadline = document.getElementById("form-deadline").value;

    if (!name) {
        setModalError("Please enter a project name.");
        return;
    }

    if (!groupId) {
        setModalError("Please select a group.");
        return;
    }

    createButton.disabled = true;
    createButton.textContent = "Creating...";

    try {
        const created = await api.post("/api/projects", {
            name,
            description,
            groupId: Number(groupId),
            priority,
            status: "PLANNING",
            color: "#6366F1",
            deadline: deadline || null
        });

        projects = [
            created,
            ...projects.filter(item => item.id !== created.id)
        ];

        form.reset();
        document.getElementById("form-priority").value = "MEDIUM";

        if (groups.length > 0) {
            groupSelect.value = String(groups[0].id);
        }

        closeModal();
        setError("");
        renderProjects();

    } catch (error) {
        let message = error instanceof Error
            ? error.message
            : "Unable to create project";

        try {
            const parsed = JSON.parse(message);
            message = parsed.message || message;
        } catch (e) {
        }

        setModalError(message);

    } finally {
        createButton.disabled = false;
        createButton.textContent = "Create Project";
    }
}


document.querySelectorAll(".view-btn").forEach(button => {
    button.addEventListener("click", () => {
        view = button.dataset.view;
        renderProjects();
    });
});

searchInput.addEventListener("input", renderProjects);

container.addEventListener("click", event => {
    const card = event.target.closest("[data-project-id]");

    if (card) {
        openProject(card.dataset.projectId);
    }
});

container.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest("[data-project-id]");

    if (card) {
        event.preventDefault();
        openProject(card.dataset.projectId);
    }
});

document.getElementById("new-project-btn")
    .addEventListener("click", openModal);

document.getElementById("close-modal-btn")
    .addEventListener("click", closeModal);

document.getElementById("cancel-modal-btn")
    .addEventListener("click", closeModal);

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

form.addEventListener("submit", createProject);

loadProjects();