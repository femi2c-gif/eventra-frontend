// ============================================================
// EVENTRA
// SCREEN 09 - SIGN IN
// ============================================================


// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL =
  "https://eventra-backend-aidf.onrender.com/api";


// ============================================================
// ROUTES
// ============================================================

const ROUTES = {

  signUp:
    "../02_Create Account/index.html",

  forgotPassword:
    "../06_Forgot Password/index.html",

  home:
    "../05_Home/index.html"

};


// ============================================================
// ELEMENTS
// ============================================================

const loginForm =
  document.getElementById("loginForm");

const emailInput =
  document.getElementById("email");

const passwordInput =
  document.getElementById("password");

const rememberMe =
  document.getElementById("rememberMe");

const togglePassword =
  document.getElementById("togglePassword");

const eyeOpen =
  document.getElementById("eyeOpen");

const eyeClosed =
  document.getElementById("eyeClosed");

const signInButton =
  document.getElementById("signInButton");

const signInText =
  document.getElementById("signInText");

const signInArrow =
  document.getElementById("signInArrow");

const loadingSpinner =
  document.getElementById("loadingSpinner");

const loginError =
  document.getElementById("loginError");

const emailError =
  document.getElementById("emailError");

const passwordError =
  document.getElementById("passwordError");


// ============================================================
// SAFETY CHECK
// ============================================================

if (
  !loginForm ||
  !emailInput ||
  !passwordInput ||
  !rememberMe ||
  !togglePassword ||
  !signInButton ||
  !loginError
) {

  console.error(
    "Eventra Sign In: Required elements were not found."
  );

}


// ============================================================
// SHOW / HIDE PASSWORD
// ============================================================

togglePassword.addEventListener(
  "click",
  function () {

    const isPassword =
      passwordInput.type === "password";


    if (isPassword) {

      passwordInput.type = "text";

      eyeOpen.classList.add(
        "hidden"
      );

      eyeClosed.classList.remove(
        "hidden"
      );

      togglePassword.setAttribute(
        "aria-label",
        "Hide password"
      );

    } else {

      passwordInput.type = "password";

      eyeClosed.classList.add(
        "hidden"
      );

      eyeOpen.classList.remove(
        "hidden"
      );

      togglePassword.setAttribute(
        "aria-label",
        "Show password"
      );

    }

  }
);


// ============================================================
// CLEAR ERROR
// ============================================================

function clearErrors() {

  loginError.classList.add(
    "hidden"
  );

  emailError.classList.add(
    "hidden"
  );

  passwordError.classList.add(
    "hidden"
  );

  loginError.textContent = "";

  emailError.textContent = "";

  passwordError.textContent = "";

}


// ============================================================
// DISPLAY LOGIN ERROR
// ============================================================

function showLoginError(message) {

  loginError.textContent =
    message;

  loginError.classList.remove(
    "hidden"
  );

}


// ============================================================
// EMAIL VALIDATION
// ============================================================

function isValidEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);

}


// ============================================================
// VALIDATE FORM
// ============================================================

function validateForm() {

  clearErrors();

  let valid = true;


  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;


  // ----------------------------------------------------------
  // EMAIL
  // ----------------------------------------------------------

  if (!email) {

    emailError.textContent =
      "Please enter your email address.";

    emailError.classList.remove(
      "hidden"
    );

    valid = false;

  } else if (!isValidEmail(email)) {

    emailError.textContent =
      "Please enter a valid email address.";

    emailError.classList.remove(
      "hidden"
    );

    valid = false;

  }


  // ----------------------------------------------------------
  // PASSWORD
  // ----------------------------------------------------------

  if (!password) {

    passwordError.textContent =
      "Please enter your password.";

    passwordError.classList.remove(
      "hidden"
    );

    valid = false;

  }


  return valid;

}


// ============================================================
// BUTTON LOADING STATE
// ============================================================

function setLoading(isLoading) {

  signInButton.disabled =
    isLoading;


  if (isLoading) {

    signInText.textContent =
      "Signing In...";

    signInArrow.classList.add(
      "hidden"
    );

    loadingSpinner.classList.remove(
      "hidden"
    );

  } else {

    signInText.textContent =
      "Sign In";

    signInArrow.classList.remove(
      "hidden"
    );

    loadingSpinner.classList.add(
      "hidden"
    );

  }

}


// ============================================================
// EXTRACT TOKEN FROM API RESPONSE
// ============================================================

function extractToken(responseData) {

  if (!responseData) {
    return null;
  }


  // Possible format:
  // { token: "..." }

  if (
    typeof responseData.token === "string"
  ) {

    return responseData.token;

  }


  // Standard Eventra format:
  // { status: "success", data: { token: "..." } }

  if (
    responseData.data &&
    typeof responseData.data.token === "string"
  ) {

    return responseData.data.token;

  }


  // Alternative naming

  if (
    typeof responseData.access_token === "string"
  ) {

    return responseData.access_token;

  }


  if (
    responseData.data &&
    typeof responseData.data.access_token === "string"
  ) {

    return responseData.data.access_token;

  }


  return null;

}


// ============================================================
// EXTRACT USER FROM API RESPONSE
// ============================================================

function extractUser(responseData) {

  if (!responseData) {
    return null;
  }


  if (responseData.user) {
    return responseData.user;
  }


  if (
    responseData.data &&
    responseData.data.user
  ) {

    return responseData.data.user;

  }


  return null;

}


// ============================================================
// STORE AUTHENTICATION DATA
// ============================================================

function saveAuthentication(data) {

  const token =
    extractToken(data);

  const user =
    extractUser(data);


  if (!token) {

    console.error(
      "Login succeeded but no authentication token was returned.",
      data
    );

    throw new Error(
      "Login succeeded, but the authentication token was not returned."
    );

  }


  // ----------------------------------------------------------
  // CLEAR OLD AUTH DATA
  // ----------------------------------------------------------

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("eventra_token");
  localStorage.removeItem("eventra_user");

  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
  sessionStorage.removeItem("eventra_token");
  sessionStorage.removeItem("eventra_user");


  // ----------------------------------------------------------
  // CHOOSE STORAGE
  // ----------------------------------------------------------

  const storage =
    rememberMe.checked
      ? localStorage
      : sessionStorage;


  // ----------------------------------------------------------
  // SAVE TOKEN
  // ----------------------------------------------------------

  storage.setItem(
    "access_token",
    token
  );

  storage.setItem(
    "eventra_token",
    token
  );

  const refreshToken =
    data &&
    data.data &&
    typeof data.data.refresh_token === "string"
      ? data.data.refresh_token
      : null;

  if (refreshToken) {
    storage.setItem(
      "refresh_token",
      refreshToken
    );
  }


  // ----------------------------------------------------------
  // SAVE USER
  // ----------------------------------------------------------

  if (user) {

    storage.setItem(
      "eventra_user",
      JSON.stringify(user)
    );

  }


  // ----------------------------------------------------------
  // SAVE LOGIN EMAIL
  // ----------------------------------------------------------

  if (rememberMe.checked) {

    localStorage.setItem(
      "eventra_email",
      emailInput.value.trim()
    );

  } else {

    localStorage.removeItem(
      "eventra_email"
    );

  }


  console.log(
    "Eventra authentication saved successfully."
  );

}


// ============================================================
// LOGIN API
// ============================================================

async function loginUser(
  email,
  password
) {

  const loginURL =
    `${API_BASE_URL}/auth/login`;


  console.log(
    "Eventra Login Request:",
    loginURL
  );


  let response;


  try {

    response =
      await fetch(
        loginURL,
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

              email:
                email,

              password:
                password

            })

        }
      );

  } catch (networkError) {

    console.error(
      "Eventra Login Network Error:",
      networkError
    );


    throw new Error(
      "Unable to connect to Eventra. Please check your internet connection and try again."
    );

  }


  // ==========================================================
  // READ RESPONSE
  // ==========================================================

  let data = null;


  const responseText =
    await response.text();


  if (responseText) {

    try {

      data =
        JSON.parse(
          responseText
        );

    } catch (parseError) {

      console.warn(
        "Eventra returned a non-JSON response:",
        responseText
      );

    }

  }


  console.log(
    "Eventra Login Response:",
    response.status,
    data
  );


  // ==========================================================
  // HANDLE HTTP ERROR
  // ==========================================================

  if (!response.ok) {

    let message =
      "Unable to sign in. Please check your email and password.";


    if (
      data &&
      typeof data.message === "string"
    ) {

      message =
        data.message;

    } else if (
      data &&
      typeof data.error === "string"
    ) {

      message =
        data.error;

    }


    // --------------------------------------------------------
    // FRIENDLY AUTH ERROR
    // --------------------------------------------------------

    if (
      response.status === 401
    ) {

      message =
        "Incorrect email or password. Please try again.";

    }

    if (response.status === 403) {
      message = data?.message || "This account is not allowed to sign in yet. Please contact support.";
    }


    if (
      response.status === 404
    ) {

      message =
        "The sign-in service could not be found. Please try again later.";

    }


    if (
      response.status >= 500
    ) {

      message =
        "The Eventra server is currently unavailable. Please try again shortly.";

    }


    throw new Error(
      message
    );

  }


  // ==========================================================
  // ENSURE WE HAVE DATA
  // ==========================================================

  if (!data) {

    throw new Error(
      "The server returned an invalid response. Please try again."
    );

  }


  // ==========================================================
  // CHECK EVENTRA SUCCESS STATUS
  // ==========================================================

  if (
    data.status &&
    data.status !== "success"
  ) {

    throw new Error(
      data.message ||
      "Unable to sign in. Please try again."
    );

  }


  return data;

}


// ============================================================
// FORM SUBMISSION
// ============================================================

loginForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    // --------------------------------------------------------
    // VALIDATE
    // --------------------------------------------------------

    if (!validateForm()) {

      return;

    }


    // --------------------------------------------------------
    // GET VALUES
    // --------------------------------------------------------

    const email =
      emailInput.value.trim();

    const password =
      passwordInput.value;


    // --------------------------------------------------------
    // LOADING
    // --------------------------------------------------------

    setLoading(true);


    try {

      // ======================================================
      // LOGIN
      // ======================================================

      const data =
        await loginUser(
          email,
          password
        );


      // ======================================================
      // SAVE AUTHENTICATION
      // ======================================================

      saveAuthentication(
        data
      );


      // ======================================================
      // SUCCESS
      // ======================================================

      console.log(
        "Eventra login successful."
      );


      // Small delay gives the browser time to persist
      // authentication before navigating.

      setTimeout(
        function () {

          const returnTarget = new URLSearchParams(window.location.search).get("return");
          if (returnTarget === "checkout") {
            window.location.href = "../12_Event%20Checkout%20Order%20Summary/index.html";
          } else if (returnTarget === "payment") {
            window.location.href = "../13_Event%20Payment%20Method/index.html";
          } else {
            window.location.href = ROUTES.home;
          }

        },
        150
      );


    } catch (error) {

      console.error(
        "Eventra Login Error:",
        error
      );


      showLoginError(
        error.message ||
        "Something went wrong. Please try again."
      );


    } finally {

      setLoading(false);

    }

  }
);


// ============================================================
// REMOVE ERRORS WHEN USER STARTS TYPING
// ============================================================

emailInput.addEventListener(
  "input",
  function () {

    emailError.classList.add(
      "hidden"
    );

    loginError.classList.add(
      "hidden"
    );

  }
);


passwordInput.addEventListener(
  "input",
  function () {

    passwordError.classList.add(
      "hidden"
    );

    loginError.classList.add(
      "hidden"
    );

  }
);


// ============================================================
// LOAD REMEMBERED EMAIL
// ============================================================

const rememberedEmail =
  localStorage.getItem(
    "eventra_email"
  );


if (rememberedEmail) {

  emailInput.value =
    rememberedEmail;

  rememberMe.checked =
    true;

}


// ============================================================
// REMEMBER ME STATE
// ============================================================

rememberMe.addEventListener(
  "change",
  function () {

    if (!rememberMe.checked) {

      localStorage.removeItem(
        "eventra_email"
      );

    }

  }
);


// ============================================================
// INITIAL CONSOLE CHECK
// ============================================================

console.log(
  "Eventra Sign In initialized."
);

console.log(
  "API:",
  `${API_BASE_URL}/auth/login`
);