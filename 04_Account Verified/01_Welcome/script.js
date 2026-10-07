// ============================================================
// EVENTRA
// SCREEN 01 - WELCOME SCREEN
// ============================================================


// ============================================================
// ROUTES
// ============================================================

// These names match the EXACT folder names in VS Code.

const ROUTES = {

  // Screen 01 → Screen 02
  getStarted:
    "../02_Create%20Account/index.html",

  // Screen 01 → Screen 09
  signIn:
    "../09_Sign_In/index.html"

};


// ============================================================
// DOM ELEMENTS
// ============================================================

const getStartedBtn =
  document.getElementById("getStartedBtn");

const signInBtn =
  document.getElementById("signInBtn");


// ============================================================
// NAVIGATION FUNCTION
// ============================================================

function navigateTo(route) {

  window.location.href = route;

}


// ============================================================
// GET STARTED
// ============================================================

if (getStartedBtn) {

  getStartedBtn.addEventListener("click", () => {

    navigateTo(
      ROUTES.getStarted
    );

  });

}


// ============================================================
// SIGN IN
// ============================================================

if (signInBtn) {

  signInBtn.addEventListener("click", () => {

    navigateTo(
      ROUTES.signIn
    );

  });

}