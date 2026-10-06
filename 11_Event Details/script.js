// ============================================================
// EVENTRA
// SCREEN 11 - EVENT DETAILS
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
  home:
    "../05_Home/index.html",

  discover:
    "../10_Discover Event/index.html",

  // FIXED:
  // Actual folder:
  // 12_Event Checkout Order Summary
  checkout:
    "../12_Event Checkout Order Summary/index.html"
};


// ============================================================
// DEFAULT EVENT
// ============================================================

const defaultEvent = {
  id:
    "tech-conference-2026",

  title:
    "Tech Conference 2026",

  description:
    "A premier gathering for innovators, engineering leaders, founders, and changemakers across Nigeria and the wider African digital frontier.",

  image:
    "./Event Visual.png",

  venue:
    "Landmark Centre",

  address:
    "Water Corporation Drive, Victoria Island, Lagos",

  distance:
    "1.4 km from Lekki-Epe Expressway",

  date:
    "Saturday, Oct 12, 2026",

  time:
    "10:00 AM - 6:00 PM WAT",

  price:
    15000,

  category:
    "Tech & Innovation"
};


// ============================================================
// STATE
// ============================================================

let currentEvent = {
  ...defaultEvent
};

let quantity = 1;

let isFavourite =
  localStorage.getItem(
    "eventra_favourite_tech-conference-2026"
  ) === "true";


// ============================================================
// ELEMENTS
// ============================================================

const eventTitle =
  document.getElementById(
    "eventTitle"
  );

const eventDescription =
  document.getElementById(
    "eventDescription"
  );

const eventHeroImage =
  document.getElementById(
    "eventHeroImage"
  );

const favouriteButton =
  document.getElementById(
    "favouriteButton"
  );

const favouriteIcon =
  document.getElementById(
    "favouriteIcon"
  );

const quantityValue =
  document.getElementById(
    "quantityValue"
  );

const mobileQuantity =
  document.getElementById(
    "mobileQuantity"
  );

const mobileTotal =
  document.getElementById(
    "mobileTotal"
  );

const desktopTotal =
  document.getElementById(
    "desktopTotal"
  );


// ============================================================
// FORMAT MONEY
// ============================================================

function formatMoney(amount) {
  return Number(amount).toLocaleString(
    "en-NG"
  );
}


// ============================================================
// GET EVENT ID
// ============================================================

function getEventId() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  return (
    params.get("id") ||
    sessionStorage.getItem(
      "eventra_selected_event_id"
    ) ||
    defaultEvent.id
  );
}


// ============================================================
// NORMALIZE EVENT
// ============================================================

function normalizeEvent(event) {
  return {
    id:
      event.id ||
      event._id ||
      defaultEvent.id,

    title:
      event.title ||
      event.name ||
      defaultEvent.title,

    description:
      event.description ||
      defaultEvent.description,

    image:
      event.image ||
      event.image_url ||
      event.cover_image ||
      defaultEvent.image,

    venue:
      event.venue ||
      event.venue_name ||
      defaultEvent.venue,

    address:
      event.address ||
      event.venue_address ||
      defaultEvent.address,

    distance:
      event.distance ||
      defaultEvent.distance,

    date:
      event.date ||
      event.event_date ||
      defaultEvent.date,

    time:
      event.time ||
      event.event_time ||
      defaultEvent.time,

    price:
      Number(
        event.price ||
        event.ticket_price ||
        event.starting_price ||
        defaultEvent.price
      ),

    category:
      event.category ||
      defaultEvent.category
  };
}


// ============================================================
// LOAD EVENT
// ============================================================

async function loadEvent() {
  const eventId =
    getEventId();

  try {
    const response =
      await fetch(
        `${API_BASE_URL}/events`
      );

    if (!response.ok) {
      throw new Error(
        "Could not load events"
      );
    }

    const data =
      await response.json();

    let events = [];

    if (Array.isArray(data)) {
      events = data;

    } else if (
      Array.isArray(data.events)
    ) {
      events = data.events;

    } else if (
      Array.isArray(data.data)
    ) {
      events = data.data;
    }

    const foundEvent =
      events.find(
        event =>
          String(
            event.id ||
            event._id
          ) === String(eventId)
      );

    if (foundEvent) {
      currentEvent =
        normalizeEvent(
          foundEvent
        );
    }

  } catch (error) {
    console.warn(
      "Using local event details.",
      error
    );

    currentEvent = {
      ...defaultEvent
    };
  }

  renderEvent();
}


// ============================================================
// RENDER EVENT
// ============================================================

function renderEvent() {
  if (eventTitle) {
    eventTitle.textContent =
      currentEvent.title;
  }

  if (eventDescription) {
    eventDescription.textContent =
      currentEvent.description;
  }

  if (eventHeroImage) {
    eventHeroImage.src =
      currentEvent.image;

    eventHeroImage.onerror =
      function () {
        this.src =
          "./Event Visual.png";
      };
  }

  updateQuantity();
  updateFavourite();
}


// ============================================================
// UPDATE QUANTITY
// ============================================================

function updateQuantity() {
  if (quantityValue) {
    quantityValue.textContent =
      quantity;
  }

  if (mobileQuantity) {
    mobileQuantity.textContent =
      quantity;
  }

  const total =
    currentEvent.price *
    quantity;

  if (mobileTotal) {
    mobileTotal.textContent =
      formatMoney(total);
  }

  if (desktopTotal) {
    desktopTotal.textContent =
      formatMoney(total);
  }
}


// ============================================================
// INCREASE QUANTITY
// ============================================================

const increaseQuantity =
  document.getElementById(
    "increaseQuantity"
  );

if (increaseQuantity) {
  increaseQuantity.addEventListener(
    "click",
    function () {
      if (quantity < 10) {
        quantity += 1;
        updateQuantity();
      }
    }
  );
}


// ============================================================
// DECREASE QUANTITY
// ============================================================

const decreaseQuantity =
  document.getElementById(
    "decreaseQuantity"
  );

if (decreaseQuantity) {
  decreaseQuantity.addEventListener(
    "click",
    function () {
      if (quantity > 1) {
        quantity -= 1;
        updateQuantity();
      }
    }
  );
}


// ============================================================
// FAVOURITE
// ============================================================

if (favouriteButton) {
  favouriteButton.addEventListener(
    "click",
    function () {
      isFavourite =
        !isFavourite;

      localStorage.setItem(
        `eventra_favourite_${currentEvent.id}`,
        String(isFavourite)
      );

      updateFavourite();
    }
  );
}


// ============================================================
// UPDATE FAVOURITE ICON
// ============================================================

function updateFavourite() {
  if (!favouriteIcon) {
    return;
  }

  if (isFavourite) {
    favouriteIcon.setAttribute(
      "fill",
      "#6230F5"
    );

    favouriteIcon.setAttribute(
      "stroke",
      "#6230F5"
    );

  } else {
    favouriteIcon.setAttribute(
      "fill",
      "none"
    );

    favouriteIcon.setAttribute(
      "stroke",
      "currentColor"
    );
  }
}


// ============================================================
// ADD TO CALENDAR
// ============================================================

const addCalendarButton =
  document.getElementById(
    "addCalendarButton"
  );

if (addCalendarButton) {
  addCalendarButton.addEventListener(
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
    }
  );
}


// ============================================================
// DIRECTIONS
// ============================================================

const directionsButton =
  document.getElementById(
    "directionsButton"
  );

if (directionsButton) {
  directionsButton.addEventListener(
    "click",
    function () {
      const destination =
        encodeURIComponent(
          currentEvent.venue +
          ", " +
          currentEvent.address
        );

      window.open(
        `https://www.google.com/maps/search/?api=1&query=${destination}`,
        "_blank"
      );
    }
  );
}


// ============================================================
// TABS
// ============================================================

const tabButtons =
  document.querySelectorAll(
    ".tab-button"
  );

tabButtons.forEach(
  button => {
    button.addEventListener(
      "click",
      function () {

        tabButtons.forEach(
          tab => {
            tab.classList.remove(
              "bg-[#6230F5]",
              "text-white",
              "font-semibold"
            );

            tab.classList.add(
              "bg-white",
              "text-[#596174]",
              "font-medium"
            );
          }
        );

        this.classList.remove(
          "bg-white",
          "text-[#596174]",
          "font-medium"
        );

        this.classList.add(
          "bg-[#6230F5]",
          "text-white",
          "font-semibold"
        );

        const tab =
          this.dataset.tab;


        // --------------------------
        // ABOUT
        // --------------------------

        if (tab === "about") {
          const aboutSection =
            document.getElementById(
              "aboutSection"
            );

          if (aboutSection) {
            aboutSection.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }
        }


        // --------------------------
        // SPEAKERS
        // --------------------------

        if (tab === "speakers") {
          const speakersSection =
            document.getElementById(
              "speakersSection"
            );

          if (speakersSection) {
            speakersSection.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }
        }


        // --------------------------
        // PASSES
        // --------------------------

        if (tab === "passes") {
          const passesSection =
            document.getElementById(
              "passesSection"
            );

          if (passesSection) {
            passesSection.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }
        }


        // --------------------------
        // VENUE
        // --------------------------

        if (tab === "venue") {
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        }
      }
    );
  }
);


// ============================================================
// GET TICKETS
// ============================================================

function goToCheckout() {

  // Save selected event
  sessionStorage.setItem(
    "eventra_checkout_event_id",
    currentEvent.id
  );

  // Save selected quantity
  sessionStorage.setItem(
    "eventra_checkout_quantity",
    String(quantity)
  );

  // Save total amount
  sessionStorage.setItem(
    "eventra_checkout_total",
    String(
      currentEvent.price *
      quantity
    )
  );

  // ----------------------------------------------------------
  // IMPORTANT FIX
  // ----------------------------------------------------------
  // Actual folder:
  //
  // 12_Event Checkout Order Summary
  //
  // NOT:
  //
  // 12_Event Checkout & Order Summary
  // ----------------------------------------------------------

  window.location.href =
    ROUTES.checkout;
}


// ============================================================
// MOBILE GET TICKETS
// ============================================================

const mobileGetTickets =
  document.getElementById(
    "mobileGetTickets"
  );

if (mobileGetTickets) {
  mobileGetTickets.addEventListener(
    "click",
    goToCheckout
  );
}


// ============================================================
// DESKTOP GET TICKETS
// ============================================================

const desktopGetTickets =
  document.getElementById(
    "desktopGetTickets"
  );

if (desktopGetTickets) {
  desktopGetTickets.addEventListener(
    "click",
    goToCheckout
  );
}


// ============================================================
// BACK BUTTON
// ============================================================

const backButton =
  document.getElementById(
    "backButton"
  );

if (backButton) {
  backButton.addEventListener(
    "click",
    function () {

      if (
        window.history.length > 1
      ) {
        window.history.back();

      } else {
        window.location.href =
          ROUTES.discover;
      }

    }
  );
}


// ============================================================
// INITIALIZE
// ============================================================

loadEvent();