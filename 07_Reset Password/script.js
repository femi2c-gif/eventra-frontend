// ============================================================
// EVENTRA
// SCREEN 07 - RESET PASSWORD
// ============================================================

const ROUTES = {

  signIn:
    "../09_Sign_In/index.html",

  success:
    "../08_Password%20Reset%20Successful/index.html"

};


// ============================================================
// DOM ELEMENTS
// ============================================================

const backButton =
  document.getElementById("backButton");

const resetPasswordForm =
  document.getElementById(
    "resetPasswordForm"
  );

const newPassword =
  document.getElementById(
    "newPassword"
  );

const confirmPassword =
  document.getElementById(
    "confirmPassword"
  );

const newPasswordWrapper =
  document.getElementById(
    "newPasswordWrapper"
  );

const confirmPasswordWrapper =
  document.getElementById(
    "confirmPasswordWrapper"
  );

const newPasswordError =
  document.getElementById(
    "newPasswordError"
  );

const confirmPasswordError =
  document.getElementById(
    "confirmPasswordError"
  );

const toggleNewPassword =
  document.getElementById(
    "toggleNewPassword"
  );

const toggleConfirmPassword =
  document.getElementById(
    "toggleConfirmPassword"
  );

const passwordStrength =
  document.getElementById(
    "passwordStrength"
  );

const matchStatus =
  document.getElementById(
    "matchStatus"
  );

const signOutOption =
  document.getElementById(
    "signOutOption"
  );

const signOutCheckbox =
  document.getElementById(
    "signOutCheckbox"
  );

const signOutCheckIcon =
  document.getElementById(
    "signOutCheckIcon"
  );

const resetButton =
  document.getElementById(
    "resetButton"
  );

const resetButtonText =
  document.getElementById(
    "resetButtonText"
  );

const resetButtonArrow =
  document.getElementById(
    "resetButtonArrow"
  );

const resetSpinner =
  document.getElementById(
    "resetSpinner"
  );

const cancelButton =
  document.getElementById(
    "cancelButton"
  );

const successMessage =
  document.getElementById(
    "successMessage"
  );


// ============================================================
// STATE
// ============================================================

let signOutAllDevices = false;


// ============================================================
// INITIALIZATION
// ============================================================

console.log(
  "Eventra Reset Password initialized."
);


// ============================================================
// NAVIGATION
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

        navigateTo(
          ROUTES.signIn
        );

      }

    }
  );

}


// ============================================================
// CANCEL
// ============================================================

if (cancelButton) {

  cancelButton.addEventListener(
    "click",
    function () {

      navigateTo(
        ROUTES.signIn
      );

    }
  );

}


// ============================================================
// PASSWORD VISIBILITY
// ============================================================

function togglePasswordVisibility(
  input,
  button
) {

  if (!input || !button) return;

  const showingPassword =
    input.type === "password";


  input.type =
    showingPassword
      ? "text"
      : "password";


  button.setAttribute(
    "aria-label",
    showingPassword
      ? "Hide password"
      : "Show password"
  );

}


if (toggleNewPassword) {

  toggleNewPassword.addEventListener(
    "click",
    function () {

      togglePasswordVisibility(
        newPassword,
        toggleNewPassword
      );

    }
  );

}


if (toggleConfirmPassword) {

  toggleConfirmPassword.addEventListener(
    "click",
    function () {

      togglePasswordVisibility(
        confirmPassword,
        toggleConfirmPassword
      );

    }
  );

}


// ============================================================
// PASSWORD REQUIREMENTS
// ============================================================

function getPasswordRequirements(
  password
) {

  return {

    length:
      password.length >= 8,

    uppercase:
      /[A-Z]/.test(password),

    number:
      /[0-9]/.test(password),

    special:
      /[@#$%&]/.test(password)

  };

}


// ============================================================
// CHECKLIST ITEM
// ============================================================

function updateChecklistItem(
  id,
  valid
) {

  const element =
    document.getElementById(id);

  if (!element) return;

  const icon =
    element.querySelector("span");

  if (!icon) return;


  if (valid) {

    icon.classList.remove(
      "bg-[#E5E7EB]",
      "text-[#9CA3AF]"
    );

    icon.classList.add(
      "bg-[#6230F5]",
      "text-white"
    );

  } else {

    icon.classList.remove(
      "bg-[#6230F5]",
      "text-white"
    );

    icon.classList.add(
      "bg-[#E5E7EB]",
      "text-[#9CA3AF]"
    );

  }

}


// ============================================================
// PASSWORD STRENGTH
// ============================================================

function updatePasswordStrength(
  requirements
) {

  const score =
    Object.values(
      requirements
    ).filter(Boolean).length;


  if (!passwordStrength) return;


  if (score === 4) {

    passwordStrength.textContent =
      "Strong password";

    passwordStrength.className =
      "text-[10px] font-semibold text-[#16A34A] sm:text-[11px]";

  } else if (score >= 2) {

    passwordStrength.textContent =
      "Good password";

    passwordStrength.className =
      "text-[10px] font-semibold text-[#D97706] sm:text-[11px]";

  } else {

    passwordStrength.textContent =
      "Weak password";

    passwordStrength.className =
      "text-[10px] font-semibold text-[#DC2626] sm:text-[11px]";

  }

}


// ============================================================
// UPDATE CHECKLIST
// ============================================================

function updateChecklist() {

  if (!newPassword) return;


  const requirements =
    getPasswordRequirements(
      newPassword.value
    );


  updateChecklistItem(
    "checkLength",
    requirements.length
  );

  updateChecklistItem(
    "checkCase",
    requirements.uppercase &&
    requirements.number
  );

  updateChecklistItem(
    "checkSpecial",
    requirements.special
  );


  updatePasswordStrength(
    requirements
  );

}


// ============================================================
// CLEAR NEW PASSWORD ERROR
// ============================================================

function clearNewPasswordError() {

  if (newPasswordError) {

    newPasswordError.textContent = "";

    newPasswordError.classList.add(
      "hidden"
    );

  }


  if (newPasswordWrapper) {

    newPasswordWrapper.classList.remove(
      "border-red-300",
      "bg-red-50"
    );

    newPasswordWrapper.classList.add(
      "border-[#ECEEF4]"
    );

  }

}


// ============================================================
// SHOW NEW PASSWORD ERROR
// ============================================================

function showNewPasswordError(
  message
) {

  if (newPasswordError) {

    newPasswordError.textContent =
      message;

    newPasswordError.classList.remove(
      "hidden"
    );

  }


  if (newPasswordWrapper) {

    newPasswordWrapper.classList.remove(
      "border-[#ECEEF4]"
    );

    newPasswordWrapper.classList.add(
      "border-red-300",
      "bg-red-50"
    );

  }

}


// ============================================================
// CLEAR CONFIRM PASSWORD ERROR
// ============================================================

function clearConfirmPasswordError() {

  if (confirmPasswordError) {

    confirmPasswordError.textContent =
      "";

    confirmPasswordError.classList.add(
      "hidden"
    );

  }


  if (confirmPasswordWrapper) {

    confirmPasswordWrapper.classList.remove(
      "border-red-300",
      "bg-red-50"
    );

    confirmPasswordWrapper.classList.add(
      "border-[#ECEEF4]"
    );

  }

}


// ============================================================
// SHOW CONFIRM PASSWORD ERROR
// ============================================================

function showConfirmPasswordError(
  message
) {

  if (confirmPasswordError) {

    confirmPasswordError.textContent =
      message;

    confirmPasswordError.classList.remove(
      "hidden"
    );

  }


  if (confirmPasswordWrapper) {

    confirmPasswordWrapper.classList.remove(
      "border-[#ECEEF4]"
    );

    confirmPasswordWrapper.classList.add(
      "border-red-300",
      "bg-red-50"
    );

  }

}


// ============================================================
// PASSWORD MATCH
// ============================================================

function checkPasswordMatch() {

  if (
    !newPassword ||
    !confirmPassword
  ) {
    return false;
  }


  const password =
    newPassword.value;

  const confirmation =
    confirmPassword.value;


  if (!confirmation) {

    if (matchStatus) {
      matchStatus.classList.add(
        "hidden"
      );
    }

    return false;

  }


  if (
    password === confirmation
  ) {

    clearConfirmPasswordError();


    if (matchStatus) {

      matchStatus.classList.remove(
        "hidden"
      );

      matchStatus.classList.add(
        "flex"
      );

    }


    return true;

  }


  if (matchStatus) {

    matchStatus.classList.add(
      "hidden"
    );

    matchStatus.classList.remove(
      "flex"
    );

  }


  return false;

}


// ============================================================
// PASSWORD INPUT
// ============================================================

if (newPassword) {

  newPassword.addEventListener(
    "input",
    function () {

      clearNewPasswordError();

      updateChecklist();

      checkPasswordMatch();

    }
  );

}


if (confirmPassword) {

  confirmPassword.addEventListener(
    "input",
    function () {

      clearConfirmPasswordError();

      checkPasswordMatch();

    }
  );

}


// ============================================================
// SIGN OUT ALL DEVICES
// ============================================================

function updateSignOutVisual() {

  if (
    !signOutCheckbox ||
    !signOutCheckIcon ||
    !signOutOption
  ) {
    return;
  }


  if (signOutAllDevices) {

    signOutCheckbox.classList.remove(
      "bg-white"
    );

    signOutCheckbox.classList.add(
      "bg-[#6230F5]"
    );


    signOutCheckIcon.classList.remove(
      "hidden"
    );


    signOutOption.setAttribute(
      "aria-checked",
      "true"
    );


    signOutOption.classList.add(
      "border-[#D8D0FF]",
      "bg-[#FCFBFF]"
    );

  } else {

    signOutCheckbox.classList.remove(
      "bg-[#6230F5]"
    );

    signOutCheckbox.classList.add(
      "bg-white"
    );


    signOutCheckIcon.classList.add(
      "hidden"
    );


    signOutOption.setAttribute(
      "aria-checked",
      "false"
    );


    signOutOption.classList.remove(
      "border-[#D8D0FF]",
      "bg-[#FCFBFF]"
    );

  }


  localStorage.setItem(
    "eventra_sign_out_devices",
    String(signOutAllDevices)
  );

}


function toggleSignOutDevices() {

  signOutAllDevices =
    !signOutAllDevices;

  updateSignOutVisual();

}


if (signOutOption) {

  signOutOption.addEventListener(
    "click",
    toggleSignOutDevices
  );


  signOutOption.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        toggleSignOutDevices();

      }

    }
  );

}


// ============================================================
// RESTORE CHECKBOX STATE
// ============================================================

const savedSignOutState =
  localStorage.getItem(
    "eventra_sign_out_devices"
  );


if (savedSignOutState === "true") {

  signOutAllDevices = true;

}


updateSignOutVisual();


// ============================================================
// LOADING STATE
// ============================================================

function setLoading(
  loading
) {

  if (!resetButton) return;


  resetButton.disabled =
    loading;


  if (loading) {

    if (resetButtonText) {

      resetButtonText.textContent =
        "Resetting...";

    }


    if (resetButtonArrow) {

      resetButtonArrow.classList.add(
        "hidden"
      );

    }


    if (resetSpinner) {

      resetSpinner.classList.remove(
        "hidden"
      );

    }

  } else {

    if (resetButtonText) {

      resetButtonText.textContent =
        "Reset Password & Login";

    }


    if (resetButtonArrow) {

      resetButtonArrow.classList.remove(
        "hidden"
      );

    }


    if (resetSpinner) {

      resetSpinner.classList.add(
        "hidden"
      );

    }

  }

}


// ============================================================
// VALIDATE PASSWORD
// ============================================================

function validatePassword() {

  const password =
    newPassword.value;

  const requirements =
    getPasswordRequirements(
      password
    );


  if (!password) {

    showNewPasswordError(
      "Please enter a new password."
    );

    return false;

  }


  if (
    !requirements.length ||
    !requirements.uppercase ||
    !requirements.number ||
    !requirements.special
  ) {

    showNewPasswordError(
      "Your password must be at least 8 characters and include an uppercase letter, a number, and a special character."
    );

    return false;

  }


  return true;

}


// ============================================================
// RESET FORM
// ============================================================

if (resetPasswordForm) {

  resetPasswordForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      clearNewPasswordError();

      clearConfirmPasswordError();


      // ------------------------------------------------------
      // VALIDATE NEW PASSWORD
      // ------------------------------------------------------

      if (!validatePassword()) {

        newPassword.focus();

        return;

      }


      // ------------------------------------------------------
      // VALIDATE CONFIRM PASSWORD
      // ------------------------------------------------------

      if (
        !confirmPassword.value
      ) {

        showConfirmPasswordError(
          "Please confirm your new password."
        );

        confirmPassword.focus();

        return;

      }


      if (
        newPassword.value !==
        confirmPassword.value
      ) {

        showConfirmPasswordError(
          "Passwords do not match."
        );

        confirmPassword.focus();

        return;

      }


      // ------------------------------------------------------
      // CHECK RESET TOKEN
      // ------------------------------------------------------

      const params =
        new URLSearchParams(
          window.location.search
        );


      const resetToken =
        params.get("token") ||
        params.get("reset_token");


      const storedToken =
        sessionStorage.getItem(
          "eventra_reset_token"
        ) ||
        localStorage.getItem(
          "eventra_reset_token"
        );


      const token =
        resetToken ||
        storedToken;


      // ------------------------------------------------------
      // RESET PASSWORD API
      // ------------------------------------------------------

      const email =
        localStorage.getItem("eventra_reset_email") ||
        localStorage.getItem("eventra_email") ||
        "";

      if (!email) {

        showResetApiMessage(
          "Your reset email could not be identified. Please request a new password reset link."
        );

        return;

      }

      setLoading(true);

      try {

        const response = await fetch(
          `${API_BASE_URL}/auth/reset-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              email,
              token,
              new_password: newPassword.value
            })
          }
        );

        const result =
          await response.json().catch(() => ({}));

        if (!response.ok || result.status === "error") {
          throw new Error(
            result.message ||
            "Unable to reset your password. Please request a new reset link."
          );
        }

        sessionStorage.removeItem("eventra_reset_token");
        localStorage.removeItem("eventra_reset_token");
        localStorage.removeItem("eventra_reset_email");

        window.location.href = ROUTES.success;

      } catch (error) {

        console.error(
          "Eventra Reset Password Error:",
          error
        );

        showResetApiMessage(
          error.message ||
          "Unable to reset your password. Please try again."
        );

      } finally {

        setLoading(false);

      }


    }
  );

}


// ============================================================
// RESET API MESSAGE
// ============================================================

function showResetApiMessage(
  message
) {

  if (!successMessage) {

    alert(message);

    return;

  }


  successMessage.textContent =
    message;

  successMessage.classList.remove(
    "hidden"
  );


  successMessage.classList.remove(
    "bg-green-50",
    "text-green-700"
  );

  successMessage.classList.add(
    "bg-red-50",
    "text-red-600"
  );

}


// ============================================================
// INITIAL CHECKLIST
// ============================================================

updateChecklist();

checkPasswordMatch();