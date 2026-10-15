
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
    page.members.innerHTML = `
        <div class="members-heading">
            <div>
                <h2>Thành viên nhóm</h2>
                <p>${members.length} thành viên</p>
            </div>

            <button
                type="button"
                id="show-add-member-btn"
                class="primary-btn"
            >
                + Add Member
            </button>
        </div>

        <form id="add-member-form" class="add-member-form hidden">
            <label for="member-email">Email tài khoản FlowTask</label>

            <div class="add-member-input-row">
                <input
                    id="member-email"
                    type="email"
                    placeholder="example@gmail.com"
                    autocomplete="email"
                    required
                >

                <button
                    type="submit"
                    id="add-member-btn"
                    class="primary-btn"
                    hidden
                >
                    Add to group
                </button>
            </div>

            <p id="add-member-message" role="status"></p>
        </form>

        <div class="members-list">
            ${
                members.length === 0
                    ? '<div class="empty-state">Chưa có thành viên nào.</div>'
                    : members.map(member => {
                        const status = String(
                            member.status || "offline"
                        ).toLowerCase();

                        const dotColor =
                            statusDot[status] || statusDot.offline;

                        return `
                            <article class="member-card">
                                <div class="avatar-wrap">
                                    <div
                                        class="avatar"
                                        style="background:${color}18;color:${color}"
                                    >
                                        ${escapeHtml(member.initials || "?")}
                                    </div>
                                </div>

                                <div class="member-info">
                                    <div class="member-name">
                                        ${escapeHtml(
                                            member.fullName ||
                                            member.name ||
                                            "Unknown member"
                                        )}
                                    </div>

                                    <div class="member-email">
                                        ${escapeHtml(
                                            member.email || "Chưa có email"
                                        )}
                                    </div>
                                </div>

                                <span
                                    class="member-role ${String(
                                        member.role || "Member"
                                    ).toLowerCase().replace(/\s+/g, "-")}"
                                >
                                    ${escapeHtml(member.role || "Member")}
                                </span>
                            </article>
                        `;
                    }).join("")
            }
        </div>
    `;

    const showButton =
        document.getElementById("show-add-member-btn");

    const form =
        document.getElementById("add-member-form");

    const emailInput =
        document.getElementById("member-email");

    const message =
        document.getElementById("add-member-message");

    const submitButton =
        document.getElementById("add-member-btn");

    emailInput.addEventListener("input", () => {
        const email = emailInput.value.trim();

        submitButton.hidden = email.length === 0;
        submitButton.disabled = !emailInput.checkValidity();
    });

    showButton.addEventListener("click", () => {
        form.classList.toggle("hidden");

        if (!form.classList.contains("hidden")) {
            emailInput.focus();
        }
    });

    form.addEventListener("submit", async event => {
        event.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            return;
        }

        message.textContent = "Đang thêm thành viên...";
        message.style.color = "#64748b";
        submitButton.disabled = true;

        try {
            await api.post(`${apiUrl}/members`, { email });

            message.textContent = "Thêm thành viên thành công!";
            message.style.color = "#34D399";

            await loadGroup();
        } catch (error) {
            console.error("Lỗi thêm thành viên:", error);

            let errorData = {};

            try {
                errorData = JSON.parse(error.message);
            } catch {
                errorData = {
                    message: error.message
                };
            }

            const errorMessage = String(
                errorData.message || error.message || ""
            );

            if (
                errorMessage.includes("Group not found") ||
                errorMessage.includes("Nhóm không tồn tại")
            ) {
                message.textContent =
                    "Không tìm thấy nhóm. Vui lòng kiểm tra ID nhóm.";
            } else if (errorData.status === 403) {
                message.textContent =
                    "Bạn không có quyền thêm thành viên. Chỉ Leader mới được thêm.";
            } else if (
                errorData.status === 400 ||
                errorMessage.includes("tự thêm chính mình")
            ) {
                message.textContent =
                    "Email không hợp lệ hoặc bạn không thể tự thêm chính mình.";
            } else if (
                errorData.status === 409 ||
                errorMessage.includes("đã là thành viên")
            ) {
                message.textContent =
                    "Thành viên này đã có trong nhóm.";
            } else if (
                errorData.status === 404 ||
                errorMessage.includes("Không tìm thấy")
            ) {
                message.textContent =
                    "Không tìm thấy tài khoản với email này.";
            } else {
                message.textContent =
                    errorMessage || "Thêm thành viên thất bại. Vui lòng thử lại.";
            }

            message.style.color = "#F87171";
        } finally {
            submitButton.disabled = false;
        }
    });
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
            <article
                class="project-card"
                data-project-id="${escapeHtml(project.id)}"
            >
                <span
                    class="project-dot"
                    style="background:${color}"
                ></span>

                <div class="project-info">
                    <div class="project-name">
                        ${escapeHtml(project.name || "Untitled Project")}
                    </div>

                    <div class="progress-track">
                        <div
                            class="progress-fill"
                            style="width:${percent}%;background:${color}"
                        ></div>
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
        button.classList.toggle(
            "active",
            button.dataset.tab === tab
        );
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
