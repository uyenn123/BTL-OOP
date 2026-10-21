const tabs = ["Profile", "Security"];

const currentUser = JSON.parse(
    localStorage.getItem("flowtask_user") || "{}"
);

const state = {
    tab: "Profile",
    saved: false,
    error: "",
    form: {
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || ""
    }
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
            <input class="form-control"
                id="${key}"
                name="${key}"
                type="${type}"
                value="${escapeHtml(state.form[key])}">
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

            <div id="form-message"
                class="${state.error ? "message-error" : "message-success"}"
                role="alert">
                ${escapeHtml(
                    state.error ||
                    (state.saved ? "Saved successfully!" : "")
                )}
            </div>

            <div class="form-actions">
                <button class="btn btn-primary" type="submit">
                    ${state.saved ? "✓ Saved!" : "Save changes"}
                </button>

                <button class="btn btn-outline"
                    type="button"
                    id="cancel-profile">
                    Cancel
                </button>
            </div>
        </form>
    `;
}

function toggleRow(label, enabled, key) {
    return `
        <div class="toggle-row">
            <span class="toggle-label">${label}</span>

            <button type="button"
                class="toggle ${enabled ? "active" : ""}"
                data-toggle="${key}"
                aria-pressed="${enabled}">
            </button>
        </div>
    `;
}
function renderSecurity() {
    return `
        <div class="tab-content">
            <section class="panel">
                <div class="panel-body">
                    <h3 class="panel-title title-font">
                        Change Password
                    </h3>

                    <form id="password-form" class="security-fields">
                        ${[
                            "Current password",
                            "New password",
                            "Confirm new password"
                        ].map((label, i) => `
                            <div class="form-field">
                                <label for="password-${i}">
                                    ${label}
                                </label>

                                <input
                                    class="form-control"
                                    id="password-${i}"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                >
                            </div>
                        `).join("")}

                        <button class="btn btn-primary" type="submit">
                            Update password
                        </button>

                        <div
                            id="password-message"
                            class="message-error"
                            role="alert">
                        </div>
                    </form>
                </div>
            </section>
        </div>
    `;
}

function render() {
    const content = {
        Profile: renderProfile,
        Security: renderSecurity
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
                    <p>${escapeHtml(state.form.email)}</p>

                    <div class="profile-stats">
                        <div class="stat">
                            <strong>12</strong>
                            <span>Active Tasks</span>
                        </div>

                        <div class="stat">
                            <strong>5</strong>
                            <span>Projects</span>
                        </div>

                        <div class="stat">
                            <strong>3</strong>
                            <span>Groups</span>
                        </div>
                    </div>
                </div>
            </section>

            <nav class="profile-tabs">
                ${tabs.map(tab => `
                    <button type="button"
                        class="profile-tab ${
                            state.tab === tab ? "active" : ""
                        }"
                        data-tab="${tab}">
                        ${tab}
                    </button>
                `).join("")}
            </nav>

            <section id="tab-content">
                ${content}
            </section>
        </main>
    `;

    bindEvents();
}

function bindEvents() {
    // Chuyển tab Profile và Security
    document.querySelectorAll("[data-tab]").forEach(button => {
        button.addEventListener("click", () => {
            collectForm();

            state.tab = button.dataset.tab;
            state.error = "";
            state.saved = false;

            render();
        });
    });

    const form = document.getElementById("profile-form");

    if (form) {
        form.addEventListener("input", () => {
            collectForm();
            state.saved = false;
        });

        form.addEventListener("submit", async event => {
            event.preventDefault();

            collectForm();
            await saveProfile();
        });
    }

    document.getElementById("cancel-profile")
        ?.addEventListener("click", () => {
            state.form = {
                firstName: currentUser.firstName || "",
                lastName: currentUser.lastName || "",
                email: currentUser.email || ""
            };

            state.error = "";
            state.saved = false;

            render();
        });

    document.querySelectorAll("[data-toggle]").forEach(button => {
        button.addEventListener("click", () => {
            button.classList.toggle("active");

            button.setAttribute(
                "aria-pressed",
                button.classList.contains("active")
            );
        });
    });

    document.getElementById("password-form")
        ?.addEventListener("submit", async event => {
            event.preventDefault();

            const inputs = [
                ...event.target.querySelectorAll("input")
            ];

            const currentPassword = inputs[0].value;
            const newPassword = inputs[1].value;
            const confirmPassword = inputs[2].value;

            const message = document.getElementById("password-message");

            message.textContent = "";
            message.className = "";

            if (newPassword.length < 8) {
                message.textContent =
                    "New password must contain at least 8 characters.";
                message.className = "message-error";
                return;
            }

            if (newPassword !== confirmPassword) {
                message.textContent =
                    "New passwords do not match.";
                message.className = "message-error";
                return;
            }
            if (newPassword === currentPassword) {
                message.textContent =
                    "New password must be different from current password.";
                message.className = "message-error";
                return;
            }
            try {
                await api.put("/api/users/me/password", {
                    currentPassword: currentPassword,
                    newPassword: newPassword
                });

                event.target.reset();

                message.textContent =
                    "Password changed successfully!";
                message.className = "message-success";
            } catch (error) {
                message.textContent = error instanceof Error
                    ? error.message
                    : "Unable to change password.";

                message.className = "message-error";
            }
        });

    document.getElementById("delete-account")
        ?.addEventListener("click", () => {
            alert(
                "Account deletion API is not configured. No data has been deleted."
            );
        });
}

function collectForm() {
    const form = document.getElementById("profile-form");

    if (!form) return;

    ["firstName", "lastName", "email"].forEach(key => {
        const input = form.elements.namedItem(key);

        if (input) {
            state.form[key] = input.value;
        }
    });
}

async function saveProfile() {
    state.error = "";
    state.saved = false;

    try {
        const updated = await api.put("/api/users/me", {
            firstName: state.form.firstName.trim(),
            lastName: state.form.lastName.trim(),
            email: state.form.email.trim()
        });

        Object.assign(currentUser, updated);

        state.form.firstName =
            updated.firstName ?? state.form.firstName;

        state.form.lastName =
            updated.lastName ?? state.form.lastName;

        state.form.email =
            updated.email ?? state.form.email;

        localStorage.setItem(
            "flowtask_user",
            JSON.stringify({
                ...currentUser,
                ...updated
            })
        );

        state.saved = true;
    } catch (error) {
        state.error = error instanceof Error
            ? error.message
            : "Unable to save profile";
    }

    render();
}

render();