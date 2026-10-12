const tabs = ["Profile", "Security", "Notifications", "Appearance"];

const currentUser = JSON.parse(localStorage.getItem("flowtask_user") || "{}");

const state = {
    tab: "Profile",
    saved: false,
    error: "",
    form: {
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        jobTitle: currentUser.jobTitle || "",
        organization: currentUser.organization || "",
        bio: currentUser.bio || ""
    },
    theme: localStorage.getItem("flowtask_theme") || "Dark",
    accent: localStorage.getItem("flowtask_accent") || "#6366F1"
};

const app = document.getElementById("app");

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function initials() {
    return currentUser.initials ||
        `${state.form.firstName[0] || ""}${state.form.lastName[0] || ""}`.toUpperCase() ||
        "FT";
}

function fullName() {
    return `${state.form.firstName} ${state.form.lastName}`.trim() ||
        currentUser.fullName || "FlowTask User";
}

function inputField(label, key, type = "text") {
    return `
        <div class="form-field">
            <label for="${key}">${label}</label>
            <input class="form-control" id="${key}" name="${key}"
                type="${type}" value="${escapeHtml(state.form[key])}">
        </div>
    `;
}

function toggleRow(label, enabled, key) {
    return `
        <div class="toggle-row">
            <span class="toggle-label">${label}</span>
            <button type="button" class="toggle ${enabled ? "active" : ""}"
                data-toggle="${key}" aria-pressed="${enabled}"></button>
        </div>
    `;
}

function renderProfile() {
    return `
        <form id="profile-form" class="tab-content form-stack">
            <div class="form-row">
                ${inputField("First name", "firstName")}
                ${inputField("Last name", "lastName")}
            </div>
            ${inputField("Email", "email", "email")}
            ${inputField("Job title", "jobTitle")}
            ${inputField("Organization", "organization")}
            <div class="form-field">
                <label for="bio">Bio</label>
                <textarea class="form-control" id="bio" name="bio" rows="3">${escapeHtml(state.form.bio)}</textarea>
            </div>

            <div id="form-message" class="${state.error ? "message-error" : "message-success"}" role="alert">
                ${escapeHtml(state.error || (state.saved ? "Saved successfully!" : ""))}
            </div>

            <div class="form-actions">
                <button class="btn btn-primary" type="submit">
                    ${state.saved ? "✓ Saved!" : "Save changes"}
                </button>
                <button class="btn btn-outline" type="button" id="cancel-profile">Cancel</button>
            </div>
        </form>
    `;
}

function renderSecurity() {
    return `
        <div class="tab-content">
            <section class="panel">
                <div class="panel-body">
                    <h3 class="panel-title title-font">Change Password</h3>
                    <form id="password-form" class="security-fields">
                        ${["Current password", "New password", "Confirm new password"].map((label, i) => `
                            <div class="form-field">
                                <label for="password-${i}">${label}</label>
                                <input class="form-control" id="password-${i}" type="password"
                                    placeholder="••••••••" required>
                            </div>
                        `).join("")}
                        <button class="btn btn-primary" type="submit">Update password</button>
                        <div id="password-message" class="message-error"></div>
                    </form>
                </div>
            </section>

            <section class="panel">
                <div class="panel-body" style="display:flex;justify-content:space-between;align-items:center;gap:16px">
                    <div>
                        <h3 class="panel-title" style="margin-bottom:4px">Two-factor authentication</h3>
                        <div class="panel-description">Add an extra layer of security to your account</div>
                    </div>
                    ${toggleRow("", true, "two-factor")}
                </div>
            </section>

            <section class="panel danger-panel">
                <div class="panel-body">
                    <h3 class="panel-title">Danger Zone</h3>
                    <p class="panel-description">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    <button class="btn btn-danger" id="delete-account" type="button">Delete account</button>
                </div>
            </section>
        </div>
    `;
}

function renderNotifications() {
    const sections = [
        {
            title: "Email Notifications",
            items: [
                ["Task assigned to you", true],
                ["Comments on your tasks", true],
                ["Project updates", false],
                ["Weekly digest", true]
            ]
        },
        {
            title: "In-App Notifications",
            items: [
                ["Task due reminders", true],
                ["Mention alerts", true],
                ["Sprint start/end", false]
            ]
        }
    ];

    return `<div class="tab-content">${sections.map((section, index) => `
        <section class="panel">
            <div class="panel-body" style="border-bottom:1px solid rgba(255,255,255,.05)">
                <h3 class="panel-title" style="margin:0">${section.title}</h3>
            </div>
            ${section.items.map(([label, enabled], i) =>
                toggleRow(label, enabled, `notification-${index}-${i}`)
            ).join("")}
        </section>
    `).join("")}</div>`;
}

function renderAppearance() {
    const themes = [
        ["Dark", "#0B0D16"],
        ["Dim", "#1C2040"],
        ["Light", "#F7F8FA"]
    ];

    const accents = ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

    return `
        <div class="tab-content form-stack">
            <section class="panel">
                <div class="panel-body">
                    <h3 class="panel-title">Theme</h3>
                    <div class="theme-options">
                        ${themes.map(([label, bg]) => `
                            <button type="button" class="theme-option ${state.theme === label ? "active" : ""}"
                                data-theme="${label}" style="background:${bg}">
                                <span class="theme-preview"></span>
                                <span class="theme-name">${label}</span>
                            </button>
                        `).join("")}
                    </div>
                </div>
            </section>

            <section class="panel">
                <div class="panel-body">
                    <h3 class="panel-title">Accent color</h3>
                    <div class="accent-options">
                        ${accents.map(color => `
                            <button type="button"
                                class="accent-option ${state.accent === color ? "active" : ""}"
                                data-accent="${color}" style="background:${color}"
                                aria-label="Choose ${color}"></button>
                        `).join("")}
                    </div>
                </div>
            </section>

            <button type="button" class="btn btn-primary" id="save-appearance"
                style="align-self:flex-start">Save appearance</button>
            <div id="appearance-message" class="message-success"></div>
        </div>
    `;
}

function render() {
    const content = {
        Profile: renderProfile,
        Security: renderSecurity,
        Notifications: renderNotifications,
        Appearance: renderAppearance
    }[state.tab]();

    app.innerHTML = `
        <main class="profile-page">
            <h1 class="page-title">Account Settings</h1>

            <section class="profile-hero">
                <div class="avatar">
                    ${escapeHtml(initials())}
                    <span class="avatar-status"></span>
                </div>
                <div class="profile-info">
                    <h2>${escapeHtml(fullName())}</h2>
                    <p>${escapeHtml(state.form.jobTitle || "No job title")} ·
                       ${escapeHtml(state.form.organization || "No organization")} ·
                       ${escapeHtml(state.form.email)}</p>
                    <div class="profile-stats">
                        <div class="stat"><strong>12</strong><span>Active Tasks</span></div>
                        <div class="stat"><strong>5</strong><span>Projects</span></div>
                        <div class="stat"><strong>3</strong><span>Groups</span></div>
                    </div>
                </div>
                <button type="button" class="btn btn-photo" id="change-photo">Change photo</button>
                <input type="file" id="photo-input" accept="image/*" hidden>
            </section>

            <nav class="profile-tabs">
                ${tabs.map(tab => `
                    <button type="button" class="profile-tab ${state.tab === tab ? "active" : ""}"
                        data-tab="${tab}">${tab}</button>
                `).join("")}
            </nav>

            <section id="tab-content">${content}</section>
        </main>
    `;

    bindEvents();
}

function bindEvents() {
    document.querySelectorAll("[data-tab]").forEach(button => {
        button.addEventListener("click", () => {
            collectForm();
            state.tab = button.dataset.tab;
            state.error = "";
            render();
        });
    });

    const form = document.getElementById("profile-form");
    if (form) {
        form.addEventListener("input", collectForm);
        form.addEventListener("submit", async event => {
            event.preventDefault();
            collectForm();
            await saveProfile();
        });
    }

    document.getElementById("cancel-profile")?.addEventListener("click", () => {
        state.form = {
            firstName: currentUser.firstName || "",
            lastName: currentUser.lastName || "",
            email: currentUser.email || "",
            jobTitle: currentUser.jobTitle || "",
            organization: currentUser.organization || "",
            bio: currentUser.bio || ""
        };
        state.error = "";
        state.saved = false;
        render();
    });

    document.querySelectorAll("[data-toggle]").forEach(button => {
        button.addEventListener("click", () => {
            button.classList.toggle("active");
            button.setAttribute("aria-pressed", button.classList.contains("active"));
        });
    });

    document.querySelectorAll("[data-theme]").forEach(button => {
        button.addEventListener("click", () => {
            state.theme = button.dataset.theme;
            render();
        });
    });

    document.querySelectorAll("[data-accent]").forEach(button => {
        button.addEventListener("click", () => {
            state.accent = button.dataset.accent;
            render();
        });
    });

    document.getElementById("save-appearance")?.addEventListener("click", () => {
        localStorage.setItem("flowtask_theme", state.theme);
        localStorage.setItem("flowtask_accent", state.accent);

        document.documentElement.style.setProperty("--primary", state.accent);
        document.documentElement.style.setProperty("--purple", state.accent);

        const message = document.getElementById("appearance-message");
        if (message) message.textContent = "Appearance saved!";
    });

    document.getElementById("change-photo")?.addEventListener("click", () => {
        document.getElementById("photo-input").click();
    });

    document.getElementById("photo-input")?.addEventListener("change", event => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const avatar = document.querySelector(".avatar");
            avatar.innerHTML = `<img src="${reader.result}" alt="Avatar"
                style="width:100%;height:100%;border-radius:50%;object-fit:cover">
                <span class="avatar-status"></span>`;
        };
        reader.readAsDataURL(file);
    });

    document.getElementById("password-form")?.addEventListener("submit", event => {
        event.preventDefault();
        const values = [...event.target.querySelectorAll("input")].map(input => input.value);
        const message = document.getElementById("password-message");

        if (values[1] !== values[2]) {
            message.textContent = "New passwords do not match.";
            return;
        }

        message.textContent = "Backend API for changing password is not configured yet.";
    });

    document.getElementById("delete-account")?.addEventListener("click", () => {
        alert("Account deletion API is not configured. No data has been deleted.");
    });
}

function collectForm() {
    const form = document.getElementById("profile-form");
    if (!form) return;

    ["firstName", "lastName", "email", "jobTitle", "organization", "bio"].forEach(key => {
        const input = form.elements.namedItem(key);
        if (input) state.form[key] = input.value;
    });
}

async function saveProfile() {
    state.error = "";
    state.saved = false;

    try {
        if (typeof api !== "function") {
            throw new Error("Cannot find api() in js/api.js");
        }

        const updated = await api("/users/me", {
            method: "PUT",
            body: JSON.stringify(state.form)
        });

        Object.assign(currentUser, updated);
        localStorage.setItem("flowtask_user", JSON.stringify(currentUser));

        state.form.firstName = updated.firstName ?? state.form.firstName;
        state.form.lastName = updated.lastName ?? state.form.lastName;
        state.form.email = updated.email ?? state.form.email;
        state.form.jobTitle = updated.jobTitle ?? state.form.jobTitle;
        state.form.organization = updated.organization ?? state.form.organization;
        state.form.bio = updated.bio ?? state.form.bio;

        state.saved = true;
    } catch (error) {
        state.error = error instanceof Error ? error.message : "Unable to save profile";
    }

    render();
}

if (state.theme === "Dim") {
    document.documentElement.style.setProperty("--bg", "#1C2040");
} else if (state.theme === "Light") {
    document.documentElement.style.setProperty("--bg", "#F7F8FA");
    document.documentElement.style.setProperty("--card", "#FFFFFF");
    document.documentElement.style.setProperty("--text", "#1F2937");
    document.documentElement.style.setProperty("--muted", "#6B7280");
}

document.documentElement.style.setProperty("--primary", state.accent);
document.documentElement.style.setProperty("--purple", state.accent);

render();