import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    updatePassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


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
    document.getElementById("forgotPasswordOverlay");

const closeForgotPassword =
    document.getElementById("closeForgotPassword");

const forgotEmail =
    document.getElementById("forgotEmail");

const newPassword =
    document.getElementById("newPassword");

const confirmNewPassword =
    document.getElementById("confirmNewPassword");

const newPasswordEye =
    document.getElementById("newPasswordEye");

const confirmNewPasswordEye =
    document.getElementById("confirmNewPasswordEye");

const changePasswordBtn =
    document.getElementById("changePasswordBtn");

const forgotPasswordMessage =
    document.getElementById("forgotPasswordMessage");

const googleBtn =
    document.getElementById("googleBtn");

const toast =
    document.getElementById("toast");


function showLoginMessage(text, color) {

    if (!loginMessage) {
        return;
    }

    loginMessage.style.color = color;
    loginMessage.textContent = text;
}


function showForgotMessage(text, color) {

    if (!forgotPasswordMessage) {
        return;
    }

    forgotPasswordMessage.style.color = color;
    forgotPasswordMessage.textContent = text;
}


if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const email =
            loginEmail
                ? loginEmail.value.trim().toLowerCase()
                : "";


        const password =
            loginPassword
                ? loginPassword.value
                : "";


        if (!email || !password) {

            showLoginMessage(
                "Please enter your email and password.",
                "red"
            );

            return;
        }


        const submitButton =
            document.getElementById("submit");


        if (submitButton) {

            submitButton.disabled = true;
            submitButton.textContent = "Logging in...";
        }


        try {

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            let profile = {
                id: user.uid,
                fullname: "",
                email: user.email,
                phone: "",
                profileImage: "",
                theme: "light"
            };


            try {

                const userDocument =
                    await getDoc(
                        doc(
                            db,
                            "users",
                            user.uid
                        )
                    );


                if (userDocument.exists()) {

                    const data =
                        userDocument.data();


                    profile = {
                        id: user.uid,
                        fullname:
                            data.fullname || "",
                        email:
                            user.email,
                        phone:
                            data.phone || "",
                        profileImage:
                            data.profileImage || "",
                        theme:
                            data.theme || "light"
                    };
                }

            } catch (profileError) {

                console.error(
                    "Could not load user profile:",
                    profileError
                );
            }


            localStorage.setItem(
                "easyRideUser",
                JSON.stringify(profile)
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

                window.location.href =
                    "/landingpage/home-page.html";

            }, 1000);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                showLoginMessage(
                    "Incorrect email or password.",
                    "red"
                );

            } else if (
                error.code ===
                "auth/wrong-password"
            ) {

                showLoginMessage(
                    "Incorrect password.",
                    "red"
                );

            } else if (
                error.code ===
                "auth/user-not-found"
            ) {

                showLoginMessage(
                    "No account was found with this email.",
                    "red"
                );

            } else if (
                error.code ===
                "auth/invalid-email"
            ) {

                showLoginMessage(
                    "Please enter a valid email address.",
                    "red"
                );

            } else {

                showLoginMessage(
                    "Unable to login. Please try again.",
                    "red"
                );
            }


            if (submitButton) {

                submitButton.disabled = false;
                submitButton.textContent = "Login";
            }
        }

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

            forgotEmail.value =
                loginEmail.value.trim();
        }


        if (forgotPasswordMessage) {

            forgotPasswordMessage.textContent = "";
        }


        forgotPasswordOverlay.classList.add("show");


        setTimeout(function () {

            if (forgotEmail) {
                forgotEmail.focus();
            }

        }, 300);

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


document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            forgotPasswordOverlay &&
            forgotPasswordOverlay.classList.contains("show")
        ) {

            closeForgotPasswordBox();
        }

    }
);


if (changePasswordBtn) {

    changePasswordBtn.addEventListener(
        "click",
        async function () {

            const email =
                forgotEmail
                    ? forgotEmail.value.trim().toLowerCase()
                    : "";


            const password =
                newPassword
                    ? newPassword.value
                    : "";


            const confirmPassword =
                confirmNewPassword
                    ? confirmNewPassword.value
                    : "";


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


            showForgotMessage(
                "Checking account...",
                "green"
            );


            try {

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                const user =
                    userCredential.user;


                showForgotMessage(
                    "Please use your current password to change it.",
                    "red"
                );


                await signOut(auth);

            } catch (error) {

                console.log(error);

                showForgotMessage(
                    "For security, use Firebase password reset for forgotten passwords.",
                    "red"
                );
            }

        }
    );
}


function setupPasswordEye(eye, input) {

    if (!eye || !input) {
        return;
    }


    eye.addEventListener("click", function () {

        if (input.type === "password") {

            input.type = "text";

            eye.classList.remove(
                "fa-eye-slash"
            );

            eye.classList.add(
                "fa-eye"
            );

        } else {

            input.type = "password";

            eye.classList.remove(
                "fa-eye"
            );

            eye.classList.add(
                "fa-eye-slash"
            );
        }

    });

}


setupPasswordEye(
    loginPasswordEye,
    loginPassword
);


setupPasswordEye(
    newPasswordEye,
    newPassword
);


setupPasswordEye(
    confirmNewPasswordEye,
    confirmNewPassword
);


if (googleBtn && toast) {

    googleBtn.addEventListener("click", function () {

        toast.classList.add("show");

        setTimeout(function () {

            toast.classList.remove("show");

        }, 4000);

    });

}
