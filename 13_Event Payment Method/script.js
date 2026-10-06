document.addEventListener("DOMContentLoaded", () => {

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
  // PAY BUTTON
  //
  // THIS IS THE IMPORTANT FIX.
  //
  // Before:
  // showToast(...)
  //
  // After:
  // validate
  // save checkout data
  // navigate to Screen 14
  // ============================================================

  if (payButton) {

    payButton.addEventListener(
      "click",
      () => {

        const selected =
          document.querySelector(
            '.payment-method[aria-selected="true"]'
          );


        const selectedMethod =
          selected?.dataset.method;


        const names = {

          card:
            "Debit / Credit Card",

          bank:
            "Bank Transfer",

          ussd:
            "USSD / Bank Code",

          wallet:
            "Apple Pay / Google Pay"

        };


        // ------------------------------------------------------
        // NO PAYMENT METHOD
        // ------------------------------------------------------

        if (!selectedMethod) {

          showToast(
            "Please select a payment method."
          );


          return;

        }


        // ------------------------------------------------------
        // CARD VALIDATION
        //
        // Only validate card fields if Card is selected.
        // Bank, USSD and Wallet do NOT need card fields.
        // ------------------------------------------------------

        if (
          selectedMethod === "card"
        ) {

          const cardholderName =
            document.getElementById(
              "cardholderName"
            );


          if (
            !cardholderName ||
            !cardholderName.value.trim()
          ) {

            showToast(
              "Enter the cardholder name."
            );


            return;

          }


          if (
            !cardNumber ||
            cardNumber.value
              .replace(/\D/g, "")
              .length < 16
          ) {

            showToast(
              "Enter a valid card number."
            );


            return;

          }


          if (
            !expiryDate ||
            expiryDate.value.length !== 5
          ) {

            showToast(
              "Enter the expiry date."
            );


            return;

          }


          if (
            !cvv ||
            cvv.value.length < 3
          ) {

            showToast(
              "Enter your CVV."
            );


            return;

          }

        }


        // ======================================================
        // SAVE CHECKOUT DATA
        // ======================================================

        try {

          sessionStorage.setItem(
            "eventra_payment_method",
            selectedMethod
          );


          sessionStorage.setItem(
            "eventra_payment_method_name",
            names[selectedMethod]
          );


          sessionStorage.setItem(
            "eventra_checkout_total",
            "17625"
          );


          sessionStorage.setItem(
            "eventra_checkout_quantity",
            "1"
          );


          sessionStorage.setItem(
            "eventra_checkout_event_title",
            "Tech Conference 2026"
          );


          sessionStorage.setItem(
            "eventra_checkout_tier",
            "Regular Pass × 1"
          );


          // Save card details only if card was selected.
          // This is temporary UI data for the prototype.
          // Do not store real card information in production.

          if (
            selectedMethod === "card"
          ) {

            sessionStorage.setItem(
              "eventra_payment_provider",
              "Mastercard •••• 4821"
            );

          }

          else {

            sessionStorage.setItem(
              "eventra_payment_provider",
              names[selectedMethod]
            );

          }

        }

        catch (error) {

          console.warn(
            "Could not save checkout data:",
            error
          );

        }


        // ======================================================
        // SHOW SHORT CONFIRMATION
        // ======================================================

        showToast(
          `Payment selected: ${names[selectedMethod]}`
        );


        // ======================================================
        // GO TO PAYMENT PROCESSING
        //
        // IMPORTANT:
        // The folder is:
        //
        // 14_Payment Processing
        //
        // Therefore the space is encoded as %20.
        // ======================================================

        setTimeout(
          () => {

            window.location.href =
              "../14_Payment%20Processing/index.html";

          },
          450
        );

      }
    );

  }


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