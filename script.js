/* =========================================================
   EASY RIDE - MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ACCOUNT HELPERS
    ===================================================== */

    function getAllUsers() {

        const usersData =
            localStorage.getItem("easyRideUsers");


        if (!usersData) {

            return [];

        }


        try {

            const users =
                JSON.parse(usersData);


            return Array.isArray(users) ?
                users :
                [];

        } catch (error) {

            return [];

        }

    }


    function saveAllUsers(users) {

        localStorage.setItem(
            "easyRideUsers",
            JSON.stringify(users)
        );

    }


    function getCurrentUser() {

        const userData =
            localStorage.getItem("easyRideUser");


        if (!userData) {

            return null;

        }


        try {

            const user =
                JSON.parse(userData);


            if (
                user &&
                typeof user === "object" &&
                user.id
            ) {

                return user;

            }


            return null;

        } catch (error) {

            return null;

        }

    }


    function saveCurrentUser(user) {

        localStorage.setItem(
            "easyRideUser",
            JSON.stringify(user)
        );

    }


    /*
       Find the newest version of the
       current account from easyRideUsers.
    */

    function getUserById(userId) {

        const users =
            getAllUsers();


        return users.find(function (user) {

            return user.id === userId;

        }) || null;

    }


    /*
       Update ONLY one account.

       The user's ID is used to make sure
       another account is never changed.
    */

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

                return user.id ===
                    updatedUser.id;

            });


        if (userIndex === -1) {

            return false;

        }


        users[userIndex] =
            updatedUser;


        saveAllUsers(users);


        /*
           Update only the current session.
        */

        saveCurrentUser(
            updatedUser
        );


        return true;

    }


    /*
       Check whether a real user is logged in.
    */

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
            user.id
        );

    }


    /*
       Get the latest account information.
    */

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


        /*
           If the account exists inside
           easyRideUsers, use the latest data.
        */

        if (savedUser) {

            saveCurrentUser(savedUser);

            return savedUser;

        }


        return currentUser;

    }


    /* =====================================================
       SPLASH SCREEN
    ===================================================== */

    const splash =
        document.getElementById("splash");


    const mainContent =
        document.getElementById("main-content");


    if (splash && mainContent) {

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

        let index =
            0;


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
        document.getElementById("typing");


    if (typing) {

        const text =
            "Ride with Confidence. Every Mile Matters.";

        let index =
            0;


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

        let currentSlide =
            0;


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
                    emailInput.value.trim() ===
                    "";

            } else {

                continueBtn.disabled =
                    phoneInput.value.trim() ===
                    "";

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
       USER MENU
    ===================================================== */

    const userMenuBtn =
        document.getElementById(
            "userMenuBtn"
        );


    const userPopover =
        document.getElementById(
            "userPopover"
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

    }


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

    }


    loadUserInformation();


    /* =====================================================
       OPEN / CLOSE USER MENU
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


                userPopover.classList.toggle(
                    "show"
                );


                if (
                    userPopover.classList.contains(
                        "show"
                    )
                ) {

                    userPopover.style.display =
                        "block";

                } else {

                    userPopover.style.display =
                        "";

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
                    !userPopover.contains(
                        event.target
                    ) &&
                    !userMenuBtn.contains(
                        event.target
                    )
                ) {

                    userPopover.classList.remove(
                        "show"
                    );


                    userPopover.style.display =
                        "";

                }

            }
        );

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function () {

                /*
                   Only remove the current session.
                   ALL registered accounts remain.
                */

                localStorage.removeItem(
                    "easyRideLoggedIn"
                );


                localStorage.removeItem(
                    "easyRideUser"
                );


                /*
                   Remove current account's theme
                   from the visible page.

                   The next user will load THEIR
                   own saved theme.
                */

                document.body.classList.remove(
                    "dark-mode"
                );


                if (userPopover) {

                    userPopover.classList.remove(
                        "show"
                    );

                    userPopover.style.display =
                        "";

                }


                window.location.href =
                    "/website/login.html";

            }
        );

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
       OPEN SETTINGS
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

                    alert(
                        "Please login first."
                    );

                    return;

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


                settingsModal.classList.add(
                    "show"
                );

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
            function () {

                settingsModal.classList.remove(
                    "show"
                );

            }
        );

    }


    if (settingsModal) {

        settingsModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    settingsModal
                ) {

                    settingsModal.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    /* =====================================================
       PROFILE IMAGE
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

                    alert(
                        "Please select an image."
                    );

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    function (event) {

                        settingsProfileImage.src =
                            event.target.result;


                        settingsProfileImage.classList.add(
                            "show"
                        );


                        settingsDefaultAvatar.classList.add(
                            "hide"
                        );

                    };


                reader.readAsDataURL(
                    file
                );

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

        /*
           Always reset first.

           This stops the previous account's
           theme from affecting another account.
        */

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


        /*
           Theme belongs to this user only.
        */

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


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            function () {

                const currentUser =
                    getFreshCurrentUser();


                if (
                    !isLoggedIn() ||
                    !currentUser
                ) {

                    alert(
                        "Please login first."
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


                /*
                   Save ONLY inside this account.
                */

                currentUser.theme =
                    isDark ?
                    "dark" :
                    "light";


                /*
                   Update ONLY this user's data.
                */

                updateUser(
                    currentUser
                );


                updateThemeToggle(
                    isDark
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
            function () {

                const currentUser =
                    getFreshCurrentUser();


                if (
                    !isLoggedIn() ||
                    !currentUser
                ) {

                    alert(
                        "Please login first."
                    );

                    return;

                }


                const name =
                    settingsName ?
                    settingsName.value.trim() :
                    "";


                const email =
                    settingsEmail ?
                    settingsEmail.value
                    .trim()
                    .toLowerCase() :
                    "";


                const phone =
                    settingsPhone ?
                    settingsPhone.value.trim() :
                    "";

                if (!name) {

                    alert(
                        "Please enter your name."
                    );

                    return;

                }


                if (!email) {

                    alert(
                        "Please enter your Gmail/email."
                    );

                    return;

                }


                /*
                   Get all accounts and check
                   whether ANOTHER account
                   already uses this email.
                */

                const users =
                    getAllUsers();


                const emailUsedByAnotherUser =
                    users.some(
                        function (user) {

                            return (
                                user.email &&
                                user.email
                                .trim()
                                .toLowerCase() ===
                                email &&
                                user.id !==
                                currentUser.id
                            );

                        }
                    );


                if (
                    emailUsedByAnotherUser
                ) {

                    alert(
                        "Another account already uses this email."
                    );

                    return;

                }


                /* UPDATE ONLY CURRENT ACCOUNT */

                currentUser.fullname =
                    name;


                currentUser.email =
                    email;


                currentUser.phone =
                    phone;

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


                /*
                   Keep the current user's
                   own theme unchanged.
                */

                if (!currentUser.theme) {

                    currentUser.theme =
                        "light";

                }


                /*
                   Update ONLY this account
                   in easyRideUsers and
                   easyRideUser.
                */

                const updated =
                    updateUser(
                        currentUser
                    );


                if (!updated) {

                    alert(
                        "Unable to update your account."
                    );

                    return;

                }


                localStorage.setItem(
                    "easyRideLoggedIn",
                    "true"
                );


                settingsModal.classList.remove(
                    "show"
                );


                /*
                   Refresh so all information
                   belongs to the updated account.
                */

                window.location.reload();

            }
        );

    }

});