// ============================================================
// EVENTRA
// SCREEN 02 - CREATE ACCOUNT
// ============================================================


// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL =
  "https://eventra-backend-aidf.onrender.com/api";

const REGISTER_ENDPOINT =
  `${API_BASE_URL}/auth/register`;


// ============================================================
// ROUTES
// ============================================================

const ROUTES = {
  back: "../01_Welcome/index.html",
  signIn: "../09_Sign_In/index.html",
};


// ============================================================
// DOM ELEMENTS
// ============================================================

const registerForm =
  document.getElementById("registerForm");

const backBtn =
  document.getElementById("backBtn");

const signInLink =
  document.getElementById("signInLink");

const termsBtn =
  document.getElementById("termsBtn");

const termsInput =
  document.getElementById("terms");

const checkmark =
  document.getElementById("checkmark");

const firstNameInput =
  document.getElementById("firstName");

const lastNameInput =
  document.getElementById("lastName");

const emailInput =
  document.getElementById("email");

const passwordInput =
  document.getElementById("password");

const createAccountBtn =
  document.getElementById("createAccountBtn");

const buttonText =
  document.getElementById("buttonText");

const buttonLoader =
  document.getElementById("buttonLoader");

const errorMessage =
  document.getElementById("errorMessage");


// ============================================================
// NAVIGATION
// ============================================================

function navigateTo(route) {
  window.location.href = route;
}


// ============================================================
// BACK BUTTON
// ============================================================

if (backBtn) {

  backBtn.addEventListener("click", () => {

    navigateTo(ROUTES.back);

  });

}


// ============================================================
// SIGN IN
// ============================================================

if (signInLink) {

  signInLink.addEventListener("click", () => {

    navigateTo(ROUTES.signIn);

  });

}


// ============================================================
// TERMS CHECKBOX
// ============================================================

if (termsInput) {

  termsInput.addEventListener("change", () => {

    if (termsInput.checked) {

      checkmark.classList.remove("hidden");

    } else {

      checkmark.classList.add("hidden");

    }

  });

}


// ============================================================
// TERMS & CONDITIONS
// ============================================================

if (termsBtn) {

  termsBtn.addEventListener("click", (event) => {

    // Prevent the Terms button from submitting the form.

    event.preventDefault();

    event.stopPropagation();

    alert("Terms & Conditions will be available here.");

  });

}


// ============================================================
// ERROR MESSAGE
// ============================================================

function showError(message) {

  errorMessage.textContent = message;

  errorMessage.classList.remove("hidden");

}


// ============================================================
// HIDE ERROR
// ============================================================

function hideError() {

  errorMessage.textContent = "";

  errorMessage.classList.add("hidden");

}


// ============================================================
// LOADING STATE
// ============================================================

function setLoading(isLoading) {

  createAccountBtn.disabled = isLoading;


  if (isLoading) {

    buttonText.textContent =
      "Creating Account...";

    buttonLoader.classList.remove("hidden");

  } else {

    buttonText.textContent =
      "Create Account";

    buttonLoader.classList.add("hidden");

  }

}


// ============================================================
// VALIDATE FORM
// ============================================================

function validateForm() {

  const firstName =
    firstNameInput.value.trim();

  const lastName =
    lastNameInput.value.trim();

  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;


  // First name

  if (!firstName) {

    showError(
      "Please enter your first name."
    );

    firstNameInput.focus();

    return false;
  }


  // Last name

  if (!lastName) {

    showError(
      "Please enter your last name."
    );

    lastNameInput.focus();

    return false;
  }


  // Email

  if (!email) {

    showError(
      "Please enter your email address."
    );

    emailInput.focus();

    return false;
  }


  // Email format

  if (
    !email.includes("@") ||
    !email.includes(".")
  ) {

    showError(
      "Please enter a valid email address."
    );

    emailInput.focus();

    return false;
  }


  // Password

  if (!password) {

    showError(
      "Please enter a password."
    );

    passwordInput.focus();

    return false;
  }


  // Password length

  if (password.length < 8) {

    showError(
      "Password must be at least 8 characters."
    );

    passwordInput.focus();

    return false;
  }


  // Terms

  if (!termsInput.checked) {

    showError(
      "Please agree to the Terms & Conditions."
    );

    return false;
  }


  return true;

}


// ============================================================
// REGISTER USER
// ============================================================

async function registerUser() {

  hideError();


  // Validate

  if (!validateForm()) {

    return;

  }


  // Get values

  const firstName =
    firstNameInput.value.trim();

  const lastName =
    lastNameInput.value.trim();

  const email =
    emailInput.value.trim().toLowerCase();

  const password =
    passwordInput.value;


  // Loading

  setLoading(true);


  try {

    // ========================================================
    // API REQUEST
    // ========================================================

    const response = await fetch(
      REGISTER_ENDPOINT,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          first_name: firstName,

          last_name: lastName,

          email: email,

          password: password

        })
      }
    );


    // ========================================================
    // API RESPONSE
    // ========================================================

    const result =
      await response.json();


    // ========================================================
    // API ERROR
    // ========================================================

    if (!response.ok) {

      showError(
        result.message ||
        "Unable to create your account. Please try again."
      );

      return;

    }


    // ========================================================
    // HANDLE REGISTRATION RESPONSE
    // ========================================================

    const responseData = result.data || {};

    // Email verification/OTP has been removed from the active
    // registration flow. Clear any old verification state so
    // previous testing cannot redirect the user back into the
    // retired verification flow.
    localStorage.removeItem("eventra_verification_id");
    localStorage.removeItem("eventra_email_verified");

    // Preserve tokens if the backend returns them at registration.
    if (responseData.access_token) {
      localStorage.setItem("access_token", responseData.access_token);
      localStorage.setItem("eventra_token", responseData.access_token);
    }

    if (responseData.refresh_token) {
      localStorage.setItem("refresh_token", responseData.refresh_token);
    }


    // ========================================================
    // SAVE USER DETAILS
    // ========================================================

    localStorage.setItem(
      "eventra_first_name",
      firstName
    );

    localStorage.setItem(
      "eventra_last_name",
      lastName
    );

    localStorage.setItem(
      "eventra_email",
      email
    );


    // ========================================================
    // GO TO SIGN IN
    // ========================================================

    // Email verification/OTP has been removed from the active
    // registration flow. After a successful account creation,
    // send the user directly to Sign In.
    navigateTo(
      ROUTES.signIn
    );

  } catch (error) {

    console.error(
      "Registration error:",
      error
    );


    showError(
      "Unable to connect to Eventra. Please check your internet connection and try again."
    );

  } finally {

    setLoading(false);

  }

}


// ============================================================
// FORM SUBMIT
// ============================================================

if (registerForm) {

  registerForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      await registerUser();

    }
  );

}