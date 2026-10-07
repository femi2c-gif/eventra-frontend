// ============================================================
// EVENTRA
// SCREEN 11 - EVENT DETAILS
// TICKET FIX V3 — uses TicketTypes embedded in GET /events/:id; no /ticket-types request
// ============================================================

const API_BASE_URL = "https://eventra-backend-aidf.onrender.com/api";

const ROUTES = {
  home: "../05_Home/index.html",
  discover: "../10_Discover Event/index.html",
  checkout: "../12_Event Checkout Order Summary/index.html"
};

const defaultEvent = {
  id: "",
  title: "Tech Conference 2026",
  description: "A premier gathering for innovators, engineering leaders, founders, and changemakers across Nigeria and the wider African digital frontier.",
  image: "./Event Visual.png",
  venue: "Landmark Centre",
  address: "Water Corporation Drive, Victoria Island, Lagos",
  distance: "1.4 km from Lekki-Epe Expressway",
  date: "Saturday, Oct 12, 2026",
  time: "10:00 AM - 6:00 PM WAT",
  price: 15000,
  category: "Tech & Innovation"
};

let currentEvent = { ...defaultEvent };
let ticketTypes = {
  regular: { key: "regular", id: "", name: "Regular Pass", price: 15000, available: 10 },
  vip: { key: "vip", id: "", name: "VIP All-Access", price: 40000, available: 10 },
  vvip: { key: "vvip", id: "", name: "Executive VVIP", price: 75000, available: 10 }
};

// Each pass can be selected independently. A quantity of 0 means it is unselected.
let selectedTickets = {
  regular: 1,
  vip: 0,
  vvip: 0
};

let isFavourite = false;

const eventTitle = document.getElementById("eventTitle");
const eventDescription = document.getElementById("eventDescription");
const eventHeroImage = document.getElementById("eventHeroImage");
const favouriteButton = document.getElementById("favouriteButton");
const favouriteIcon = document.getElementById("favouriteIcon");
const quantityValue = document.getElementById("quantityValue");
const mobileQuantity = document.getElementById("mobileQuantity");
const mobileTotal = document.getElementById("mobileTotal");
const desktopTotal = document.getElementById("desktopTotal");

function formatMoney(amount) {
  return Number(amount || 0).toLocaleString("en-NG");
}

function getEventId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || sessionStorage.getItem("eventra_selected_event_id") || "";
}

function extractEventList(result) {
  const candidates = [
    result?.events,
    result?.data?.events,
    result?.data?.data,
    result?.data,
    result?.results
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

async function resolveEventIdWithoutRouteParam() {
  const response = await fetch(`${API_BASE_URL}/events?page=1&limit=50`, {
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`Event list request failed: ${response.status}`);
  }

  const result = await response.json();
  const events = extractEventList(result);
  if (!events.length) throw new Error("No events were returned by the backend");

  const preferred = events.find(event =>
    String(event?.title || event?.name || "").toLowerCase().includes("tech conference")
  );
  const selected = preferred || events[0];
  const id = selected?.id || selected?._id;

  if (!id) throw new Error("The backend event list did not contain an event ID");

  sessionStorage.setItem("eventra_selected_event_id", String(id));
  return String(id);
}

function normalizeEvent(event) {
  return {
    id: event?.id || event?._id || "",
    title: event?.title || event?.name || defaultEvent.title,
    description: event?.description || defaultEvent.description,
    image: event?.image || event?.image_url || event?.cover_image || defaultEvent.image,
    venue: event?.venue || event?.venue_name || defaultEvent.venue,
    address: event?.address || event?.venue_address || defaultEvent.address,
    distance: event?.distance || defaultEvent.distance,
    date: event?.date || event?.event_date || defaultEvent.date,
    time: event?.time || event?.event_time || defaultEvent.time,
    price: Number(event?.price || event?.ticket_price || event?.starting_price || defaultEvent.price),
    category: event?.category || defaultEvent.category
  };
}

function normalizeTicketType(raw, key, fallback) {
  const id = raw?.id || raw?._id || raw?.ticket_type_id || "";
  const name = raw?.name || raw?.title || fallback.name;
  const price = Number(raw?.price ?? fallback.price);
  const availableRaw = raw?.available ?? raw?.quantity ?? 10;
  const available = Number.isFinite(Number(availableRaw)) ? Math.max(0, Number(availableRaw)) : 10;
  return { key, id, name, price, available };
}

function matchTicketType(types, key) {
  const names = types.map(type => ({
    raw: type,
    text: String(type?.name || type?.title || "").toLowerCase()
  }));

  if (key === "vvip") {
    return names.find(item => /vvip|executive|premium/.test(item.text))?.raw;
  }
  if (key === "vip") {
    return names.find(item => /\bvip\b|all-access/.test(item.text) && !/vvip/.test(item.text))?.raw;
  }
  return names.find(item => /regular|general|standard/.test(item.text))?.raw;
}

function extractTicketTypes(result) {
  // The Event Details endpoint returns ticket types embedded in the event.
  // The backend uses the capitalized `TicketTypes` key in the current response.
  const candidates = [
    result?.TicketTypes,
    result?.ticketTypes,
    result?.ticket_types,
    result?.data?.TicketTypes,
    result?.data?.ticketTypes,
    result?.data?.ticket_types,
    result?.data?.event?.TicketTypes,
    result?.data?.event?.ticketTypes,
    result?.data?.event?.ticket_types,
    result?.event?.TicketTypes,
    result?.event?.ticketTypes,
    result?.event?.ticket_types
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  if (Array.isArray(result?.data)) return result.data;
  return [];
}

function hydrateTicketTypes(types) {
  if (!Array.isArray(types) || !types.length) return false;

  ["regular", "vip", "vvip"].forEach(key => {
    const matched = matchTicketType(types, key);
    if (matched) {
      ticketTypes[key] = normalizeTicketType(matched, key, ticketTypes[key]);
    }
  });

  // If names do not match our labels but the API returns exactly three
  // ticket types, preserve API order as a fallback.
  if (types.length === 3) {
    ["regular", "vip", "vvip"].forEach((key, index) => {
      if (!ticketTypes[key].id) {
        ticketTypes[key] = normalizeTicketType(types[index], key, ticketTypes[key]);
      }
    });
  }

  Object.values(ticketTypes).forEach(ticket => {
    if (ticket.id) {
      sessionStorage.setItem(`eventra_ticket_type_id_${ticket.key}`, String(ticket.id));
    }
    sessionStorage.setItem(`eventra_ticket_type_name_${ticket.key}`, ticket.name);
    sessionStorage.setItem(`eventra_ticket_price_${ticket.key}`, String(ticket.price));
  });

  return Object.values(ticketTypes).some(ticket => Boolean(ticket.id));
}

async function loadTicketTypes(eventId, eventPayload) {
  // IMPORTANT: /events/:eventId/ticket-types does not exist on the current
  // backend. Ticket types are already included in GET /events/:eventId.
  const types = extractTicketTypes(eventPayload);
  const loaded = hydrateTicketTypes(types);

  if (!loaded) {
    console.warn("No usable ticket type IDs were found in the event response.", eventPayload);
  }

  return loaded;
}

function totalSelectedQuantity() {
  return Object.values(selectedTickets).reduce((sum, value) => sum + value, 0);
}

function selectedSubtotal() {
  return Object.entries(selectedTickets).reduce((sum, [key, qty]) => {
    return sum + (ticketTypes[key].price * qty);
  }, 0);
}

function updateCardState(key) {
  const card = document.querySelector(`[data-ticket-card="${key}"]`);
  if (!card) return;

  const selected = selectedTickets[key] > 0;
  card.classList.add("border-2");
  card.style.borderColor = selected ? "#6230F5" : "#E7EBF3";
}

function updateTicketUI() {
  const regularQty = document.getElementById("quantityValue");
  const vipQty = document.getElementById("vipQuantity");
  const vvipQty = document.getElementById("vvipQuantity");

  if (regularQty) regularQty.textContent = selectedTickets.regular;
  if (vipQty) vipQty.textContent = selectedTickets.vip;
  if (vvipQty) vvipQty.textContent = selectedTickets.vvip;

  const total = selectedSubtotal();
  if (mobileQuantity) mobileQuantity.textContent = totalSelectedQuantity();
  if (mobileTotal) mobileTotal.textContent = formatMoney(total);
  if (desktopTotal) desktopTotal.textContent = formatMoney(total);

  ["regular", "vip", "vvip"].forEach(updateCardState);

  const prices = {
    regularPrice: ticketTypes.regular.price,
    vipPrice: ticketTypes.vip.price,
    vvipPrice: ticketTypes.vvip.price
  };
  Object.entries(prices).forEach(([id, price]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = `₦${formatMoney(price)}`;
  });

  const mobileGetTickets = document.getElementById("mobileGetTickets");
  const desktopGetTickets = document.getElementById("desktopGetTickets");
  [mobileGetTickets, desktopGetTickets].forEach(button => {
    if (!button) return;
    const disabled = totalSelectedQuantity() === 0;
    button.disabled = disabled;
    button.classList.toggle("opacity-50", disabled);
    button.classList.toggle("cursor-not-allowed", disabled);
  });
}

function setTicketQuantity(key, nextQuantity) {
  const ticket = ticketTypes[key];
  const available = Number(ticket.available);
  const max = Number.isFinite(available) ? Math.min(10, Math.max(0, available)) : 10;
  selectedTickets[key] = Math.max(0, Math.min(max, Number(nextQuantity)));
  updateTicketUI();
}

document.addEventListener("click", event => {
  const button = event.target.closest("[data-ticket-action]");
  if (!button) return;

  const key = button.dataset.ticketKey;
  const action = button.dataset.ticketAction;
  if (!selectedTickets.hasOwnProperty(key)) return;

  if (action === "increase") setTicketQuantity(key, selectedTickets[key] + 1);
  if (action === "decrease") setTicketQuantity(key, selectedTickets[key] - 1);
});

// Keep the existing regular +/- buttons working.
const increaseQuantity = document.getElementById("increaseQuantity");
const decreaseQuantity = document.getElementById("decreaseQuantity");
if (increaseQuantity) increaseQuantity.dataset.ticketAction = "increase";
if (increaseQuantity) increaseQuantity.dataset.ticketKey = "regular";
if (decreaseQuantity) decreaseQuantity.dataset.ticketAction = "decrease";
if (decreaseQuantity) decreaseQuantity.dataset.ticketKey = "regular";

function renderEvent() {
  if (eventTitle) eventTitle.textContent = currentEvent.title;
  if (eventDescription) eventDescription.textContent = currentEvent.description;

  if (eventHeroImage) {
    eventHeroImage.src = currentEvent.image;
    eventHeroImage.onerror = function () { this.src = "./Event Visual.png"; };
  }

  isFavourite = localStorage.getItem(`eventra_favourite_${currentEvent.id}`) === "true";
  updateTicketUI();
  updateFavourite();
}

async function loadEvent() {
  console.log("[Eventra] Screen 11 Ticket Fix V4 loaded");
  let eventId = getEventId();
  let ticketTypesLoaded = false;

  try {
    // Never call the event-details endpoint with the old demo slug.
    // If the page is opened directly, resolve a real backend event ID first.
    if (!eventId) {
      eventId = await resolveEventIdWithoutRouteParam();
    }

    const response = await fetch(`${API_BASE_URL}/events/${encodeURIComponent(eventId)}`, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error(`Event request failed: ${response.status}`);

    const result = await response.json();
    const raw = result?.data?.event || result?.data || result?.event || result;
    currentEvent = normalizeEvent(raw || defaultEvent);

    // Keep the real backend event ID even if other event fields are missing.
    currentEvent.id = raw?.id || raw?._id || eventId;

    // Use the ticket types embedded in this event response. Do NOT call
    // /events/:eventId/ticket-types because that route is not implemented.
    ticketTypesLoaded = await loadTicketTypes(currentEvent.id, raw);
  } catch (error) {
    console.error("Event details could not be loaded:", error);
    currentEvent = { ...defaultEvent };
  }

  renderEvent();

  const message = document.getElementById("ticketSelectionMessage");
  if (message) {
    message.textContent = ticketTypesLoaded
      ? ""
      : "Ticket options are still loading. Please wait a moment and try again.";
    message.style.display = ticketTypesLoaded ? "none" : "block";
  }
}

if (favouriteButton) {
  favouriteButton.addEventListener("click", function () {
    isFavourite = !isFavourite;
    localStorage.setItem(`eventra_favourite_${currentEvent.id}`, String(isFavourite));
    updateFavourite();
  });
}

function updateFavourite() {
  if (!favouriteIcon) return;
  favouriteIcon.setAttribute("fill", isFavourite ? "#6230F5" : "none");
  favouriteIcon.setAttribute("stroke", isFavourite ? "#6230F5" : "currentColor");
}

const addCalendarButton = document.getElementById("addCalendarButton");
if (addCalendarButton) {
  addCalendarButton.addEventListener("click", function () {
    this.textContent = "✓ Added";
    this.classList.remove("bg-[#EEE9FF]", "text-[#6230F5]");
    this.classList.add("bg-[#E8F8EF]", "text-[#16834B]");
  });
}

const directionsButton = document.getElementById("directionsButton");
if (directionsButton) {
  directionsButton.addEventListener("click", function () {
    const destination = encodeURIComponent(`${currentEvent.venue}, ${currentEvent.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${destination}`, "_blank");
  });
}

const tabButtons = document.querySelectorAll(".tab-button");
tabButtons.forEach(button => {
  button.addEventListener("click", function () {
    tabButtons.forEach(tab => {
      tab.classList.remove("bg-[#6230F5]", "text-white", "font-semibold");
      tab.classList.add("bg-white", "text-[#596174]", "font-medium");
    });
    this.classList.remove("bg-white", "text-[#596174]", "font-medium");
    this.classList.add("bg-[#6230F5]", "text-white", "font-semibold");

    const tab = this.dataset.tab;
    const target = tab === "about" ? "aboutSection" : tab === "speakers" ? "speakersSection" : tab === "passes" ? "passesSection" : null;
    if (target) document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (tab === "venue") window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

function buildCheckoutItems() {
  return Object.entries(selectedTickets)
    .filter(([, quantity]) => quantity > 0)
    .map(([key, quantity]) => ({
      ticket_type_id: ticketTypes[key].id,
      quantity,
      ticket_type_name: ticketTypes[key].name,
      unit_price: ticketTypes[key].price
    }));
}

function showSelectionMessage(message) {
  let element = document.getElementById("ticketSelectionMessage");
  if (!element) {
    element = document.createElement("p");
    element.id = "ticketSelectionMessage";
    element.className = "mt-2 text-center text-[12px] font-medium text-red-500";
    const anchor = document.getElementById("passesSection");
    anchor?.appendChild(element);
  }
  element.textContent = message;
}

function goToCheckout() {
  const items = buildCheckoutItems();
  if (!items.length) {
    showSelectionMessage("Please select at least one ticket before continuing.");
    return;
  }

  const missingId = items.find(item => !item.ticket_type_id);
  if (missingId) {
    showSelectionMessage("Ticket options are still loading. Please wait a moment and try again.");
    return;
  }

  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  sessionStorage.setItem("eventra_checkout_event_id", currentEvent.id);
  sessionStorage.setItem("eventra_checkout_items", JSON.stringify(items));
  sessionStorage.setItem("eventra_checkout_quantity", String(totalSelectedQuantity()));
  sessionStorage.setItem("eventra_checkout_total", String(subtotal));
  sessionStorage.setItem("eventra_checkout_event_title", currentEvent.title);
  sessionStorage.setItem("eventra_checkout_ticket_type_name", items.map(item => `${item.ticket_type_name} × ${item.quantity}`).join(", "));
  sessionStorage.setItem("eventra_ticket_price", String(items[0].unit_price));
  sessionStorage.setItem("eventra_ticket_type_id", String(items[0].ticket_type_id));

  window.location.href = ROUTES.checkout;
}

document.getElementById("mobileGetTickets")?.addEventListener("click", goToCheckout);
document.getElementById("desktopGetTickets")?.addEventListener("click", goToCheckout);

document.getElementById("backButton")?.addEventListener("click", function () {
  if (window.history.length > 1) window.history.back();
  else window.location.href = ROUTES.discover;
});

loadEvent();
