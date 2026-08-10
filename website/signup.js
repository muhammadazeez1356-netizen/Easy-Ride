const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");

signupForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {

        message.style.color = "red";
        message.innerHTML = "Incorrect Password! Passwords do not match.";

        return;

    }

    const user = {
        fullname,
        email,
        password
    };

    localStorage.setItem("easyRideUser", JSON.stringify(user));

    message.style.color = "green";
    message.innerHTML = "Account created successfully.";

    setTimeout(() => {

        
            window.location.href = "/landingpage/home-page.html";

    }, 1500);

});
// Select all eye icons
const eyes = document.querySelectorAll(".eye");

eyes.forEach((eye) => {

    eye.addEventListener("click", () => {

        // Get the input before the eye icon
        const passwordInput = eye.previousElementSibling;

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            eye.classList.remove("fa-eye");
            eye.classList.add("fa-eye-slash");

        } else {

            passwordInput.type = "password";

            eye.classList.remove("fa-eye-slash");
            eye.classList.add("fa-eye");

        }

    });

});