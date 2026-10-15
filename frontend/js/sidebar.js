document.addEventListener("DOMContentLoaded", async function () {
    const api = window.api;
    const container = document.getElementById("sidebar-container");

    if (!container) return;

    if (!api) {
        console.error("Không tìm thấy window.api. Kiểm tra api.js đã được tải chưa.");
        return;
    }
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

        const user = JSON.parse(localStorage.getItem("flowtask_user") || "null");

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
        const notificationList = container.querySelector("#notification-list");
        const notificationCount = container.querySelector("#notification-count");
        const markAllReadBtn = container.querySelector("#mark-all-read");
        const logoutBtn = container.querySelector("#logout-btn");

        function formatDate(date) {
            if (!date) return "";
            return new Date(date).toLocaleString("vi-VN");
        }

        function renderNotifications(list) {
            notificationList.replaceChildren();

            if (!Array.isArray(list) || list.length === 0) {
                const empty = document.createElement("p");
                empty.className = "notification-empty";
                empty.textContent = "Chưa có thông báo nào.";
                notificationList.appendChild(empty);
                return;
            }

            list.forEach(function (item) {
                const row = document.createElement("div");
                row.className = "notification-item";
                row.classList.add(item.read ? "read" : "unread");

                const top = document.createElement("div");
                top.className = "notification-item-top";

                const status = document.createElement("span");
                status.className = "notification-status";
                status.textContent = item.read ? "Đã đọc" : "Chưa đọc";

                const message = document.createElement("p");
                message.className = "notification-message";
                message.textContent = item.message || "Bạn có thông báo mới";

                const time = document.createElement("small");
                time.className = "notification-time";
                time.textContent = formatDate(item.createdAt);

                top.appendChild(status);
                row.append(top, message, time);

                row.addEventListener("click", async function () {
                    try {
                        if (!item.read) {
                            await api.markNotificationAsRead(item.id);
                            item.read = true;

                            row.classList.remove("unread");
                            row.classList.add("read");
                            status.textContent = "Đã đọc";

                            await loadUnreadCount();
                        }

                        if (item.taskId) {
                            window.location.href =
                                `task-detail.html?id=${item.taskId}`;
                        } else if (item.projectId) {
                            window.location.href =
                                `project-detail.html?id=${item.projectId}`;
                        }
                    } catch (error) {
                        console.error("Không thể cập nhật thông báo:", error);
                    }
                });

                notificationList.appendChild(row);
            });
        }

        async function loadNotifications() {
            try {
                const list = await api.getNotifications();
                renderNotifications(list);
            } catch (error) {
                console.error("Không tải được thông báo:", error);

                notificationList.replaceChildren();
                const message = document.createElement("p");
                message.className = "notification-empty";
                message.textContent = "Không tải được thông báo.";
                notificationList.appendChild(message);
            }
        }

        async function loadUnreadCount() {
            try {
                const count = await api.getUnreadNotificationCount();
                notificationCount.textContent = Number(count) > 0 ? String(count) : "";
                notificationCount.hidden = !(Number(count) > 0);
            } catch (error) {
                console.error("Không tải được số thông báo chưa đọc:", error);
            }
        }

        if (notificationBtn && notificationPanel) {
            notificationBtn.addEventListener("click", async function () {
                notificationPanel.hidden = !notificationPanel.hidden;

                if (!notificationPanel.hidden) {
                    await loadNotifications();
                    await loadUnreadCount();
                }
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
                try {
                    await api.markAllNotificationsAsRead();
                    await loadNotifications();
                    await loadUnreadCount();
                } catch (error) {
                    console.error("Không thể đánh dấu đã đọc:", error);
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

        await loadUnreadCount();

    } catch (error) {
        console.error("Sidebar error:", error);
        container.textContent = "Unable to load sidebar.";
    }
});
