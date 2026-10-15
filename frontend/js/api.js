
const API_BASE_URL = "http://localhost:8080";

async function apiRequest(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    const token = localStorage.getItem("flowtask_token");

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (options.body && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

const api = {
    get(path) {
        return apiRequest(path);
    },

    post(path, body) {
        return apiRequest(path, {
            method: "POST",
            body: JSON.stringify(body)
        });
    },

    put(path, body) {
        return apiRequest(path, {
            method: "PUT",
            body: JSON.stringify(body)
        });
    },

    patch(path, body) {
        return apiRequest(path, {
            method: "PATCH",
            body: JSON.stringify(body)
        });
    },

    delete(path) {
        return apiRequest(path, { method: "DELETE" });
    },

    getNotifications() {
        return apiRequest("/api/notifications");
    },

    getUnreadNotificationCount() {
        return apiRequest("/api/notifications/unread-count");
    },

    getProjectNotifications(projectId) {
        return apiRequest(`/api/notifications/project/${projectId}`);
    },

    getProjectUnreadNotificationCount(projectId) {
        return apiRequest(`/api/notifications/project/${projectId}/unread-count`);
    },

    markNotificationAsRead(id) {
        return apiRequest(`/api/notifications/${id}/read`, {
            method: "PATCH"
        });
    },

    markAllNotificationsAsRead() {
        return apiRequest("/api/notifications/read-all", {
            method: "PATCH"
        });
    }
};

window.api = api;