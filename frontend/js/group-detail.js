
const params = new URLSearchParams(window.location.search);
const groupId = params.get("id");
const statusDot = {
    online: "#34D399",
    away: "#FBBF24",
    offline: "#8B92B3"
};

const page = {
    loading: document.getElementById("loading"),
    error: document.getElementById("error-message"),
    content: document.getElementById("group-content"),
    name: document.getElementById("group-name"),
    breadcrumb: document.getElementById("breadcrumb-name"),
    description: document.getElementById("group-description"),
    headerLine: document.getElementById("header-line"),
    headerGlow: document.getElementById("header-glow"),
    icon: document.getElementById("group-icon"),
    memberCount: document.getElementById("member-count"),
    projectCount: document.getElementById("project-count"),
    activeTaskCount: document.getElementById("active-task-count"),
    members: document.getElementById("members-panel"),
    projects: document.getElementById("projects-panel"),
    tabs: document.querySelectorAll(".tab-btn")
};

const apiUrl = `/api/groups/${encodeURIComponent(groupId || "")}`;

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function validColor(color, fallback = "#6366F1") {
    return typeof color === "string" &&
        /^#[0-9a-fA-F]{3,8}$/.test(color)
        ? color
        : fallback;
}

function showError(message) {
    page.loading.classList.add("hidden");
    page.content.classList.add("hidden");
    page.error.textContent = message;
    page.error.classList.remove("hidden");
}

function renderGroup(data) {
    const color = validColor(data.color);
    const members = Array.isArray(data.members) ? data.members : [];
    const projects = Array.isArray(data.projects) ? data.projects : [];

    page.name.textContent = data.name || "Untitled Group";
    page.breadcrumb.textContent = data.name || "Untitled Group";
    page.description.textContent = data.description || "No description";

    page.headerLine.style.background = color;
    page.headerGlow.style.background =
        `radial-gradient(circle, ${color}22 0%, transparent 70%)`;

    page.icon.style.color = color;
    page.icon.style.background = `${color}20`;
    page.icon.style.border = `1px solid ${color}40`;

    page.memberCount.textContent = members.length;
    page.projectCount.textContent = projects.length;

    const activeTasks = projects.reduce((sum, project) => {
        const total = Number(project.taskCount) || 0;
        const done = Number(project.doneCount) || 0;

        return sum + Math.max(0, total - done);
    }, 0);

    page.activeTaskCount.textContent = activeTasks;

    renderMembers(members, color);
    renderProjects(projects);

    page.loading.classList.add("hidden");
    page.error.classList.add("hidden");
    page.content.classList.remove("hidden");

    setTab("members");
}

function renderMembers(members, color) {
    if (members.length === 0) {
        page.members.innerHTML =
            '<div class="empty-state">No members in this group.</div>';
        return;
    }

    page.members.innerHTML = members.map(member => {
        const status = String(member.status || "offline").toLowerCase();
        const dotColor = statusDot[status] || statusDot.offline;

        return `
            <article class="member-card">
                <div class="avatar-wrap">
                    <div class="avatar"
                         style="background:${color}25;color:${color}">
                        ${escapeHtml(member.initials || "?")}
                    </div>
                    <span class="status-dot"
                          style="background:${dotColor}"></span>
                </div>

                <div class="member-info">
                    <div class="member-name">
                        ${escapeHtml(member.fullName || member.name || "Unknown member")}
                    </div>
                    <div class="member-role">
                        ${escapeHtml(member.role || "Member")}
                    </div>
                </div>

                <div class="member-status" style="color:${color}">
                    ${escapeHtml(status)}
                </div>
            </article>
        `;
    }).join("");
}

function renderProjects(projects) {
    if (projects.length === 0) {
        page.projects.innerHTML =
            '<div class="empty-state">No projects in this group.</div>';
        return;
    }

    page.projects.innerHTML = projects.map(project => {
        const color = validColor(project.color);
        const total = Math.max(0, Number(project.taskCount) || 0);
        const done = Math.max(0, Number(project.doneCount) || 0);
        const percent = total
            ? Math.min(100, Math.round(done / total * 100))
            : 0;

        return `
            <article class="project-card"
                     data-project-id="${escapeHtml(project.id)}">
                <span class="project-dot"
                      style="background:${color}"></span>

                <div class="project-info">
                    <div class="project-name">
                        ${escapeHtml(project.name || "Untitled Project")}
                    </div>

                    <div class="progress-track">
                        <div class="progress-fill"
                             style="width:${percent}%;background:${color}">
                        </div>
                    </div>
                </div>

                <span class="project-count">${done}/${total}</span>
            </article>
        `;
    }).join("");

    page.projects.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.dataset.projectId;
            window.location.href =
                `project-detail.html?id=${encodeURIComponent(id)}`;
        });
    });
}

function setTab(tab) {
    page.tabs.forEach(button => {
        button.classList.toggle("active", button.dataset.tab === tab);
    });

    page.members.classList.toggle("hidden", tab !== "members");
    page.projects.classList.toggle("hidden", tab !== "projects");
}

page.tabs.forEach(button => {
    button.addEventListener("click", () => {
        setTab(button.dataset.tab);
    });
});

async function loadGroup() {
    if (!groupId) {
        showError("Thiếu ID nhóm trong URL.");
        return;
    }

    try {
        const data = await api.get(apiUrl);
        renderGroup(data);
    } catch (error) {
        console.error("Không thể tải chi tiết nhóm:", error);
        showError(error.message || "Không thể tải chi tiết nhóm.");
    }
}

loadGroup();
