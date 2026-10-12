document.addEventListener("DOMContentLoaded", () => {
    loadGroups();
    setupEvents();
});

let groups = [];

async function loadGroups() {
    const loading = document.getElementById("loading");
    const grid = document.getElementById("groups-grid");
    const summary = document.getElementById("group-summary");

    loading.classList.remove("hidden");
    grid.innerHTML = "";
    hideError();

    try {
        const result = await api.get("/api/groups");

        if (!Array.isArray(result)) {
            throw new Error("Dữ liệu nhóm trả về không hợp lệ.");
        }

        groups = result;
        summary.textContent = `${groups.length} nhóm`;
        renderGroups(groups);
    } catch (error) {
        console.error("Không thể tải danh sách nhóm:", error);

        summary.textContent = "Không thể tải danh sách nhóm";
        showError(
            "Không thể tải danh sách nhóm. Fen kiểm tra đăng nhập và kết nối backend nhé."
        );
    } finally {
        loading.classList.add("hidden");
    }
}

function renderGroups(data) {
    const grid = document.getElementById("groups-grid");
    const empty = document.getElementById("empty-state");
    const title = document.getElementById("empty-title");
    const description = document.getElementById("empty-description");

    grid.innerHTML = "";

    if (data.length === 0) {
        empty.classList.remove("hidden");

        title.textContent = groups.length === 0
            ? "Chưa có nhóm nào"
            : "Không tìm thấy nhóm";

        description.textContent = groups.length === 0
            ? "Tạo nhóm đầu tiên để bắt đầu cộng tác."
            : "Thử tìm kiếm bằng từ khóa khác nhé.";

        return;
    }

    empty.classList.add("hidden");

    data.forEach(group => {
        const card = document.createElement("article");
        card.className = "group-card";

        const color = safeColor(group.color);
        const name = escapeHtml(group.name || "Nhóm chưa có tên");
        const descriptionText = escapeHtml(
            group.description || "Nhóm chưa có mô tả."
        );

        const memberCount = Math.max(
            0,
            Number(group.memberCount) || 0
        );

        const projectCount = Math.max(
            0,
            Number(group.projectCount) || 0
        );

        card.innerHTML = `
            <div
                class="card-accent"
                style="background: ${color}"
            ></div>

            <div
                class="card-glow"
                style="background: ${color}"
            ></div>

            <div class="card-top">
                <div
                    class="group-icon"
                    style="
                        background: ${hexToRgba(color, 0.15)};
                        color: ${color};
                        border-color: ${hexToRgba(color, 0.25)};
                    "
                    aria-hidden="true"
                >
                    ${groupIcon()}
                </div>
            </div>

            <h3>${name}</h3>

            <p class="group-description">
                ${descriptionText}
            </p>

            <div class="member-row">
                <div class="avatars">
                    ${renderAvatars(group, memberCount, color)}
                </div>

                <span class="member-count">
                    ${memberCount} thành viên
                </span>
            </div>

            <div class="card-footer">
                <span class="project-count">
                    <strong>${projectCount}</strong>
                    ${projectCount === 1 ? "dự án" : "dự án"}
                </span>

                <span class="view-link">
                    Xem chi tiết <span aria-hidden="true">→</span>
                </span>
            </div>
        `;
                card.addEventListener("click", () => {
                    window.location.href =
                        `group-detail.html?id=${encodeURIComponent(group.id)}`;
                });

                grid.appendChild(card);
    });
}

function groupIcon() {
    return `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <rect x="3" y="4" width="18" height="16" rx="4"></rect>
            <path d="M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
            <path d="M5.5 16a3.5 3.5 0 0 1 7 0"></path>
            <path d="M15 9h3"></path>
            <path d="M15 13h3"></path>
        </svg>
    `;
}

function renderAvatars(group, memberCount, color) {
    const avatars = Array.isArray(group.avatars)
        ? group.avatars
        : [];

    const visibleCount = Math.min(
        avatars.length,
        3,
        memberCount
    );

    let html = "";

    for (let i = 0; i < visibleCount; i++) {
        const avatar = String(avatars[i] || "?");
        const initial = escapeHtml(
            avatar.trim().charAt(0).toUpperCase() || "?"
        );

        html += `
            <span
                class="avatar"
                style="background: ${color}"
                title="${escapeHtml(avatar)}"
            >${initial}</span>
        `;
    }

    if (visibleCount === 0 && memberCount > 0) {
        html = `
            <span
                class="avatar"
                style="background: ${color}"
            >${memberCount > 99 ? "99+" : memberCount}</span>
        `;
    }

    if (memberCount > visibleCount && visibleCount > 0) {
        html += `
            <span
                class="avatar"
                style="background: #292D49; color: #C7D0F8"
            >+${memberCount - visibleCount}</span>
        `;
    }

    return html;
}

function setupEvents() {
    document.getElementById("search-input")
        .addEventListener("input", event => {
            const keyword = event.target.value.trim().toLowerCase();

            const filtered = groups.filter(group =>
                (group.name || "").toLowerCase().includes(keyword) ||
                (group.description || "").toLowerCase().includes(keyword)
            );

            renderGroups(filtered);
        });

    document.getElementById("new-group-btn")
        .addEventListener("click", openModal);

    document.getElementById("close-modal-btn")
        .addEventListener("click", closeModal);

    document.getElementById("cancel-modal-btn")
        .addEventListener("click", closeModal);

    document.getElementById("group-modal")
        .addEventListener("click", event => {
            if (event.target.id === "group-modal") {
                closeModal();
            }
        });

    document.getElementById("group-form")
        .addEventListener("submit", createGroup);
}

function openModal() {
    const modal = document.getElementById("group-modal");

    modal.classList.remove("hidden");

    document.getElementById("modal-error").classList.add("hidden");
    document.getElementById("modal-title").textContent = "Create Group";
    document.getElementById("create-group-btn").textContent = "Create Group";
    document.getElementById("group-name-input").focus();
}

function closeModal() {
    document.getElementById("group-modal").classList.add("hidden");
}

async function createGroup(event) {
    event.preventDefault();

    const name = document.getElementById("group-name-input").value.trim();
    const description = document.getElementById("group-description-input").value.trim();
    const selectedColor = document.querySelector(
        'input[name="color"]:checked'
    );

    const button = document.getElementById("create-group-btn");

    if (!name) {
        showModalError("Tên nhóm không được để trống.");
        return;
    }

    if (!selectedColor) {
        showModalError("Fen hãy chọn màu cho nhóm.");
        return;
    }

    button.disabled = true;
    button.textContent = "Đang tạo...";

    try {
        await api.post("/api/groups", {
            name,
            description,
            color: safeColor(selectedColor.value)
        });

        document.getElementById("group-form").reset();

        closeModal();
        await loadGroups();
    } catch (error) {
        console.error("Không thể tạo nhóm:", error);

        showModalError(
            "Tạo nhóm thất bại. Kiểm tra quyền đăng nhập và dữ liệu gửi lên."
        );
    } finally {
        button.disabled = false;
        button.textContent = "Create Group";
    }
}

function showError(message) {
    const element = document.getElementById("error-message");

    element.textContent = message;
    element.classList.remove("hidden");
}

function hideError() {
    const element = document.getElementById("error-message");

    element.textContent = "";
    element.classList.add("hidden");
}

function showModalError(message) {
    const element = document.getElementById("modal-error");

    element.textContent = message;
    element.classList.remove("hidden");
}

function safeColor(color) {
    return /^#[0-9a-fA-F]{6}$/.test(color || "")
        ? color
        : "#6366F1";
}

function hexToRgba(hex, alpha) {
    const color = safeColor(hex);

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}