// ============================================================
// EVENTRA
// SCREEN 08 - PASSWORD RESET SUCCESSFUL
// ============================================================


// ============================================================
// ROUTES
// ============================================================

const ROUTES = {

  signIn:
    "../09_Sign In/index.html",

  explore:
    "../10_Discover Event/index.html"

};


// ============================================================
// ELEMENTS
// ============================================================

const backButton =
  document.getElementById("backButton");

const signInButton =
  document.getElementById("signInButton");

const exploreButton =
  document.getElementById("exploreButton");

const lockAccountButton =
  document.getElementById("lockAccountButton");

const contactSecurityButton =
  document.getElementById("contactSecurityButton");


// ============================================================
// BACK BUTTON
// ============================================================

backButton.addEventListener(
  "click",
  function () {

    if (window.history.length > 1) {

      window.history.back();

    } else {

      window.location.href =
        ROUTES.signIn;

    }

  }
);


// ============================================================
// SIGN IN NOW
// ============================================================

signInButton.addEventListener(
  "click",
  function () {

    window.location.href =
      ROUTES.signIn;

  }
);


// ============================================================
// GO TO EXPLORE EVENTS
// ============================================================

exploreButton.addEventListener(
  "click",
  function () {

    window.location.href =
      ROUTES.explore;

  }
);


// ============================================================
// LOCK ACCOUNT
// ============================================================

lockAccountButton.addEventListener(
  "click",
  function () {

    const confirmed =
      window.confirm(
        "If you did not request this password change, please contact Eventra Security immediately. Do you want to continue?"
      );


    if (confirmed) {

      window.alert(
        "Your account security request has been recorded."
      );

    }

  }
);


// ============================================================
// CONTACT EVENTRA SECURITY
// ============================================================

contactSecurityButton.addEventListener(
  "click",
  function () {

    window.location.href =
      "mailto:security@eventra.com?subject=Password%20Reset%20Security%20Issue";

  }
);