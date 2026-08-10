const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const savedUser = JSON.parse(localStorage.getItem("easyRideUser"));

    if (!savedUser) {

        loginMessage.style.color = "red";
        loginMessage.innerHTML = "No account found.";

        return;

    }

    if (email !== savedUser.email) {

        loginMessage.style.color = "red";
        loginMessage.innerHTML = "Email not found.";

        return;

    }

    if (password !== savedUser.password) {

        loginMessage.style.color = "red";
        loginMessage.innerHTML = "Incorrect Password.";

        return;

    }

    loginMessage.style.color = "green";
    loginMessage.innerHTML = "Login Successful.";

    setTimeout(() => {

        window.location.href = "/landingpage/home-page.html";

    }, 1000);

});
// Show-Hide Password

const eye = document.querySelector(".eye");
const password = document.getElementById("loginPassword");

eye.addEventListener("click", () => {

    if(password.type === "password"){

        password.type = "text";

        eye.classList.remove("fa-eye");
        eye.classList.add("fa-eye-slash");

    }else{

        password.type = "password";

        eye.classList.remove("fa-eye-slash");
        eye.classList.add("fa-eye");

    }

});