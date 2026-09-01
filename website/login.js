function getAllUsers() {
    const usersData = localStorage.getItem("easyRideUsers");

    if (!usersData) {
        return [];
    }

    try {
        const users = JSON.parse(usersData);

        if (Array.isArray(users)) {
            return users;
        }

        return [];
    } catch (error) {
        console.error("Error reading users:", error);
        return [];
    }
}

function saveAllUsers(users) {
    localStorage.setItem("easyRideUsers", JSON.stringify(users));
}

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginPasswordEye = document.getElementById("loginPasswordEye");

const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
const forgotPasswordOverlay = document.getElementById("forgotPasswordOverlay");
const forgotPasswordPopover = document.getElementById("forgotPasswordPopover");
const closeForgotPassword = document.getElementById("closeForgotPassword");

const forgotEmail = document.getElementById("forgotEmail");
const newPassword = document.getElementById("newPassword");
const confirmNewPassword = document.getElementById("confirmNewPassword");

const newPasswordEye = document.getElementById("newPasswordEye");
const confirmNewPasswordEye = document.getElementById("confirmNewPasswordEye");

const changePasswordBtn = document.getElementById("changePasswordBtn");
const forgotPasswordMessage = document.getElementById("forgotPasswordMessage");

const googleBtn = document.getElementById("googleBtn");
const toast = document.getElementById("toast");

function showLoginMessage(text, color) {
    if (!loginMessage) {
        return;
    }

    loginMessage.style.color = color;
    loginMessage.textContent = text;
}

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = loginEmail
            ? loginEmail.value.trim().toLowerCase()
            : "";

        const password = loginPassword
            ? loginPassword.value
            : "";

        if (!email || !password) {
            showLoginMessage(
                "Please enter your email and password.",
                "red"
            );
            return;
        }

        const users = getAllUsers();

        if (users.length === 0) {
            showLoginMessage(
                "No account found. Please create an account first.",
                "red"
            );
            return;
        }

        const user = users.find(function (savedUser) {
            if (!savedUser || !savedUser.email) {
                return false;
            }

            return savedUser.email.trim().toLowerCase() === email;
        });

        if (!user) {
            showLoginMessage(
                "No account was found with this email.",
                "red"
            );
            return;
        }

        if (String(user.password) !== String(password)) {
            showLoginMessage(
                "Incorrect password.",
                "red"
            );
            return;
        }

        localStorage.setItem(
            "easyRideUser",
            JSON.stringify(user)
        );

        localStorage.setItem(
            "easyRideLoggedIn",
            "true"
        );

        showLoginMessage(
            "Login successful. Redirecting...",
            "green"
        );

        setTimeout(function () {
            window.location.href = "/landingpage/home-page.html";
        }, 1000);
    });
}

if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener("click", function () {
        if (!forgotPasswordOverlay) {
            return;
        }

        if (
            forgotEmail &&
            loginEmail &&
            loginEmail.value.trim()
        ) {
            forgotEmail.value = loginEmail.value.trim();
        }

        if (forgotPasswordMessage) {
            forgotPasswordMessage.textContent = "";
        }

        forgotPasswordOverlay.classList.add("show");

        setTimeout(function () {
            if (forgotEmail) {
                forgotEmail.focus();
            }
        }, 350);
    });
}

function closeForgotPasswordBox() {
    if (!forgotPasswordOverlay) {
        return;
    }

    forgotPasswordOverlay.classList.remove("show");

    if (forgotPasswordMessage) {
        forgotPasswordMessage.textContent = "";
    }
}

if (closeForgotPassword) {
    closeForgotPassword.addEventListener(
        "click",
        closeForgotPasswordBox
    );
}

if (forgotPasswordOverlay) {
    forgotPasswordOverlay.addEventListener("click", function (event) {
        if (event.target === forgotPasswordOverlay) {
            closeForgotPasswordBox();
        }
    });
}

document.addEventListener("keydown", function (event) {
    if (
        event.key === "Escape" &&
        forgotPasswordOverlay &&
        forgotPasswordOverlay.classList.contains("show")
    ) {
        closeForgotPasswordBox();
    }
});

function showForgotMessage(text, color) {
    if (!forgotPasswordMessage) {
        return;
    }

    forgotPasswordMessage.style.color = color;
    forgotPasswordMessage.textContent = text;
}

if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", function () {
        const email = forgotEmail
            ? forgotEmail.value.trim().toLowerCase()
            : "";

        const password = newPassword
            ? newPassword.value
            : "";

        const confirmPassword = confirmNewPassword
            ? confirmNewPassword.value
            : "";

        if (!email || !password || !confirmPassword) {
            showForgotMessage(
                "Please fill in all fields.",
                "red"
            );
            return;
        }

        if (password.length < 6) {
            showForgotMessage(
                "Password must be at least 6 characters.",
                "red"
            );
            return;
        }

        if (password !== confirmPassword) {
            showForgotMessage(
                "Passwords do not match.",
                "red"
            );
            return;
        }

        const users = getAllUsers();

        const userIndex = users.findIndex(function (user) {
            if (!user || !user.email) {
                return false;
            }

            return user.email.trim().toLowerCase() === email;
        });

        if (userIndex === -1) {
            showForgotMessage(
                "No account was found with this email.",
                "red"
            );
            return;
        }

        users[userIndex].password = password;

        saveAllUsers(users);

        localStorage.removeItem("easyRideLoggedIn");
        localStorage.removeItem("easyRideUser");

        closeForgotPasswordBox();

        if (loginEmail) {
            loginEmail.value = email;
        }

        if (loginPassword) {
            loginPassword.value = "";
            loginPassword.focus();
        }

        showLoginMessage(
            "Password changed successfully. Enter your new password to login.",
            "green"
        );
    });
}

function setupPasswordEye(eye, input) {
    if (!eye || !input) {
        return;
    }

    eye.addEventListener("click", function () {
        if (input.type === "password") {
            input.type = "text";

            eye.classList.remove("fa-eye-slash");
            eye.classList.add("fa-eye");
        } else {
            input.type = "password";

            eye.classList.remove("fa-eye");
            eye.classList.add("fa-eye-slash");
        }
    });
}

setupPasswordEye(loginPasswordEye, loginPassword);
setupPasswordEye(newPasswordEye, newPassword);
setupPasswordEye(confirmNewPasswordEye, confirmNewPassword);

if (googleBtn && toast) {
    googleBtn.addEventListener("click", function () {
        googleBtn.addEventListener("click", function () {
            toast.classList.add("show");

            setTimeout(function () {
                toast.classList.remove("show");
            }, 4000);
        });
    });
}