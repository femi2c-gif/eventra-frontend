/* ============================================================
   EVENTRA
   SCREEN 16 - DIGITAL TICKET
============================================================ */


/* ============================================================
   API
============================================================ */

const API_BASE_URL =
    "https://eventra-backend-aidf.onrender.com/api";


/* ============================================================
   ROUTES
============================================================ */

const ROUTES = {

    home:
        "../05_Home/index.html",

    tickets:
        "../15_My Tickets/index.html",

    profile:
        "../19_User%20Profile/index.html"

};


/* ============================================================
   DEFAULT TICKET
============================================================ */

const defaultTicket = {

    id:
        "",

    ticket_code:
        "EVT-928374-TC26",

    qr_code_url:
        "",

    status:
        "valid",

    attendee_name:
        "John Doe",

    ticket_type:
        "Regular Pass",

    quantity:
        1,

    event_name:
        "Tech Conference 2026",

    event_category:
        "LAGOS TECH SERIES",

    venue:
        "Landmark Centre, Victoria Island, Lagos",

    address:
        "Landmark Centre, Water Corporation Drive, Victoria Island, Lagos",

    date:
        "Sat, Oct 12, 2026",

    time:
        "10:00 AM - 6:00 PM",

    gate:
        "Gate 2 (Hall A)",

    seat:
        "General Keynote",

    organizer:
        "Apex Live Events NG"

};


/* ============================================================
   DOM ELEMENTS
============================================================ */

const qrCode =
    document.getElementById(
        "qrCode"
    );


const eventTitle =
    document.getElementById(
        "eventTitle"
    );


const eventCategory =
    document.getElementById(
        "eventCategory"
    );


const eventVenue =
    document.getElementById(
        "eventVenue"
    );


const ticketCode =
    document.getElementById(
        "ticketCode"
    );


const attendeeName =
    document.getElementById(
        "attendeeName"
    );


const noticeName =
    document.getElementById(
        "noticeName"
    );


const ticketTier =
    document.getElementById(
        "ticketTier"
    );


const ticketQuantity =
    document.getElementById(
        "ticketQuantity"
    );


const eventDate =
    document.getElementById(
        "eventDate"
    );


const eventTime =
    document.getElementById(
        "eventTime"
    );


const gateEntry =
    document.getElementById(
        "gateEntry"
    );


const seatArea =
    document.getElementById(
        "seatArea"
    );


const organizerName =
    document.getElementById(
        "organizerName"
    );


const venueAddress =
    document.getElementById(
        "venueAddress"
    );


const qrTimer =
    document.getElementById(
        "qrTimer"
    );


const toast =
    document.getElementById(
        "toast"
    );


const toastMessage =
    document.getElementById(
        "toastMessage"
    );


/* ============================================================
   TOKEN
============================================================ */

function getToken() {

    return (

        localStorage.getItem(
            "eventra_token"
        ) ||

        sessionStorage.getItem(
            "eventra_token"
        ) ||

        localStorage.getItem(
            "token"
        ) ||

        sessionStorage.getItem(
            "token"
        ) ||

        ""

    );

}


/* ============================================================
   GET TICKET ID
============================================================ */

function getTicketId() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return (

        params.get(
            "ticket_id"
        ) ||

        params.get(
            "ticketId"
        ) ||

        params.get(
            "id"
        ) ||

        sessionStorage.getItem(
            "eventra_selected_ticket_id"
        ) ||

        sessionStorage.getItem(
            "eventra_ticket_id"
        ) ||

        localStorage.getItem(
            "eventra_selected_ticket_id"
        ) ||

        localStorage.getItem(
            "eventra_ticket_id"
        ) ||

        ""

    );

}


/* ============================================================
   TOAST
============================================================ */

let toastTimeout =
    null;


function showToast(
    message
) {

    if (
        !toast ||
        !toastMessage
    ) {

        return;

    }


    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2800
        );

}


/* ============================================================
   FORMAT DATE
============================================================ */

function formatEventDate(
    value
) {

    if (!value) {

        return "";

    }


    const parsed =
        new Date(
            value
        );


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return value;

    }


    return parsed.toLocaleDateString(
        "en-US",
        {

            weekday:
                "short",

            month:
                "short",

            day:
                "numeric",

            year:
                "numeric"

        }
    );

}


/* ============================================================
   FORMAT TIME
============================================================ */

function formatEventTime(
    start,
    end,
    fallback
) {

    if (!start) {

        return fallback || "";

    }


    const startDate =
        new Date(
            start
        );


    if (
        Number.isNaN(
            startDate.getTime()
        )
    ) {

        return fallback || "";

    }


    const startTime =
        startDate.toLocaleTimeString(
            "en-US",
            {

                hour:
                    "numeric",

                minute:
                    "2-digit"

            }
        );


    if (!end) {

        return startTime;

    }


    const endDate =
        new Date(
            end
        );


    if (
        Number.isNaN(
            endDate.getTime()
        )
    ) {

        return startTime;

    }


    const endTime =
        endDate.toLocaleTimeString(
            "en-US",
            {

                hour:
                    "numeric",

                minute:
                    "2-digit"

            }
        );


    return (
        `${startTime} - ${endTime}`
    );

}


/* ============================================================
   NORMALIZE API RESPONSE
============================================================ */

function normalizeTicket(
    rawResponse
) {

    if (!rawResponse) {

        return {
            ...defaultTicket
        };

    }


    /*
        The API may return:

        {
            data: {
                ticket: {...}
            }
        }

        OR

        {
            data: {...}
        }

        OR

        {
            ticket: {...}
        }

        OR the ticket object directly.
    */

    const ticket =

        rawResponse?.data?.ticket ||

        rawResponse?.data?.data?.ticket ||

        rawResponse?.data ||

        rawResponse?.ticket ||

        rawResponse;


    const event =

        ticket?.event ||

        ticket?.Event ||

        {};


    const user =

        ticket?.user ||

        ticket?.attendee ||

        {};


    const ticketType =

        ticket?.ticket_type ||

        ticket?.ticketType ||

        {};


    const firstName =
        user?.first_name ||
        "";


    const lastName =
        user?.last_name ||
        "";


    const calculatedName =

        `${firstName} ${lastName}`.trim();


    return {

        ...defaultTicket,


        /* Ticket ID */

        id:

            ticket?.id ||

            ticket?.ticket_id ||

            defaultTicket.id,


        /* Ticket Code */

        ticket_code:

            ticket?.ticket_code ||

            ticket?.ticketCode ||

            ticket?.code ||

            defaultTicket.ticket_code,


        /* IMPORTANT QR FIELD */

        qr_code_url:

            ticket?.qr_code_url ||

            ticket?.qrCodeUrl ||

            ticket?.qr_code ||

            ticket?.qrCode ||

            "",


        /* Status */

        status:

            ticket?.status ||

            defaultTicket.status,


        /* Attendee */

        attendee_name:

            ticket?.attendee_name ||

            ticket?.attendeeName ||

            ticket?.user_name ||

            calculatedName ||

            defaultTicket.attendee_name,


        /* Ticket type */

        ticket_type:

            ticketType?.name ||

            ticket?.ticket_type_name ||

            ticket?.ticketTypeName ||

            (
                typeof ticket?.ticket_type ===
                "string"
                    ? ticket.ticket_type
                    : ""
            ) ||

            defaultTicket.ticket_type,


        /* Quantity */

        quantity:

            ticket?.quantity ||

            ticketType?.quantity ||

            1,


        /* Event */

        event_name:

            event?.name ||

            event?.title ||

            ticket?.event_name ||

            ticket?.event_title ||

            defaultTicket.event_name,


        event_category:

            event?.category ||

            event?.category_name ||

            ticket?.event_category ||

            defaultTicket.event_category,


        /* Venue */

        venue:

            event?.venue ||

            event?.venue_name ||

            ticket?.venue ||

            defaultTicket.venue,


        /* Address */

        address:

            event?.address ||

            event?.location ||

            ticket?.address ||

            defaultTicket.address,


        /* Date */

        date:

            formatEventDate(
                event?.start_date ||
                event?.date ||
                ticket?.event_date
            ) ||

            defaultTicket.date,


        /* Time */

        time:

            formatEventTime(
                event?.start_date,
                event?.end_date,
                event?.time
            ) ||

            defaultTicket.time,


        /* Gate */

        gate:

            ticket?.gate ||

            ticket?.gate_entry ||

            ticket?.gateEntry ||

            defaultTicket.gate,


        /* Seat */

        seat:

            ticket?.seat ||

            ticket?.area ||

            ticket?.seat_area ||

            defaultTicket.seat,


        /* Organizer */

        organizer:

            event?.organizer?.name ||

            event?.organizer_name ||

            event?.organizer?.business_name ||

            ticket?.organizer_name ||

            defaultTicket.organizer

    };

}


/* ============================================================
   RENDER TICKET
============================================================ */

function renderTicket(
    ticket
) {

    if (!ticket) {

        return;

    }


    /* Event */

    if (eventTitle) {

        eventTitle.textContent =
            ticket.event_name;

    }


    if (eventCategory) {

        eventCategory.textContent =
            ticket.event_category;

    }


    if (eventVenue) {

        eventVenue.textContent =
            ticket.venue;

    }


    /* Ticket */

    if (ticketCode) {

        ticketCode.textContent =
            ticket.ticket_code;

    }


    /* Attendee */

    if (attendeeName) {

        attendeeName.textContent =
            ticket.attendee_name;

    }


    if (noticeName) {

        noticeName.textContent =
            ticket.attendee_name;

    }


    /* Tier */

    if (ticketTier) {

        ticketTier.textContent =
            ticket.ticket_type;

    }


    if (ticketQuantity) {

        ticketQuantity.textContent =
            `${ticket.quantity}x`;

    }


    /* Date */

    if (eventDate) {

        eventDate.textContent =
            ticket.date;

    }


    /* Time */

    if (eventTime) {

        eventTime.textContent =
            ticket.time;

    }


    /* Gate */

    if (gateEntry) {

        gateEntry.textContent =
            ticket.gate;

    }


    /* Seat */

    if (seatArea) {

        seatArea.textContent =
            ticket.seat;

    }


    /* Organizer */

    if (organizerName) {

        organizerName.textContent =
            ticket.organizer;

    }


    /* Address */

    if (venueAddress) {

        venueAddress.textContent =
            ticket.address;

    }


    /*
        IMPORTANT:

        Always pass the complete ticket to QR renderer.
    */

    renderQRCode(
        ticket.qr_code_url,
        ticket
    );


    updateTicketStatus(
        ticket.status
    );

}


/* ============================================================
   RENDER QR CODE
============================================================ */

function renderQRCode(
    qrUrl,
    ticket
) {

    const container =
        document.getElementById(
            "qrCode"
        );


    if (!container) {

        return;

    }


    /*
        Clear previous QR.
    */

    container.innerHTML =
        "";


    /*
        --------------------------------------------------------
        OPTION 1
        USE REAL BACKEND QR
        --------------------------------------------------------
    */

    if (

        qrUrl &&

        typeof qrUrl ===
            "string" &&

        qrUrl.trim() !== ""

    ) {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            qrUrl;


        image.alt =
            "Eventra digital ticket QR code";


        image.className =
            "h-full w-full object-contain";


        image.onload =
            function () {

                console.log(
                    "Eventra backend QR loaded successfully."
                );

            };


        image.onerror =
            function () {

                console.warn("Backend QR could not be loaded.");
                showQrUnavailable();

            };


        container.appendChild(
            image
        );


        return;

    }


    /*
        --------------------------------------------------------
        OPTION 2
        BACKEND DID NOT SEND QR
        GENERATE ONE FROM TICKET DATA
        --------------------------------------------------------
    */

    showQrUnavailable();

}


function showQrUnavailable() {
    const container = document.getElementById("qrCode");
    if (!container) return;
    container.innerHTML = `<div class="flex h-full w-full items-center justify-center rounded-[8px] bg-[#F5F5FA] px-4 text-center text-[12px] font-medium text-[#626A7D]">QR code unavailable. Please refresh the ticket.</div>`;
}


/* ============================================================
   FALLBACK QR GENERATOR
============================================================ */

function generateFallbackQR(
    ticket
) {

    const container =
        document.getElementById(
            "qrCode"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    /*
        QR payload.

        If the backend is temporarily not returning
        qr_code_url, this allows us to continue testing
        the frontend without showing an empty QR block.
    */

    const payload = {

        ticket_id:
            ticket?.id ||
            "",

        ticket_code:
            ticket?.ticket_code ||
            "EVT-928374-TC26",

        event:
            ticket?.event_name ||
            "Tech Conference 2026",

        status:
            ticket?.status ||
            "valid"

    };


    const qrText =
        JSON.stringify(
            payload
        );


    /*
        Make sure QR library exists.
    */

    if (
        typeof QRCode ===
        "undefined"
    ) {

        console.error(
            "QRCode library is not available."
        );


        container.innerHTML = `

            <div
                class="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    rounded-[8px]
                    bg-[#F5F5FA]
                    px-5
                    text-center
                    text-[12px]
                    font-medium
                    text-[#626A7D]
                "
            >
                QR library could not be loaded
            </div>

        `;


        return;

    }


    try {

        new QRCode(
            container,
            {

                text:
                    qrText,

                width:
                    220,

                height:
                    220,

                colorDark:
                    "#111827",

                colorLight:
                    "#FFFFFF",

                correctLevel:
                    QRCode.CorrectLevel.H

            }
        );


        /*
            Center verification mark.
        */

        addQRCheckMark(
            container
        );


        console.log(
            "Fallback QR generated successfully."
        );


    } catch (error) {

        console.error(
            "Fallback QR generation failed:",
            error
        );


        container.innerHTML = `

            <div
                class="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    rounded-[8px]
                    bg-[#F5F5FA]
                    px-5
                    text-center
                    text-[12px]
                    font-medium
                    text-[#626A7D]
                "
            >
                Unable to generate QR code
            </div>

        `;

    }

}


/* ============================================================
   QR CHECK MARK
============================================================ */

function addQRCheckMark(
    container
) {

    const mark =
        document.createElement(
            "div"
        );


    mark.style.position =
        "absolute";


    mark.style.left =
        "50%";


    mark.style.top =
        "50%";


    mark.style.transform =
        "translate(-50%, -50%)";


    mark.style.width =
        "46px";


    mark.style.height =
        "46px";


    mark.style.borderRadius =
        "50%";


    mark.style.background =
        "#6428FF";


    mark.style.display =
        "flex";


    mark.style.alignItems =
        "center";


    mark.style.justifyContent =
        "center";


    mark.style.border =
        "4px solid white";


    mark.style.boxShadow =
        "0 3px 8px rgba(0,0,0,.14)";


    mark.innerHTML = `

        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2.5"
            style="
                width:24px;
                height:24px;
            "
        >

            <path
                d="m5 12 4 4L19 6"
            />

        </svg>

    `;


    container.appendChild(
        mark
    );

}


/* ============================================================
   TICKET STATUS
============================================================ */

function updateTicketStatus(
    status
) {

    const normalized =
        String(
            status ||
            "valid"
        ).toLowerCase();


    if (
        normalized ===
        "used"
    ) {

        showToast(
            "This ticket has already been used."
        );


        return;

    }


    if (
        normalized ===
        "expired"
    ) {

        showToast(
            "This ticket has expired."
        );


        return;

    }


    if (
        normalized ===
        "cancelled"
    ) {

        showToast(
            "This ticket has been cancelled."
        );


        return;

    }

}


/* ============================================================
   LOAD TICKET FROM API
============================================================ */

async function loadTicket() {

    const ticketId =
        getTicketId();


    /*
        If there is no ID yet, use cached/default
        ticket so the design remains visible.
    */

    if (!ticketId) {
        console.warn("No ticket ID found.");
        const app = document.getElementById("app");
        if (app) {
            app.innerHTML = `<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:28px;text-align:center;font-family:Outfit,Arial,sans-serif;background:#F7F8FD"><div><div style="font-size:44px">🎟️</div><h1 style="font-size:22px;color:#172033;margin:12px 0 8px">No ticket selected</h1><p style="color:#69738A;max-width:320px;margin:0 auto 20px">Purchase a ticket first or open a ticket from My Tickets.</p><button type="button" id="openMyTicketsEmpty" style="height:46px;padding:0 20px;border:0;border-radius:12px;background:#5B00E8;color:#fff;font:600 14px Outfit,Arial,sans-serif">Open My Tickets</button></div></div>`;
            document.getElementById("openMyTicketsEmpty")?.addEventListener("click", () => window.location.assign("../17_MyTicket/index.html"));
        }
        return;
    }


    const token =
        getToken();


    try {

        console.log(
            "Loading Eventra ticket:",
            ticketId
        );


        const response =
            await fetch(
                `${API_BASE_URL}/tickets/${encodeURIComponent(ticketId)}`,
                {

                    method:
                        "GET",

                    headers: {

                        "Accept":
                            "application/json",

                        "Content-Type":
                            "application/json",

                        ...(token
                            ? {
                                "Authorization":
                                    `Bearer ${token}`
                            }
                            : {})

                    }

                }
            );


        /*
            Handle HTTP error.
        */

        if (
            !response.ok
        ) {

            const errorText =
                await response.text();


            console.error(
                "Ticket API error:",
                response.status,
                errorText
            );


            throw new Error(
                `Ticket request failed: ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "Eventra ticket API response:",
            result
        );


        const ticket =
            normalizeTicket(
                result
            );


        console.log(
            "Normalized Eventra ticket:",
            ticket
        );


        /*
            Cache complete ticket locally.
        */

        sessionStorage.setItem(
            "eventra_digital_ticket",
            JSON.stringify(
                ticket
            )
        );


        localStorage.setItem(
            "eventra_digital_ticket",
            JSON.stringify(
                ticket
            )
        );


        /*
            Render.
        */

        renderTicket(
            ticket
        );


    } catch (error) {

        console.error(
            "Could not load ticket from backend:",
            error
        );


        /*
            Try session cache.
        */

        const cached =
            loadCachedTicket();


        if (cached) {

            renderTicket(
                cached
            );


            showToast(
                "Showing your saved digital ticket."
            );


            return;

        }


        const app = document.getElementById("app");
        if (app) {
            app.innerHTML = `<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:28px;text-align:center;font-family:Outfit,Arial,sans-serif;background:#F7F8FD"><div><div style="font-size:44px">⚠️</div><h1 style="font-size:22px;color:#172033;margin:12px 0 8px">Ticket unavailable</h1><p style="color:#69738A;max-width:340px;margin:0 auto 20px">We could not load this ticket from Eventra. Please try again from My Tickets.</p><button type="button" id="openMyTicketsError" style="height:46px;padding:0 20px;border:0;border-radius:12px;background:#5B00E8;color:#fff;font:600 14px Outfit,Arial,sans-serif">Open My Tickets</button></div></div>`;
            document.getElementById("openMyTicketsError")?.addEventListener("click", () => window.location.assign("../17_MyTicket/index.html"));
        }

        showToast("Ticket could not be loaded.");

    }

}


/* ============================================================
   LOAD CACHED TICKET
============================================================ */

function loadCachedTicket() {

    const sessionTicket =
        sessionStorage.getItem(
            "eventra_digital_ticket"
        );


    const localTicket =
        localStorage.getItem(
            "eventra_digital_ticket"
        );


    const cached =
        sessionTicket ||
        localTicket;


    if (!cached) {

        return null;

    }


    try {

        return normalizeTicket(
            JSON.parse(
                cached
            )
        );

    } catch (error) {

        console.error(
            "Invalid cached ticket:",
            error
        );


        return null;

    }

}


/* ============================================================
   QR SECURITY COUNTDOWN
============================================================ */

let qrSeconds =
    44;


/* ============================================================
   UPDATE QR TIMER
============================================================ */

function updateQRTimer() {

    if (!qrTimer) {

        return;

    }


    qrTimer.textContent =
        `${qrSeconds}s`;

}


/* ============================================================
   START QR TIMER
============================================================ */

function startQRTimer() {

    updateQRTimer();


    setInterval(
        () => {

            qrSeconds--;


            if (
                qrSeconds <
                0
            ) {

                qrSeconds =
                    44;

            }


            updateQRTimer();

        },
        1000
    );

}


/* ============================================================
   SAVE TO DEVICE WALLET
============================================================ */

function saveToWallet() {

    const ticket =
        loadCachedTicket() ||
        defaultTicket;


    const walletData = {

        type:
            "eventra_digital_ticket",

        event:
            ticket.event_name,

        attendee:
            ticket.attendee_name,

        ticket_code:
            ticket.ticket_code,

        ticket_type:
            ticket.ticket_type,

        date:
            ticket.date,

        time:
            ticket.time,

        venue:
            ticket.venue,

        gate:
            ticket.gate,

        status:
            ticket.status

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    walletData,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `${ticket.ticket_code || "eventra-ticket"}-wallet.json`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "Ticket saved to your device."
    );

}


/* ============================================================
   DOWNLOAD PDF
============================================================ */

function downloadPDF() {

    showToast(
        "Opening print dialog. Choose Save as PDF."
    );


    setTimeout(
        () => {

            window.print();

        },
        500
    );

}


/* ============================================================
   SHARE DIGITAL PASS
============================================================ */

async function shareDigitalPass() {

    const ticket =
        loadCachedTicket() ||
        defaultTicket;


    const shareText =

        `${ticket.event_name}\n\n` +

        `Digital Ticket\n` +

        `Attendee: ${ticket.attendee_name}\n` +

        `Ticket: ${ticket.ticket_code}\n` +

        `Pass: ${ticket.ticket_type}\n` +

        `Date: ${ticket.date}\n` +

        `Time: ${ticket.time}\n` +

        `Venue: ${ticket.venue}`;


    /*
        Native share.
    */

    if (
        navigator.share
    ) {

        try {

            await navigator.share({

                title:
                    `${ticket.event_name} - Digital Ticket`,

                text:
                    shareText,

                url:
                    window.location.href

            });


        } catch (error) {

            if (
                error.name !==
                "AbortError"
            ) {

                console.error(
                    "Share failed:",
                    error
                );

            }

        }


        return;

    }


    /*
        Clipboard fallback.
    */

    try {

        await navigator.clipboard.writeText(
            shareText
        );


        showToast(
            "Digital ticket details copied."
        );


    } catch (error) {

        console.error(
            "Clipboard failed:",
            error
        );


        showToast(
            "Sharing is not supported on this device."
        );

    }

}


/* ============================================================
   DIRECTIONS
============================================================ */

function openDirections() {

    const destination =
        "Landmark Centre, Water Corporation Drive, Victoria Island, Lagos";


    const mapsUrl =
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;


    window.open(
        mapsUrl,
        "_blank",
        "noopener,noreferrer"
    );

}


/* ============================================================
   CONTACT ORGANIZER
============================================================ */

function contactOrganizer() {

    const organizer =
        organizerName
            ?.textContent
            ?.trim() ||
        "Event Organizer";


    const subject =
        encodeURIComponent(
            `Eventra Support - ${organizer}`
        );


    const body =
        encodeURIComponent(
            "Hello, I need assistance with my Eventra ticket."
        );


    window.location.href =
        `mailto:support@eventra.com?subject=${subject}&body=${body}`;

}


/* ============================================================
   TRANSFER TICKET
============================================================ */

function transferTicket() {

    showToast(
        "Ticket transfer will be available from Ticket Management."
    );

}


/* ============================================================
   REPORT ISSUE
============================================================ */

function reportIssue() {

    const ticket =
        loadCachedTicket() ||
        defaultTicket;


    const subject =
        encodeURIComponent(
            `Ticket Issue - ${ticket.ticket_code}`
        );


    const body =
        encodeURIComponent(

            `Hello Eventra Support,\n\n` +

            `I need help with ticket ` +

            `${ticket.ticket_code} ` +

            `for ${ticket.event_name}.\n\n`

        );


    window.location.href =
        `mailto:support@eventra.com?subject=${subject}&body=${body}`;

}


/* ============================================================
   RETURN HOME
============================================================ */

function goHome() {

    window.location.href =
        ROUTES.home;

}


/* ============================================================
   ONLINE / OFFLINE
============================================================ */

function updateOnlineState() {

    if (
        navigator.onLine
    ) {

        console.log(
            "Eventra ticket is online."
        );

    } else {

        console.log(
            "Eventra ticket is offline."
        );

    }

}


/* ============================================================
   BUTTON EVENTS
============================================================ */

const walletButton =
    document.getElementById(
        "walletButton"
    );


if (walletButton) {

    walletButton.addEventListener(
        "click",
        saveToWallet
    );

}


const downloadButton =
    document.getElementById(
        "downloadButton"
    );


if (downloadButton) {

    downloadButton.addEventListener(
        "click",
        downloadPDF
    );

}


const shareButton =
    document.getElementById(
        "shareButton"
    );


if (shareButton) {

    shareButton.addEventListener(
        "click",
        shareDigitalPass
    );

}


const directionsButton =
    document.getElementById(
        "directionsButton"
    );


if (directionsButton) {

    directionsButton.addEventListener(
        "click",
        openDirections
    );

}


const contactButton =
    document.getElementById(
        "contactButton"
    );


if (contactButton) {

    contactButton.addEventListener(
        "click",
        contactOrganizer
    );

}


const transferButton =
    document.getElementById(
        "transferButton"
    );


if (transferButton) {

    transferButton.addEventListener(
        "click",
        transferTicket
    );

}


const reportButton =
    document.getElementById(
        "reportButton"
    );


if (reportButton) {

    reportButton.addEventListener(
        "click",
        reportIssue
    );

}


const homeButton =
    document.getElementById(
        "homeButton"
    );


if (homeButton) {

    homeButton.addEventListener(
        "click",
        goHome
    );

}


/* ============================================================
   ONLINE / OFFLINE EVENTS
============================================================ */

window.addEventListener(
    "online",
    updateOnlineState
);


window.addEventListener(
    "offline",
    updateOnlineState
);


/* ============================================================
   INITIALIZE
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /*
            Render cached ticket immediately if available.
        */

        const cachedTicket =
            loadCachedTicket();


        if (cachedTicket) {

            renderTicket(
                cachedTicket
            );

        } else {

            renderTicket(
                defaultTicket
            );

        }


        /*
            Start countdown.
        */

        startQRTimer();


        /*
            Check network.
        */

        updateOnlineState();


        /*
            Refresh ticket from backend.
        */

        await loadTicket();

    }
);