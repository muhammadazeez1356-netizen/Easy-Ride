const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");


/* =========================================================
   GET ALL EASY RIDE USERS
========================================================= */

function getAllUsers() {

    const usersData = localStorage.getItem("easyRideUsers");


    if (!usersData) {

        return [];

    }


    try {

        const users = JSON.parse(usersData);


        return Array.isArray(users) ? users : [];

    } catch (error) {

        return [];

    }

}


/* =========================================================
   CREATE ACCOUNT
========================================================= */

if (signupForm) {

    signupForm.addEventListener("submit", function (e) {

        e.preventDefault();


        const fullname = document
            .getElementById("fullname")
            .value
            .trim();


        const phone = document
            .getElementById("phone")
            .value
            .trim();


        const email = document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();


        const password = document
            .getElementById("password")
            .value;


        const confirmPassword = document
            .getElementById("confirmPassword")
            .value;


        /* =================================================
           CHECK EMPTY FIELDS
        ================================================= */

        if (
            !fullname ||
            !phone ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            message.style.color = "red";

            message.textContent =
                "Please fill in all fields.";

            return;

        }


        /* =================================================
           CHECK PASSWORD
        ================================================= */

        if (password !== confirmPassword) {

            message.style.color = "red";

            message.textContent =
                "Passwords do not match.";

            return;

        }


        /* =================================================
           GET ALL EXISTING USERS
        ================================================= */

        const users = getAllUsers();


        /* =================================================
           CHECK IF EMAIL ALREADY EXISTS
        ================================================= */

        const emailAlreadyExists = users.some(
            function (user) {

                return (
                    user.email &&
                    user.email.toLowerCase() === email
                );

            }
        );


        if (emailAlreadyExists) {

            message.style.color = "red";

            message.textContent =
                "This email already has an account. Please login.";

            return;

        }


        /* =================================================
           CREATE NEW ACCOUNT
        ================================================= */

        const newUser = {

            id: Date.now().toString(),

            fullname: fullname,

            phone: phone,

            email: email,

            password: password,

            profileImage: ""

        };


        /* =================================================
           ADD NEW USER TO ALL USERS
        ================================================= */

        users.push(newUser);


        localStorage.setItem(
            "easyRideUsers",
            JSON.stringify(users)
        );


        /* =================================================
           SAVE CURRENT LOGGED-IN USER
        ================================================= */

        localStorage.setItem(
            "easyRideUser",
            JSON.stringify(newUser)
        );


        /* =================================================
           CREATE LOGIN SESSION
        ================================================= */

        localStorage.setItem(
            "easyRideLoggedIn",
            "true"
        );


        /* =================================================
           SUCCESS MESSAGE
        ================================================= */

        message.style.color = "green";

        message.textContent =
            "Account created successfully. Redirecting...";


        /* =================================================
           REDIRECT
        ================================================= */

        setTimeout(function () {

            window.location.href =
                "/landingpage/home-page.html";

        }, 1500);

    });

}


/* =========================================================
   SHOW / HIDE PASSWORD
========================================================= */

const eyes = document.querySelectorAll(".eye");


eyes.forEach(function (eye) {

    eye.addEventListener("click", function () {

        const passwordInput =
            eye.previousElementSibling;


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


/* =========================================================
   GOOGLE TOAST
========================================================= */

const googleBtn =
    document.getElementById("googleBtn");


const toast =
    document.getElementById("toast");


if (googleBtn && toast) {

    googleBtn.addEventListener("click", function () {

        toast.classList.add("show");


        setTimeout(function () {

            toast.classList.remove("show");

        }, 4000);

    });

}