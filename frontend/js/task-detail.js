
const params = new URLSearchParams(window.location.search);
const taskId = params.get("id");

function setText(id, value, fallback = "Chưa có thông tin") {
    document.getElementById(id).textContent =
        value === null || value === undefined || value === ""
            ? fallback
            : value;
}
async function saveChecklist() {
    const inputs = document.querySelectorAll(
        "#detail-checklist input[type='checkbox']"
    );

    const request = {
        mainTaskDone: inputs[0].checked,
        resultChecked: inputs[1].checked,
        taskFinished: inputs[2].checked
    };

    try {
        await api.patch(
            `/api/tasks/${encodeURIComponent(taskId)}/checklist`,
            request
        );

        updateChecklistCount();
    } catch (error) {
        console.error("Không thể lưu checklist:", error);
        alert("Lưu checklist thất bại. Vui lòng thử lại.");
    }
}
function formatDate(value) {
    if (!value) return null;

    const date = String(value).split("T")[0];
    const parts = date.split("-");

    if (parts.length !== 3) return value;

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function updateChecklistCount() {
    const inputs = document.querySelectorAll(
        "#detail-checklist input[type='checkbox']"
    );

    const checked = document.querySelectorAll(
        "#detail-checklist input[type='checkbox']:checked"
    );

    setText("checklist-count", `${checked.length}/${inputs.length}`);
}

async function loadTaskDetail() {
    if (!taskId) {
        setText("detail-title", "Không tìm thấy nhiệm vụ");
        return;
    }

    try {
        const task = await api.get(`/api/tasks/${encodeURIComponent(taskId)}`);
        const inputs = document.querySelectorAll(
            "#detail-checklist input[type='checkbox']"
        );

        inputs[0].checked = task.mainTaskDone;
        inputs[1].checked = task.resultChecked;
        inputs[2].checked = task.taskFinished;

        updateChecklistCount();
        setText("detail-title", task.title, "Chưa có tên");
        setText("detail-project", task.projectName, "Chưa có project");
        setText("detail-group", task.groupName, "Chưa có nhóm");

        setText("detail-status", task.status);
        setText("detail-priority", task.priority);

        setText("detail-assignee", task.assigneeName, "Chưa giao");
        setText("detail-due-date", formatDate(task.dueDate), "Chưa đặt deadline");
        setText(
            "detail-description",
            task.description,
            "Chưa có mô tả cho nhiệm vụ này."
        );

        setText("detail-creator", task.reporterName, "Chưa có thông tin");
        setText(
            "detail-created-date",
            task.createdAt ? formatDate(task.createdAt) : null,
            "Chưa có thông tin"
        );
        const priorityColors = {
            URGENT: "#F87171",
            HIGH: "#FBBF24",
            MEDIUM: "#818CF8",
            LOW: "#8B92B3"
        };

        const priorityElement = document.getElementById("detail-priority");
        priorityElement.style.color =
            priorityColors[String(task.priority).toUpperCase()] || "#818CF8";

        const statusElement = document.getElementById("detail-status");
        const statusColors = {
            TODO: "#8B92B3",
            IN_PROGRESS: "#818CF8",
            DONE: "#34D399"
        };

        statusElement.style.color =
            statusColors[String(task.status).toUpperCase()] || "#818CF8";

    } catch (error) {
        console.error("Không thể tải chi tiết task:", error);
        setText("detail-title", "Không thể tải nhiệm vụ");
        setText(
            "detail-error",
            error.message || "Đã xảy ra lỗi khi tải nhiệm vụ."
        );
        document.getElementById("detail-error").hidden = false;
    }
}

document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "tasks.html";
});

document.getElementById("detail-checklist").addEventListener(
    "change",
    saveChecklist
);

document.addEventListener("DOMContentLoaded", () => {
    updateChecklistCount();
    loadTaskDetail();
});

const confirmArea = document.getElementById("leader-confirm-area");
const confirmBtn = document.getElementById("confirm-task-btn");
const checklistMessage = document.getElementById("checklist-message");

function updateChecklistCount() {
    const inputs = document.querySelectorAll(
        "#detail-checklist input[type='checkbox']"
    );

    const checked = document.querySelectorAll(
        "#detail-checklist input[type='checkbox']:checked"
    ).length;

    setText("checklist-count", `${checked}/${inputs.length}`);

    const allChecked = inputs.length > 0 && checked === inputs.length;
    const currentStatus = document.getElementById("detail-status").textContent;

    if (confirmArea) {
        confirmArea.hidden = !allChecked || currentStatus.trim().toUpperCase() === "DONE";
    }

    if (checklistMessage) {
        checklistMessage.hidden = !allChecked;
        checklistMessage.textContent = allChecked
            ? "Checklist đã hoàn thành. Chờ Leader xác nhận."
            : "";
    }
}

if (confirmBtn) {
    confirmBtn.addEventListener("click", async () => {
        const inputs = document.querySelectorAll(
            "#detail-checklist input[type='checkbox']"
        );

        if (inputs.length === 0 || !Array.from(inputs).every(input => input.checked)) {
            return;
        }

        if (!window.confirm("Bạn xác nhận nhiệm vụ này đã hoàn thành?")) {
            return;
        }

        confirmBtn.disabled = true;
        confirmBtn.textContent = "Đang cập nhật...";

        try {
            const task = await api.patch(
                `/api/tasks/${encodeURIComponent(taskId)}/status`,
                {
                    status: "DONE",
                    position: 0
                }
            );

            setText("detail-status", task.status || "DONE");
            updateChecklistCount();

            if (checklistMessage) {
                checklistMessage.hidden = false;
                checklistMessage.textContent = "Nhiệm vụ đã được xác nhận hoàn thành.";
            }
        } catch (error) {
            console.error("Không thể hoàn thành task:", error);

            if (checklistMessage) {
                checklistMessage.hidden = false;
                checklistMessage.textContent =
                    error.message || "Không thể hoàn thành nhiệm vụ. Hãy kiểm tra quyền Leader.";
            }
        } finally {
            confirmBtn.disabled = false;
            confirmBtn.textContent = "Xác nhận hoàn thành";
        }
    });
}

document.getElementById("detail-checklist").addEventListener(
    "change",
    updateChecklistCount
);

updateChecklistCount();