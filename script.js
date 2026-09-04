/* =========================================================
   EASY RIDE - MAIN JAVASCRIPT
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
       ACCOUNT HELPERS
       EACH ACCOUNT IS COMPLETELY SEPARATE
    ===================================================== */

    function getAllUsers() {

        const usersData =
            localStorage.getItem("easyRideUsers");

        if (!usersData) {
            return [];
        }

        try {

            const users = JSON.parse(usersData);

            return Array.isArray(users)
                ? users
                : [];

        } catch (error) {

            console.error(
                "Unable to read users:",
                error
            );

            return [];
        }
    }


    /* =====================================================
       SAVE ALL ACCOUNTS
    ===================================================== */

    function saveAllUsers(users) {

        localStorage.setItem(
            "easyRideUsers",
            JSON.stringify(users)
        );
    }


    /* =====================================================
       GET CURRENT LOGGED-IN ACCOUNT
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
       SAVE CURRENT ACCOUNT SESSION
    ===================================================== */

    function saveCurrentUser(user) {

        if (
            !user ||
            !user.id
        ) {
            return;
        }

        localStorage.setItem(
            "easyRideUser",
            JSON.stringify(user)
        );
    }


    /* =====================================================
       GET ACCOUNT BY ID
    ===================================================== */

    function getUserById(userId) {

        if (!userId) {
            return null;
        }

        const users =
            getAllUsers();

        return users.find(function (user) {

            return String(user.id) ===
                String(userId);

        }) || null;
    }


    /* =====================================================
       GET LOGGED-IN ACCOUNT ID
    ===================================================== */

    function getCurrentUserId() {

        const user =
            getCurrentUser();

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
    ===================================================== */

    function getFreshCurrentUser() {

        const currentUser =
            getCurrentUser();

        if (!currentUser) {
            return null;
        }

        const savedUser =
            getUserById(
                currentUser.id
            );

        if (savedUser) {

            saveCurrentUser(
                savedUser
            );

            return savedUser;
        }

        return currentUser;
    }


    /* =====================================================
       UPDATE ONLY THE CURRENT ACCOUNT
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

                return String(user.id) ===
                    String(updatedUser.id);

            });

        if (userIndex === -1) {
            return false;
        }

        users[userIndex] = {
            ...users[userIndex],
            ...updatedUser
        };

        saveAllUsers(users);

        saveCurrentUser(
            users[userIndex]
        );

        return true;
    }


    /* =====================================================
       SETTINGS ELEMENTS
    ===================================================== */

    const settingsBtn =
        document.getElementById(
            "settingsBtn"
        );

    const settingsModal =
        document.getElementById(
            "settingsModal"
        );

    const closeSettings =
        document.getElementById(
            "closeSettings"
        );

    const saveSettings =
        document.getElementById(
            "saveSettings"
        );

    const settingsName =
        document.getElementById(
            "settingsName"
        );

    const settingsEmail =
        document.getElementById(
            "settingsEmail"
        );

    const settingsPhone =
        document.getElementById(
            "settingsPhone"
        );

    const settingsPassword =
        document.getElementById(
            "settingsPassword"
        );

    const togglePassword =
        document.getElementById(
            "togglePassword"
        );

    const themeToggle =
        document.getElementById(
            "themeToggle"
        );

    const profileImageInput =
        document.getElementById(
            "profileImageInput"
        );

    const settingsProfileImage =
        document.getElementById(
            "settingsProfileImage"
        );

    const settingsDefaultAvatar =
        document.getElementById(
            "settingsDefaultAvatar"
        );


    /* =====================================================
       SPLASH SCREEN
    ===================================================== */

    const splash =
        document.getElementById("splash");

    const mainContent =
        document.getElementById(
            "main-content"
        );

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
        document.getElementById(
            "typing-texts"
        );

    if (typingTexts) {

        const text =
            "Easy Ride.";

        let index = 0;

        typingTexts.textContent =
            "";

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
        document.getElementById(
            "typing"
        );

    if (typing) {

        const text =
            "Ride with Confidence. Every Mile Matters.";

        let index = 0;

        typing.textContent =
            "";

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
        document.querySelectorAll(
            ".slide"
        );

    if (slides.length > 0) {

        let currentSlide = 0;

        slides[0].classList.add(
            "active"
        );

        setInterval(function () {

            slides[currentSlide]
                .classList.remove(
                    "active"
                );

            currentSlide =
                (currentSlide + 1) %
                slides.length;

            slides[currentSlide]
                .classList.add(
                    "active"
                );

        }, 4000);
    }


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const mobileMenuButton =
        document.querySelector(
            ".show-div"
        );

    const navItems =
        document.getElementById(
            "nav-items"
        );

    if (
        mobileMenuButton &&
        navItems
    ) {

        mobileMenuButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                navItems.classList.toggle(
                    "open"
                );
            }
        );
    }


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    const contactForm =
        document.getElementById(
            "contactForm"
        );

    const contactToast =
        document.getElementById(
            "toast"
        );

    if (
        contactForm &&
        contactToast
    ) {

        contactForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                contactToast.classList.add(
                    "show"
                );

                setTimeout(function () {

                    contactToast.classList.remove(
                        "show"
                    );

                }, 2000);

                contactForm.reset();
            }
        );
    }


    /* =====================================================
       LOGIN TABS
    ===================================================== */

    const tabs =
        document.querySelectorAll(
            ".tab"
        );

    const forms =
        document.querySelectorAll(
            ".form"
        );

    const emailInput =
        document.getElementById(
            "emailInput"
        );

    const phoneInput =
        document.getElementById(
            "phoneInput"
        );

    const continueBtn =
        document.getElementById(
            "continueBtn"
        );

    if (
        tabs.length > 0 &&
        forms.length > 0 &&
        emailInput &&
        phoneInput &&
        continueBtn
    ) {

        let activeTab =
            "emailForm";

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

                    tab.classList.add(
                        "active"
                    );

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
                activeTab ===
                "emailForm"
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
        document.getElementById(
            "userMenuBtn"
        );

    const userPopover =
        document.getElementById(
            "userPopover"
        );

    const userMenu =
        document.querySelector(
            ".user-menu"
        );

    const userAvatar =
        document.getElementById(
            "userAvatar"
        );

    const userAvatarImage =
        document.getElementById(
            "userAvatarImage"
        );

    const userAvatarDefault =
        document.getElementById(
            "userAvatarDefault"
        );

    const popoverName =
        document.getElementById(
            "popoverName"
        );

    const popoverEmail =
        document.getElementById(
            "popoverEmail"
        );

    const userFullname =
        document.getElementById(
            "userFullname"
        );

    const userPhone =
        document.getElementById(
            "userPhone"
        );

    const userEmail =
        document.getElementById(
            "userEmail"
        );

    const accountStatus =
        document.getElementById(
            "accountStatus"
        );

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    /* =====================================================
       PROFILE IMAGE ELEMENTS
    ===================================================== */

    const profileImageViewer =
        document.getElementById(
            "profileImageViewer"
        );

    const largeProfileImage =
        document.getElementById(
            "largeProfileImage"
        );

    const closeProfileViewer =
        document.getElementById(
            "closeProfileViewer"
        );


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

            userAvatarImage.removeAttribute(
                "src"
            );

            userAvatarImage.classList.remove(
                "show"
            );

            userAvatarDefault.classList.remove(
                "hide"
            );

            return;
        }

        userAvatarImage.src =
            user.profileImage;

        userAvatarImage.classList.add(
            "show"
        );

        userAvatarDefault.classList.add(
            "hide"
        );
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

        userPopover.classList.add(
            "show"
        );
    }


    function closeUserMenu() {

        if (!userPopover) {
            return;
        }

        userPopover.classList.remove(
            "show"
        );
    }


    /* =====================================================
       SETTINGS RETURN STATE
    ===================================================== */

    let shouldReturnToUserPopover = false;


    /* =====================================================
       SETTINGS POSITION STATE

       This remembers exactly where the first
       profile popover was located.

       The settings popover will use this same
       position.
    ===================================================== */

    let savedUserPopoverPosition = null;


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

                userPopover.classList.add(
                    "show"
                );
            }

        }, 50);
    }


    /* =====================================================
       SETTINGS CONTAINER
    ===================================================== */

    const settingsContainer =
        document.querySelector(
            ".settings-container"
        );


    /* =====================================================
       SAVE CURRENT USER POPOVER POSITION
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
       POSITION SETTINGS LIKE USER POPOVER
       
       IMPORTANT:
       The settings box uses the SAME viewport
       position as the first profile popover.

       It is also kept inside the screen.
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
                left: savedUserPopoverPosition.left,
                top: savedUserPopoverPosition.top,
                width: savedUserPopoverPosition.width,
                height: savedUserPopoverPosition.height
            };

        } else if (userPopover) {

            referenceRect =
                userPopover.getBoundingClientRect();
        }

        if (!referenceRect) {
            return;
        }


        /* =================================================
           GET SETTINGS SIZE
        ================================================= */

        const settingsRect =
            settingsContainer.getBoundingClientRect();

        let settingsWidth =
            settingsRect.width;

        let settingsHeight =
            settingsRect.height;


        /*
         * If the element has not received its
         * dimensions yet, use its offset dimensions.
         */

        if (!settingsWidth) {
            settingsWidth =
                settingsContainer.offsetWidth;
        }

        if (!settingsHeight) {
            settingsHeight =
                settingsContainer.offsetHeight;
        }


        /*
         * Make settings container independently
         * positioned inside the viewport.
         */

        settingsContainer.style.position =
            "fixed";

        settingsContainer.style.transform =
            "none";

        settingsContainer.style.right =
            "auto";

        settingsContainer.style.bottom =
            "auto";


        /*
         * Put the settings container at the
         * same LEFT and TOP position as the
         * first user popover.
         */

        let left =
            referenceRect.left;

        let top =
            referenceRect.top;


        /*
         * Keep the settings box inside
         * the viewport horizontally.
         */

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


        /*
         * The profile menu MUST remain above
         * the settings popover.
         */

        if (userMenu) {

            userMenu.style.zIndex =
                "100000";
        }

        if (userPopover) {

            userPopover.style.zIndex =
                "100001";
        }


        /*
         * Settings is below the profile menu.
         */

        settingsContainer.style.zIndex =
            "99990";


        /*
         * The settings background/modal itself
         * stays below the profile menu.
         */

        if (settingsModal) {

            settingsModal.style.zIndex =
                "99900";
        }
    }


    /* =====================================================
       RESTORE SETTINGS POSITION WHEN WINDOW CHANGES
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
       
       IMPORTANT:
       A DRAG MUST NOT TRIGGER A CLICK.
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

                /*
                 * Drag suppression is handled by
                 * the draggable section below.
                 */

                if (
                    userPopover.classList.contains(
                        "show"
                    )
                ) {

                    closeUserMenu();

                } else {

                    shouldReturnToUserPopover =
                        false;

                    openUserMenu();
                }
            }
        );


        /* =================================================
           CLICK INSIDE POPOVER
        ================================================= */

        userPopover.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();
            }
        );


        /* =================================================
           CLICK OUTSIDE POPOVER
        ================================================= */

        document.addEventListener(
            "click",
            function (event) {

                if (
                    settingsModal &&
                    settingsModal.classList.contains(
                        "show"
                    )
                ) {
                    return;
                }

                if (
                    !userPopover.contains(
                        event.target
                    ) &&
                    !userMenuBtn.contains(
                        event.target
                    )
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

        profileImageViewer.classList.remove(
            "show"
        );

        if (largeProfileImage) {

            largeProfileImage.removeAttribute(
                "src"
            );
        }

        document.body.style.overflow =
            "";
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
       CLOSE PROFILE IMAGE BUTTON
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
       
       IMPORTANT:
       The user popover position is captured BEFORE
       the user popover is closed.

       Settings then opens in the same position.
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


                /* =========================================
                   CAPTURE FIRST POPOVER POSITION
                ========================================= */

                if (userPopover) {

                    const popoverRect =
                        userPopover.getBoundingClientRect();

                    savedUserPopoverPosition = {
                        left: popoverRect.left,
                        top: popoverRect.top,
                        width: popoverRect.width,
                        height: popoverRect.height
                    };
                }


                /* =========================================
                   LOAD NAME
                ========================================= */

                if (settingsName) {

                    settingsName.value =
                        user.fullname || "";
                }


                /* =========================================
                   LOAD EMAIL
                ========================================= */

                if (settingsEmail) {

                    settingsEmail.value =
                        user.email || "";
                }


                /* =========================================
                   LOAD PHONE
                ========================================= */

                if (settingsPhone) {

                    settingsPhone.value =
                        user.phone || "";
                }


                /* =========================================
                   RESET PASSWORD
                ========================================= */

                if (settingsPassword) {

                    settingsPassword.value =
                        "";

                    settingsPassword.type =
                        "password";
                }


                /* =========================================
                   RESET EYE ICON
                ========================================= */

                if (togglePassword) {

                    const icon =
                        togglePassword.querySelector(
                            "i"
                        );

                    if (icon) {

                        icon.classList.remove(
                            "fa-eye-slash"
                        );

                        icon.classList.add(
                            "fa-eye"
                        );
                    }
                }


                /* =========================================
                   LOAD PROFILE IMAGE
                ========================================= */

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


                /* =========================================
                   CLOSE USER POPOVER
                ========================================= */

                closeUserMenu();


                /* =========================================
                   OPEN SETTINGS
                ========================================= */

                settingsModal.classList.add(
                    "show"
                );


                /*
                 * Wait until the settings box is
                 * rendered so its dimensions are available.
                 */

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
       CLOSE SETTINGS BUTTON
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

                settingsModal.classList.remove(
                    "show"
                );

                /*
                 * Remove temporary settings positioning.
                 * This allows the original CSS to control
                 * the settings when it is opened again.
                 */

                if (settingsContainer) {

                    settingsContainer.style.position =
                        "";

                    settingsContainer.style.left =
                        "";

                    settingsContainer.style.top =
                        "";

                    settingsContainer.style.right =
                        "";

                    settingsContainer.style.bottom =
                        "";

                    settingsContainer.style.transform =
                        "";

                    settingsContainer.style.zIndex =
                        "";
                }

                if (settingsModal) {

                    settingsModal.style.zIndex =
                        "";
                }

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


                    if (settingsContainer) {

                        settingsContainer.style.position =
                            "";

                        settingsContainer.style.left =
                            "";

                        settingsContainer.style.top =
                            "";

                        settingsContainer.style.right =
                            "";

                        settingsContainer.style.bottom =
                            "";

                        settingsContainer.style.transform =
                            "";

                        settingsContainer.style.zIndex =
                            "";
                    }


                    settingsModal.style.zIndex =
                        "";


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
                    togglePassword.querySelector(
                        "i"
                    );

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
                    !file.type.startsWith(
                        "image/"
                    )
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


                /* =========================================
                   LOGIN CHECK
                ========================================= */

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


                /* =========================================
                   GET VALUES
                ========================================= */

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


                /* =========================================
                   NAME VALIDATION
                ========================================= */

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


                /* =========================================
                   EMAIL VALIDATION
                ========================================= */

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


                /* =========================================
                   BASIC EMAIL VALIDATION
                ========================================= */

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


                /* =========================================
                   CHECK DUPLICATE EMAIL
                ========================================= */

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


                if (
                    emailUsedByAnotherUser
                ) {

                    showToast(
                        "Another account already uses this email.",
                        "error"
                    );

                    return;
                }


                /* =========================================
                   UPDATE CURRENT USER
                ========================================= */

                currentUser.fullname =
                    name;

                currentUser.email =
                    email;

                currentUser.phone =
                    phone;


                /* =========================================
                   CHANGE PASSWORD
                ========================================= */

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


                /* =========================================
                   SAVE PROFILE IMAGE
                ========================================= */

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


                /* =========================================
                   DEFAULT THEME
                ========================================= */

                if (!currentUser.theme) {

                    currentUser.theme =
                        "light";
                }


                /* =========================================
                   SAVE USER
                ========================================= */

                const updated =
                    updateUser(
                        currentUser
                    );

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


                /* =========================================
                   REFRESH USER INFORMATION
                ========================================= */

                loadUserInformation();

                updateUserAvatar(
                    currentUser
                );


                /* =========================================
                   CLOSE SETTINGS
                ========================================= */

                settingsModal.classList.remove(
                    "show"
                );


                /* =========================================
                   RESET SETTINGS POSITION
                ========================================= */

                if (settingsContainer) {

                    settingsContainer.style.position =
                        "";

                    settingsContainer.style.left =
                        "";

                    settingsContainer.style.top =
                        "";

                    settingsContainer.style.right =
                        "";

                    settingsContainer.style.bottom =
                        "";

                    settingsContainer.style.transform =
                        "";

                    settingsContainer.style.zIndex =
                        "";
                }

                settingsModal.style.zIndex =
                    "";


                /* =========================================
                   RESET PASSWORD FIELD
                ========================================= */

                if (settingsPassword) {

                    settingsPassword.value =
                        "";

                    settingsPassword.type =
                        "password";
                }


                /* =========================================
                   RESET EYE ICON
                ========================================= */

                if (togglePassword) {

                    const icon =
                        togglePassword.querySelector(
                            "i"
                        );

                    if (icon) {

                        icon.classList.remove(
                            "fa-eye-slash"
                        );

                        icon.classList.add(
                            "fa-eye"
                        );
                    }
                }


                /* =========================================
                   SUCCESS TOAST
                ========================================= */

                showToast(
                    "Your settings have been saved successfully.",
                    "success"
                );


                /* =========================================
                   RETURN TO USER POPOVER
                ========================================= */

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
                event.key !==
                "Escape"
            ) {
                return;
            }


            closeProfileImageViewer();


            /* =============================================
               SETTINGS
            ============================================= */

            if (
                settingsModal &&
                settingsModal.classList.contains(
                    "show"
                )
            ) {

                settingsModal.classList.remove(
                    "show"
                );


                if (settingsContainer) {

                    settingsContainer.style.position =
                        "";

                    settingsContainer.style.left =
                        "";

                    settingsContainer.style.top =
                        "";

                    settingsContainer.style.right =
                        "";

                    settingsContainer.style.bottom =
                        "";

                    settingsContainer.style.transform =
                        "";

                    settingsContainer.style.zIndex =
                        "";
                }


                settingsModal.style.zIndex =
                    "";


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


    /* =========================================================
       DRAGGABLE RESPONSIVE PROFILE MENU

       IMPORTANT:

       - MENU IS FIXED TO VIEWPORT
       - BODY DOES NOT MOVE
       - MENU DOES NOT SCROLL WITH BODY
       - POPOVER DOES NOT FOLLOW MENU
       - MENU STAYS ABOVE SETTINGS
       - MENU POSITION IS SAVED PER ACCOUNT
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


        /* =================================================
           GET ACCOUNT-SPECIFIC MENU POSITION KEY
        ================================================= */

        function getProfileMenuPositionKey() {

            const currentUser =
                getCurrentUser();

            if (
                currentUser &&
                currentUser.id
            ) {

                return `easyRideProfileMenuPosition_${currentUser.id}`;
            }

            return "easyRideProfileMenuPosition_guest";
        }


        /* =================================================
           SET FIXED POSITION
        ================================================= */

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


            /*
             * The profile popover is also kept
             * above the settings layer.
             */

            if (userPopover) {

                userPopover.style.zIndex =
                    "100001";
            }


            /*
             * Settings stays below the profile menu.
             */

            if (settingsContainer) {

                settingsContainer.style.zIndex =
                    "99990";
            }

            if (settingsModal) {

                settingsModal.style.zIndex =
                    "99900";
            }
        }


        /* =================================================
           SET DEFAULT RIGHT-MIDDLE POSITION
        ================================================= */

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


            /*
             * RIGHT SIDE
             */

            let left =
                window.innerWidth -
                menuWidth -
                25;


            /*
             * MIDDLE OF SCREEN
             */

            let top =
                (
                    window.innerHeight -
                    menuHeight
                ) / 2;


            /*
             * Keep inside screen
             */

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


        /* =================================================
           RESTORE SAVED POSITION
        ================================================= */

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


            /*
             * If there is no saved position,
             * put it on the right-middle.
             */

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


                /*
                 * Keep menu inside viewport
                 */

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
                    window.innerWidth >
                    1024
                ) {
                    return;
                }


                /*
                 * Only primary mouse button.
                 */

                if (
                    event.pointerType ===
                        "mouse" &&
                    event.button !== 0
                ) {
                    return;
                }


                event.preventDefault();
                event.stopPropagation();


                makeProfileMenuFixed();


                isDragging =
                    true;

                hasMoved =
                    false;

                suppressNextClick =
                    false;


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


                /*
                 * Remove transform so
                 * left/top control position.
                 */

                userMenu.style.transform =
                    "none";

                userMenu.style.left =
                    startLeft + "px";

                userMenu.style.top =
                    startTop + "px";


                /*
                 * Prevent touch from
                 * scrolling the page.
                 */

                userMenuBtn.style.touchAction =
                    "none";


                try {

                    userMenuBtn.setPointerCapture(
                        event.pointerId
                    );

                } catch (error) {

                    /* Ignore pointer capture errors */
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
                    window.innerWidth >
                    1024
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


                /*
                 * Determine whether the
                 * user actually dragged.
                 */

                if (
                    Math.abs(moveX) > 5 ||
                    Math.abs(moveY) > 5
                ) {

                    hasMoved =
                        true;

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
                    window.innerWidth -
                    menuWidth;

                const maxTop =
                    window.innerHeight -
                    menuHeight;


                /*
                 * Keep inside left edge.
                 */

                if (newLeft < 0) {
                    newLeft = 0;
                }


                /*
                 * Keep inside top edge.
                 */

                if (newTop < 0) {
                    newTop = 0;
                }


                /*
                 * Keep inside right edge.
                 */

                if (newLeft > maxLeft) {
                    newLeft = maxLeft;
                }


                /*
                 * Keep inside bottom edge.
                 */

                if (newTop > maxTop) {
                    newTop = maxTop;
                }


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


                isDragging =
                    false;


                try {

                    userMenuBtn.releasePointerCapture(
                        event.pointerId
                    );

                } catch (error) {

                    /* Ignore pointer capture errors */
                }


                /*
                 * Keep touch action disabled
                 * so a following click does not
                 * cause unwanted page movement.
                 */

                userMenuBtn.style.touchAction =
                    "none";


                /*
                 * Save ONLY if the menu was
                 * actually moved.
                 */

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


                    /*
                     * The next browser click
                     * must not open/close the menu.
                     */

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

                isDragging =
                    false;


                try {

                    userMenuBtn.releasePointerCapture(
                        event.pointerId
                    );

                } catch (error) {

                    /* Ignore pointer capture errors */
                }


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
        );


        /* =================================================
           PREVENT DRAG IMAGE
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

                if (
                    suppressNextClick
                ) {

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
            window.innerWidth <=
            1024
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
                    window.innerWidth <=
                    1024
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
                    window.innerWidth >
                    1024
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


                /*
                 * Keep current position
                 * inside the new viewport.
                 */

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


                /*
                 * If Settings is open,
                 * keep it aligned correctly.
                 */

                refreshSettingsPosition();
            }
        );
    }


    /* =====================================================
       EXTRA SETTINGS POSITION UPDATE
       
       This makes sure that if the browser changes
       size while Settings is open, the Settings
       popover remains properly positioned.
    ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            if (
                settingsModal &&
                settingsModal.classList.contains(
                    "show"
                )
            ) {

                setTimeout(function () {

                    positionSettingsLikeUserPopover();

                }, 30);
            }
        }
    );


    /* =====================================================
       FINAL PROFILE MENU LAYER
       
       Always keep the profile menu above settings.
    ===================================================== */

    function keepProfileMenuAboveSettings() {

        if (!userMenu) {
            return;
        }

        if (
            window.innerWidth <=
            1024
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

    setTimeout(function () {

        keepProfileMenuAboveSettings();

        if (
            window.innerWidth <=
            1024 &&
            userMenu
        ) {

            if (
                !userMenu.style.left ||
                !userMenu.style.top
            ) {

                /*
                 * Restore the account-specific
                 * saved position one final time.
                 */

                if (typeof restoreProfileMenuPosition === "function") {
                    restoreProfileMenuPosition();
                }
            }
        }

    }, 100);

});





function showDownloadToast(event) {
    event.preventDefault();

    const toast = document.getElementById("downloadToast");

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


document.getElementById("downloadBtn").addEventListener("click", function () {

    const toast = document.getElementById("downloadToast");

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);

});