document.addEventListener("DOMContentLoaded", function () {
    const api = window.api;

    const listElement = document.getElementById("page-notification-list");
    const filterElement = document.getElementById("notification-filter");
    const markAllBtn = document.getElementById("mark-all-read");

    let notifications = [];

    function formatDate(date) {
        if (!date) return "";
        return new Date(date).toLocaleString("vi-VN");
    }

    function updateSummary() {
        const unread = notifications.filter(item => !item.read).length;

        document.getElementById("total-count").textContent =
            notifications.length;

        document.getElementById("unread-total").textContent = unread;

        document.getElementById("read-total").textContent =
            notifications.length - unread;
    }

    function renderNotifications() {
        listElement.replaceChildren();

        const filter = filterElement.value;

        const filtered = notifications.filter(item => {
            if (filter === "unread") return !item.read;
            if (filter === "read") return item.read;
            return true;
        });

        if (filtered.length === 0) {
            const empty = document.createElement("p");
            empty.className = "page-empty";
            empty.textContent = filter === "unread"
                ? "Không có thông báo chưa đọc."
                : filter === "read"
                    ? "Không có thông báo đã đọc."
                    : "Chưa có thông báo nào.";

            listElement.appendChild(empty);
            return;
        }

        filtered.forEach(item => {
            const row = document.createElement("div");
            row.className = "page-notification-item";
            row.classList.add(item.read ? "read" : "unread");

            const icon = document.createElement("div");
            icon.className = "page-notification-icon";
            icon.textContent = "♧";

            const body = document.createElement("div");
            body.className = "page-notification-body";

            const top = document.createElement("div");
            top.className = "page-notification-top";

            const status = document.createElement("span");
            status.className = "page-notification-status";
            status.textContent = item.read ? "Đã đọc" : "Chưa đọc";

            const time = document.createElement("small");
            time.className = "page-notification-time";
            time.textContent = formatDate(item.createdAt);

            const message = document.createElement("p");
            message.className = "page-notification-message";
            message.textContent = item.message || "Bạn có thông báo mới";

            top.append(status, time);
            body.append(top, message);
            row.append(icon, body);

            row.addEventListener("click", async function () {
                try {
                    if (!item.read) {
                        await api.markNotificationAsRead(item.id);
                        item.read = true;
                        updateSummary();
                        renderNotifications();
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

            listElement.appendChild(row);
        });
    }

    async function loadNotifications() {
        if (!api) {
            listElement.textContent = "Không tìm thấy API.";
            return;
        }

        try {
            const result = await api.getNotifications();
            notifications = Array.isArray(result) ? result : [];
            updateSummary();
            renderNotifications();
        } catch (error) {
            console.error("Không tải được thông báo:", error);
            listElement.textContent = "Không thể tải thông báo.";
        }
    }

    filterElement.addEventListener("change", renderNotifications);

    markAllBtn.addEventListener("click", async function () {
        try {
            await api.markAllNotificationsAsRead();

            notifications.forEach(item => {
                item.read = true;
            });

            updateSummary();
            renderNotifications();
        } catch (error) {
            console.error("Không thể đánh dấu đã đọc:", error);
        }
    });

    loadNotifications();
});