const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signInButton = document.getElementById("login-btn");
const errorBox = document.getElementById("error-message");

let loading = false;

function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
}

function clearError() {
    errorBox.textContent = "";
    errorBox.hidden = true;
}

function setLoading(value) {
    loading = value;
    signInButton.disabled = value;
    emailInput.disabled = value;
    passwordInput.disabled = value;
    signInButton.textContent = value ? "Signing in..." : "Sign in";
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (loading) return;

    clearError();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        showError("Please enter your email.");
        emailInput.focus();
        return;
    }

    if (!emailRegex.test(email)) {
        showError("Please enter a valid email address.");
        emailInput.focus();
        return;
    }

    if (!password) {
        showError("Please enter your password.");
        passwordInput.focus();
        return;
    }

    setLoading(true);

    try {
        const result = await api.post("/api/auth/login", {
            email: email,
            password: password
        });

        if (!result || !result.token) {
            throw new Error("Invalid server response.");
        }

        localStorage.setItem("flowtask_token", result.token);
        localStorage.setItem("flowtask_user", JSON.stringify(result.user));

        window.location.href = "dashboard.html";
    } catch (error) {
        if (error instanceof TypeError) {
            showError("Cannot connect to the server. Please try again.");
        } else {
            showError("Email or password is incorrect.");
        }
    } finally {
        setLoading(false);
    }
});