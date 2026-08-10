// ==========================
// GET SAVED USER
// ==========================
const user = localStorage.getItem("easyRideUser");

// Redirect if not logged in
if (!user) {
    window.location.href = "/landingpage/login.html";
}

// Display user name
document.getElementById("driverName").textContent = user;
document.getElementById("sidebarName").textContent = user;


// ==========================
// LOGOUT
// ==========================
document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.removeItem("easyRideUser");

    window.location.href = "/landingpage/login.html";

});

// ==========================
// ONLINE / OFFLINE BUTTONS
// ==========================
const onlineBtn = document.getElementById("bbtn1");
const offlineBtn = document.getElementById("bbtn2");

// All sidebar menu links
const menuLinks = document.querySelectorAll(".menu-link");

let isOnline = localStorage.getItem("driverStatus") || "online";

function updateSidebarVisibility() {

    if (isOnline === "offline") {

        // Hide all sidebar links
        menuLinks.forEach(link => {
            link.style.display = "none";
        });

    } else {

        // Show all sidebar links
        menuLinks.forEach(link => {
            link.style.display = "flex";
        });

    }

}

function updateDriverStatus() {

    if (isOnline === "online") {

        onlineBtn.style.background = "#ffd900";
        onlineBtn.style.color = "#fff";

        offlineBtn.style.background = "#e5e7eb";
        offlineBtn.style.color = "#000";

    } else {

        offlineBtn.style.background = "#dc2626";
        offlineBtn.style.color = "#fff";

        onlineBtn.style.background = "#e5e7eb";
        onlineBtn.style.color = "#000";

    }

    // Update sidebar items
    updateSidebarVisibility();

}

// Online button
onlineBtn.addEventListener("click", () => {

    isOnline = "online";

    localStorage.setItem("driverStatus", isOnline);

    updateDriverStatus();

});

// Offline button
offlineBtn.addEventListener("click", () => {

    isOnline = "offline";

    localStorage.setItem("driverStatus", isOnline);

    updateDriverStatus();

});

// Load saved status
updateDriverStatus();


// ==========================
// SETTINGS TOGGLE
// ==========================
const settingsBtn = document.getElementById("settingsBtn");
const settingsBox = document.getElementById("settingsBox");

settingsBtn.addEventListener("click", () => {

    settingsBox.classList.toggle("show");

});


// ==========================
// PROFILE IMAGE UPLOAD
// ==========================
const uploadInput = document.getElementById("uploadImage");
const profileImage = document.getElementById("profileImage");

// Load saved image
const savedImage = localStorage.getItem("driverProfileImage");

if (savedImage) {
    profileImage.src = savedImage;
}

// Upload new image
uploadInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        profileImage.src = e.target.result;

        localStorage.setItem("driverProfileImage", e.target.result);

    };

    reader.readAsDataURL(file);

});


// ==========================
// PAGE LOADING
// ==========================
const mainContent = document.getElementById("mainContent");
const links = document.querySelectorAll(".menu-link");

function loadPage(page) {

    fetch(page)
        .then(response => response.text())
        .then(data => {

            mainContent.innerHTML = data;

            // Re-initialize page features
            setTimeout(() => {

                initRideMap();
                loadDriverRideRequests();

            }, 100);

        })
        .catch(() => {

            mainContent.innerHTML = `
                <div class="card">
                    <h2>Page Not Found</h2>
                    <p>The page could not be loaded.</p>
                </div>
            `;

        });

}


// ==========================
// LEAFLET MAP
// ==========================
/* =========================
   LIVE MAP
========================= */

let liveMap = null;
let pickupMarker = null;
let destinationMarker = null;
let routeLayer = null;

function initRideMap() {

    const mapBox = document.getElementById("liveMap");

    if (!mapBox) return;

    if (liveMap) {
        liveMap.remove();
    }

    liveMap = L.map("liveMap").setView([7.3775, 3.9470], 12);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(liveMap);

    // Show accepted ride if it exists
    const acceptedRide =
        JSON.parse(localStorage.getItem("rideAccepted"));

    if (acceptedRide) {
        showRideRoute(acceptedRide);
    }
}






async function showRideRoute(ride) {

    if (!liveMap) return;

    const pickup =
        [ride.pickupLat, ride.pickupLon];

    const destination =
        [ride.destinationLat, ride.destinationLon];

    if (pickupMarker) liveMap.removeLayer(pickupMarker);
    if (destinationMarker) liveMap.removeLayer(destinationMarker);
    if (routeLayer) liveMap.removeLayer(routeLayer);

    pickupMarker = L.marker(pickup)
        .addTo(liveMap)
        .bindPopup(`<b>📍 Pickup</b><br>${ride.pickup}`);

    destinationMarker = L.marker(destination)
        .addTo(liveMap)
        .bindPopup(`<b>🏁 Destination</b><br>${ride.destination}`);

    const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${ride.pickupLon},${ride.pickupLat};` +
        `${ride.destinationLon},${ride.destinationLat}` +
        `?overview=full&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes.length) return;

    const route = data.routes[0];

    routeLayer = L.geoJSON(route.geometry, {
        style: {
            color: "#2563eb",
            weight: 6,
            opacity: 0.9
        }
    }).addTo(liveMap);

    liveMap.fitBounds(routeLayer.getBounds(), {
        padding: [40, 40]
    });

    // REAL distance and time
    const distanceKm =
        (route.distance / 1000).toFixed(1);

    const timeMin =
        Math.ceil(route.duration / 60);

    // Show label directly on the route
    const center =
        routeLayer.getBounds().getCenter();

    L.marker(center, {
        icon: L.divIcon({
            className: "route-info-label",
            html: `
                <div style="
                    background:#111;
                    color:#fff;
                    padding:8px 14px;
                    border-radius:12px;
                    font-size:14px;
                    font-weight:600;
                    box-shadow:0 2px 8px rgba(0,0,0,.25);
                    white-space:nowrap;
                ">
                    🚗 ${distanceKm} KM • ${timeMin} min
                </div>
            `,
            iconSize: [140, 40]
        })
    }).addTo(liveMap);
}






// ==========================
// RIDE REQUESTS
// ==========================
function loadDriverRideRequests() {

    const container =
        document.getElementById("newRideRequests");

    if (!container) return;

    container.innerHTML = "";

    const request =
        JSON.parse(localStorage.getItem("easyRideRequest"));

    const accepted =
        JSON.parse(localStorage.getItem("rideAccepted"));

    const canceled =
        JSON.parse(localStorage.getItem("userCanceledRide"));

    // Show canceled request
    if (canceled) {

        container.innerHTML = `
            <div class="request1">

                <div class="request-text1">
                    <img src="/image/user5.webp" alt="">
                    <h4>${canceled.passenger}</h4>
                    <h5 style="color:#dc2626;">
                        User Canceled Ride
                    </h5>
                </div>

                <div class="request-text2">
                    <p>Pickup</p>
                    <h4>${canceled.pickup}</h4>
                </div>

                <div class="request-text2">
                    <p>Destination</p>
                    <h4>${canceled.destination}</h4>
                </div>

                <hr>

                <div class="requestt1">

                    <div class="request-text3">
                        <h4>${canceled.distance}</h4>
                        <p>Distance</p>
                    </div>

                    <div id="linees"></div>

                    <div class="request-text3">
                        <h4>${canceled.fare}</h4>
                        <p>Fare</p>
                    </div>

                    <div id="linees"></div>

                    <div class="request-text3">
                        <h4>${canceled.eta}</h4>
                        <p>ETA</p>
                    </div>

                </div>

                <div class="button-request">

                    <button class="botton1"
                        style="
                            width:100%;
                            background:#dc2626;
                            color:#fff;
                            cursor:not-allowed;
                        ">
                        User Canceled Ride
                    </button>

                </div>

            </div>
        `;

        return;
    }

    // No request
    if (!request) return;

    // Normal request
    container.innerHTML = `
        <div class="request1">

            <div class="request-text1">
                <img src="/image/user5.webp" alt="">
                <h4>${request.passenger}</h4>
                <h5 style="color:#16a34a;">
                    ${accepted ? "Ride Accepted" : "New Request"}
                </h5>
            </div>

            <div class="request-text2">
                <p>Pickup</p>
                <h4>${request.pickup}</h4>
            </div>

            <div class="request-text2">
                <p>Destination</p>
                <h4>${request.destination}</h4>
            </div>

            <hr>

            <div class="requestt1">

                <div class="request-text3">
                    <h4>${request.distance}</h4>
                    <p>Distance</p>
                </div>

                <div id="linees"></div>

                <div class="request-text3">
                    <h4>${request.fare}</h4>
                    <p>Fare</p>
                </div>

                <div id="linees"></div>

                <div class="request-text3">
                    <h4>${request.eta}</h4>
                    <p>ETA</p>
                </div>

            </div>

            <div class="button-request">

                ${accepted ? `
                    <button class="botton3"
                        style="
                            width:100%;
                            background:#16a34a;
                            color:#fff;
                        ">
                        Ride Accepted
                    </button>
                ` : `
                    <button class="botton1"
                        onclick="declineRide(this)">
                        Decline
                    </button>

                    <button class="botton2">
                        View Details
                    </button>

                    <button class="botton3"
                        onclick="acceptRide(this)">
                        Accept Ride
                    </button>
                `}

            </div>

        </div>
    `;

    if (accepted) {
        showRideRoute(accepted);
    }
}

// ==========================
// SIDEBAR NAVIGATION
// ==========================
links.forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        links.forEach(item =>
            item.classList.remove("active")
        );

        this.classList.add("active");

        loadPage(this.getAttribute("href"));

    });

});

// LOAD DEFAULT PAGE
loadPage("dashboard.html");









/* =========================
   RIDE REQUEST
========================= */

function loadDriverRideRequests() {

    const container = document.getElementById("newRideRequests");

    if (!container) return;

    container.innerHTML = "";

    // Get booking request from passenger page
    const request = JSON.parse(localStorage.getItem("easyRideRequest"));

    // If nobody booked a ride, show nothing
    if (!request) return;

    container.innerHTML = `
        <div class="request1">

            <div class="request-text1">
                <img src="/image/user5.webp" alt="">
                <h4>${request.passenger}</h4>
                <h5>New Request</h5>
            </div>

            <div class="request-text2">
                <p>Pickup</p>
                <h4>${request.pickup}</h4>
            </div>

            <div class="request-text2">
                <p>Destination</p>
                <h4>${request.destination}</h4>
            </div>

            <hr>

            <div class="requestt1">

                <div class="request-text3">
                    <h4>${request.distance}</h4>
                    <p>Distance</p>
                </div>

                <div id="linees"></div>

                <div class="request-text3">
                    <h4>${request.fare}</h4>
                    <p>Fare</p>
                </div>

                <div id="linees"></div>

                <div class="request-text3">
                    <h4>${request.eta}</h4>
                    <p>ETA</p>
                </div>

            </div>

            <div class="button-request">

                <button class="botton1" onclick="declineRide(this)">
                    Decline
                </button>

                <button class="botton2">
                    View Details
                </button>

                <button class="botton3" onclick="acceptRide(this)">
                    Accept Ride
                </button>

            </div>

        </div>
    `;
}

/* Accept Ride */
function acceptRide(button) {

    const request =
        JSON.parse(localStorage.getItem("easyRideRequest"));

    if (!request) return;

    // Save accepted ride
    localStorage.setItem(
        "rideAccepted",
        JSON.stringify(request)
    );

    // Change button
    const parent =
        button.closest(".button-request");

    parent.innerHTML = `
        <button class="botton3"
            style="width:100%;
                   background:#16a34a;
                   color:#fff;">
            Ride Accepted
        </button>
    `;

    // Show real route on map
    showRideRoute(request);
}

/* Decline Ride */
function declineRide(button) {

    const request = JSON.parse(localStorage.getItem("easyRideRequest"));

    if (!request) return;

    localStorage.setItem("rideDeclined", JSON.stringify(request));

    localStorage.removeItem("easyRideRequest");

    const parent = button.closest(".button-request");

    parent.innerHTML = `
        <button class="botton1"
            style="width:100%;background:#dc2626;color:#fff;">
            Ride Declined
        </button>
    `;
}

/* Load automatically when page opens */
document.addEventListener("DOMContentLoaded", function () {
    loadDriverRideRequests();
});


// Refresh when localStorage changes
window.addEventListener("storage", () => {
    loadDriverRideRequests();
});

// Also refresh every second
setInterval(() => {
    loadDriverRideRequests();
}, 1000);

document.addEventListener("DOMContentLoaded", () => {
    initRideMap();
    loadDriverRideRequests();
});




/* =========================================
   MOBILE SIDEBAR TOGGLE
========================================= */

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("side-bar");

if (menuToggle && sidebar){

    // Open / close sidebar
    menuToggle.addEventListener("click", (e) => {

        e.stopPropagation();

        sidebar.classList.toggle("show");
    });

    // Close when clicking outside sidebar
    document.addEventListener("click", (e) => {

        if (
            window.innerWidth <= 992 &&
            sidebar.classList.contains("show") &&
            !sidebar.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {

            sidebar.classList.remove("show");
        }
    });
}







document.addEventListener("click", function (e) {

    if (e.target.id === "toggleBalance") {

        const balance = document.getElementById("walletBalance");

        if (balance.textContent !== "****") {

            // Hide money
            balance.textContent = "****";
            e.target.classList.remove("fa-eye");
            e.target.classList.add("fa-eye-slash");

        } else {

            // Show money again
            balance.textContent = "₦32,000";
            e.target.classList.remove("fa-eye-slash");
            e.target.classList.add("fa-eye");
        }
    }
});