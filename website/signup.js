
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc
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


const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");
const googleBtn = document.getElementById("googleBtn");
const toast = document.getElementById("toast");


function showMessage(text, color) {

    if (!message) {
        return;
    }

    message.style.color = color;
    message.textContent = text;
}


if (signupForm) {

    signupForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const fullname =
            document.getElementById("fullname").value.trim();

        const email =
            document.getElementById("email").value.trim().toLowerCase();

        const phone =
            document.getElementById("phone").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (
            !fullname ||
            !email ||
            !phone ||
            !password ||
            !confirmPassword
        ) {

            showMessage(
                "Please fill in all fields.",
                "red"
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                "Password must be at least 6 characters.",
                "red"
            );

            return;
        }


        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match.",
                "red"
            );

            return;
        }


        const submitButton =
            document.getElementById("submit");

        if (submitButton) {

            submitButton.disabled = true;
            submitButton.textContent = "Creating Account...";
        }


        try {

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            await setDoc(
                doc(db, "users", user.uid),
                {
                    uid: user.uid,
                    fullname: fullname,
                    email: email,
                    phone: phone,
                    profileImage: "",
                    theme: "light",
                    createdAt: new Date().toISOString()
                }
            );


            localStorage.setItem(
                "easyRideUser",
                JSON.stringify({
                    id: user.uid,
                    fullname: fullname,
                    email: email,
                    phone: phone,
                    profileImage: "",
                    theme: "light"
                })
            );


            localStorage.setItem(
                "easyRideLoggedIn",
                "true"
            );


            showMessage(
                "Account created successfully. Redirecting...",
                "green"
            );


            setTimeout(function () {

                window.location.href =
                    "/landingpage/home-page.html";

            }, 1200);


        } catch (error) {

            console.error(
                "Signup error:",
                error
            );


            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                showMessage(
                    "This email already has an account. Please login.",
                    "red"
                );

            } else if (
                error.code ===
                "auth/invalid-email"
            ) {

                showMessage(
                    "Please enter a valid email address.",
                    "red"
                );

            } else if (
                error.code ===
                "auth/weak-password"
            ) {

                showMessage(
                    "Password must be at least 6 characters.",
                    "red"
                );

            } else {

                showMessage(
                    "Unable to create account. Please try again.",
                    "red"
                );
            }


            if (submitButton) {

                submitButton.disabled = false;
                submitButton.textContent = "Create Account";
            }
        }

    });

}


const eyes =
    document.querySelectorAll(".eye");


eyes.forEach(function (eye) {

    eye.addEventListener("click", function () {

        const input =
            eye.previousElementSibling;

        if (!input) {
            return;
        }


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

});


if (googleBtn && toast) {

    googleBtn.addEventListener("click", function () {

        toast.classList.add("show");

        setTimeout(function () {

            toast.classList.remove("show");

        }, 4000);

    });

}