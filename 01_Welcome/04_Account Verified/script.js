// ============================================================
// EVENTRA
// SCREEN 04 - ACCOUNT VERIFIED
// ============================================================


// ============================================================
// ROUTES
// ============================================================

const ROUTES = {

  back:
    "../03_Verify%20Account/index.html",

  home:
    "../05_Home/index.html"

};


// ============================================================
// ELEMENTS
// ============================================================

const backBtn =
  document.getElementById("backBtn");

const getStartedBtn =
  document.getElementById("getStartedBtn");

const skipBtn =
  document.getElementById("skipBtn");

const userName =
  document.getElementById("userName");

const selectionCounter =
  document.getElementById("selectionCounter");

const validationMessage =
  document.getElementById("validationMessage");

const notificationToggle =
  document.getElementById("notificationToggle");

const toggleKnob =
  document.getElementById("toggleKnob");

const interestButtons =
  document.querySelectorAll(".interest-btn");

const cityButtons =
  document.querySelectorAll(".city-btn");


// ============================================================
// STATE
// ============================================================

let selectedInterests = [];

let selectedCity = "Lagos";

let earlyBirdEnabled = true;


// ============================================================
// LOAD USER NAME
// ============================================================

const savedFirstName =
  localStorage.getItem(
    "eventra_first_name"
  );

if (savedFirstName) {

  userName.textContent =
    savedFirstName;

}


// ============================================================
// NAVIGATION
// ============================================================

function navigateTo(route) {

  window.location.href = route;

}


// ============================================================
// BACK BUTTON
// ============================================================

backBtn.addEventListener(
  "click",
  function () {

    navigateTo(
      ROUTES.back
    );

  }
);


// ============================================================
// DEFAULT INTERESTS
// ============================================================

const defaultInterests = [

  "Afrobeats & Live Music",

  "Tech & Startups",

  "Food & Drinks / Festivals"

];


// ============================================================
// INTEREST SELECTION
// ============================================================

interestButtons.forEach(
  function (button) {

    const interest =
      button.dataset.interest;

    const status =
      button.querySelector(
        ".interest-status"
      );


    if (
      defaultInterests.includes(
        interest
      )
    ) {

      selectedInterests.push(
        interest
      );

      button.classList.add(
        "selected"
      );

      status.textContent =
        "✓";

    }


    button.addEventListener(
      "click",
      function () {

        if (
          selectedInterests.includes(
            interest
          )
        ) {

          selectedInterests =
            selectedInterests.filter(
              function (item) {

                return item !== interest;

              }
            );

          button.classList.remove(
            "selected"
          );

          status.textContent =
            "+";

        }

        else {

          selectedInterests.push(
            interest
          );

          button.classList.add(
            "selected"
          );

          status.textContent =
            "✓";

        }


        updateCounter();

        hideValidation();

      }
    );

  }
);


// ============================================================
// COUNTER
// ============================================================

function updateCounter() {

  const count =
    selectedInterests.length;


  selectionCounter.textContent =
    `${count} selected (Target: 3+)`;


  if (count >= 3) {

    selectionCounter.classList.remove(
      "bg-[#DFD5FF]",
      "text-[#3D1A8B]"
    );

    selectionCounter.classList.add(
      "bg-[#DFF7E8]",
      "text-[#187A45]"
    );

  }

  else {

    selectionCounter.classList.remove(
      "bg-[#DFF7E8]",
      "text-[#187A45]"
    );

    selectionCounter.classList.add(
      "bg-[#DFD5FF]",
      "text-[#3D1A8B]"
    );

  }

}


// ============================================================
// CITY SELECTION
// ============================================================

cityButtons.forEach(
  function (button) {

    if (
      button.dataset.city === "Lagos"
    ) {

      button.classList.add(
        "selected"
      );

    }


    button.addEventListener(
      "click",
      function () {

        cityButtons.forEach(
          function (city) {

            city.classList.remove(
              "selected"
            );

          }
        );


        button.classList.add(
          "selected"
        );


        selectedCity =
          button.dataset.city;


        hideValidation();

      }
    );

  }
);


// ============================================================
// NOTIFICATION TOGGLE
// ============================================================

notificationToggle.addEventListener(
  "click",
  function () {

    earlyBirdEnabled =
      !earlyBirdEnabled;


    notificationToggle.setAttribute(
      "aria-checked",
      String(
        earlyBirdEnabled
      )
    );


    if (earlyBirdEnabled) {

      notificationToggle.classList.remove(
        "bg-[#D6D8E0]"
      );

      notificationToggle.classList.add(
        "bg-[#6230F5]"
      );


      toggleKnob.classList.remove(
        "left-[3px]"
      );

      toggleKnob.classList.add(
        "right-[3px]"
      );


      toggleKnob.textContent =
        "⚡";

    }

    else {

      notificationToggle.classList.remove(
        "bg-[#6230F5]"
      );

      notificationToggle.classList.add(
        "bg-[#D6D8E0]"
      );


      toggleKnob.classList.remove(
        "right-[3px]"
      );

      toggleKnob.classList.add(
        "left-[3px]"
      );


      toggleKnob.textContent =
        "";

    }

  }
);


// ============================================================
// VALIDATION
// ============================================================

function showValidation(message) {

  validationMessage.textContent =
    message;

  validationMessage.classList.remove(
    "hidden"
  );

}


function hideValidation() {

  validationMessage.classList.add(
    "hidden"
  );

}


// ============================================================
// SAVE USER PREFERENCES
// ============================================================

function savePreferences() {

  const preferences = {

    interests:
      selectedInterests,

    city:
      selectedCity,

    early_bird_notifications:
      earlyBirdEnabled

  };


  localStorage.setItem(
    "eventra_preferences",
    JSON.stringify(
      preferences
    )
  );

}


// ============================================================
// GET STARTED
// ============================================================

getStartedBtn.addEventListener(
  "click",
  function () {

    if (
      selectedInterests.length < 3
    ) {

      showValidation(
        "Please select at least 3 interests."
      );

      return;

    }


    if (!selectedCity) {

      showValidation(
        "Please select your primary city."
      );

      return;

    }


    savePreferences();


    navigateTo(
      ROUTES.home
    );

  }
);


// ============================================================
// SKIP FOR NOW
// ============================================================

skipBtn.addEventListener(
  "click",
  function () {

    savePreferences();

    navigateTo(
      ROUTES.home
    );

  }
);


// ============================================================
// INITIALIZE
// ============================================================

updateCounter();