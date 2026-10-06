"use strict";

/* =========================================================
   EVENTRA — SCREEN 17
   MY TICKETS
========================================================= */


/* =========================================================
   API
========================================================= */

const API_BASE =
    "https://eventra-backend-aidf.onrender.com/api";


/* =========================================================
   ROUTES
========================================================= */

const ROUTES = {

    home:
        "../05_Home/index.html",

    discover:
        "../10_Discover%20Event/index.html",

    digitalTicket:
        "../16_Digital%20Ticket/index.html",

    notifications:
        "../18_Notification/index.html",

    profile:
        "../19_User%20Profile/index.html"

};


/* =========================================================
   DOM ELEMENTS
========================================================= */

const ticketSearch =
    document.getElementById("ticketSearch");

const inlineSearchButton =
    document.getElementById("inlineSearchButton");

const upcomingTab =
    document.getElementById("upcomingTab");

const pastTab =
    document.getElementById("pastTab");

const upcomingContent =
    document.getElementById("upcomingContent");

const pastContent =
    document.getElementById("pastContent");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const modal =
    document.getElementById("modal");

const modalTitle =
    document.getElementById("modalTitle");

const modalText =
    document.getElementById("modalText");

const modalConfirm =
    document.getElementById("modalConfirm");

const closeModal =
    document.getElementById("closeModal");

const mainQr =
    document.getElementById("mainQr");

const openGatePassButton =
    document.getElementById("openGatePassButton");

const walletButton =
    document.getElementById("walletButton");


/* =========================================================
   STATE
========================================================= */

let activeTab = "upcoming";

let currentModalAction = null;


/* =========================================================
   STORAGE
========================================================= */

function getStoredUser() {

    const keys = [
        "user",
        "currentUser",
        "eventra_user",
        "auth_user"
    ];

    for (const key of keys) {

        try {

            const value =
                localStorage.getItem(key) ||
                sessionStorage.getItem(key);

            if (!value) {
                continue;
            }

            return JSON.parse(value);

        } catch (error) {

            continue;

        }
    }

    return null;
}


function getToken() {

    const keys = [
        "token",
        "access_token",
        "accessToken",
        "authToken",
        "eventra_token"
    ];

    for (const key of keys) {

        const value =
            localStorage.getItem(key) ||
            sessionStorage.getItem(key);

        if (value) {
            return value;
        }
    }

    return null;
}


function getUserId() {

    const user =
        getStoredUser();

    if (!user) {
        return null;
    }

    return (
        user.id ||
        user.user_id ||
        user.userId ||
        user.data?.id ||
        user.data?.user_id ||
        null
    );
}


/* =========================================================
   TOAST
========================================================= */

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

    clearTimeout(
        window.eventraToastTimer
    );

    window.eventraToastTimer =
        setTimeout(
            function () {

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
   MODAL
========================================================= */

function openModal(
    title,
    message,
    callback = null
) {

    if (!modal) {
        return;
    }

    modalTitle.textContent =
        title;

    modalText.textContent =
        message;

    currentModalAction =
        callback;

    modal.classList.remove(
        "hidden"
    );

    modal.classList.add(
        "flex"
    );
}


function hideModal() {

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "flex"
    );

    modal.classList.add(
        "hidden"
    );

    currentModalAction =
        null;
}


closeModal?.addEventListener(
    "click",
    hideModal
);


modal?.addEventListener(
    "click",
    function (event) {

        if (event.target === modal) {
            hideModal();
        }

    }
);


modalConfirm?.addEventListener(
    "click",
    function () {

        if (
            typeof currentModalAction ===
            "function"
        ) {

            currentModalAction();

        }

        hideModal();

    }
);


/* =========================================================
   TICKET ACTION BUTTON STATE
========================================================= */

/*
    Initial state:

    Open Gate Pass = PURPLE / ACTIVE
    Save to Wallet = LIGHT / INACTIVE

    Clicking either button switches the active
    purple state to that button.
*/

function setTicketActionState(
    activeButton
) {

    if (
        !openGatePassButton ||
        !walletButton
    ) {
        return;
    }


    /* -----------------------------------------
       RESET BOTH BUTTONS
    ----------------------------------------- */

    openGatePassButton.classList.remove(
        "bg-[#5B00E8]",
        "text-white",
        "shadow-[0_5px_12px_rgba(91,0,232,0.2)]"
    );

    openGatePassButton.classList.add(
        "border",
        "border-[#DFE4EE]",
        "bg-[#F1F5FF]",
        "text-[#29354D]"
    );


    walletButton.classList.remove(
        "bg-[#5B00E8]",
        "text-white",
        "shadow-[0_5px_12px_rgba(91,0,232,0.2)]"
    );

    walletButton.classList.add(
        "border",
        "border-[#DFE4EE]",
        "bg-[#F1F5FF]",
        "text-[#29354D]"
    );


    /* -----------------------------------------
       ACTIVE BUTTON
    ----------------------------------------- */

    activeButton.classList.remove(
        "border",
        "border-[#DFE4EE]",
        "bg-[#F1F5FF]",
        "text-[#29354D]"
    );

    activeButton.classList.add(
        "bg-[#5B00E8]",
        "text-white",
        "shadow-[0_5px_12px_rgba(91,0,232,0.2)]"
    );


    /* -----------------------------------------
       UPDATE ICON COLORS
    ----------------------------------------- */

    const iconPaths =
        activeButton.querySelectorAll(
            "svg path, svg rect, svg circle"
        );


    iconPaths.forEach(
        function (element) {

            if (
                activeButton ===
                openGatePassButton
            ) {

                element.setAttribute(
                    "stroke",
                    "white"
                );

            } else {

                element.setAttribute(
                    "stroke",
                    "white"
                );

            }

        }
    );
}


/* =========================================================
   INITIAL ACTIVE STATE
========================================================= */

if (openGatePassButton) {

    setTicketActionState(
        openGatePassButton
    );

}


/* =========================================================
   TABS
========================================================= */

function setActiveTab(tab) {

    activeTab =
        tab;


    if (tab === "upcoming") {

        upcomingContent.classList.remove(
            "hidden"
        );

        pastContent.classList.add(
            "hidden"
        );


        upcomingTab.classList.add(
            "bg-[#5B00E8]",
            "text-white"
        );

        upcomingTab.classList.remove(
            "text-[#29354D]"
        );


        pastTab.classList.remove(
            "bg-[#5B00E8]",
            "text-white"
        );

        pastTab.classList.add(
            "text-[#29354D]"
        );

    } else {

        upcomingContent.classList.add(
            "hidden"
        );

        pastContent.classList.remove(
            "hidden"
        );


        pastTab.classList.add(
            "bg-[#5B00E8]",
            "text-white"
        );

        pastTab.classList.remove(
            "text-[#29354D]"
        );


        upcomingTab.classList.remove(
            "bg-[#5B00E8]",
            "text-white"
        );

        upcomingTab.classList.add(
            "text-[#29354D]"
        );

    }

    applySearch();
}


upcomingTab?.addEventListener(
    "click",
    function () {

        setActiveTab(
            "upcoming"
        );

    }
);


pastTab?.addEventListener(
    "click",
    function () {

        setActiveTab(
            "past"
        );

    }
);


/* =========================================================
   SEARCH
========================================================= */

function applySearch() {

    const query =
        (
            ticketSearch?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const cards =
        document.querySelectorAll(
            ".ticket-card"
        );


    cards.forEach(
        function (card) {

            const searchableText =
                (
                    card.dataset.search ||
                    card.textContent ||
                    ""
                ).toLowerCase();


            const matches =
                query === "" ||
                searchableText.includes(
                    query
                );


            card.classList.toggle(
                "hidden",
                !matches
            );

        }
    );
}


ticketSearch?.addEventListener(
    "input",
    applySearch
);


inlineSearchButton?.addEventListener(
    "click",
    function () {

        ticketSearch?.focus();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   QR CODE
========================================================= */

function createFallbackQR() {

    if (!mainQr) {
        return;
    }

    mainQr.innerHTML = "";


    const pattern = [

        1, 1, 1, 0, 1, 1, 1,
        1, 0, 1, 1, 0, 0, 1,
        1, 1, 1, 0, 1, 1, 1,
        0, 1, 0, 1, 1, 0, 0,
        1, 1, 1, 0, 1, 1, 1,
        1, 0, 0, 1, 0, 0, 1,
        1, 1, 1, 0, 1, 1, 1

    ];


    pattern.forEach(
        function (value) {

            const cell =
                document.createElement(
                    "span"
                );


            cell.className =
                value === 1
                    ? "qr-cell dark"
                    : "qr-cell";


            mainQr.appendChild(
                cell
            );

        }
    );
}


createFallbackQR();


/* =========================================================
   DIGITAL TICKET
========================================================= */

function buildDigitalTicketURL(
    ticketId = null
) {

    const url =
        new URL(
            ROUTES.digitalTicket,
            window.location.href
        );


    if (ticketId) {

        url.searchParams.set(
            "ticket_id",
            ticketId
        );

    }


    return url.href;
}


function openDigitalTicket(
    ticketId = null
) {

    const url =
        buildDigitalTicketURL(
            ticketId
        );


    window.location.assign(
        url
    );
}


/* =========================================================
   OPEN GATE PASS
========================================================= */

openGatePassButton?.addEventListener(
    "click",
    function () {

        /*
           Make Open Gate Pass active.
        */

        setTicketActionState(
            openGatePassButton
        );


        showToast(
            "Opening your digital gate pass..."
        );


        setTimeout(
            function () {

                openDigitalTicket(
                    "EVT-928374-TC26"
                );

            },
            300
        );

    }
);


/* =========================================================
   SAVE TO WALLET
========================================================= */

walletButton?.addEventListener(
    "click",
    function () {

        /*
           Switch the purple active state
           from Open Gate Pass to Wallet.
        */

        setTicketActionState(
            walletButton
        );


        showToast(
            "Ticket saved to Wallet"
        );

    }
);


/* =========================================================
   SCAN TICKET
========================================================= */

document
    .getElementById(
        "scanTicketButton"
    )
    ?.addEventListener(
        "click",
        function () {

            openModal(
                "Ready to Scan",
                "Your digital pass QR code will be displayed for entry scanning.",
                function () {

                    openDigitalTicket(
                        "EVT-928374-TC26"
                    );

                }
            );

        }
    );


/* =========================================================
   OTHER TICKETS
========================================================= */

document
    .querySelectorAll(
        '[data-ticket-action="view"]'
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    showToast(
                        "Opening ticket..."
                    );


                    setTimeout(
                        function () {

                            openDigitalTicket();

                        },
                        300
                    );

                }
            );

        }
    );


document
    .querySelectorAll(
        '[data-ticket-action="manage"]'
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    openModal(
                        "Manage Pass",
                        "Pass management options will be available here.",
                        function () {

                            showToast(
                                "Pass management opened"
                            );

                        }
                    );

                }
            );

        }
    );


/* =========================================================
   TRANSFER PASS
========================================================= */

document
    .getElementById(
        "transferPassButton"
    )
    ?.addEventListener(
        "click",
        function () {

            openModal(
                "Transfer Pass",
                "Transfer this ticket to another Eventra attendee.",
                function () {

                    showToast(
                        "Transfer flow opened"
                    );

                }
            );

        }
    );


/* =========================================================
   RFID
========================================================= */

document
    .getElementById(
        "rfidButton"
    )
    ?.addEventListener(
        "click",
        function () {

            openModal(
                "RFID & Swag",
                "View RFID pickup points and swag collection information.",
                function () {

                    showToast(
                        "RFID & Swag opened"
                    );

                }
            );

        }
    );


/* =========================================================
   RECEIPTS
========================================================= */

document
    .getElementById(
        "receiptsButton"
    )
    ?.addEventListener(
        "click",
        function () {

            showToast(
                "Opening your receipts..."
            );

        }
    );


/* =========================================================
   DISCOVER
========================================================= */

document
    .getElementById(
        "discoverButton"
    )
    ?.addEventListener(
        "click",
        function () {

            window.location.assign(
                ROUTES.discover
            );

        }
    );


/* =========================================================
   LOGO
========================================================= */

document
    .getElementById(
        "logoButton"
    )
    ?.addEventListener(
        "click",
        function () {

            window.location.assign(
                ROUTES.home
            );

        }
    );


/* =========================================================
   LOCATION
========================================================= */

document
    .getElementById(
        "locationButton"
    )
    ?.addEventListener(
        "click",
        function () {

            showToast(
                "Current location: Lagos"
            );

        }
    );


/* =========================================================
   NOTIFICATIONS
========================================================= */

document
    .getElementById(
        "notificationButton"
    )
    ?.addEventListener(
        "click",
        function () {

            if (ROUTES.notifications) {

                window.location.assign(
                    ROUTES.notifications
                );

            }

        }
    );


/* =========================================================
   PROFILE
========================================================= */

document
    .getElementById(
        "profileButton"
    )
    ?.addEventListener(
        "click",
        function () {

            if (ROUTES.profile) {

                window.location.assign(
                    ROUTES.profile
                );

            }

        }
    );


/* =========================================================
   HISTORY
========================================================= */

document
    .getElementById(
        "historyButton"
    )
    ?.addEventListener(
        "click",
        function () {

            setActiveTab(
                "past"
            );


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

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
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const destination =
                        button.dataset.nav;


                    if (
                        destination ===
                        "tickets"
                    ) {

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });

                        return;
                    }


                    const route =
                        ROUTES[destination];


                    if (route) {

                        window.location.assign(
                            route
                        );

                    }

                }
            );

        }
    );


/* =========================================================
   BACKEND — USER TICKETS
========================================================= */

async function loadUserTickets() {

    const userId =
        getUserId();

    const token =
        getToken();


    if (!userId || !token) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/users/${encodeURIComponent(userId)}/tickets`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `Ticket request failed: ${response.status}`
            );

        }


        const result =
            await response.json();


        const tickets =
            normalizeTicketResponse(
                result
            );


        console.log(
            "Eventra tickets:",
            tickets
        );


    } catch (error) {

        console.warn(
            "Eventra ticket API:",
            error.message
        );

    }
}


/* =========================================================
   NORMALIZE API RESPONSE
========================================================= */

function normalizeTicketResponse(
    result
) {

    if (!result) {
        return [];
    }


    if (Array.isArray(result)) {
        return result;
    }


    if (Array.isArray(result.data)) {
        return result.data;
    }


    if (Array.isArray(result.tickets)) {
        return result.tickets;
    }


    if (
        result.data &&
        Array.isArray(
            result.data.tickets
        )
    ) {

        return result.data.tickets;

    }


    return [];
}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setActiveTab(
            "upcoming"
        );

        loadUserTickets();

    }
);