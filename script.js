let splash = document.getElementById("splash");
let mainCountent = document.getElementById("main-content");

setTimeout(function () {

    splash.style.display = "none";

    mainCountent.style.display = "block";
}, 2000);

const text = "Easy Ride.";
const typingElement = document.getElementById("typing-texts");

let index = 0;

function typeWriter() {
    if (index < text.length) {
        typingElement.textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, 100)
    }
}

window.onload = () => {
    typingElement.textContent = "";
    index = 0;
    typeWriter();
};


// ===== PERFECT SLIDESHOW =====
document.addEventListener("DOMContentLoaded", function () {

    const slides = document.querySelectorAll(".slide");

    if (slides.length > 0) {

        let currentSlide = 0;

        // show first slide
        slides[0].classList.add("active");

        setInterval(() => {

            slides[currentSlide].classList.remove("active");

            currentSlide = (currentSlide + 1) % slides.length;

            slides[currentSlide].classList.add("active");

        }, 4000);

    }

});



function show_nav() {
    var nav_items = document.getElementById("nav-items");
    nav_items.classList.toggle("open");
}



document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");
    const toast = document.getElementById("toast");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

      
        toast.classList.add("show");

        
        setTimeout(function () {
            toast.classList.remove("show");
        }, 2000);

        
        form.reset();
    });

});


const tabs = document.querySelectorAll(".tab");
const forms = document.querySelectorAll(".form");

const emailInput = document.getElementById("emailInput");
const phoneInput = document.getElementById("phoneInput");

const continueBtn = document.getElementById("continueBtn");

let activeTab = "emailForm";

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(btn => btn.classList.remove("active"));
        forms.forEach(form => form.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");

        activeTab = tab.dataset.tab;

        checkInput();

    });

});

function checkInput() {

    if (activeTab === "emailForm") {

        continueBtn.disabled = emailInput.value.trim() === "";

    } else {

        continueBtn.disabled = phoneInput.value.trim() === "";

    }

}

emailInput.addEventListener("input", checkInput);
phoneInput.addEventListener("input", checkInput);

continueBtn.addEventListener("click", function () {

    let user = "";

    if (activeTab === "emailForm") {
        user = emailInput.value.trim();
    } else {
        user = phoneInput.value.trim();
    }

    localStorage.setItem("easyRideUser", user);

    window.location.href = "/Dash-board/main-dash-board.html";

});

emailInput.addEventListener("input",checkInput);

phoneInput.addEventListener("input",checkInput);










