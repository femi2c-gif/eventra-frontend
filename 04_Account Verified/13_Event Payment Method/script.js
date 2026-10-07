document.addEventListener("DOMContentLoaded", () => {

  const API_BASE_URL = "https://eventra-backend-aidf.onrender.com/api";

  // Paystack returns the customer to the callback URL configured by the backend.
  // If that callback points back to Screen 13, immediately hand the reference
  // to the real payment-processing screen instead of showing the payment method UI again.
  const returnedParams = new URLSearchParams(window.location.search);
  const returnedReference =
    returnedParams.get("reference") ||
    returnedParams.get("trxref") ||
    "";

  if (returnedReference) {
    sessionStorage.setItem("eventra_payment_reference", returnedReference);
    localStorage.setItem("eventra_payment_reference", returnedReference);

    const processingUrl =
      `../14_Payment%20Processing/index.html?reference=${encodeURIComponent(returnedReference)}`;

    window.location.replace(processingUrl);
    return;
  }

  // ============================================================
  // ELEMENTS
  // ============================================================

  const timer =
    document.getElementById("reservationTimer");

  const backButton =
    document.getElementById("backButton");

  const payButton =
    document.getElementById("payButton");

  const toast =
    document.getElementById("toast");

  const saveCard =
    document.getElementById("saveCard");

  const saveCheckbox =
    document.getElementById("saveCheckbox");

  const cvv =
    document.getElementById("cvv");

  const cvvToggle =
    document.getElementById("cvvToggle");

  const cardNumber =
    document.getElementById("cardNumber");

  const expiryDate =
    document.getElementById("expiryDate");


  const cardDetails = document.querySelector(".card-details");
  if (cardDetails) {
    cardDetails.innerHTML = `<div style="padding:16px;border-radius:12px;background:#F1F5FF;color:#566078;font-size:14px;line-height:1.5">Your card details will be entered securely on Paystack. Eventra does not collect or store your card number, expiry date or CVV.</div>`;
  }

  const methods = [
    ...document.querySelectorAll(
      ".payment-method"
    )
  ];


  // ============================================================
  // TOAST
  // ============================================================

  let toastTimeout;


  function showToast(message) {

    clearTimeout(toastTimeout);


    if (!toast) {
      return;
    }


    toast.textContent =
      message;


    toast.classList.remove(
      "opacity-0",
      "translate-y-3"
    );


    toast.classList.add(
      "opacity-100",
      "translate-y-0"
    );


    toastTimeout =
      setTimeout(() => {

        toast.classList.remove(
          "opacity-100",
          "translate-y-0"
        );


        toast.classList.add(
          "opacity-0",
          "translate-y-3"
        );

      }, 1800);

  }


  // ============================================================
  // PAYMENT METHOD SELECTION
  // ============================================================

  function setMethod(methodElement) {

    if (!methodElement) {
      return;
    }


    methods.forEach((method) => {

      const selected =
        method === methodElement;


      const check =
        method.querySelector(
          ".method-check"
        );


      const checkIcon =
        check?.querySelector("svg");


      const cardDetails =
        method.querySelector(
          ".card-details"
        );


      method.setAttribute(
        "aria-selected",
        String(selected)
      );


      // --------------------------------------------------------
      // SELECTED
      // --------------------------------------------------------

      if (selected) {

        method.classList.remove(
          "border-transparent"
        );


        method.classList.add(
          "border-eventra",
          "shadow-[0_4px_13px_rgba(97,40,255,0.07)]"
        );


        if (check) {

          check.classList.remove(
            "bg-inactive"
          );


          check.classList.add(
            "bg-eventra"
          );


          check.setAttribute(
            "aria-pressed",
            "true"
          );

        }


        if (checkIcon) {

          checkIcon.classList.remove(
            "opacity-0"
          );


          checkIcon.classList.add(
            "opacity-100"
          );

        }


        if (cardDetails) {

          cardDetails.classList.remove(
            "hidden"
          );


          cardDetails.classList.add(
            "block"
          );

        }

      }


      // --------------------------------------------------------
      // NOT SELECTED
      // --------------------------------------------------------

      else {

        method.classList.remove(
          "border-eventra",
          "shadow-[0_4px_13px_rgba(97,40,255,0.07)]"
        );


        method.classList.add(
          "border-transparent"
        );


        if (check) {

          check.classList.remove(
            "bg-eventra"
          );


          check.classList.add(
            "bg-inactive"
          );


          check.setAttribute(
            "aria-pressed",
            "false"
          );

        }


        if (checkIcon) {

          checkIcon.classList.remove(
            "opacity-100"
          );


          checkIcon.classList.add(
            "opacity-0"
          );

        }


        if (cardDetails) {

          cardDetails.classList.remove(
            "block"
          );


          cardDetails.classList.add(
            "hidden"
          );

        }

      }

    });

  }


  // ============================================================
  // PAYMENT METHOD CLICK
  // ============================================================

  methods.forEach((method) => {

    const check =
      method.querySelector(
        ".method-check"
      );


    method.addEventListener(
      "click",
      (event) => {

        /*
          Allow inputs, links and internal buttons
          to work without selecting the whole card.
        */

        if (
          event.target.closest(
            "input, a, #saveCard, #cvvToggle"
          )
        ) {
          return;
        }


        setMethod(method);

      }
    );


    if (check) {

      check.addEventListener(
        "click",
        (event) => {

          event.preventDefault();

          event.stopPropagation();

          setMethod(method);

        }
      );

    }

  });


  // ============================================================
  // DEFAULT PAYMENT METHOD
  // ============================================================

  setMethod(
    document.querySelector(
      '[data-method="card"]'
    )
  );


  // ============================================================
  // SAVE CARD
  // ============================================================

  let saveCardChecked =
    false;


  function updateSaveCard() {

    if (!saveCard || !saveCheckbox) {
      return;
    }


    saveCard.setAttribute(
      "aria-checked",
      String(saveCardChecked)
    );


    const icon =
      saveCheckbox.querySelector(
        "svg"
      );


    if (saveCardChecked) {

      saveCheckbox.classList.remove(
        "bg-white"
      );


      saveCheckbox.classList.add(
        "bg-eventra"
      );


      if (icon) {

        icon.classList.remove(
          "opacity-0"
        );


        icon.classList.add(
          "opacity-100"
        );

      }

    }

    else {

      saveCheckbox.classList.remove(
        "bg-eventra"
      );


      saveCheckbox.classList.add(
        "bg-white"
      );


      if (icon) {

        icon.classList.remove(
          "opacity-100"
        );


        icon.classList.add(
          "opacity-0"
        );

      }

    }

  }


  function toggleSaveCard() {

    saveCardChecked =
      !saveCardChecked;


    updateSaveCard();

  }


  if (saveCard) {

    saveCard.addEventListener(
      "click",
      toggleSaveCard
    );


    saveCard.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          toggleSaveCard();

        }

      }
    );

  }


  updateSaveCard();


  // ============================================================
  // CVV SHOW / HIDE
  // ============================================================

  if (cvvToggle && cvv) {

    cvvToggle.addEventListener(
      "click",
      () => {

        const showing =
          cvv.type === "text";


        cvv.type =
          showing
            ? "password"
            : "text";


        cvvToggle.setAttribute(
          "aria-label",
          showing
            ? "Show CVV"
            : "Hide CVV"
        );

      }
    );

  }


  // ============================================================
  // CARD NUMBER FORMATTING
  // ============================================================

  if (cardNumber) {

    cardNumber.addEventListener(
      "input",
      () => {

        const digits =
          cardNumber.value
            .replace(/\D/g, "")
            .slice(0, 16);


        cardNumber.value =
          digits
            .replace(
              /(.{4})/g,
              "$1 "
            )
            .trim();

      }
    );

  }


  // ============================================================
  // EXPIRY DATE FORMATTING
  // ============================================================

  if (expiryDate) {

    expiryDate.addEventListener(
      "input",
      () => {

        let value =
          expiryDate.value
            .replace(/\D/g, "")
            .slice(0, 4);


        if (value.length > 2) {

          value =
            `${value.slice(0, 2)}/${value.slice(2)}`;

        }


        expiryDate.value =
          value;

      }
    );

  }


  // ============================================================
  // RESERVATION COUNTDOWN
  // ============================================================

  let remainingSeconds =
    8 * 60 + 30;


  function updateTimer() {

    if (!timer) {
      return;
    }


    const minutes =
      Math.floor(
        remainingSeconds / 60
      );


    const seconds =
      remainingSeconds % 60;


    timer.textContent =
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    if (
      remainingSeconds <= 0
    ) {

      clearInterval(
        timerInterval
      );


      showToast(
        "Your reservation has expired."
      );


      return;

    }


    remainingSeconds -= 1;

  }


  updateTimer();


  const timerInterval =
    setInterval(
      updateTimer,
      1000
    );


  // ============================================================
  // BACK BUTTON
  // ============================================================

  if (backButton) {

    backButton.addEventListener(
      "click",
      () => {

        if (
          window.history.length > 1
        ) {

          window.history.back();

        }

        else {

          showToast(
            "Back to ticket selection"
          );

        }

      }
    );

  }


  // ============================================================
  // PAY BUTTON — REAL PAYSTACK CHECKOUT
  // ============================================================

  const paymentTotal = document.getElementById("paymentTotal");
  const checkoutData = JSON.parse(sessionStorage.getItem("eventra_checkout") || "{}");
  const storedPayableAmount = Number(
    sessionStorage.getItem("eventra_payable_amount") ||
    checkoutData.total ||
    0
  );
  if (paymentTotal && storedPayableAmount > 0) {
    paymentTotal.textContent = `₦${Math.round(storedPayableAmount).toLocaleString("en-NG")}`;
  }

  if (payButton) {
    payButton.addEventListener("click", async () => {
      const token =
        localStorage.getItem("eventra_token") ||
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("eventra_token") ||
        sessionStorage.getItem("access_token") || "";

      const bookingId = sessionStorage.getItem("eventra_booking_id") || "";
      if (!token) {
        window.location.href = "../09_Sign_In/index.html?return=payment";
        return;
      }
      if (!bookingId) {
        showToast("Your booking could not be found. Please return to checkout.");
        return;
      }

      payButton.disabled = true;
      const originalText = payButton.textContent;
      payButton.textContent = "Connecting to Paystack...";

      try {
        const storedUser = JSON.parse(
          localStorage.getItem("eventra_user") ||
          sessionStorage.getItem("eventra_user") ||
          "{}"
        );
        const bookingData = JSON.parse(
          sessionStorage.getItem("eventra_booking_data") || "{}"
        );
        const checkout = JSON.parse(
          sessionStorage.getItem("eventra_checkout") || "{}"
        );

        const email =
          storedUser?.email ||
          checkout?.attendee?.email ||
          document.getElementById("attendeeEmail")?.textContent?.trim() ||
          "";

        // The backend payment contract uses POST /payments/initiate.
        // Prefer the amount returned by the booking API so Paystack is
        // initialized with the server-side booking total.
        const booking = bookingData?.data || bookingData || {};
        // Always use the amount created by the backend booking as the Paystack
        // amount. This prevents the UI from adding a different frontend fee
        // calculation and charging/displaying a different amount.
        const amount = Number(
          booking?.total_price ??
          booking?.final_amount ??
          booking?.total_amount ??
          sessionStorage.getItem("eventra_payable_amount") ??
          checkout?.total ??
          Number(sessionStorage.getItem("eventra_checkout_total") || 0)
        );

        if (!email) {
          throw new Error("Your email address is required to start payment.");
        }
        if (!Number.isFinite(amount) || amount <= 0) {
          throw new Error("A valid booking amount is required to start payment.");
        }

        // Keep every Eventra payment surface synchronized with this exact amount.
        sessionStorage.setItem("eventra_payable_amount", String(amount));
        sessionStorage.setItem("eventra_checkout_total", String(amount));
        if (paymentTotal) {
          paymentTotal.textContent = `₦${Math.round(amount).toLocaleString("en-NG")}`;
        }

        const eventName =
          checkout?.event_title ||
          sessionStorage.getItem("eventra_checkout_event_title") ||
          booking?.Event?.title ||
          booking?.event?.title ||
          "Eventra Event";

        const response = await fetch(`${API_BASE_URL}/payments/initiate`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            booking_id: bookingId,
            email,
            amount,
            metadata: {
              event_name: eventName
            }
          })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            window.location.href = "../09_Sign_In/index.html?return=payment";
            return;
          }
          throw new Error(result?.message || "Unable to start Paystack payment.");
        }

        const data = result?.data || result;
        const authorizationUrl = data?.authorization_url || data?.authorizationUrl;
        const reference = data?.reference || data?.payment_reference || "";
        if (!authorizationUrl) throw new Error("Paystack authorization URL was not returned by the server.");

        if (reference) {
          sessionStorage.setItem("eventra_payment_reference", String(reference));
          localStorage.setItem("eventra_payment_reference", String(reference));
        }
        sessionStorage.setItem("eventra_payment_response", JSON.stringify(result));
        sessionStorage.setItem("eventra_payment_method", "paystack");
        sessionStorage.setItem("eventra_payment_method_name", "Paystack");
        sessionStorage.setItem("eventra_paystack_active", "1");
        sessionStorage.setItem("eventra_paystack_started_at", String(Date.now()));
        window.location.assign(authorizationUrl);
      } catch (error) {
        console.error("Paystack checkout error:", error);
        showToast(error.message || "Unable to connect to Paystack. Please try again.");
        payButton.disabled = false;
        payButton.textContent = originalText;
      }
    });
  }

  // ============================================================
  // PAYSTACK RETURN / CLOSE HANDLING
  // ============================================================
  // Paystack can return to this page without a query string when the
  // hosted checkout is closed. If a payment attempt is still active,
  // hand the stored reference to Screen 14 so the backend can verify it.
  function resetPayButton() {
    if (!payButton) return;
    payButton.disabled = false;
    payButton.textContent = `Pay ₦${Number(checkoutData.total || sessionStorage.getItem("eventra_checkout_total") || 0).toLocaleString("en-NG")}`;
  }

  function continueToProcessing(reference) {
    if (!reference) return false;
    sessionStorage.setItem("eventra_payment_reference", String(reference));
    localStorage.setItem("eventra_payment_reference", String(reference));
    const processingUrl = `../14_Payment%20Processing/index.html?reference=${encodeURIComponent(reference)}`;
    window.location.replace(processingUrl);
    return true;
  }

  function handlePaystackReturn() {
    const params = new URLSearchParams(window.location.search);
    const queryReference = params.get("reference") || params.get("trxref") || "";
    if (queryReference) {
      sessionStorage.removeItem("eventra_paystack_active");
      continueToProcessing(queryReference);
      return true;
    }

    const active = sessionStorage.getItem("eventra_paystack_active") === "1";
    const storedReference = sessionStorage.getItem("eventra_payment_reference") || localStorage.getItem("eventra_payment_reference") || "";
    if (active && storedReference) {
      continueToProcessing(storedReference);
      return true;
    }

    resetPayButton();
    return false;
  }

  // Handle normal navigation and bfcache restoration after Paystack closes
  // or returns without appending reference/trxref to the URL.
  window.addEventListener("pageshow", () => {
    setTimeout(handlePaystackReturn, 0);
  });

  // ============================================================
  // TICKETING TERMS
  // ============================================================

  const ticketingTerms =
    document.getElementById(
      "ticketingTerms"
    );


  if (ticketingTerms) {

    ticketingTerms.addEventListener(
      "click",
      (event) => {

        event.preventDefault();


        showToast(
          "Ticketing Terms"
        );

      }
    );

  }


  // ============================================================
  // REFUND POLICY
  // ============================================================

  const refundPolicy =
    document.getElementById(
      "refundPolicy"
    );


  if (refundPolicy) {

    refundPolicy.addEventListener(
      "click",
      (event) => {

        event.preventDefault();


        showToast(
          "Refund Policy"
        );

      }
    );

  }

});