"use strict";


/* =========================================================
   EVENTRA — SCREEN 18
   NOTIFICATIONS
========================================================= */


/* =========================================================
   ROUTES
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
   ELEMENTS
========================================================= */

const notificationCards =
    document.querySelectorAll(
        ".notification-card"
    );


const filterButtons =
    document.querySelectorAll(
        ".notification-filter"
    );


const markAllReadButton =
    document.getElementById(
        "markAllReadButton"
    );


const newCount =
    document.getElementById(
        "newCount"
    );


const todaySection =
    document.getElementById(
        "todaySection"
    );


const earlierSection =
    document.getElementById(
        "earlierSection"
    );


const toast =
    document.getElementById(
        "toast"
    );


const toastMessage =
    document.getElementById(
        "toastMessage"
    );


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

    if (
        !toast ||
        !toastMessage
    ) {
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


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "opacity-100"
                );

                toast.classList.add(
                    "opacity-0",
                    "pointer-events-none"
                );

            },
            2200
        );

}


/* =========================================================
   UPDATE UNREAD COUNT
========================================================= */

function updateUnreadCount() {

    const unreadCards =
        document.querySelectorAll(
            '.notification-card[data-unread="true"]'
        );


    const count =
        unreadCards.length;


    if (newCount) {

        newCount.textContent =
            `${count} new`;

    }

}


/* =========================================================
   MARK ONE READ
========================================================= */

function markAsRead(card) {

    if (!card) {
        return;
    }


    if (
        card.dataset.unread !==
        "true"
    ) {
        return;
    }


    card.dataset.unread =
        "false";


    card.classList.remove(
        "unread"
    );


    card.classList.add(
        "read"
    );


    const dot =
        card.querySelector(
            ".unread-dot"
        );


    if (dot) {

        dot.remove();

    }


    updateUnreadCount();

}


/* =========================================================
   NOTIFICATION CLICK
========================================================= */

notificationCards.forEach(
    (card) => {

        card.addEventListener(
            "click",
            () => {

                markAsRead(
                    card
                );


                showToast(
                    "Notification marked as read"
                );

            }
        );

    }
);


/* =========================================================
   MARK ALL READ
========================================================= */

if (markAllReadButton) {

    markAllReadButton.addEventListener(
        "click",
        () => {

            notificationCards.forEach(
                (card) => {

                    card.dataset.unread =
                        "false";


                    card.classList.remove(
                        "unread"
                    );


                    card.classList.add(
                        "read"
                    );


                    const dot =
                        card.querySelector(
                            ".unread-dot"
                        );


                    if (dot) {

                        dot.remove();

                    }

                }
            );


            updateUnreadCount();


            showToast(
                "All notifications marked as read"
            );

        }
    );

}


/* =========================================================
   FILTER BUTTON ACTIVE STATE
========================================================= */

function setActiveFilter(
    activeButton
) {

    filterButtons.forEach(
        (button) => {

            button.classList.remove(
                "bg-[#5B00E8]",
                "text-white"
            );


            button.classList.add(
                "bg-[#E8EFFD]",
                "text-[#4C4E5D]"
            );

        }
    );


    activeButton.classList.remove(
        "bg-[#E8EFFD]",
        "text-[#4C4E5D]"
    );


    activeButton.classList.add(
        "bg-[#5B00E8]",
        "text-white"
    );

}


/* =========================================================
   FILTER NOTIFICATIONS
========================================================= */

function filterNotifications(
    category
) {

    notificationCards.forEach(
        (card) => {

            const cardCategory =
                card.dataset.category;


            const visible =
                category === "all" ||
                cardCategory === category;


            if (visible) {

                card.classList.remove(
                    "hidden"
                );

            } else {

                card.classList.add(
                    "hidden"
                );

            }

        }
    );


    updateSectionVisibility();

}


/* =========================================================
   SECTION VISIBILITY
========================================================= */

function updateSectionVisibility() {

    if (
        !todaySection ||
        !earlierSection
    ) {
        return;
    }


    const todayCards =
        todaySection.querySelectorAll(
            ".notification-card:not(.hidden)"
        );


    const earlierCards =
        earlierSection.querySelectorAll(
            ".notification-card:not(.hidden)"
        );


    todaySection.classList.toggle(
        "hidden",
        todayCards.length === 0
    );


    earlierSection.classList.toggle(
        "hidden",
        earlierCards.length === 0
    );

}


/* =========================================================
   FILTER EVENTS
========================================================= */

filterButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const category =
                    button.dataset.filter ||
                    "all";


                setActiveFilter(
                    button
                );


                filterNotifications(
                    category
                );

            }
        );

    }
);


/* =========================================================
   BOTTOM NAVIGATION
========================================================= */

document
    .querySelectorAll(
        "[data-nav]"
    )
    .forEach(
        (button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();


                    const destination =
                        button.dataset.nav;


                    const route =
                        ROUTES[
                            destination
                        ];


                    if (!route) {

                        console.warn(
                            "No route found:",
                            destination
                        );

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

        }
    );


/* =========================================================
   ACCESSIBILITY
========================================================= */

notificationCards.forEach(
    (card) => {

        card.setAttribute(
            "tabindex",
            "0"
        );


        card.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                        "Enter" ||
                    event.key ===
                        " "
                ) {

                    event.preventDefault();

                    card.click();

                }

            }
        );

    }
);


/* =========================================================
   INITIAL STATE
========================================================= */

updateUnreadCount();

updateSectionVisibility();