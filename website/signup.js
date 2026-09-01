const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");

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

if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const fullname = document.getElementById("fullname").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!fullname || !phone || !email || !password || !confirmPassword) {
            message.style.color = "red";
            message.textContent = "Please fill in all fields.";
            return;
        }

        if (password !== confirmPassword) {
            message.style.color = "red";
            message.textContent = "Passwords do not match.";
            return;
        }

        if (password.length < 6) {
            message.style.color = "red";
            message.textContent = "Password must be at least 6 characters.";
            return;
        }

        const users = getAllUsers();

        const emailAlreadyExists = users.some(function (user) {
            if (!user || !user.email) {
                return false;
            }

            return user.email.trim().toLowerCase() === email;
        });

        if (emailAlreadyExists) {
            message.style.color = "red";
            message.textContent = "This email already has an account. Please login.";
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            fullname: fullname,
            phone: phone,
            email: email,
            password: password,
            profileImage: "",
            theme: "light"
        };

        users.push(newUser);

        saveAllUsers(users);

        localStorage.setItem(
            "easyRideUser",
            JSON.stringify(newUser)
        );

        localStorage.setItem(
            "easyRideLoggedIn",
            "true"
        );

        message.style.color = "green";
        message.textContent = "Account created successfully. Redirecting...";

        setTimeout(function () {
            window.location.href = "/landingpage/home-page.html";
        }, 1500);
    });
}

const eyes = document.querySelectorAll(".eye");

eyes.forEach(function (eye) {
    eye.addEventListener("click", function () {
        const passwordInput = eye.previousElementSibling;

        if (!passwordInput) {
            return;
        }

        if (passwordInput.type === "password") {
            passwordInput.type = "text";

            eye.classList.remove("fa-eye-slash");
            eye.classList.add("fa-eye");
        } else {
            passwordInput.type = "password";

            eye.classList.remove("fa-eye");
            eye.classList.add("fa-eye-slash");
        }
    });
});

const googleBtn = document.getElementById("googleBtn");
const toast = document.getElementById("toast");

if (googleBtn && toast) {
    googleBtn.addEventListener("click", function () {
        toast.classList.add("show");

        setTimeout(function () {
            toast.classList.remove("show");
        }, 4000);
    });
}