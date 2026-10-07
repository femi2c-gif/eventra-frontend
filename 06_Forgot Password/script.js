// ============================================================
// EVENTRA
// SCREEN 06 - FORGOT PASSWORD
// ============================================================

const API_BASE_URL =
  "https://eventra-backend-aidf.onrender.com/api";


// ============================================================
// ROUTES
// ============================================================

const ROUTES = {
  signIn: "../09_Sign_In/index.html",
  resetPassword: "../07_Reset%20Password/index.html"
};


// ============================================================
// DOM ELEMENTS
// ============================================================

const backButton =
  document.getElementById("backButton");

const forgotPasswordForm =
  document.getElementById("forgotPasswordForm");

const emailInput =
  document.getElementById("email");

const emailWrapper =
  document.getElementById("emailWrapper");

const emailError =
  document.getElementById("emailError");

const submitButton =
  document.getElementById("submitButton");

const submitText =
  document.getElementById("submitText");

const submitArrow =
  document.getElementById("submitArrow");

const loadingSpinner =
  document.getElementById("loadingSpinner");

const successMessage =
  document.getElementById("successMessage");

const signInButton =
  document.getElementById("signInButton");

const supportButton =
  document.getElementById("supportButton");


// ============================================================
// INITIALIZATION CHECK
// ============================================================

console.log(
  "Eventra Forgot Password initialized."
);

console.log(
  "API:",
  `${API_BASE_URL}/auth/forgot-password`
);


// ============================================================
// ROUTE HELPER
// ============================================================

function navigateTo(route) {
  window.location.href = route;
}


// ============================================================
// BACK BUTTON
// ============================================================

if (backButton) {
  backButton.addEventListener(
    "click",
    function () {

      if (window.history.length > 1) {
        window.history.back();
      } else {
        navigateTo(ROUTES.signIn);
      }

    }
  );
}


// ============================================================
// EMAIL VALIDATION
// ============================================================

function isValidEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


// ============================================================
// SHOW EMAIL ERROR
// ============================================================

function showEmailError(message) {

  if (emailError) {

    emailError.textContent = message;

    emailError.classList.remove("hidden");

  }

  if (emailWrapper) {

    emailWrapper.classList.remove(
      "border-transparent"
    );

    emailWrapper.classList.add(
      "border-red-300",
      "bg-red-50"
    );

  }

}


// ============================================================
// CLEAR EMAIL ERROR
// ============================================================

function clearEmailError() {

  if (emailError) {

    emailError.textContent = "";

    emailError.classList.add("hidden");

  }

  if (emailWrapper) {

    emailWrapper.classList.remove(
      "border-red-300",
      "bg-red-50"
    );

    emailWrapper.classList.add(
      "border-transparent",
      "bg-[#EEF3FF]"
    );

  }

}


// ============================================================
// SHOW SUCCESS
// ============================================================

function showSuccess(message) {

  if (!successMessage) return;

  successMessage.textContent = message;

  successMessage.classList.remove("hidden");

}


// ============================================================
// HIDE SUCCESS
// ============================================================

function hideSuccess() {

  if (!successMessage) return;

  successMessage.classList.add("hidden");

}


// ============================================================
// LOADING STATE
// ============================================================

function setLoading(loading) {

  if (!submitButton) return;

  submitButton.disabled = loading;


  if (loading) {

    if (submitText) {
      submitText.textContent = "Sending...";
    }

    if (submitArrow) {
      submitArrow.classList.add("hidden");
    }

    if (loadingSpinner) {
      loadingSpinner.classList.remove("hidden");
    }

  } else {

    if (submitText) {
      submitText.textContent =
        "Send Reset Instructions";
    }

    if (submitArrow) {
      submitArrow.classList.remove("hidden");
    }

    if (loadingSpinner) {
      loadingSpinner.classList.add("hidden");
    }

  }

}


// ============================================================
// API RESPONSE READER
// ============================================================

async function readResponse(response) {

  const text =
    await response.text();

  if (!text) {
    return {};
  }

  try {

    return JSON.parse(text);

  } catch {

    return {
      message: text
    };

  }

}


// ============================================================
// FORGOT PASSWORD API
// ============================================================

async function sendForgotPasswordRequest(email) {

  const endpoint =
    `${API_BASE_URL}/auth/forgot-password`;

  console.log(
    "Eventra Forgot Password Request:",
    endpoint
  );


  let response;


  try {

    response =
      await fetch(
        endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "Accept":
              "application/json"
          },

          body:
            JSON.stringify({
              email: email
            })
        }
      );

  } catch (error) {

    console.error(
      "Forgot Password Network Error:",
      error
    );

    throw new Error(
      "Unable to connect to Eventra. Please check your connection and try again."
    );

  }


  const data =
    await readResponse(response);


  console.log(
    "Eventra Forgot Password Response:",
    response.status,
    data
  );


  if (!response.ok) {

    throw new Error(
      data.message ||
      data.error ||
      "Unable to send password reset instructions."
    );

  }


  if (
    data.status &&
    data.status !== "success"
  ) {

    throw new Error(
      data.message ||
      "Unable to process the password reset request."
    );

  }


  return data;

}


// ============================================================
// EMAIL INPUT
// ============================================================

if (emailInput) {

  emailInput.addEventListener(
    "input",
    function () {

      clearEmailError();

      hideSuccess();

    }
  );

}


// ============================================================
// SUBMIT
// ============================================================

if (forgotPasswordForm) {

  forgotPasswordForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      clearEmailError();

      hideSuccess();


      const email =
        emailInput.value.trim();


      // --------------------------------------------------------
      // REQUIRED
      // --------------------------------------------------------

      if (!email) {

        showEmailError(
          "Please enter your email address."
        );

        emailInput.focus();

        return;

      }


      // --------------------------------------------------------
      // FORMAT
      // --------------------------------------------------------

      if (!isValidEmail(email)) {

        showEmailError(
          "Please enter a valid email address."
        );

        emailInput.focus();

        return;

      }


      // --------------------------------------------------------
      // SAVE EMAIL
      // --------------------------------------------------------

      localStorage.setItem(
        "eventra_reset_email",
        email
      );


      setLoading(true);


      try {

        await sendForgotPasswordRequest(
          email
        );


        // ------------------------------------------------------
        // SUCCESS
        // ------------------------------------------------------

        showSuccess(
          "Reset instructions have been sent. Please check your email for the password reset link."
        );


        /*
         * IMPORTANT:
         *
         * We do NOT automatically send the user to Screen 07.
         *
         * The backend documentation says that the forgot-password
         * endpoint sends a reset link. The actual reset-password
         * endpoint/token contract has not been provided yet.
         *
         * Therefore we wait for the user's reset link/token before
         * opening the Create New Password screen.
         */


      } catch (error) {

        console.error(
          "Eventra Forgot Password Error:",
          error
        );


        showEmailError(
          error.message ||
          "Something went wrong. Please try again."
        );

      } finally {

        setLoading(false);

      }

    }
  );

}


// ============================================================
// SIGN IN
// ============================================================

if (signInButton) {

  signInButton.addEventListener(
    "click",
    function () {

      navigateTo(
        ROUTES.signIn
      );

    }
  );

}


// ============================================================
// SUPPORT
// ============================================================

if (supportButton) {

  supportButton.addEventListener(
    "click",
    function () {

      window.location.href =
        "mailto:support@eventra.com";

    }
  );

}


// ============================================================
// ENTER KEY
// ============================================================

if (emailInput) {

  emailInput.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Enter") {

        event.preventDefault();

        if (
          forgotPasswordForm &&
          typeof forgotPasswordForm.requestSubmit ===
            "function"
        ) {

          forgotPasswordForm.requestSubmit();

        }

      }

    }
  );

}