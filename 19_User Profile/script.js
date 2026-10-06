"use strict";


/* =========================================================
   EVENTRA — SCREEN 19
   USER PROFILE
========================================================= */


const ROUTES = {

    home:
        "../05_Home/index.html",

    discover:
        "../10_Discover%20Event/index.html",

    tickets:
        "../17_MyTicket/index.html",

    notifications:
        "../18_Notification/index.html",

    profile:
        "../19_User%20Profile/index.html"

};


/* =========================================================
   TOAST
========================================================= */

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

let toastTimer;


function showToast(message) {

    if (!toast || !toastMessage) {
        return;
    }


    toastMessage.textContent =
        message;


    toast.classList.remove(
        "opacity-0",
        "pointer-events-none"
    );


    toast.classList.add(
        "opacity-100"
    );


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toast.classList.remove(
            "opacity-100"
        );

        toast.classList.add(
            "opacity-0",
            "pointer-events-none"
        );

    }, 2200);

}


/* =========================================================
   NAVIGATION
========================================================= */

document
    .querySelectorAll("[data-nav]")
    .forEach((button) => {

        button.addEventListener(
            "click",
            (event) => {

                event.preventDefault();


                const destination =
                    button.dataset.nav;


                const route =
                    ROUTES[destination];


                if (!route) {
                    return;
                }


                const target =
                    new URL(
                        route,
                        window.location.href
                    );


                window.location.assign(
                    target.href
                );

            }
        );

    });


/* =========================================================
   PROFILE ACTIONS
========================================================= */

document
    .querySelectorAll("[data-action]")
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;


                switch (action) {

                    case "personal":

                        showToast(
                            "Personal Information"
                        );

                        break;


                    case "payment-history":

                        showToast(
                            "Payment History & Orders"
                        );

                        break;


                    case "payment-methods":

                        showToast(
                            "Linked Payment Methods"
                        );

                        break;


                    case "notifications":

                        window.location.assign(
                            new URL(
                                ROUTES.notifications,
                                window.location.href
                            ).href
                        );

                        break;


                    case "saved-events":

                        showToast(
                            "Saved Events & Wishlist"
                        );

                        break;


                    case "security":

                        showToast(
                            "Account Security & 2FA"
                        );

                        break;


                    case "support":

                        showToast(
                            "Help & 24/7 Support"
                        );

                        break;


                    default:

                        showToast(
                            "Coming soon"
                        );

                }

            }
        );

    });


/* =========================================================
   SWITCH MODE
========================================================= */

const switchModeButton =
    document.getElementById(
        "switchModeButton"
    );


if (switchModeButton) {

    switchModeButton.addEventListener(
        "click",
        () => {

            showToast(
                "Organizer mode coming soon"
            );

        }
    );

}


/* =========================================================
   CHANGE PHOTO
========================================================= */

const changePhotoButton =
    document.getElementById(
        "changePhotoButton"
    );


if (changePhotoButton) {

    changePhotoButton.addEventListener(
        "click",
        () => {

            showToast(
                "Profile photo upload coming soon"
            );

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to log out?"
                );


            if (!confirmed) {
                return;
            }


            localStorage.removeItem(
                "eventra_token"
            );

            localStorage.removeItem(
                "eventra_user"
            );

            sessionStorage.removeItem(
                "eventra_token"
            );

            sessionStorage.removeItem(
                "eventra_user"
            );


            showToast(
                "Logged out successfully"
            );


            setTimeout(() => {

                const signIn =
                    new URL(
                        "../09_Sign%20In/index.html",
                        window.location.href
                    );


                window.location.assign(
                    signIn.href
                );

            }, 700);

        }
    );

}