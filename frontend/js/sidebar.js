
document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("sidebar-container");

    if (!container) return;

    try {
        const response = await fetch("sidebar.html");

        if (!response.ok) {
            throw new Error("Không tải được sidebar.html");
        }

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const sidebar = doc.querySelector(".sidebar");

        if (!sidebar) {
            throw new Error("Không tìm thấy phần tử .sidebar");
        }

        container.replaceChildren(sidebar);

        const currentPath = window.location.pathname;
        const currentPage = currentPath.split("/").pop().replace(".html", "");

        container.querySelectorAll(".sidebar-nav .nav-item").forEach(function (item) {
            if (item.dataset.page === currentPage) {
                item.classList.add("active");
            }
        });

        const user = JSON.parse(
            localStorage.getItem("flowtask_user") || "null"
        );

        if (user) {
            const name = user.fullName || user.name || user.username || "FlowTask User";
            const email = user.email || "";

            const nameElement = container.querySelector("#user-name");
            const emailElement = container.querySelector("#user-email");
            const avatarElement = container.querySelector("#user-avatar");

            if (nameElement) nameElement.textContent = name;
            if (emailElement) emailElement.textContent = email;

            if (avatarElement) {
                avatarElement.textContent = name
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(-2)
                    .map(word => word[0])
                    .join("")
                    .toUpperCase();
            }
        }

        const notificationBtn = container.querySelector("#notification-btn");
        const notificationPanel = container.querySelector("#notification-panel");
        const markAllReadBtn = container.querySelector("#mark-all-read");
        const logoutBtn = container.querySelector("#logout-btn");

        if (notificationBtn && notificationPanel) {
            notificationBtn.addEventListener("click", function () {
                notificationPanel.hidden = !notificationPanel.hidden;
            });

            document.addEventListener("click", function (event) {
                if (
                    !notificationPanel.contains(event.target) &&
                    !notificationBtn.contains(event.target)
                ) {
                    notificationPanel.hidden = true;
                }
            });
        }

        if (markAllReadBtn) {
            markAllReadBtn.addEventListener("click", async function () {
                if (typeof markAllNotificationsRead === "function") {
                    await markAllNotificationsRead();
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
                localStorage.removeItem("flowtask_token");
                localStorage.removeItem("flowtask_user");
                window.location.href = "login.html";
            });
        }
    } catch (error) {
        console.error("Sidebar error:", error);
        container.textContent = "Unable to load sidebar.";
    }
});
