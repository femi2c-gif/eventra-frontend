// ============================================================
// EVENTRA
// SCREEN 03 - VERIFY ACCOUNT
// API INTEGRATION
// ============================================================

const API_BASE_URL =
  "https://eventra-backend-aidf.onrender.com/api";

const ROUTES = {
  back: "../02_Create%20Account/index.html",
  verified: "../04_Account%20Verified/index.html",
  signIn: "../09_Sign%20In/index.html"
};

const backBtn = document.getElementById("backBtn");
const editEmailBtn = document.getElementById("editEmailBtn");
const emailDisplay = document.getElementById("emailDisplay");
const resendBtn = document.getElementById("resendBtn");
const countdown = document.getElementById("countdown");
const verifyBtn = document.getElementById("verifyBtn");
const otpInputs = document.querySelectorAll(".otp-input");

const savedEmail = localStorage.getItem("eventra_email") || "";
const verificationId =
  localStorage.getItem("eventra_verification_id") || "";

if (emailDisplay) {
  emailDisplay.textContent = savedEmail || "your email address";
}

function navigateTo(route) {
  window.location.href = route;
}

function getOTP() {
  return Array.from(otpInputs)
    .map((input) => input.value)
    .join("");
}

function updateVerifyButton() {
  if (verifyBtn) {
    verifyBtn.disabled = getOTP().length !== 6;
  }
}

function setButtonLoading(button, loading, loadingText) {
  if (!button) return;

  if (loading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent.trim();
    button.textContent = loadingText;
  } else {
    button.disabled = false;
    if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
    }
  }
}

// ============================================================
// OTP INPUT
// ============================================================

otpInputs.forEach((input, index) => {
  input.addEventListener("input", (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 1);

    event.target.value = value;

    if (value && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }

    updateVerifyButton();
  });

  input.addEventListener("keydown", (event) => {
    if (
      event.key === "Backspace" &&
      !input.value &&
      index > 0
    ) {
      otpInputs[index - 1].focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      otpInputs[index - 1].focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < otpInputs.length - 1
    ) {
      otpInputs[index + 1].focus();
    }
  });

  input.addEventListener("paste", (event) => {
    event.preventDefault();

    const pasted = (
      event.clipboardData ||
      window.clipboardData
    )
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    pasted.split("").forEach((digit, digitIndex) => {
      if (otpInputs[digitIndex]) {
        otpInputs[digitIndex].value = digit;
      }
    });

    const focusIndex = Math.min(
      pasted.length,
      otpInputs.length - 1
    );

    if (otpInputs[focusIndex]) {
      otpInputs[focusIndex].focus();
    }

    updateVerifyButton();
  });
});

// ============================================================
// COUNTDOWN
// ============================================================

let remainingSeconds = 47;
let countdownTimer = null;

function renderCountdown() {
  if (!countdown) return;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  countdown.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startCountdown() {
  clearInterval(countdownTimer);

  remainingSeconds = 47;
  renderCountdown();

  if (resendBtn) {
    resendBtn.disabled = true;
  }

  countdownTimer = setInterval(() => {
    remainingSeconds -= 1;
    renderCountdown();

    if (remainingSeconds <= 0) {
      clearInterval(countdownTimer);
      if (resendBtn) {
        resendBtn.disabled = false;
      }
    }
  }, 1000);
}

// ============================================================
// VERIFY EMAIL
// ============================================================

async function verifyEmail() {
  const code = getOTP();

  if (code.length !== 6) return;

  if (!verificationId) {
    alert(
      "Your verification session is missing. Please return to Create Account and register again."
    );
    return;
  }

  setButtonLoading(verifyBtn, true, "Verifying...");

  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/verify-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          code,
          verification_id: verificationId
        })
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.status === "error") {
      throw new Error(
        result.message ||
        "The verification code is invalid or has expired."
      );
    }

    const data = result.data || {};

    // Backend handoff says verification may return tokens.
    // Support that while remaining compatible with the
    // documented user-only verification response.
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("eventra_token", data.access_token);
    }

    if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
    }

    if (data.user) {
      localStorage.setItem(
        "eventra_user",
        JSON.stringify(data.user)
      );
    }

    localStorage.setItem(
      "eventra_email_verified",
      "true"
    );

    localStorage.removeItem(
      "eventra_verification_id"
    );

    navigateTo(ROUTES.verified);

  } catch (error) {
    console.error("Eventra Verify Email Error:", error);

    alert(
      error.message ||
      "Unable to verify your email. Please try again."
    );
  } finally {
    setButtonLoading(verifyBtn, false);
    updateVerifyButton();
  }
}

if (verifyBtn) {
  verifyBtn.addEventListener("click", verifyEmail);
}

// ============================================================
// RESEND VERIFICATION
// ============================================================

async function resendVerification() {
  if (!savedEmail) {
    alert(
      "Your email address is missing. Please return to Create Account."
    );
    return;
  }

  setButtonLoading(resendBtn, true, "Sending...");

  try {
    // The test report confirms this endpoint is live.
    // The detailed guide does not document its request body,
    // so email is used as the account identifier.
    const response = await fetch(
      `${API_BASE_URL}/auth/resend-verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: savedEmail
        })
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.status === "error") {
      throw new Error(
        result.message ||
        "Unable to resend the verification code. Please try again."
      );
    }

    startCountdown();

  } catch (error) {
    console.error(
      "Eventra Resend Verification Error:",
      error
    );

    alert(
      error.message ||
      "Unable to resend the verification code."
    );

    if (resendBtn) {
      resendBtn.disabled = false;
    }
  }
}

if (resendBtn) {
  resendBtn.addEventListener(
    "click",
    resendVerification
  );
}

// ============================================================
// NAVIGATION
// ============================================================

if (backBtn) {
  backBtn.addEventListener(
    "click",
    () => navigateTo(ROUTES.back)
  );
}

if (editEmailBtn) {
  editEmailBtn.addEventListener(
    "click",
    () => navigateTo(ROUTES.back)
  );
}

// ============================================================
// INITIALIZE
// ============================================================

updateVerifyButton();
startCountdown();
