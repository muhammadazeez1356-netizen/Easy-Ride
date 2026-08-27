/* =========================================================
   EASY RIDE - LOGIN JAVASCRIPT
========================================================= */


/* =========================================================
   GET ALL USERS
========================================================= */

function getAllUsers() {

    const usersData =
        localStorage.getItem("easyRideUsers");


    if (!usersData) {

        return [];

    }


    try {

        const users =
            JSON.parse(usersData);


        return Array.isArray(users)
            ? users
            : [];

    } catch (error) {

        return [];

    }

}


/* =========================================================
   SAVE ALL USERS
========================================================= */

function saveAllUsers(users) {

    localStorage.setItem(
        "easyRideUsers",
        JSON.stringify(users)
    );

}


/* =========================================================
   ELEMENTS
========================================================= */

const loginForm =
    document.getElementById("loginForm");


const loginMessage =
    document.getElementById("loginMessage");


const loginEmail =
    document.getElementById("loginEmail");


const loginPassword =
    document.getElementById("loginPassword");


const loginPasswordEye =
    document.getElementById("loginPasswordEye");


const forgotPasswordBtn =
    document.getElementById("forgotPasswordBtn");


const forgotPasswordOverlay =
    document.getElementById(
        "forgotPasswordOverlay"
    );


const forgotPasswordPopover =
    document.getElementById(
        "forgotPasswordPopover"
    );


const closeForgotPassword =
    document.getElementById(
        "closeForgotPassword"
    );


const forgotEmail =
    document.getElementById(
        "forgotEmail"
    );


const newPassword =
    document.getElementById(
        "newPassword"
    );


const confirmNewPassword =
    document.getElementById(
        "confirmNewPassword"
    );


const newPasswordEye =
    document.getElementById(
        "newPasswordEye"
    );


const confirmNewPasswordEye =
    document.getElementById(
        "confirmNewPasswordEye"
    );


const changePasswordBtn =
    document.getElementById(
        "changePasswordBtn"
    );


const forgotPasswordMessage =
    document.getElementById(
        "forgotPasswordMessage"
    );


const googleBtn =
    document.getElementById(
        "googleBtn"
    );


const toast =
    document.getElementById(
        "toast"
    );


/* =========================================================
   LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                loginEmail
                ? loginEmail.value
                    .trim()
                    .toLowerCase()
                : "";


            const password =
                loginPassword
                ? loginPassword.value
                : "";


            /* =============================================
               EMPTY FIELDS
            ============================================= */

            if (!email || !password) {

                showLoginMessage(
                    "Please enter your email and password.",
                    "red"
                );

                return;

            }


            /* =============================================
               GET ACCOUNTS
            ============================================= */

            const users =
                getAllUsers();


            if (users.length === 0) {

                showLoginMessage(
                    "No account found. Please create an account first.",
                    "red"
                );

                return;

            }


            /* =============================================
               FIND ACCOUNT
            ============================================= */

            const user =
                users.find(
                    function (savedUser) {

                        return (
                            savedUser &&
                            savedUser.email &&
                            savedUser.email
                                .trim()
                                .toLowerCase() ===
                            email
                        );

                    }
                );


            /* =============================================
               EMAIL NOT FOUND
            ============================================= */

            if (!user) {

                showLoginMessage(
                    "No account was found with this email.",
                    "red"
                );

                return;

            }


            /* =============================================
               PASSWORD CHECK
            ============================================= */

            if (user.password !== password) {

                showLoginMessage(
                    "Incorrect password.",
                    "red"
                );

                return;

            }


            /* =============================================
               SAVE CURRENT USER
            ============================================= */

            localStorage.setItem(
                "easyRideUser",
                JSON.stringify(user)
            );


            /* =============================================
               LOGIN SESSION
            ============================================= */

            localStorage.setItem(
                "easyRideLoggedIn",
                "true"
            );


            /* =============================================
               LOGIN SUCCESS
            ============================================= */

            showLoginMessage(
                "Login successful. Redirecting...",
                "green"
            );


            /* =============================================
               REDIRECT
            ============================================= */

            setTimeout(
                function () {

                    window.location.href =
                        "/landingpage/home-page.html";

                },
                1000
            );

        }
    );

}


/* =========================================================
   LOGIN MESSAGE HELPER
========================================================= */

function showLoginMessage(
    text,
    color
) {

    if (!loginMessage) {

        return;

    }


    loginMessage.style.color =
        color;


    loginMessage.textContent =
        text;

}


/* =========================================================
   OPEN FORGOT PASSWORD
========================================================= */

if (forgotPasswordBtn) {

    forgotPasswordBtn.addEventListener(
        "click",
        function () {

            if (!forgotPasswordOverlay) {

                return;

            }


            /* Put login email inside
               forgot password email */

            if (
                forgotEmail &&
                loginEmail &&
                loginEmail.value.trim()
            ) {

                forgotEmail.value =
                    loginEmail.value.trim();

            }


            if (forgotPasswordMessage) {

                forgotPasswordMessage.textContent =
                    "";

            }


            forgotPasswordOverlay.classList.add(
                "show"
            );


            setTimeout(
                function () {

                    if (forgotEmail) {

                        forgotEmail.focus();

                    }

                },
                350
            );

        }
    );

}


/* =========================================================
   CLOSE FORGOT PASSWORD
========================================================= */

function closeForgotPasswordBox() {

    if (!forgotPasswordOverlay) {

        return;

    }


    forgotPasswordOverlay.classList.remove(
        "show"
    );


    if (forgotPasswordMessage) {

        forgotPasswordMessage.textContent =
            "";

    }

}


if (closeForgotPassword) {

    closeForgotPassword.addEventListener(
        "click",
        closeForgotPasswordBox
    );

}


/* =========================================================
   CLICK OUTSIDE POPOVER
========================================================= */

if (forgotPasswordOverlay) {

    forgotPasswordOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                forgotPasswordOverlay
            ) {

                closeForgotPasswordBox();

            }

        }
    );

}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            forgotPasswordOverlay &&
            forgotPasswordOverlay.classList.contains(
                "show"
            )
        ) {

            closeForgotPasswordBox();

        }

    }
);


/* =========================================================
   CHANGE PASSWORD
========================================================= */

if (changePasswordBtn) {

    changePasswordBtn.addEventListener(
        "click",
        function () {

            const email =
                forgotEmail
                ? forgotEmail.value
                    .trim()
                    .toLowerCase()
                : "";


            const password =
                newPassword
                ? newPassword.value
                : "";


            const confirmPassword =
                confirmNewPassword
                ? confirmNewPassword.value
                : "";


            /* =============================================
               EMPTY FIELDS
            ============================================= */

            if (
                !email ||
                !password ||
                !confirmPassword
            ) {

                showForgotMessage(
                    "Please fill in all fields.",
                    "red"
                );

                return;

            }


            /* =============================================
               PASSWORD LENGTH
            ============================================= */

            if (password.length < 6) {

                showForgotMessage(
                    "Password must be at least 6 characters.",
                    "red"
                );

                return;

            }


            /* =============================================
               PASSWORD MATCH
            ============================================= */

            if (
                password !==
                confirmPassword
            ) {

                showForgotMessage(
                    "Passwords do not match.",
                    "red"
                );

                return;

            }


            /* =============================================
               GET ALL USERS
            ============================================= */

            const users =
                getAllUsers();


            /* =============================================
               FIND USER
            ============================================= */

            const userIndex =
                users.findIndex(
                    function (user) {

                        return (
                            user &&
                            user.email &&
                            user.email
                                .trim()
                                .toLowerCase() ===
                            email
                        );

                    }
                );


            /* =============================================
               ACCOUNT NOT FOUND
            ============================================= */

            if (userIndex === -1) {

                showForgotMessage(
                    "No account was found with this email.",
                    "red"
                );

                return;

            }


            /* =============================================
               UPDATE ONLY THIS USER
            ============================================= */

            users[userIndex].password =
                password;


            /* =============================================
               SAVE ALL USERS
            ============================================= */

            saveAllUsers(users);


            /* =============================================
               IMPORTANT:
               DO NOT LOG USER IN AUTOMATICALLY
            ============================================= */

            localStorage.removeItem(
                "easyRideLoggedIn"
            );


            localStorage.removeItem(
                "easyRideUser"
            );


            /* =============================================
               CLOSE POPOVER
            ============================================= */

            closeForgotPasswordBox();


            /* =============================================
               PUT EMAIL BACK INTO LOGIN
            ============================================= */

            if (loginEmail) {

                loginEmail.value =
                    email;

            }


            if (loginPassword) {

                loginPassword.value =
                    "";

                loginPassword.focus();

            }


            /* =============================================
               LOGIN MESSAGE
            ============================================= */

            showLoginMessage(
                "Password changed successfully. Enter your new password to login.",
                "green"
            );

        }
    );

}


/* =========================================================
   FORGOT PASSWORD MESSAGE
========================================================= */

function showForgotMessage(
    text,
    color
) {

    if (!forgotPasswordMessage) {

        return;

    }


    forgotPasswordMessage.style.color =
        color;


    forgotPasswordMessage.textContent =
        text;

}


/* =========================================================
   PASSWORD EYE HELPER
========================================================= */

function setupPasswordEye(
    eye,
    input
) {

    if (!eye || !input) {

        return;

    }


    eye.addEventListener(
        "click",
        function () {

            if (
                input.type ===
                "password"
            ) {

                input.type =
                    "text";


                eye.classList.remove(
                    "fa-eye-slash"
                );


                eye.classList.add(
                    "fa-eye"
                );

            } else {

                input.type =
                    "password";


                eye.classList.remove(
                    "fa-eye"
                );


                eye.classList.add(
                    "fa-eye-slash"
                );

            }

        }
    );

}


/* =========================================================
   LOGIN PASSWORD EYE
========================================================= */

setupPasswordEye(
    loginPasswordEye,
    loginPassword
);


/* =========================================================
   NEW PASSWORD EYE
========================================================= */

setupPasswordEye(
    newPasswordEye,
    newPassword
);


/* =========================================================
   CONFIRM PASSWORD EYE
========================================================= */

setupPasswordEye(
    confirmNewPasswordEye,
    confirmNewPassword
);


/* =========================================================
   GOOGLE TOAST
========================================================= */

if (googleBtn && toast) {

    googleBtn.addEventListener(
        "click",
        function () {

            toast.classList.add(
                "show"
            );


            setTimeout(
                function () {

                    toast.classList.remove(
                        "show"
                    );

                },
                4000
            );

        }
    );

}