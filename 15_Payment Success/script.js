// ============================================================
// EVENTRA
// SCREEN 15 - PAYMENT SUCCESS
// ============================================================


// ============================================================
// API
// ============================================================

const API_BASE_URL =
    "https://eventra-backend-aidf.onrender.com/api";


// ============================================================
// ROUTES
// ============================================================

const ROUTES = {

    digitalTicket:
        "../16_Digital%20Ticket/index.html",

    home:
        "../05_Home/index.html",

    myTickets:
        "../16_Digital%20Ticket/index.html"

};


// ============================================================
// ELEMENTS
// ============================================================

const viewDigitalPassButton =
    document.getElementById(
        "viewDigitalPassButton"
    );


const toast =
    document.getElementById(
        "toast"
    );


// ============================================================
// GET TOKEN
// ============================================================

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


// ============================================================
// SHOW TOAST
// ============================================================

function showToast(
    message
) {

    /*
        If the existing page has a toast element,
        use it.
    */

    if (toast) {

        toast.textContent =
            message;

        toast.classList.add(
            "show"
        );


        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );


        return;

    }


    /*
        Fallback toast if the page doesn't have
        the expected toast element.
    */

    const fallbackToast =
        document.createElement(
            "div"
        );


    fallbackToast.textContent =
        message;


    fallbackToast.style.position =
        "fixed";


    fallbackToast.style.left =
        "50%";


    fallbackToast.style.bottom =
        "24px";


    fallbackToast.style.transform =
        "translateX(-50%)";


    fallbackToast.style.zIndex =
        "99999";


    fallbackToast.style.background =
        "#171C2D";


    fallbackToast.style.color =
        "#FFFFFF";


    fallbackToast.style.padding =
        "13px 18px";


    fallbackToast.style.borderRadius =
        "12px";


    fallbackToast.style.fontFamily =
        "Outfit, Arial, sans-serif";


    fallbackToast.style.fontSize =
        "13px";


    fallbackToast.style.fontWeight =
        "600";


    fallbackToast.style.boxShadow =
        "0 10px 30px rgba(0,0,0,.18)";


    document.body.appendChild(
        fallbackToast
    );


    setTimeout(
        () => {

            fallbackToast.remove();

        },
        2200
    );

}


// ============================================================
// GET PAYMENT DATA
// ============================================================

function getPaymentData() {

    const possibleKeys = [

        "eventra_payment_data",

        "eventra_payment",

        "payment_data",

        "eventra_booking_data",

        "eventra_booking",

        "booking_data",

        "eventra_success_data"

    ];


    for (
        const key of possibleKeys
    ) {

        const sessionValue =
            sessionStorage.getItem(
                key
            );


        if (sessionValue) {

            try {

                return JSON.parse(
                    sessionValue
                );

            } catch (error) {

                console.warn(
                    `Could not parse ${key}`,
                    error
                );

            }

        }


        const localValue =
            localStorage.getItem(
                key
            );


        if (localValue) {

            try {

                return JSON.parse(
                    localValue
                );

            } catch (error) {

                console.warn(
                    `Could not parse ${key}`,
                    error
                );

            }

        }

    }


    return null;

}


// ============================================================
// FIND TICKET ID
// ============================================================

function getTicketId() {

    /*
        First check URL.
    */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const urlTicketId =

        params.get(
            "ticket_id"
        ) ||

        params.get(
            "ticketId"
        ) ||

        params.get(
            "ticket"
        );


    if (urlTicketId) {

        return urlTicketId;

    }


    /*
        Check common storage keys.
    */

    const storageKeys = [

        "eventra_ticket_id",

        "eventra_selected_ticket_id",

        "ticket_id",

        "ticketId"

    ];


    for (
        const key of storageKeys
    ) {

        const sessionValue =
            sessionStorage.getItem(
                key
            );


        if (sessionValue) {

            return sessionValue;

        }


        const localValue =
            localStorage.getItem(
                key
            );


        if (localValue) {

            return localValue;

        }

    }


    /*
        Look inside payment / booking data.
    */

    const paymentData =
        getPaymentData();


    if (paymentData) {

        const possibleTicketId =

            paymentData.ticket_id ||

            paymentData.ticketId ||

            paymentData.ticket?.id ||

            paymentData.data?.ticket_id ||

            paymentData.data?.ticketId ||

            paymentData.data?.ticket?.id ||

            paymentData.booking?.ticket_id ||

            paymentData.booking?.tickets?.[0]?.id ||

            paymentData.data?.booking?.tickets?.[0]?.id;


        if (
            possibleTicketId
        ) {

            return possibleTicketId;

        }

    }


    return "";

}


// ============================================================
// FIND BOOKING ID
// ============================================================

function getBookingId() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return (

        params.get(
            "booking_id"
        ) ||

        params.get(
            "bookingId"
        ) ||

        sessionStorage.getItem(
            "eventra_booking_id"
        ) ||

        localStorage.getItem(
            "eventra_booking_id"
        ) ||

        ""

    );

}


// ============================================================
// SAVE TICKET DATA
// ============================================================

function preserveTicketData() {

    const paymentData =
        getPaymentData();


    const ticketId =
        getTicketId();


    const bookingId =
        getBookingId();


    /*
        Preserve ticket ID.
    */

    if (ticketId) {

        sessionStorage.setItem(
            "eventra_ticket_id",
            ticketId
        );


        localStorage.setItem(
            "eventra_ticket_id",
            ticketId
        );


        sessionStorage.setItem(
            "eventra_selected_ticket_id",
            ticketId
        );


        localStorage.setItem(
            "eventra_selected_ticket_id",
            ticketId
        );

    }


    /*
        Preserve booking ID.
    */

    if (bookingId) {

        sessionStorage.setItem(
            "eventra_booking_id",
            bookingId
        );


        localStorage.setItem(
            "eventra_booking_id",
            bookingId
        );

    }


    /*
        Preserve complete payment data.
    */

    if (paymentData) {

        try {

            sessionStorage.setItem(
                "eventra_payment_data",
                JSON.stringify(
                    paymentData
                )
            );

        } catch (error) {

            console.warn(
                "Could not preserve payment data.",
                error
            );

        }

    }


    return {

        ticketId,

        bookingId,

        paymentData

    };

}


// ============================================================
// BUILD DIGITAL TICKET URL
// ============================================================

function buildDigitalTicketURL() {

    const {

        ticketId,

        bookingId

    } =
        preserveTicketData();


    /*
        Start with the correct relative
        folder path.

        IMPORTANT:
        The folder contains a space:

        16_Digital Ticket

        Therefore it must be encoded.
    */

    const url =
        new URL(
            ROUTES.digitalTicket,
            window.location.href
        );


    /*
        If we have a ticket ID, pass it
        directly to Screen 16.
    */

    if (ticketId) {

        url.searchParams.set(
            "ticket_id",
            ticketId
        );

    }


    /*
        Preserve booking ID too.
    */

    if (bookingId) {

        url.searchParams.set(
            "booking_id",
            bookingId
        );

    }


    return url.href;

}


// ============================================================
// OPEN DIGITAL TICKET
// ============================================================

function openDigitalTicket() {

    /*
        Prevent duplicate clicks.
    */

    if (
        viewDigitalPassButton
    ) {

        viewDigitalPassButton.disabled =
            true;

    }


    /*
        Preserve ticket/payment information
        before leaving this page.
    */

    preserveTicketData();


    /*
        Show feedback.
    */

    showToast(
        "Opening your full digital pass..."
    );


    /*
        Build the correct URL.
    */

    const digitalTicketURL =
        buildDigitalTicketURL();


    console.log(
        "Eventra Digital Ticket URL:",
        digitalTicketURL
    );


    /*
        Navigate after a very short delay
        so the user sees the feedback.
    */

    setTimeout(
        () => {

            window.location.assign(
                digitalTicketURL
            );

        },
        250
    );

}


// ============================================================
// VIEW DIGITAL PASS BUTTON
// ============================================================

function setupViewDigitalPassButton() {

    /*
        Preferred method:
        button has id="viewDigitalPassButton"
    */

    if (
        viewDigitalPassButton
    ) {

        viewDigitalPassButton.addEventListener(
            "click",
            openDigitalTicket
        );

    }


    /*
        Safety fallback:
        Find the button by its visible text.

        This means the navigation will still work
        even if the current HTML doesn't have
        the expected ID.
    */

    const allButtons =
        document.querySelectorAll(
            "button, a"
        );


    allButtons.forEach(
        element => {

            const text =
                element.textContent
                    ?.trim()
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .toLowerCase();


            if (
                text ===
                    "view full digital pass" ||

                text.includes(
                    "view full digital pass"
                )
            ) {

                /*
                    Don't attach twice if it is
                    already the main button.
                */

                if (
                    element !==
                    viewDigitalPassButton
                ) {

                    element.addEventListener(
                        "click",
                        function (event) {

                            event.preventDefault();

                            openDigitalTicket();

                        }
                    );

                }

            }

        }
    );

}


// ============================================================
// RECEIPT PDF
// ============================================================

function setupReceiptPDF() {

    const button =
        document.getElementById(
            "receiptPDFButton"
        ) ||

        document.getElementById(
            "receiptPdfButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            showToast(
                "Opening receipt for PDF export..."
            );


            setTimeout(
                () => {

                    window.print();

                },
                500
            );

        }
    );

}


// ============================================================
// SAVE TO WALLET
// ============================================================

function setupWalletButton() {

    const button =
        document.getElementById(
            "saveWalletButton"
        ) ||

        document.getElementById(
            "walletButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            const data =
                preserveTicketData();


            const walletData = {

                type:
                    "eventra_digital_ticket",

                ticket_id:
                    data.ticketId,

                booking_id:
                    data.bookingId,

                event:
                    "Tech Conference 2026",

                status:
                    "paid"

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
                "eventra-ticket-wallet.json";


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
    );

}


// ============================================================
// ADD TO CALENDAR
// ============================================================

function setupCalendarButton() {

    const button =
        document.getElementById(
            "addCalendarButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        function () {

            this.textContent =
                "✓ Added";


            this.classList.remove(
                "bg-[#EEE9FF]",
                "text-[#6230F5]"
            );


            this.classList.add(
                "bg-[#E8F8EF]",
                "text-[#16834B]"
            );


            showToast(
                "Event added to your calendar."
            );

        }
    );

}


// ============================================================
// SHARE
// ============================================================

function setupShareButton() {

    const button =
        document.getElementById(
            "shareButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        async () => {

            const shareData = {

                title:
                    "Eventra Payment Successful",

                text:
                    "My Tech Conference 2026 ticket payment was successful.",

                url:
                    window.location.href

            };


            if (
                navigator.share
            ) {

                try {

                    await navigator.share(
                        shareData
                    );

                } catch (error) {

                    if (
                        error.name !==
                        "AbortError"
                    ) {

                        console.error(
                            error
                        );

                    }

                }


                return;

            }


            try {

                await navigator.clipboard.writeText(
                    window.location.href
                );


                showToast(
                    "Payment page link copied."
                );


            } catch (error) {

                showToast(
                    "Sharing is not supported on this device."
                );

            }

        }
    );

}


// ============================================================
// MORE LAGOS EVENTS
// ============================================================

function setupMoreEventsButton() {

    const button =
        document.getElementById(
            "moreEventsButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            window.location.href =
                "../10_Discover%20Event/index.html";

        }
    );

}


// ============================================================
// HOME
// ============================================================

function setupHomeButton() {

    const button =
        document.getElementById(
            "homeButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            window.location.href =
                ROUTES.home;

        }
    );

}


// ============================================================
// KEYBOARD ACCESS
// ============================================================

function setupKeyboardAccess() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                const active =
                    document.activeElement;


                if (
                    active &&
                    (
                        active.id ===
                            "viewDigitalPassButton" ||

                        active.textContent
                            ?.toLowerCase()
                            .includes(
                                "view full digital pass"
                            )
                    )
                ) {

                    openDigitalTicket();

                }

            }

        }
    );

}


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Eventra Screen 15 initialized."
        );


        console.log(
            "Current URL:",
            window.location.href
        );


        console.log(
            "Digital Ticket route:",
            ROUTES.digitalTicket
        );


        /*
            Preserve whatever ticket/booking
            information is currently available.
        */

        preserveTicketData();


        /*
            Setup all interactions.
        */

        setupViewDigitalPassButton();

        setupReceiptPDF();

        setupWalletButton();

        setupCalendarButton();

        setupShareButton();

        setupMoreEventsButton();

        setupHomeButton();

        setupKeyboardAccess();

    }
);