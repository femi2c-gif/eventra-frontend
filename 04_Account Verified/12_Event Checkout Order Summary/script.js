/* ============================================================
   EVENTRA
   SCREEN 12 - EVENT CHECKOUT & ORDER SUMMARY
============================================================ */

const API_BASE_URL = "https://eventra-backend-aidf.onrender.com/api";
/*
 * The current backend booking contract calculates and stores the payable
 * amount from the selected ticket prices. It does not return separate
 * service-fee/VAT fields. Therefore the frontend must not invent additional
 * charges that Paystack will not receive.
 */
const SERVICE_FEE_RATE = 0;
const VAT_RATE = 0;

let attendingPersonally = true;
let reservationSeconds = 9 * 60 + 19;
let selectedItems = [];
let promoCode = "";

const ticketItemsContainer = document.getElementById("ticketItemsContainer");
const subtotalElement = document.getElementById("subtotal");
const serviceFeeElement = document.getElementById("serviceFee");
const vatElement = document.getElementById("vat");
const totalDueElement = document.getElementById("totalDue");
const footerTotalElement = document.getElementById("footerTotal");
const backButton = document.getElementById("backButton");
const proceedButton = document.getElementById("proceedButton");
const attendingToggle = document.getElementById("attendingToggle");
const attendingCheckboxVisual = document.getElementById("attendingCheckboxVisual");
const applyPromoButton = document.getElementById("applyPromo");
const promoInput = document.getElementById("promoInput");
const promoMessage = document.getElementById("promoMessage");
const checkoutMessage = document.getElementById("checkoutMessage");
const timerElement = document.getElementById("timer");

function formatCurrency(amount) {
  return `₦${Math.round(Number(amount) || 0).toLocaleString("en-NG")}`;
}

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem("eventra_user") ||
      sessionStorage.getItem("eventra_user") ||
      "null"
    ) || {};
  } catch (_) {
    return {};
  }
}

function getAuthToken() {
  return (
    localStorage.getItem("eventra_token") ||
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("eventra_token") ||
    sessionStorage.getItem("access_token") ||
    ""
  );
}

function getCheckoutItems() {
  try {
    const raw = sessionStorage.getItem("eventra_checkout_items");
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) return parsed.filter(item => Number(item?.quantity) > 0);
  } catch (_) {}

  // Backward compatibility for an older single-ticket session.
  const eventId = sessionStorage.getItem("eventra_checkout_event_id") || "";
  const ticketTypeId =
    sessionStorage.getItem("eventra_checkout_ticket_type_id") ||
    sessionStorage.getItem("eventra_ticket_type_id") ||
    "";
  const quantity = Number(sessionStorage.getItem("eventra_checkout_quantity") || 0);
  const price = Number(sessionStorage.getItem("eventra_ticket_price") || 0);
  const name = sessionStorage.getItem("eventra_checkout_ticket_type_name") || "Regular Pass";

  if (eventId && ticketTypeId && quantity > 0) {
    return [{
      ticket_type_id: ticketTypeId,
      quantity,
      ticket_type_name: name,
      unit_price: price || 15000
    }];
  }

  return [];
}

function getBaseSubtotal() {
  return selectedItems.reduce((sum, item) => {
    return sum + Number(item.unit_price || item.price || 0) * Number(item.quantity || 0);
  }, 0);
}

function calculateTotals() {
  const subtotal = getBaseSubtotal();
  const serviceFee = subtotal * SERVICE_FEE_RATE;
  const vat = subtotal * VAT_RATE;
  return {
    subtotal,
    serviceFee,
    vat,
    total: subtotal + serviceFee + vat
  };
}

function tierLabel(name, index) {
  const text = String(name || "").toLowerCase();
  if (text.includes("vvip") || text.includes("executive") || text.includes("premium")) return "Tier 3";
  if (text.includes("vip")) return "Tier 2";
  return index === 0 ? "Tier 1" : "Pass";
}

function renderTicketItems() {
  if (!ticketItemsContainer) return;

  if (!selectedItems.length) {
    ticketItemsContainer.innerHTML = `
      <div class="rounded-[12px] bg-[#FFF4F4] border border-[#FFD5D5] p-4 text-[13px] text-[#B42318]">
        No tickets have been selected. Go back to the event and select at least one pass.
      </div>
    `;
    return;
  }

  ticketItemsContainer.innerHTML = selectedItems.map((item, index) => {
    const name = item.ticket_type_name || item.name || "Ticket";
    const quantity = Number(item.quantity || 0);
    const unitPrice = Number(item.unit_price || item.price || 0);
    const lineTotal = unitPrice * quantity;

    return `
      <div class="bg-[#EEF3FF] rounded-[12px] p-4">
        <div class="flex justify-between items-start gap-3">
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-[17px] leading-[22px] font-bold text-[#10213B]">${escapeHtml(name)}</h3>
              <span class="text-[10px] font-semibold bg-[#E4D8FF] text-[#6428FF] rounded-full px-2 py-1">${tierLabel(name, index)}</span>
            </div>
            <p class="text-[12px] leading-[18px] text-[#555E73] mt-1">${quantity} ${quantity === 1 ? "ticket" : "tickets"} × ${formatCurrency(unitPrice)}</p>
          </div>
          <span class="text-[18px] font-bold text-[#10213B] whitespace-nowrap">${formatCurrency(lineTotal)}</span>
        </div>
      </div>
    `;
  }).join("");
}

function updateOrderSummary() {
  const totals = calculateTotals();
  if (subtotalElement) subtotalElement.textContent = formatCurrency(totals.subtotal);
  if (serviceFeeElement) serviceFeeElement.textContent = formatCurrency(totals.serviceFee);
  if (vatElement) vatElement.textContent = formatCurrency(totals.vat);
  if (totalDueElement) totalDueElement.textContent = formatCurrency(totals.total);
  if (footerTotalElement) footerTotalElement.textContent = formatCurrency(totals.total);
}

function updateEventAndAttendeeUI() {
  const title = sessionStorage.getItem("eventra_checkout_event_title") || "Tech Conference 2026";
  const eventTitle = document.getElementById("checkoutEventTitle");
  if (eventTitle) eventTitle.textContent = title;

  const user = getStoredUser();
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.name || "";
  const email = user.email || localStorage.getItem("eventra_email") || "";
  const phone = user.phone || "";

  const nameEl = document.getElementById("attendeeFullName");
  const emailEl = document.getElementById("attendeeEmail");
  const phoneEl = document.getElementById("attendeePhone");
  if (nameEl) nameEl.textContent = fullName || "Attendee";
  if (emailEl) emailEl.textContent = email || "No email provided";
  if (phoneEl) phoneEl.textContent = phone || "No phone number provided";
}

function updateAttendingCheckbox() {
  if (!attendingCheckboxVisual || !attendingToggle) return;
  attendingCheckboxVisual.classList.toggle("checked", attendingPersonally);
  attendingToggle.setAttribute("aria-checked", String(attendingPersonally));
}

function showCheckoutMessage(message) {
  if (!checkoutMessage) return;
  checkoutMessage.textContent = message;
  checkoutMessage.classList.remove("hidden");
}

function clearCheckoutMessage() {
  if (!checkoutMessage) return;
  checkoutMessage.textContent = "";
  checkoutMessage.classList.add("hidden");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

if (attendingToggle) {
  attendingToggle.addEventListener("click", () => {
    attendingPersonally = !attendingPersonally;
    updateAttendingCheckbox();
  });

  attendingToggle.addEventListener("keydown", event => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      attendingPersonally = !attendingPersonally;
      updateAttendingCheckbox();
    }
  });
}

// Promo is optional. It must never block checkout.
if (applyPromoButton) {
  applyPromoButton.addEventListener("click", () => {
    const code = String(promoInput?.value || "").trim().toUpperCase();
    promoCode = code;

    if (!promoMessage) return;
    promoMessage.classList.remove("hidden");

    if (!code) {
      promoMessage.textContent = "Promo code is optional. You can continue without one.";
      promoMessage.className = "mt-2 text-[12px] text-[#5C6374] font-medium";
      return;
    }

    // No promo-code endpoint was supplied by the backend contract yet.
    // Do not change the payable amount on the frontend.
    promoMessage.textContent = "Promo code noted. It will not prevent you from continuing to payment.";
    promoMessage.className = "mt-2 text-[12px] text-[#5C6374] font-medium";
  });
}

if (backButton) {
  backButton.addEventListener("click", () => {
    window.location.href = "../11_Event Details/index.html";
  });
}

if (proceedButton) {
  proceedButton.addEventListener("click", async () => {
    clearCheckoutMessage();

    const token = getAuthToken();
    if (!token) {
      window.location.href = "../09_Sign_In/index.html?return=checkout";
      return;
    }

    const eventId = sessionStorage.getItem("eventra_checkout_event_id") || "";
    const items = selectedItems
      .filter(item => Number(item.quantity) > 0)
      .map(item => ({
        ticket_type_id: item.ticket_type_id,
        quantity: Number(item.quantity)
      }));

    if (!eventId) {
      showCheckoutMessage("Please select an event before continuing.");
      return;
    }

    if (!items.length) {
      showCheckoutMessage("Please select at least one ticket before continuing.");
      return;
    }

    if (items.some(item => !item.ticket_type_id)) {
      showCheckoutMessage("One or more ticket types are missing. Please go back and select the tickets again.");
      return;
    }

    const originalText = proceedButton.textContent.trim();
    proceedButton.disabled = true;
    proceedButton.classList.add("opacity-70", "cursor-wait");
    proceedButton.textContent = "Creating booking...";

    try {
      // Backend contract: POST /api/bookings expects event_id + items[].
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          event_id: eventId,
          items
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.location.href = "../09_Sign_In/index.html?return=checkout";
          return;
        }
        throw new Error(result?.message || "Unable to create your booking.");
      }

      // Backend response currently returns the booking object directly inside data:
      // { status, message, data: { id, user_id, event_id, status, total_price, Tickets: [...] } }
      // Support that shape as well as the older nested { data: { booking, tickets } } shape.
      const data = result?.data || {};
      const booking = data?.booking || result?.booking || data;
      const tickets =
        data?.tickets ||
        data?.Tickets ||
        booking?.tickets ||
        booking?.Tickets ||
        result?.tickets ||
        [];
      const bookingId =
        booking?.id ||
        booking?.booking_id ||
        data?.booking_id ||
        result?.booking_id ||
        "";
      // The booking response is the server-side source of truth for the amount
      // that must be paid. The current backend returns this as `total_price`.
      // Do not fall back to a frontend-calculated fee/VAT amount when the
      // backend has already created the booking.
      const backendTotal = Number(
        booking?.total_price ??
        booking?.final_amount ??
        booking?.total_amount ??
        data?.total_price ??
        result?.data?.total_price ??
        result?.data?.total_amount ??
        result?.data?.final_amount ??
        0
      );

      if (!bookingId) {
        throw new Error("The booking was created but no booking ID was returned.");
      }

      const totals = calculateTotals();
      const payableTotal = backendTotal > 0 ? backendTotal : totals.total;
      const order = {
        event_id: eventId,
        items: selectedItems,
        subtotal: totals.subtotal,
        service_fee: totals.serviceFee,
        vat: totals.vat,
        // This is the exact amount that will be sent to Paystack.
        total: payableTotal,
        attending_personally: attendingPersonally,
        promo_code: promoCode,
        attendee: {
          full_name: [getStoredUser().first_name, getStoredUser().last_name].filter(Boolean).join(" "),
          email: getStoredUser().email || "",
          phone: getStoredUser().phone || ""
        },
        booking_id: bookingId,
        tickets
      };

      sessionStorage.setItem("eventra_checkout", JSON.stringify(order));
      sessionStorage.setItem("eventra_booking_id", String(bookingId));
      sessionStorage.setItem("eventra_booking_data", JSON.stringify(result));
      sessionStorage.setItem("eventra_checkout_total", String(order.total));
      sessionStorage.setItem("eventra_payable_amount", String(order.total));

      if (tickets[0]?.id) {
        sessionStorage.setItem("eventra_selected_ticket_id", String(tickets[0].id));
        sessionStorage.setItem("eventra_ticket_id", String(tickets[0].id));
      }

      window.location.href = "../13_Event Payment Method/index.html";
    } catch (error) {
      console.error("Booking creation error:", error);
      showCheckoutMessage(error.message || "Unable to create your booking. Please try again.");
      proceedButton.disabled = false;
      proceedButton.classList.remove("opacity-70", "cursor-wait");
      proceedButton.textContent = originalText;
    }
  });
}

function updateTimer() {
  if (!timerElement) return;
  if (reservationSeconds <= 0) {
    timerElement.textContent = "00:00";
    return;
  }

  const minutes = Math.floor(reservationSeconds / 60);
  const seconds = reservationSeconds % 60;
  timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  reservationSeconds -= 1;
}

function initialize() {
  selectedItems = getCheckoutItems();
  renderTicketItems();
  updateEventAndAttendeeUI();
  updateOrderSummary();
  updateAttendingCheckbox();
  updateTimer();

  if (!selectedItems.length) {
    showCheckoutMessage("No tickets are selected. Go back to the event and choose a pass.");
  }
}

setInterval(updateTimer, 1000);
initialize();
