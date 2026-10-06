/* ============================================================
   EVENTRA
   SCREEN 12
   EVENT CHECKOUT & ORDER SUMMARY
============================================================ */


/* ============================================================
   CONFIG
============================================================ */

const TICKET_PRICE = 15000;
const SERVICE_FEE_RATE = 0.10;
const VAT_RATE = 0.075;

let quantity = 1;

let attendingPersonally = true;


/* ============================================================
   ELEMENTS
============================================================ */

const quantityElement =
    document.getElementById("quantity");

const breakdownQuantityElement =
    document.getElementById("breakdownQuantity");

const ticketPriceElement =
    document.getElementById("ticketPrice");

const subtotalElement =
    document.getElementById("subtotal");

const serviceFeeElement =
    document.getElementById("serviceFee");

const vatElement =
    document.getElementById("vat");

const totalDueElement =
    document.getElementById("totalDue");

const footerTotalElement =
    document.getElementById("footerTotal");

const minusButton =
    document.getElementById("minusButton");

const plusButton =
    document.getElementById("plusButton");

const backButton =
    document.getElementById("backButton");

const proceedButton =
    document.getElementById("proceedButton");

const attendingToggle =
    document.getElementById("attendingToggle");

const attendingCheckboxVisual =
    document.getElementById(
        "attendingCheckboxVisual"
    );

const applyPromoButton =
    document.getElementById("applyPromo");

const promoInput =
    document.getElementById("promoInput");

const promoMessage =
    document.getElementById("promoMessage");

const timerElement =
    document.getElementById("timer");


/* ============================================================
   FORMAT CURRENCY
============================================================ */

function formatCurrency(amount) {

    return "₦" +
        Math.round(amount)
            .toLocaleString("en-NG");

}


/* ============================================================
   CALCULATE TOTAL
============================================================ */

function calculateTotal() {

    const subtotal =
        TICKET_PRICE * quantity;

    const serviceFee =
        subtotal * SERVICE_FEE_RATE;

    const vat =
        subtotal * VAT_RATE;

    const total =
        subtotal +
        serviceFee +
        vat;

    return {
        subtotal,
        serviceFee,
        vat,
        total
    };

}


/* ============================================================
   UPDATE ORDER
============================================================ */

function updateOrderSummary() {

    const totals =
        calculateTotal();


    quantityElement.textContent =
        quantity;


    breakdownQuantityElement.textContent =
        quantity;


    ticketPriceElement.textContent =
        formatCurrency(
            TICKET_PRICE * quantity
        );


    subtotalElement.textContent =
        formatCurrency(
            totals.subtotal
        );


    serviceFeeElement.textContent =
        formatCurrency(
            totals.serviceFee
        );


    vatElement.textContent =
        formatCurrency(
            totals.vat
        );


    totalDueElement.textContent =
        formatCurrency(
            totals.total
        );


    footerTotalElement.textContent =
        formatCurrency(
            totals.total
        );

}


/* ============================================================
   PLUS
============================================================ */

plusButton.addEventListener(
    "click",
    function () {

        if (quantity < 10) {

            quantity++;

            updateOrderSummary();

        }

    }
);


/* ============================================================
   MINUS
============================================================ */

minusButton.addEventListener(
    "click",
    function () {

        if (quantity > 1) {

            quantity--;

            updateOrderSummary();

        }

    }
);


/* ============================================================
   ATTENDING CHECKBOX
   FULLY CONTROLLED BY JAVASCRIPT
============================================================ */

function updateAttendingCheckbox() {

    if (attendingPersonally) {

        attendingCheckboxVisual
            .classList
            .add("checked");

        attendingToggle
            .setAttribute(
                "aria-checked",
                "true"
            );

    } else {

        attendingCheckboxVisual
            .classList
            .remove("checked");

        attendingToggle
            .setAttribute(
                "aria-checked",
                "false"
            );

    }

}


/*
    Clicking the checkbox OR the text
    will toggle the state.
*/

attendingToggle.addEventListener(
    "click",
    function () {

        attendingPersonally =
            !attendingPersonally;

        updateAttendingCheckbox();

        console.log(
            "Attending personally:",
            attendingPersonally
        );

    }
);


/*
    Keyboard support.
    Space or Enter also toggles it.
*/

attendingToggle.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === " " ||
            event.key === "Enter"
        ) {

            event.preventDefault();

            attendingPersonally =
                !attendingPersonally;

            updateAttendingCheckbox();

        }

    }
);


/* ============================================================
   PROMO CODE
============================================================ */

applyPromoButton.addEventListener(
    "click",
    function () {

        const code =
            promoInput.value
                .trim()
                .toUpperCase();


        promoMessage.classList.remove(
            "hidden"
        );


        if (code === "TECHFEST26") {

            promoMessage.textContent =
                "Promo code applied successfully.";

            promoMessage.className =
                "mt-2 text-[12px] text-green-600 font-medium";

        } else {

            promoMessage.textContent =
                code
                    ? "Invalid promo code."
                    : "Please enter a promo code.";

            promoMessage.className =
                "mt-2 text-[12px] text-red-500 font-medium";

        }

    }
);


/* ============================================================
   BACK BUTTON
============================================================ */

backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "../11_Event Details/index.html";

    }
);


/* ============================================================
   PROCEED TO PAYMENT
============================================================ */

proceedButton.addEventListener(
    "click",
    function () {

        const totals =
            calculateTotal();


        const order = {

            quantity: quantity,

            ticket_type:
                "Regular Pass",

            ticket_price:
                TICKET_PRICE,

            subtotal:
                totals.subtotal,

            service_fee:
                totals.serviceFee,

            vat:
                totals.vat,

            total:
                totals.total,

            attending_personally:
                attendingPersonally,

            attendee: {

                full_name:
                    "John Doe",

                email:
                    "john@example.com",

                phone:
                    "+234 801 234 5678"

            }

        };


        sessionStorage.setItem(
            "eventra_checkout",
            JSON.stringify(order)
        );


        window.location.href =
            "../13_Event Payment Method/index.html";

    }
);


/* ============================================================
   RESERVATION TIMER
============================================================ */

let remainingSeconds =
    9 * 60 + 19;


function updateTimer() {

    if (remainingSeconds <= 0) {

        timerElement.textContent =
            "00:00";

        return;

    }


    const minutes =
        Math.floor(
            remainingSeconds / 60
        );


    const seconds =
        remainingSeconds % 60;


    timerElement.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");


    remainingSeconds--;

}


setInterval(
    updateTimer,
    1000
);


/* ============================================================
   INITIALIZE
============================================================ */

updateOrderSummary();

updateAttendingCheckbox();