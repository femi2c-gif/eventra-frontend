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
/* =========================================================
   BACKEND — USER NOTIFICATIONS
========================================================= */
const EVENTRA_API_BASE = "https://eventra-backend-aidf.onrender.com/api";

function getAuthToken() {
    return localStorage.getItem("eventra_token") || localStorage.getItem("access_token") || sessionStorage.getItem("eventra_token") || sessionStorage.getItem("access_token") || "";
}

function getUserId() {
    try {
        const user = JSON.parse(localStorage.getItem("eventra_user") || sessionStorage.getItem("eventra_user") || "null");
        return user?.id || user?.user_id || "";
    } catch (_) { return ""; }
}

function notificationIcon(type) {
    const t = String(type || "").toLowerCase();
    if (t.includes("payment")) return "💳";
    if (t.includes("ticket") || t.includes("booking")) return "🎟️";
    if (t.includes("event")) return "📅";
    if (t.includes("refund")) return "↩️";
    return "🔔";
}

function renderBackendNotifications(items) {
    if (!todaySection || !earlierSection) return;
    const normalized = items.map(n => ({
        id: n.id || n.notification_id || crypto.randomUUID(),
        title: n.title || n.type || "Eventra notification",
        description: n.message || n.description || "You have a new Eventra update.",
        created_at: n.created_at || n.timestamp || n.createdAt || new Date().toISOString(),
        unread: n.is_read === false || n.read === false || n.unread === true,
        type: n.type || "notification"
    }));

    const make = n => {
        const date = new Date(n.created_at);
        const time = Number.isNaN(date.getTime()) ? "" : date.toLocaleString("en-NG", { day:"numeric", month:"short", hour:"numeric", minute:"2-digit" });
        return `<article class="notification-card ${n.unread ? "unread" : "read"}" data-id="${String(n.id).replace(/[^a-zA-Z0-9_-]/g, "-")}" data-unread="${n.unread}" data-type="${String(n.type).replace(/[^a-zA-Z0-9_-]/g, "-")}">
          <div class="notification-icon bg-[#E7D9FF] text-[#5B00E8]">${notificationIcon(n.type)}</div>
          <div class="min-w-0 flex-1"><div class="notification-title-text">${String(n.title).replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}</div><div class="notification-time">${time}</div><div class="notification-description">${String(n.description).replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}</div></div>
          ${n.unread ? '<span class="unread-dot"></span>' : ''}
        </article>`;
    };

    const today = [];
    const earlier = [];
    const now = new Date();
    normalized.forEach(n => {
        const d = new Date(n.created_at);
        if (!Number.isNaN(d.getTime()) && d.toDateString() === now.toDateString()) today.push(n); else earlier.push(n);
    });
    todaySection.querySelector(".notification-list")?.replaceChildren();
    earlierSection.querySelector(".notification-list")?.replaceChildren();
    if (todaySection.querySelector(".notification-list")) todaySection.querySelector(".notification-list").innerHTML = today.length ? today.map(make).join("") : '<div class="p-6 text-center text-[#69738A]">No new notifications.</div>';
    if (earlierSection.querySelector(".notification-list")) earlierSection.querySelector(".notification-list").innerHTML = earlier.length ? earlier.map(make).join("") : '<div class="p-6 text-center text-[#69738A]">No earlier notifications.</div>';
    updateUnreadCount();
}

async function loadBackendNotifications() {
    const token = getAuthToken();
    const userId = getUserId();
    if (!token || !userId) return;
    try {
        const response = await fetch(`${EVENTRA_API_BASE}/users/${encodeURIComponent(userId)}/notifications`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
        if (!response.ok) throw new Error(`Notification request failed: ${response.status}`);
        const result = await response.json();
        const items = Array.isArray(result) ? result : Array.isArray(result.data) ? result.data : Array.isArray(result.data?.notifications) ? result.data.notifications : Array.isArray(result.notifications) ? result.notifications : [];
        renderBackendNotifications(items);
    } catch (error) {
        console.warn("Could not load backend notifications:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadBackendNotifications);
