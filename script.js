/* =========================================================
   EASY RIDE - MAIN JAVASCRIPT
   ACCOUNT-SPECIFIC VERSION
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
       ACCOUNT STORAGE HELPERS
    ===================================================== */

    function getAllUsers() {

        const usersData = localStorage.getItem("easyRideUsers");

        if (!usersData) {
            return [];
        }

        try {

            const users = JSON.parse(usersData);

            return Array.isArray(users) ? users : [];

        } catch (error) {

            console.error("Unable to read users:", error);

            return [];
        }
    }


    function saveAllUsers(users) {

        localStorage.setItem(
            "easyRideUsers",
            JSON.stringify(users)
        );
    }


    /* =====================================================
       GET CURRENT LOGGED-IN USER
    ===================================================== */

    function getCurrentUser() {

        const userData = localStorage.getItem("easyRideUser");

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


    function saveCurrentUser(user) {

        if (!user || !user.id) {
            return false;
        }

        localStorage.setItem(
            "easyRideUser",
            JSON.stringify(user)
        );

        return true;
    }


    /* =====================================================
       GET USER BY ID
    ===================================================== */

    function getUserById(userId) {

        if (!userId) {
            return null;
        }

        const users = getAllUsers();

        return (
            users.find(function (user) {
                return String(user.id) === String(userId);
            }) || null
        );
    }


    /* =====================================================
       GET CURRENT USER ID
    ===================================================== */

    function getCurrentUserId() {

        const user = getCurrentUser();

        if (!user || !user.id) {
            return null;
        }

        return String(user.id);
    }


    /* =====================================================
       ACCOUNT-SPECIFIC STORAGE KEY
    ===================================================== */

    function userStorageKey(key) {

        const userId = getCurrentUserId();

        if (!userId) {
            return null;
        }

        return `easyRide_${key}_${userId}`;
    }


    /* =====================================================
       SAVE CURRENT USER DATA ONLY
    ===================================================== */

    function saveUserData(key, value) {

        const storageKey = userStorageKey(key);

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
       GET CURRENT USER DATA ONLY
    ===================================================== */

    function getUserData(key) {

        const storageKey = userStorageKey(key);

        if (!storageKey) {
            return null;
        }

        const data = localStorage.getItem(storageKey);

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
       REMOVE CURRENT USER DATA ONLY
    ===================================================== */

    function removeUserData(key) {

        const storageKey = userStorageKey(key);

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
            localStorage.getItem("easyRideLoggedIn");

        const user = getCurrentUser();

        return (
            loggedIn === "true" &&
            user !== null &&
            !!user.id
        );
    }


    /* =====================================================
       GET FRESH CURRENT ACCOUNT
    ===================================================== */

    function getFreshCurrentUser() {

        const currentUser = getCurrentUser();

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

        const users = getAllUsers();

        const userIndex =
            users.findIndex(function (user) {

                return (
                    String(user.id) ===
                    String(updatedUser.id)
                );

            });

        if (userIndex === -1) {

            console.error(
                "Account not found. Update cancelled."
            );

            return false;
        }

        users[userIndex] = {
            ...users[userIndex],
            ...updatedUser
        };

        saveAllUsers(users);

        saveCurrentUser(users[userIndex]);

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

    if (splash && mainContent) {

        setTimeout(function () {

            splash.style.display = "none";

            mainContent.style.display = "block";

        }, 2000);
    }


    /* =====================================================
       TYPING TEXT
    ===================================================== */

    const typingTexts =
        document.getElementById("typing-texts");

    if (typingTexts) {

        const text = "Easy Ride.";

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

            if (activeTab === "emailForm") {

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
            popoverName.textContent = "Guest User";
        }

        if (popoverEmail) {
            popoverEmail.textContent = "Not logged in";
        }

        if (userFullname) {
            userFullname.textContent = "Guest User";
        }

        if (userPhone) {
            userPhone.textContent = "Not available";
        }

        if (userEmail) {
            userEmail.textContent = "Not available";
        }

        if (accountStatus) {

            accountStatus.textContent =
                "Not logged in";

            accountStatus.style.color =
                "#dc2626";
        }

        if (logoutBtn) {
            logoutBtn.style.display = "none";
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
            popoverName.textContent = fullname;
        }

        if (popoverEmail) {
            popoverEmail.textContent = email;
        }

        if (userFullname) {
            userFullname.textContent = fullname;
        }

        if (userPhone) {
            userPhone.textContent = phone;
        }

        if (userEmail) {
            userEmail.textContent = email;
        }

        if (accountStatus) {

            accountStatus.textContent =
                "Active";

            accountStatus.style.color =
                "#159447";
        }

        if (logoutBtn) {
            logoutBtn.style.display = "flex";
        }

        updateUserAvatar(user);
    }


    loadUserInformation();


    /* =====================================================
       USER MENU OPEN / CLOSE
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
       SETTINGS RETURN FLAG
    ===================================================== */

    let shouldReturnToUserPopover = false;


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
       USER MENU CLICK
    ===================================================== */

    if (
        userMenuBtn &&
        userPopover
    ) {

        userMenuBtn.addEventListener(
            "click",
            function (event) {

                if (
                    userMenuBtn.dataset.wasDragged === "true"
                ) {

                    event.preventDefault();
                    event.stopPropagation();

                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                if (
                    userPopover.classList.contains("show")
                ) {

                    closeUserMenu();

                } else {

                    shouldReturnToUserPopover = false;

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

                    profileImageViewer.classList.add("show");

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
       CLICK OUTSIDE PROFILE IMAGE
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


                shouldReturnToUserPopover = true;


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

                    settingsPassword.value = "";

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
            }
        );
    }


    /* =====================================================
       CLOSE SETTINGS
    ===================================================== */

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

                    returnToUserPopover();
                }
            }
        );
    }


    /* =====================================================
       STOP SETTINGS CONTAINER CLICKS
    ===================================================== */

    const settingsContainer =
        document.querySelector(".settings-container");

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

                    profileImageInput.value = "";

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

        updateThemeToggle(isDark);
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
                    isDark ? "dark" : "light";


                const updated =
                    updateUser(currentUser);


                if (!updated) {

                    showToast(
                        "Unable to save your theme.",
                        "error"
                    );

                    return;
                }


                updateThemeToggle(isDark);


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

                        return (
                            user.email &&
                            user.email
                                .trim()
                                .toLowerCase() ===
                            email &&
                            String(user.id) !==
                            String(currentUser.id)
                        );
                    });


                if (emailUsedByAnotherUser) {

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

                updateUserAvatar(currentUser);


                settingsModal.classList.remove(
                    "show"
                );


                if (settingsPassword) {

                    settingsPassword.value = "";

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

            if (event.key !== "Escape") {
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

                returnToUserPopover();

            } else {

                closeUserMenu();
            }
        }
    );


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();


                localStorage.removeItem(
                    "easyRideLoggedIn"
                );

                localStorage.removeItem(
                    "easyRideUser"
                );


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


                window.location.href =
                    "/website/login.html";
            }
        );
    }

});


/* =========================================================
   EASY RIDE
   REAL DRAGGABLE MOBILE THREE-DOT MENU

   IMPORTANT:
   - The menu can be dragged anywhere on the screen.
   - Position is saved.
   - Dragging does NOT open the menu.
   - Normal tap still opens the menu.
   - Desktop is not affected.
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const userMenu =
            document.querySelector(".user-menu");

        const userMenuBtn =
            document.querySelector(".user-menu-btn");

        if (
            !userMenu ||
            !userMenuBtn
        ) {
            return;
        }


        /* =================================================
           MOBILE CHECK
        ================================================= */

        function isMobile() {

            return window.innerWidth <= 767;
        }


        /* =================================================
           DRAG VARIABLES
        ================================================= */

        let dragging = false;

        let hasMoved = false;

        let pointerId = null;

        let startX = 0;

        let startY = 0;

        let startLeft = 0;

        let startTop = 0;


        /* =================================================
           MAKE THE MENU ABSOLUTELY POSITIONED

           This is the important part.

           The menu is removed from normal layout flow
           when dragging on mobile.
        ================================================= */

        function prepareMobileMenu() {

            if (!isMobile()) {
                return;
            }

            const rect =
                userMenu.getBoundingClientRect();

            userMenu.style.position = "fixed";

            userMenu.style.left =
                rect.left + "px";

            userMenu.style.top =
                rect.top + "px";

            userMenu.style.right = "auto";

            userMenu.style.bottom = "auto";

            userMenu.style.margin = "0";

            userMenu.style.transform = "none";

            userMenu.style.zIndex = "99999";
        }


        /* =================================================
           LOAD SAVED POSITION
        ================================================= */

        function loadSavedMenuPosition() {

            if (!isMobile()) {
                return;
            }

            const saved =
                localStorage.getItem(
                    "easyRideMenuPosition"
                );

            if (!saved) {

                prepareMobileMenu();

                return;
            }

            try {

                const position =
                    JSON.parse(saved);

                const rect =
                    userMenu.getBoundingClientRect();

                const menuWidth =
                    rect.width;

                const menuHeight =
                    rect.height;

                const maxLeft =
                    window.innerWidth -
                    menuWidth -
                    5;

                const maxTop =
                    window.innerHeight -
                    menuHeight -
                    5;

                let left =
                    Number(position.left);

                let top =
                    Number(position.top);


                if (!Number.isFinite(left)) {
                    left = 5;
                }

                if (!Number.isFinite(top)) {
                    top = 5;
                }


                left =
                    Math.max(
                        5,
                        Math.min(
                            left,
                            Math.max(5, maxLeft)
                        )
                    );


                top =
                    Math.max(
                        5,
                        Math.min(
                            top,
                            Math.max(5, maxTop)
                        )
                    );


                userMenu.style.position =
                    "fixed";

                userMenu.style.left =
                    left + "px";

                userMenu.style.top =
                    top + "px";

                userMenu.style.right =
                    "auto";

                userMenu.style.bottom =
                    "auto";

                userMenu.style.margin =
                    "0";

                userMenu.style.transform =
                    "none";

                userMenu.style.zIndex =
                    "99999";

            } catch (error) {

                console.error(
                    "Unable to load menu position:",
                    error
                );

                prepareMobileMenu();
            }
        }


        /* =================================================
           POINTER DOWN
        ================================================= */

        userMenuBtn.addEventListener(
            "pointerdown",
            function (event) {

                if (!isMobile()) {
                    return;
                }


                /* Do not start drag with right click. */

                if (
                    event.pointerType === "mouse" &&
                    event.button !== 0
                ) {
                    return;
                }


                prepareMobileMenu();


                const rect =
                    userMenu.getBoundingClientRect();


                dragging = true;

                hasMoved = false;

                pointerId =
                    event.pointerId;


                startX =
                    event.clientX;

                startY =
                    event.clientY;

                startLeft =
                    rect.left;

                startTop =
                    rect.top;


                userMenuBtn.style.cursor =
                    "grabbing";


                try {

                    userMenuBtn.setPointerCapture(
                        event.pointerId
                    );

                } catch (error) {
                    console.log(error);
                }


                event.preventDefault();
            }
        );


        /* =================================================
           POINTER MOVE
        ================================================= */

        userMenuBtn.addEventListener(
            "pointermove",
            function (event) {

                if (!dragging) {
                    return;
                }

                if (
                    pointerId !== null &&
                    event.pointerId !== pointerId
                ) {
                    return;
                }


                const deltaX =
                    event.clientX -
                    startX;

                const deltaY =
                    event.clientY -
                    startY;


                /* Only count it as dragging after
                   moving a few pixels. */

                if (
                    Math.abs(deltaX) > 5 ||
                    Math.abs(deltaY) > 5
                ) {

                    hasMoved = true;
                }


                if (!hasMoved) {
                    return;
                }


                const menuWidth =
                    userMenu.offsetWidth;

                const menuHeight =
                    userMenu.offsetHeight;


                const screenWidth =
                    window.innerWidth;

                const screenHeight =
                    window.innerHeight;


                const minimumLeft = 5;

                const minimumTop = 5;


                const maximumLeft =
                    Math.max(
                        minimumLeft,
                        screenWidth -
                        menuWidth -
                        5
                    );


                const maximumTop =
                    Math.max(
                        minimumTop,
                        screenHeight -
                        menuHeight -
                        5
                    );


                let newLeft =
                    startLeft +
                    deltaX;

                let newTop =
                    startTop +
                    deltaY;


                /* Keep menu inside screen. */

                newLeft =
                    Math.max(
                        minimumLeft,
                        Math.min(
                            newLeft,
                            maximumLeft
                        )
                    );


                newTop =
                    Math.max(
                        minimumTop,
                        Math.min(
                            newTop,
                            maximumTop
                        )
                    );


                userMenu.style.position =
                    "fixed";

                userMenu.style.left =
                    newLeft + "px";

                userMenu.style.top =
                    newTop + "px";

                userMenu.style.right =
                    "auto";

                userMenu.style.bottom =
                    "auto";

                userMenu.style.transform =
                    "none";


                event.preventDefault();
            }
        );


        /* =================================================
           POINTER UP
        ================================================= */

        userMenuBtn.addEventListener(
            "pointerup",
            function (event) {

                if (!dragging) {
                    return;
                }


                if (
                    pointerId !== null &&
                    event.pointerId !== pointerId
                ) {
                    return;
                }


                dragging = false;


                userMenuBtn.style.cursor =
                    "grab";


                if (hasMoved) {

                    const rect =
                        userMenu.getBoundingClientRect();


                    /* Save the position. */

                    localStorage.setItem(
                        "easyRideMenuPosition",
                        JSON.stringify({

                            left: rect.left,

                            top: rect.top

                        })
                    );


                    /* Tell the normal click
                       handler not to open menu. */

                    userMenuBtn.dataset.wasDragged =
                        "true";


                    setTimeout(
                        function () {

                            userMenuBtn.dataset.wasDragged =
                                "false";

                        },
                        200
                    );
                }


                try {

                    userMenuBtn.releasePointerCapture(
                        event.pointerId
                    );

                } catch (error) {
                    console.log(error);
                }


                pointerId = null;

                event.preventDefault();
            }
        );


        /* =================================================
           POINTER CANCEL
        ================================================= */

        userMenuBtn.addEventListener(
            "pointercancel",
            function () {

                dragging = false;

                pointerId = null;

                userMenuBtn.style.cursor =
                    "grab";
            }
        );


        /* =================================================
           BLOCK CLICK AFTER DRAG
        ================================================= */

        userMenuBtn.addEventListener(
            "click",
            function (event) {

                if (
                    userMenuBtn.dataset.wasDragged ===
                    "true"
                ) {

                    event.preventDefault();

                    event.stopImmediatePropagation();

                    return false;
                }
            },
            true
        );


        /* =================================================
           PREVENT TOUCH SCROLL WHILE DRAGGING
        ================================================= */

        userMenuBtn.style.touchAction =
            "none";

        userMenuBtn.style.cursor =
            "grab";


        /* =================================================
           RESIZE

           If mobile:
           keep saved position.

           If desktop:
           remove mobile positioning.
        ================================================= */

        window.addEventListener(
            "resize",
            function () {

                if (window.innerWidth <= 767) {

                    loadSavedMenuPosition();

                } else {

                    userMenu.style.position =
                        "";

                    userMenu.style.left =
                        "";

                    userMenu.style.top =
                        "";

                    userMenu.style.right =
                        "";

                    userMenu.style.bottom =
                        "";

                    userMenu.style.margin =
                        "";

                    userMenu.style.transform =
                        "";

                    userMenu.style.zIndex =
                        "";
                }
            }
        );


        /* =================================================
           INITIALIZE
        ================================================= */

        if (isMobile()) {

            requestAnimationFrame(
                function () {

                    loadSavedMenuPosition();

                }
            );
        }

    }
);