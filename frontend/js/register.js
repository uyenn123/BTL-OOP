
const form = document.getElementById("register-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submit-btn");
const messageBox = document.getElementById("form-message");

let loading = false;

function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = `form-message ${type}`;
    messageBox.hidden = false;
}

function clearMessage() {
    messageBox.textContent = "";
    messageBox.hidden = true;
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (loading) return;

    clearMessage();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const password = passwordInput.value;
    const passwordRegex = /^(?=.*\d)(?=.*[^a-zA-Z0-9\s])\S{8,}$/;

    if (!passwordRegex.test(password)) {
        showMessage(
            "Password must contain at least 8 characters, a number and a special character.",
            "error"
        );
        passwordInput.focus();
        return;
    }

    loading = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating account...";

    try {
        const result = await api.post("/api/auth/register", {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: password
        });

        if (!result || !result.token) {
            throw new Error("Registration response is invalid.");
        }

        localStorage.setItem("flowtask_token", result.token);
        localStorage.setItem("flowtask_user", JSON.stringify(result.user));

        showMessage("Đăng ký thành công!", "success");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    } catch (error) {
        const message = error.message || "";

        if (error instanceof TypeError) {
            showMessage(
                "Không thể kết nối server. Fen kiểm tra backend nhé.",
                "error"
            );
        } else if (
            message.includes("409") ||
            message.includes("Email is already registered") ||
            message.includes("Email đã tồn tại")
        ) {
            showMessage(
                "Email này đã được đăng ký. Fen hãy đăng nhập nhé.",
                "error"
            );
        } else {
            showMessage(
                "Đăng ký thất bại. Fen hãy kiểm tra lại thông tin.",
                "error"
            );
            console.error(error);
        }
    } finally {
        loading = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "Create account";
    }
});
