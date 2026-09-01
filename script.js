/* =========================================================
   EASY RIDE - MAIN JAVASCRIPT
   ACCOUNT SYSTEM
   ---------------------------------------------------------
   easyRideUsers    = ALL REGISTERED ACCOUNTS
   easyRideUser     = CURRENT LOGGED-IN ACCOUNT
   easyRideLoggedIn = CURRENT LOGIN SESSION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       TOAST NOTIFICATION SYSTEM
    ===================================================== */

    function showToast(message, type = "success") {

        let toast = document.getElementById("easyRideToast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "easyRideToast";
            document.body.appendChild(toast);
        }

        toast.className = "";
        toast.classList.add("easy-ride-toast");

        if (type === "error") {
            toast.classList.add("error");
        } else if (type === "warning") {
            toast.classList.add("warning");
        } else {
            toast.classList.add("success");
        }

        toast.textContent = message;

        requestAnimationFrame(function () {
            toast.classList.add("show");
        });

        if (toast.hideTimer) {
            clearTimeout(toast.hideTimer);
        }

        toast.hideTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 3000);
    }


    /* =====================================================
       GET ALL REGISTERED USERS
       
       IMPORTANT:
       This is the permanent account database.
       NEVER remove this during logout.
    ===================================================== */

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

        } catch (error) {

            console.error(
                "Unable to read Easy Ride accounts:",
                error
            );
        }

        return [];
    }


    /* =====================================================
       SAVE ALL REGISTERED USERS
    ===================================================== */

    function saveAllUsers(users) {

        if (!Array.isArray(users)) {
            return false;
        }

        try {

            localStorage.setItem(
                "easyRideUsers",
                JSON.stringify(users)
            );

            return true;

        } catch (error) {

            console.error(
                "Unable to save Easy Ride accounts:",
                error
            );

            return false;
        }
    }


    /* =====================================================
       GET CURRENT SESSION USER
       
       This is NOT the permanent account database.
    ===================================================== */

    function getCurrentUser() {

        const userData =
            localStorage.getItem("easyRideUser");

        if (!userData) {
            return null;
        }

        try {

            const user = JSON.parse(userData);

            if (
                user &&
                typeof user === "object" &&
                user.id
            ) {
                return user;
            }

        } catch (error) {

            console.error(
                "Unable to read current user:",
                error
            );
        }

        return null;
    }


    /* =====================================================
       SAVE CURRENT SESSION USER
    ===================================================== */

    function saveCurrentUser(user) {

        if (
            !user ||
            !user.id
        ) {
            return false;
        }

        try {

            localStorage.setItem(
                "easyRideUser",
                JSON.stringify(user)
            );

            return true;

        } catch (error) {

            console.error(
                "Unable to save current user:",
                error
            );

            return false;
        }
    }


    /* =====================================================
       GET USER BY ID
    ===================================================== */

    function getUserById(userId) {

        if (!userId) {
            return null;
        }

        const users = getAllUsers();

        return users.find(function (user) {

            return (
                user &&
                String(user.id) === String(userId)
            );

        }) || null;
    }


    /* =====================================================
       GET CURRENT USER ID
    ===================================================== */

    function getCurrentUserId() {

        const user = getCurrentUser();

        if (
            !user ||
            !user.id
        ) {
            return null;
        }

        return String(user.id);
    }


    /* =====================================================
       ACCOUNT-SPECIFIC STORAGE KEY
    ===================================================== */

    function userStorageKey(key) {

        const userId =
            getCurrentUserId();

        if (!userId) {
            return null;
        }

        return `easyRide_${key}_${userId}`;
    }


    /* =====================================================
       SAVE DATA FOR CURRENT ACCOUNT ONLY
    ===================================================== */

    function saveUserData(key, value) {

        const storageKey =
            userStorageKey(key);

        if (!storageKey) {
            return false;
        }

        try {

            localStorage.setItem(
                storageKey,
                JSON.stringify(value)
            );

            return true;

        } catch (error) {

            console.error(
                "Unable to save account data:",
                error
            );

            return false;
        }
    }


    /* =====================================================
       GET DATA FOR CURRENT ACCOUNT ONLY
    ===================================================== */

    function getUserData(key) {

        const storageKey =
            userStorageKey(key);

        if (!storageKey) {
            return null;
        }

        const data =
            localStorage.getItem(storageKey);

        if (!data) {
            return null;
        }

        try {

            return JSON.parse(data);

        } catch (error) {

            console.error(
                "Unable to read account data:",
                error
            );

            return null;
        }
    }


    /* =====================================================
       REMOVE DATA FOR CURRENT ACCOUNT ONLY
    ===================================================== */

    function removeUserData(key) {

        const storageKey =
            userStorageKey(key);

        if (!storageKey) {
            return;
        }

        localStorage.removeItem(storageKey);
    }


    /* =====================================================
       CHECK LOGIN
    ===================================================== */

    function isLoggedIn() {

        const loggedIn =
            localStorage.getItem(
                "easyRideLoggedIn"
            );

        const user =
            getCurrentUser();

        return (
            loggedIn === "true" &&
            user !== null &&
            !!user.id
        );
    }


    /* =====================================================
       GET FRESH CURRENT ACCOUNT
       
       IMPORTANT:
       Always reload the account from easyRideUsers.
       This prevents old session information from
       overwriting the permanent account.
    ===================================================== */

    function getFreshCurrentUser() {

        const currentUser =
            getCurrentUser();

        if (!currentUser || !currentUser.id) {
            return null;
        }

        const savedUser =
            getUserById(currentUser.id);

        if (savedUser) {

            saveCurrentUser(savedUser);

            return savedUser;
        }

        return currentUser;
    }


    /* =====================================================
       UPDATE ONLY CURRENT ACCOUNT
    ===================================================== */

    function updateUser(updatedUser) {

        if (
            !updatedUser ||
            !updatedUser.id
        ) {
            return false;
        }

        const users =
            getAllUsers();

        const userIndex =
            users.findIndex(function (user) {

                return (
                    user &&
                    String(user.id) ===
                    String(updatedUser.id)
                );

            });

        if (userIndex === -1) {
            return false;
        }

        users[userIndex] = {
            ...users[userIndex],
            ...updatedUser
        };

        const saved =
            saveAllUsers(users);

        if (!saved) {
            return false;
        }

        saveCurrentUser(
            users[userIndex]
        );

        return true;
    }


    /* =====================================================
       SETTINGS ELEMENTS
    ===================================================== */

    const settingsBtn =
        document.getElementById("settingsBtn");

    const settingsModal =
        document.getElementById("settingsModal");

    const closeSettings =
        document.getElementById("closeSettings");

    const saveSettings =
        document.getElementById("saveSettings");

    const settingsName =
        document.getElementById("settingsName");

    const settingsEmail =
        document.getElementById("settingsEmail");

    const settingsPhone =
        document.getElementById("settingsPhone");

    const settingsPassword =
        document.getElementById("settingsPassword");

    const togglePassword =
        document.getElementById("togglePassword");

    const themeToggle =
        document.getElementById("themeToggle");

    const profileImageInput =
        document.getElementById("profileImageInput");

    const settingsProfileImage =
        document.getElementById("settingsProfileImage");

    const settingsDefaultAvatar =
        document.getElementById("settingsDefaultAvatar");


    /* =====================================================
       SPLASH SCREEN
    ===================================================== */

    const splash =
        document.getElementById("splash");

    const mainContent =
        document.getElementById("main-content");

    if (
        splash &&
        mainContent
    ) {

        setTimeout(function () {

            splash.style.display =
                "none";

            mainContent.style.display =
                "block";

        }, 2000);
    }


    /* =====================================================
       TYPING TEXT
    ===================================================== */

    const typingTexts =
        document.getElementById("typing-texts");

    if (typingTexts) {

        const text =
            "Easy Ride.";

        let index = 0;

        typingTexts.textContent = "";

        function typeWriter() {

            if (index < text.length) {

                typingTexts.textContent +=
                    text.charAt(index);

                index++;

                setTimeout(
                    typeWriter,
                    100
                );
            }
        }

        typeWriter();
    }


    /* =====================================================
       HOME HERO TYPING
    ===================================================== */

    const typing =
        document.getElementById("typing");

    if (typing) {

        const text =
            "Ride with Confidence. Every Mile Matters.";

        let index = 0;

        typing.textContent = "";

        function typeHeroText() {

            if (index < text.length) {

                typing.textContent +=
                    text.charAt(index);

                index++;

                setTimeout(
                    typeHeroText,
                    100
                );
            }
        }

        typeHeroText();
    }


    /* =====================================================
       SLIDESHOW
    ===================================================== */

    const slides =
        document.querySelectorAll(".slide");

    if (slides.length > 0) {

        let currentSlide = 0;

        slides[0].classList.add("active");

        setInterval(function () {

            slides[currentSlide]
                .classList.remove("active");

            currentSlide =
                (currentSlide + 1) %
                slides.length;

            slides[currentSlide]
                .classList.add("active");

        }, 4000);
    }


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const mobileMenuButton =
        document.querySelector(".show-div");

    const navItems =
        document.getElementById("nav-items");

    if (
        mobileMenuButton &&
        navItems
    ) {

        mobileMenuButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                navItems.classList.toggle("open");
            }
        );
    }


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    const contactForm =
        document.getElementById("contactForm");

    const contactToast =
        document.getElementById("toast");

    if (
        contactForm &&
        contactToast
    ) {

        contactForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                contactToast.classList.add("show");

                setTimeout(function () {

                    contactToast.classList.remove("show");

                }, 2000);

                contactForm.reset();
            }
        );
    }


    /* =====================================================
       LOGIN TABS
    ===================================================== */

    const tabs =
        document.querySelectorAll(".tab");

    const forms =
        document.querySelectorAll(".form");

    const emailInput =
        document.getElementById("emailInput");

    const phoneInput =
        document.getElementById("phoneInput");

    const continueBtn =
        document.getElementById("continueBtn");

    if (
        tabs.length > 0 &&
        forms.length > 0 &&
        emailInput &&
        phoneInput &&
        continueBtn
    ) {

        let activeTab = "emailForm";

        tabs.forEach(function (tab) {

            tab.addEventListener(
                "click",
                function () {

                    tabs.forEach(
                        function (button) {

                            button.classList.remove(
                                "active"
                            );
                        }
                    );

                    forms.forEach(
                        function (form) {

                            form.classList.remove(
                                "active"
                            );
                        }
                    );

                    tab.classList.add("active");

                    const targetForm =
                        document.getElementById(
                            tab.dataset.tab
                        );

                    if (targetForm) {

                        targetForm.classList.add(
                            "active"
                        );
                    }

                    activeTab =
                        tab.dataset.tab;

                    checkInput();
                }
            );
        });


        function checkInput() {

            if (
                activeTab === "emailForm"
            ) {

                continueBtn.disabled =
                    emailInput.value.trim() === "";

            } else {

                continueBtn.disabled =
                    phoneInput.value.trim() === "";
            }
        }


        emailInput.addEventListener(
            "input",
            checkInput
        );

        phoneInput.addEventListener(
            "input",
            checkInput
        );

        checkInput();
    }


    /* =====================================================
       USER MENU ELEMENTS
    ===================================================== */

    const userMenuBtn =
        document.getElementById("userMenuBtn");

    const userPopover =
        document.getElementById("userPopover");

    const userMenu =
        document.querySelector(".user-menu");

    const userAvatar =
        document.getElementById("userAvatar");

    const userAvatarImage =
        document.getElementById("userAvatarImage");

    const userAvatarDefault =
        document.getElementById("userAvatarDefault");

    const popoverName =
        document.getElementById("popoverName");

    const popoverEmail =
        document.getElementById("popoverEmail");

    const userFullname =
        document.getElementById("userFullname");

    const userPhone =
        document.getElementById("userPhone");

    const userEmail =
        document.getElementById("userEmail");

    const accountStatus =
        document.getElementById("accountStatus");

    const logoutBtn =
        document.getElementById("logoutBtn");


    /* =====================================================
       PROFILE IMAGE VIEWER
    ===================================================== */

    const profileImageViewer =
        document.getElementById("profileImageViewer");

    const largeProfileImage =
        document.getElementById("largeProfileImage");

    const closeProfileViewer =
        document.getElementById("closeProfileViewer");


    /* =====================================================
       UPDATE USER AVATAR
    ===================================================== */

    function updateUserAvatar(user) {

        if (
            !userAvatarImage ||
            !userAvatarDefault
        ) {
            return;
        }

        if (
            !user ||
            !user.profileImage
        ) {

            userAvatarImage.removeAttribute("src");

            userAvatarImage.classList.remove("show");

            userAvatarDefault.classList.remove("hide");

            return;
        }

        userAvatarImage.src =
            user.profileImage;

        userAvatarImage.classList.add("show");

        userAvatarDefault.classList.add("hide");
    }


    /* =====================================================
       SHOW GUEST USER
    ===================================================== */

    function showGuestUser() {

        if (popoverName) {
            popoverName.textContent =
                "Guest User";
        }

        if (popoverEmail) {
            popoverEmail.textContent =
                "Not logged in";
        }

        if (userFullname) {
            userFullname.textContent =
                "Guest User";
        }

        if (userPhone) {
            userPhone.textContent =
                "Not available";
        }

        if (userEmail) {
            userEmail.textContent =
                "Not available";
        }

        if (accountStatus) {

            accountStatus.textContent =
                "Not logged in";

            accountStatus.style.color =
                "#dc2626";
        }

        if (logoutBtn) {

            logoutBtn.style.display =
                "none";
        }

        updateUserAvatar(null);
    }


    /* =====================================================
       LOAD USER INFORMATION
    ===================================================== */

    function loadUserInformation() {

        const user =
            getFreshCurrentUser();

        if (
            !isLoggedIn() ||
            !user
        ) {

            showGuestUser();

            return;
        }

        const fullname =
            user.fullname ||
            "Easy Ride User";

        const phone =
            user.phone ||
            "Not available";

        const email =
            user.email ||
            "Not available";

        if (popoverName) {
            popoverName.textContent =
                fullname;
        }

        if (popoverEmail) {
            popoverEmail.textContent =
                email;
        }

        if (userFullname) {
            userFullname.textContent =
                fullname;
        }

        if (userPhone) {
            userPhone.textContent =
                phone;
        }

        if (userEmail) {
            userEmail.textContent =
                email;
        }

        if (accountStatus) {

            accountStatus.textContent =
                "Active";

            accountStatus.style.color =
                "#159447";
        }

        if (logoutBtn) {

            logoutBtn.style.display =
                "flex";
        }

        updateUserAvatar(user);
    }


    loadUserInformation();


    /* =====================================================
       OPEN / CLOSE USER MENU
    ===================================================== */

    function openUserMenu() {

        if (!userPopover) {
            return;
        }

        loadUserInformation();

        userPopover.classList.add("show");
    }


    function closeUserMenu() {

        if (!userPopover) {
            return;
        }

        userPopover.classList.remove("show");
    }


    /* =====================================================
       SETTINGS RETURN STATE
    ===================================================== */

    let shouldReturnToUserPopover = false;

    let savedUserPopoverPosition = null;


    /* =====================================================
       SETTINGS CONTAINER
    ===================================================== */

    const settingsContainer =
        document.querySelector(".settings-container");


    /* =====================================================
       SAVE USER POPOVER POSITION
    ===================================================== */

    function saveCurrentUserPopoverPosition() {

        if (!userPopover) {
            return;
        }

        const rect =
            userPopover.getBoundingClientRect();

        savedUserPopoverPosition = {

            left: rect.left,

            top: rect.top,

            width: rect.width,

            height: rect.height
        };
    }


    /* =====================================================
       RETURN TO USER POPOVER
    ===================================================== */

    function returnToUserPopover() {

        if (!shouldReturnToUserPopover) {
            return;
        }

        setTimeout(function () {

            if (
                userPopover &&
                userMenuBtn
            ) {

                loadUserInformation();

                userPopover.classList.add("show");
            }

        }, 50);
    }


    /* =====================================================
       POSITION SETTINGS LIKE USER POPOVER
    ===================================================== */

    function positionSettingsLikeUserPopover() {

        if (
            !settingsContainer ||
            !userMenu
        ) {
            return;
        }

        let referenceRect = null;

        if (savedUserPopoverPosition) {

            referenceRect = {

                left:
                    savedUserPopoverPosition.left,

                top:
                    savedUserPopoverPosition.top,

                width:
                    savedUserPopoverPosition.width,

                height:
                    savedUserPopoverPosition.height
            };

        } else if (userPopover) {

            referenceRect =
                userPopover.getBoundingClientRect();
        }

        if (!referenceRect) {
            return;
        }

        const settingsRect =
            settingsContainer.getBoundingClientRect();

        let settingsWidth =
            settingsRect.width;

        let settingsHeight =
            settingsRect.height;

        if (!settingsWidth) {

            settingsWidth =
                settingsContainer.offsetWidth;
        }

        if (!settingsHeight) {

            settingsHeight =
                settingsContainer.offsetHeight;
        }

        settingsContainer.style.position =
            "fixed";

        settingsContainer.style.transform =
            "none";

        settingsContainer.style.right =
            "auto";

        settingsContainer.style.bottom =
            "auto";

        let left =
            referenceRect.left;

        let top =
            referenceRect.top;

        const maxLeft =
            Math.max(
                0,
                window.innerWidth -
                settingsWidth
            );

        const maxTop =
            Math.max(
                0,
                window.innerHeight -
                settingsHeight
            );

        left =
            Math.max(
                0,
                Math.min(
                    left,
                    maxLeft
                )
            );

        top =
            Math.max(
                0,
                Math.min(
                    top,
                    maxTop
                )
            );

        settingsContainer.style.left =
            left + "px";

        settingsContainer.style.top =
            top + "px";

        if (userMenu) {

            userMenu.style.zIndex =
                "100000";
        }

        if (userPopover) {

            userPopover.style.zIndex =
                "100001";
        }

        settingsContainer.style.zIndex =
            "99990";

        if (settingsModal) {

            settingsModal.style.zIndex =
                "99900";
        }
    }


    /* =====================================================
       REFRESH SETTINGS POSITION
    ===================================================== */

    function refreshSettingsPosition() {

        if (
            !settingsModal ||
            !settingsModal.classList.contains("show")
        ) {
            return;
        }

        positionSettingsLikeUserPopover();
    }


    /* =====================================================
       USER MENU CLICK
    ===================================================== */

    if (
        userMenuBtn &&
        userPopover
    ) {

        userMenuBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                if (
                    userPopover.classList.contains("show")
                ) {

                    closeUserMenu();

                } else {

                    shouldReturnToUserPopover =
                        false;

                    openUserMenu();
                }
            }
        );


        userPopover.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();
            }
        );


        document.addEventListener(
            "click",
            function (event) {

                if (
                    settingsModal &&
                    settingsModal.classList.contains("show")
                ) {
                    return;
                }

                if (
                    !userPopover.contains(event.target) &&
                    !userMenuBtn.contains(event.target)
                ) {

                    closeUserMenu();
                }
            }
        );
    }


    /* =====================================================
       CLOSE PROFILE IMAGE VIEWER
    ===================================================== */

    function closeProfileImageViewer() {

        if (!profileImageViewer) {
            return;
        }

        profileImageViewer.classList.remove("show");

        if (largeProfileImage) {

            largeProfileImage.removeAttribute("src");
        }

        document.body.style.overflow = "";
    }


    /* =====================================================
       CLICK PROFILE IMAGE
    ===================================================== */

    if (userAvatar) {

        userAvatar.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                const currentUser =
                    getFreshCurrentUser();

                if (
                    !currentUser ||
                    !currentUser.profileImage
                ) {
                    return;
                }

                if (
                    profileImageViewer &&
                    largeProfileImage
                ) {

                    largeProfileImage.src =
                        currentUser.profileImage;

                    profileImageViewer.classList.add(
                        "show"
                    );

                    document.body.style.overflow =
                        "hidden";
                }
            }
        );
    }


    /* =====================================================
       CLOSE PROFILE VIEWER
    ===================================================== */

    if (closeProfileViewer) {

        closeProfileViewer.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                closeProfileImageViewer();
            }
        );
    }


    /* =====================================================
       CLICK OUTSIDE PROFILE VIEWER
    ===================================================== */

    if (profileImageViewer) {

        profileImageViewer.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    profileImageViewer
                ) {

                    closeProfileImageViewer();
                }
            }
        );
    }


    /* =====================================================
       SETTINGS OPEN
    ===================================================== */

    if (
        settingsBtn &&
        settingsModal
    ) {

        settingsBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                const user =
                    getFreshCurrentUser();

                if (
                    !isLoggedIn() ||
                    !user
                ) {

                    showToast(
                        "Please login first.",
                        "error"
                    );

                    return;
                }

                shouldReturnToUserPopover =
                    true;

                if (userPopover) {

                    saveCurrentUserPopoverPosition();
                }

                if (settingsName) {

                    settingsName.value =
                        user.fullname || "";
                }

                if (settingsEmail) {

                    settingsEmail.value =
                        user.email || "";
                }

                if (settingsPhone) {

                    settingsPhone.value =
                        user.phone || "";
                }

                if (settingsPassword) {

                    settingsPassword.value =
                        "";

                    settingsPassword.type =
                        "password";
                }

                if (togglePassword) {

                    const icon =
                        togglePassword.querySelector("i");

                    if (icon) {

                        icon.classList.remove(
                            "fa-eye-slash"
                        );

                        icon.classList.add(
                            "fa-eye"
                        );
                    }
                }

                if (
                    user.profileImage &&
                    settingsProfileImage &&
                    settingsDefaultAvatar
                ) {

                    settingsProfileImage.src =
                        user.profileImage;

                    settingsProfileImage.classList.add(
                        "show"
                    );

                    settingsDefaultAvatar.classList.add(
                        "hide"
                    );

                } else if (
                    settingsProfileImage &&
                    settingsDefaultAvatar
                ) {

                    settingsProfileImage.removeAttribute(
                        "src"
                    );

                    settingsProfileImage.classList.remove(
                        "show"
                    );

                    settingsDefaultAvatar.classList.remove(
                        "hide"
                    );
                }

                closeUserMenu();

                settingsModal.classList.add("show");

                requestAnimationFrame(function () {

                    positionSettingsLikeUserPopover();

                    requestAnimationFrame(function () {

                        positionSettingsLikeUserPopover();
                    });
                });
            }
        );
    }


    /* =====================================================
       CLOSE SETTINGS
    ===================================================== */

    function resetSettingsPosition() {

        if (settingsContainer) {

            settingsContainer.style.position = "";

            settingsContainer.style.left = "";

            settingsContainer.style.top = "";

            settingsContainer.style.right = "";

            settingsContainer.style.bottom = "";

            settingsContainer.style.transform = "";

            settingsContainer.style.zIndex = "";
        }

        if (settingsModal) {

            settingsModal.style.zIndex = "";
        }
    }


    if (
        closeSettings &&
        settingsModal
    ) {

        closeSettings.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                settingsModal.classList.remove("show");

                resetSettingsPosition();

                returnToUserPopover();
            }
        );
    }


    /* =====================================================
       CLOSE SETTINGS OUTSIDE
    ===================================================== */

    if (settingsModal) {

        settingsModal.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                if (
                    event.target ===
                    settingsModal
                ) {

                    settingsModal.classList.remove(
                        "show"
                    );

                    resetSettingsPosition();

                    returnToUserPopover();
                }
            }
        );
    }


    /* =====================================================
       STOP SETTINGS CONTAINER CLICKS
    ===================================================== */

    if (settingsContainer) {

        settingsContainer.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();
            }
        );
    }


    /* =====================================================
       SHOW / HIDE PASSWORD
    ===================================================== */

    if (
        togglePassword &&
        settingsPassword
    ) {

        togglePassword.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                const icon =
                    togglePassword.querySelector("i");

                if (
                    settingsPassword.type ===
                    "password"
                ) {

                    settingsPassword.type =
                        "text";

                    if (icon) {

                        icon.classList.remove(
                            "fa-eye"
                        );

                        icon.classList.add(
                            "fa-eye-slash"
                        );
                    }

                } else {

                    settingsPassword.type =
                        "password";

                    if (icon) {

                        icon.classList.remove(
                            "fa-eye-slash"
                        );

                        icon.classList.add(
                            "fa-eye"
                        );
                    }
                }
            }
        );
    }


    /* =====================================================
       PROFILE IMAGE PREVIEW
    ===================================================== */

    if (
        profileImageInput &&
        settingsProfileImage &&
        settingsDefaultAvatar
    ) {

        profileImageInput.addEventListener(
            "change",
            function (event) {

                const file =
                    event.target.files[0];

                if (!file) {
                    return;
                }

                if (
                    !file.type.startsWith("image/")
                ) {

                    showToast(
                        "Please select a valid image.",
                        "error"
                    );

                    profileImageInput.value =
                        "";

                    return;
                }

                const reader =
                    new FileReader();

                reader.onload =
                    function (loadEvent) {

                        const imageData =
                            loadEvent.target.result;

                        settingsProfileImage.src =
                            imageData;

                        settingsProfileImage.classList.add(
                            "show"
                        );

                        settingsDefaultAvatar.classList.add(
                            "hide"
                        );

                        const currentUser =
                            getFreshCurrentUser();

                        if (currentUser) {

                            currentUser.profileImage =
                                imageData;

                            updateUser(
                                currentUser
                            );

                            updateUserAvatar(
                                currentUser
                            );
                        }

                        showToast(
                            "Profile picture updated.",
                            "success"
                        );
                    };

                reader.readAsDataURL(file);
            }
        );
    }


    /* =====================================================
       ACCOUNT-SPECIFIC THEME
    ===================================================== */

    function updateThemeToggle(isDark) {

        if (!themeToggle) {
            return;
        }

        themeToggle.classList.toggle(
            "dark",
            isDark
        );
    }


    function loadUserTheme() {

        document.body.classList.remove(
            "dark-mode"
        );

        const user =
            getFreshCurrentUser();

        if (
            !isLoggedIn() ||
            !user
        ) {

            updateThemeToggle(false);

            return;
        }

        const isDark =
            user.theme === "dark";

        document.body.classList.toggle(
            "dark-mode",
            isDark
        );

        updateThemeToggle(
            isDark
        );
    }


    loadUserTheme();


    /* =====================================================
       THEME TOGGLE
    ===================================================== */

    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                const currentUser =
                    getFreshCurrentUser();

                if (
                    !isLoggedIn() ||
                    !currentUser
                ) {

                    showToast(
                        "Please login first.",
                        "error"
                    );

                    return;
                }

                const isDark =
                    !document.body.classList.contains(
                        "dark-mode"
                    );

                document.body.classList.toggle(
                    "dark-mode",
                    isDark
                );

                currentUser.theme =
                    isDark
                        ? "dark"
                        : "light";

                updateUser(
                    currentUser
                );

                updateThemeToggle(
                    isDark
                );

                showToast(
                    isDark
                        ? "Dark mode enabled."
                        : "Light mode enabled.",
                    "success"
                );
            }
        );
    }


    /* =====================================================
       SAVE SETTINGS
    ===================================================== */

    if (
        saveSettings &&
        settingsModal
    ) {

        saveSettings.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                const currentUser =
                    getFreshCurrentUser();

                if (
                    !isLoggedIn() ||
                    !currentUser
                ) {

                    showToast(
                        "Please login first.",
                        "error"
                    );

                    return;
                }

                const name =
                    settingsName
                        ? settingsName.value.trim()
                        : "";

                const email =
                    settingsEmail
                        ? settingsEmail.value
                            .trim()
                            .toLowerCase()
                        : "";

                const phone =
                    settingsPhone
                        ? settingsPhone.value.trim()
                        : "";

                const password =
                    settingsPassword
                        ? settingsPassword.value.trim()
                        : "";

                if (!name) {

                    showToast(
                        "Please enter your name.",
                        "error"
                    );

                    if (settingsName) {
                        settingsName.focus();
                    }

                    return;
                }

                if (!email) {

                    showToast(
                        "Please enter your Gmail/email.",
                        "error"
                    );

                    if (settingsEmail) {
                        settingsEmail.focus();
                    }

                    return;
                }

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (
                    !emailPattern.test(email)
                ) {

                    showToast(
                        "Please enter a valid email address.",
                        "error"
                    );

                    if (settingsEmail) {
                        settingsEmail.focus();
                    }

                    return;
                }

                const users =
                    getAllUsers();

                const emailUsedByAnotherUser =
                    users.some(function (user) {

                        if (
                            !user ||
                            !user.email
                        ) {
                            return false;
                        }

                        return (
                            user.email
                                .trim()
                                .toLowerCase() ===
                            email &&
                            String(user.id) !==
                            String(currentUser.id)
                        );
                    });

                if (
                    emailUsedByAnotherUser
                ) {

                    showToast(
                        "Another account already uses this email.",
                        "error"
                    );

                    return;
                }

                currentUser.fullname =
                    name;

                currentUser.email =
                    email;

                currentUser.phone =
                    phone;

                if (password !== "") {

                    if (
                        password.length < 6
                    ) {

                        showToast(
                            "Password must be at least 6 characters.",
                            "error"
                        );

                        if (settingsPassword) {
                            settingsPassword.focus();
                        }

                        return;
                    }

                    currentUser.password =
                        password;
                }

                if (
                    settingsProfileImage &&
                    settingsProfileImage.classList.contains(
                        "show"
                    ) &&
                    settingsProfileImage.src
                ) {

                    currentUser.profileImage =
                        settingsProfileImage.src;
                }

                if (!currentUser.theme) {

                    currentUser.theme =
                        "light";
                }

                const updated =
                    updateUser(currentUser);

                if (!updated) {

                    showToast(
                        "Unable to update your account.",
                        "error"
                    );

                    return;
                }

                localStorage.setItem(
                    "easyRideLoggedIn",
                    "true"
                );

                loadUserInformation();

                updateUserAvatar(
                    currentUser
                );

                settingsModal.classList.remove(
                    "show"
                );

                resetSettingsPosition();

                if (settingsPassword) {

                    settingsPassword.value =
                        "";

                    settingsPassword.type =
                        "password";
                }

                if (togglePassword) {

                    const icon =
                        togglePassword.querySelector("i");

                    if (icon) {

                        icon.classList.remove(
                            "fa-eye-slash"
                        );

                        icon.classList.add(
                            "fa-eye"
                        );
                    }
                }

                showToast(
                    "Your settings have been saved successfully.",
                    "success"
                );

                returnToUserPopover();
            }
        );
    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Escape"
            ) {
                return;
            }

            closeProfileImageViewer();

            if (
                settingsModal &&
                settingsModal.classList.contains("show")
            ) {

                settingsModal.classList.remove(
                    "show"
                );

                resetSettingsPosition();

                returnToUserPopover();

            } else {

                closeUserMenu();
            }
        }
    );


    /* =====================================================
       LOGOUT
       
       VERY IMPORTANT:
       
       DO NOT DELETE easyRideUsers.
       
       easyRideUsers contains the permanent
       registered accounts.
       
       Logout only removes the current session.
    ===================================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                /*
                 * Remove ONLY the current login session.
                 */

                localStorage.removeItem(
                    "easyRideLoggedIn"
                );

                localStorage.removeItem(
                    "easyRideUser"
                );

                /*
                 * DO NOT DO THIS:
                 *
                 * localStorage.removeItem("easyRideUsers");
                 *
                 * because that would delete every
                 * registered account.
                 */

                document.body.classList.remove(
                    "dark-mode"
                );

                shouldReturnToUserPopover =
                    false;

                closeUserMenu();

                closeProfileImageViewer();

                if (settingsModal) {

                    settingsModal.classList.remove(
                        "show"
                    );
                }

                resetSettingsPosition();

                /*
                 * The permanent account database
                 * easyRideUsers remains untouched.
                 */

                window.location.href =
                    "/website/login.html";
            }
        );
    }


    /* =========================================================
       DRAGGABLE RESPONSIVE PROFILE MENU
    ========================================================= */

    if (
        userMenu &&
        userMenuBtn
    ) {

        let isDragging = false;
        let hasMoved = false;
        let suppressNextClick = false;

        let startX = 0;
        let startY = 0;

        let startLeft = 0;
        let startTop = 0;


        function getProfileMenuPositionKey() {

            const currentUser =
                getCurrentUser();

            if (
                currentUser &&
                currentUser.id
            ) {

                return (
                    `easyRideProfileMenuPosition_${currentUser.id}`
                );
            }

            return (
                "easyRideProfileMenuPosition_guest"
            );
        }


        function makeProfileMenuFixed() {

            if (
                window.innerWidth > 1024
            ) {
                return;
            }

            userMenu.style.position =
                "fixed";

            userMenu.style.right =
                "auto";

            userMenu.style.bottom =
                "auto";

            userMenu.style.zIndex =
                "100000";

            if (userPopover) {

                userPopover.style.zIndex =
                    "100001";
            }

            if (settingsContainer) {

                settingsContainer.style.zIndex =
                    "99990";
            }

            if (settingsModal) {

                settingsModal.style.zIndex =
                    "99900";
            }
        }


        function setDefaultProfileMenuPosition() {

            if (
                window.innerWidth > 1024
            ) {
                return;
            }

            makeProfileMenuFixed();

            const menuWidth =
                userMenu.offsetWidth;

            const menuHeight =
                userMenu.offsetHeight;

            let left =
                window.innerWidth -
                menuWidth -
                25;

            let top =
                (
                    window.innerHeight -
                    menuHeight
                ) / 2;

            left = Math.max(
                0,
                Math.min(
                    left,
                    window.innerWidth -
                    menuWidth
                )
            );

            top = Math.max(
                0,
                Math.min(
                    top,
                    window.innerHeight -
                    menuHeight
                )
            );

            userMenu.style.left =
                left + "px";

            userMenu.style.top =
                top + "px";

            userMenu.style.transform =
                "none";
        }


        function restoreProfileMenuPosition() {

            if (
                window.innerWidth > 1024
            ) {
                return;
            }

            makeProfileMenuFixed();

            const storageKey =
                getProfileMenuPositionKey();

            const savedPosition =
                localStorage.getItem(
                    storageKey
                );

            if (!savedPosition) {

                setDefaultProfileMenuPosition();

                return;
            }

            try {

                const position =
                    JSON.parse(
                        savedPosition
                    );

                if (
                    typeof position.left !==
                    "number" ||
                    typeof position.top !==
                    "number"
                ) {

                    setDefaultProfileMenuPosition();

                    return;
                }

                const menuWidth =
                    userMenu.offsetWidth;

                const menuHeight =
                    userMenu.offsetHeight;

                let left =
                    position.left;

                let top =
                    position.top;

                left = Math.max(
                    0,
                    Math.min(
                        left,
                        window.innerWidth -
                        menuWidth
                    )
                );

                top = Math.max(
                    0,
                    Math.min(
                        top,
                        window.innerHeight -
                        menuHeight
                    )
                );

                userMenu.style.left =
                    left + "px";

                userMenu.style.top =
                    top + "px";

                userMenu.style.right =
                    "auto";

                userMenu.style.bottom =
                    "auto";

                userMenu.style.transform =
                    "none";

            } catch (error) {

                console.error(
                    "Could not restore profile menu position:",
                    error
                );

                setDefaultProfileMenuPosition();
            }
        }


        /* =================================================
           POINTER DOWN
        ================================================= */

        userMenuBtn.addEventListener(
            "pointerdown",
            function (event) {

                if (
                    window.innerWidth > 1024
                ) {
                    return;
                }

                if (
                    event.pointerType === "mouse" &&
                    event.button !== 0
                ) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                makeProfileMenuFixed();

                isDragging = true;

                hasMoved = false;

                suppressNextClick = false;

                const rect =
                    userMenu.getBoundingClientRect();

                startX =
                    event.clientX;

                startY =
                    event.clientY;

                startLeft =
                    rect.left;

                startTop =
                    rect.top;

                userMenu.style.transform =
                    "none";

                userMenu.style.left =
                    startLeft + "px";

                userMenu.style.top =
                    startTop + "px";

                userMenuBtn.style.touchAction =
                    "none";

                try {

                    userMenuBtn.setPointerCapture(
                        event.pointerId
                    );

                } catch (error) {

                    /* Ignore */
                }
            }
        );


        /* =================================================
           POINTER MOVE
        ================================================= */

        userMenuBtn.addEventListener(
            "pointermove",
            function (event) {

                if (
                    !isDragging ||
                    window.innerWidth > 1024
                ) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                const moveX =
                    event.clientX -
                    startX;

                const moveY =
                    event.clientY -
                    startY;

                if (
                    Math.abs(moveX) > 5 ||
                    Math.abs(moveY) > 5
                ) {

                    hasMoved = true;

                    suppressNextClick =
                        true;
                }

                let newLeft =
                    startLeft +
                    moveX;

                let newTop =
                    startTop +
                    moveY;

                const menuWidth =
                    userMenu.offsetWidth;

                const menuHeight =
                    userMenu.offsetHeight;

                const maxLeft =
                    Math.max(
                        0,
                        window.innerWidth -
                        menuWidth
                    );

                const maxTop =
                    Math.max(
                        0,
                        window.innerHeight -
                        menuHeight
                    );

                newLeft =
                    Math.max(
                        0,
                        Math.min(
                            newLeft,
                            maxLeft
                        )
                    );

                newTop =
                    Math.max(
                        0,
                        Math.min(
                            newTop,
                            maxTop
                        )
                    );

                userMenu.style.left =
                    newLeft + "px";

                userMenu.style.top =
                    newTop + "px";
            }
        );


        /* =================================================
           POINTER UP
        ================================================= */

        userMenuBtn.addEventListener(
            "pointerup",
            function (event) {

                if (!isDragging) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                isDragging = false;

                try {

                    userMenuBtn.releasePointerCapture(
                        event.pointerId
                    );

                } catch (error) {

                    /* Ignore */
                }

                userMenuBtn.style.touchAction =
                    "none";

                if (hasMoved) {

                    const storageKey =
                        getProfileMenuPositionKey();

                    const currentLeft =
                        parseFloat(
                            userMenu.style.left
                        ) || 0;

                    const currentTop =
                        parseFloat(
                            userMenu.style.top
                        ) || 0;

                    localStorage.setItem(
                        storageKey,
                        JSON.stringify({

                            left:
                                currentLeft,

                            top:
                                currentTop
                        })
                    );

                    suppressNextClick =
                        true;

                    setTimeout(
                        function () {

                            suppressNextClick =
                                false;

                        },
                        150
                    );
                }
            }
        );


        /* =================================================
           POINTER CANCEL
        ================================================= */

        userMenuBtn.addEventListener(
            "pointercancel",
            function (event) {

                isDragging = false;

                try {

                    userMenuBtn.releasePointerCapture(
                        event.pointerId
                    );

                } catch (error) {

                    /* Ignore */
                }

                suppressNextClick = true;

                setTimeout(
                    function () {

                        suppressNextClick =
                            false;

                    },
                    150
                );
            }
        );


        /* =================================================
           PREVENT IMAGE DRAG
        ================================================= */

        userMenuBtn.addEventListener(
            "dragstart",
            function (event) {

                event.preventDefault();
            }
        );


        /* =================================================
           STOP CLICK AFTER DRAG
        ================================================= */

        userMenuBtn.addEventListener(
            "click",
            function (event) {

                if (suppressNextClick) {

                    event.preventDefault();
                    event.stopPropagation();

                    suppressNextClick =
                        false;

                    return;
                }
            },
            true
        );


        /* =================================================
           INITIAL POSITION
        ================================================= */

        if (
            window.innerWidth <= 1024
        ) {

            requestAnimationFrame(
                function () {

                    restoreProfileMenuPosition();
                }
            );
        }


        /* =================================================
           WINDOW LOAD
        ================================================= */

        window.addEventListener(
            "load",
            function () {

                if (
                    window.innerWidth <= 1024
                ) {

                    restoreProfileMenuPosition();
                }
            }
        );


        /* =================================================
           WINDOW RESIZE
        ================================================= */

        window.addEventListener(
            "resize",
            function () {

                if (
                    window.innerWidth > 1024
                ) {
                    return;
                }

                makeProfileMenuFixed();

                const rect =
                    userMenu.getBoundingClientRect();

                const menuWidth =
                    userMenu.offsetWidth;

                const menuHeight =
                    userMenu.offsetHeight;

                let left =
                    rect.left;

                let top =
                    rect.top;

                left = Math.max(
                    0,
                    Math.min(
                        left,
                        window.innerWidth -
                        menuWidth
                    )
                );

                top = Math.max(
                    0,
                    Math.min(
                        top,
                        window.innerHeight -
                        menuHeight
                    )
                );

                userMenu.style.left =
                    left + "px";

                userMenu.style.top =
                    top + "px";

                userMenu.style.right =
                    "auto";

                userMenu.style.bottom =
                    "auto";

                userMenu.style.transform =
                    "none";

                refreshSettingsPosition();
            }
        );
    }


    /* =====================================================
       EXTRA SETTINGS POSITION UPDATE
    ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            if (
                settingsModal &&
                settingsModal.classList.contains("show")
            ) {

                setTimeout(
                    function () {

                        positionSettingsLikeUserPopover();

                    },
                    30
                );
            }
        }
    );


    /* =====================================================
       KEEP PROFILE MENU ABOVE SETTINGS
    ===================================================== */

    function keepProfileMenuAboveSettings() {

        if (!userMenu) {
            return;
        }

        if (
            window.innerWidth <= 1024
        ) {

            userMenu.style.zIndex =
                "100000";

            if (userPopover) {

                userPopover.style.zIndex =
                    "100001";
            }

            if (settingsContainer) {

                settingsContainer.style.zIndex =
                    "99990";
            }

            if (settingsModal) {

                settingsModal.style.zIndex =
                    "99900";
            }
        }
    }


    keepProfileMenuAboveSettings();


    /* =====================================================
       FINAL INITIALIZATION
    ===================================================== */

    setTimeout(
        function () {

            keepProfileMenuAboveSettings();

            if (
                window.innerWidth <= 1024 &&
                userMenu
            ) {

                if (
                    !userMenu.style.left ||
                    !userMenu.style.top
                ) {

                    /*
                     * Restore account-specific
                     * position.
                     */

                    restoreProfileMenuPosition();
                }
            }

        },
        100
    );

});