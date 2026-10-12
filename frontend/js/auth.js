function checkAuth() {
    const token = localStorage.getItem("flowtask_token");

    if (!token) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}