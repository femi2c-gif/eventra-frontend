document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // EVENTRA PAYMENT PROCESSING
    // SCREEN 14
    // ============================================================

    const API_BASE_URL =
        "https://eventra-backend-aidf.onrender.com/api";

    const SUCCESS_PAGE =
        "../15_Payment%20Success/index.html";

    const VERIFY_RETRY_COUNT = 30;
    const VERIFY_RETRY_DELAY = 2000;
    const SUCCESS_DELAY_SECONDS = 5;

    // ============================================================
    // ELEMENTS
    // ============================================================

    const progressBar = document.getElementById("progressBar");
    const progressStatus = document.getElementById("progressStatus");
    const authorizationStatus = document.getElementById("authorizationStatus");
    const paymentRequestStep = document.getElementById("paymentRequestStep");
    const secureAuthorizationStep = document.getElementById("secureAuthorizationStep");
    const ticketGenerationStep = document.getElementById("ticketGenerationStep");
    const toast = document.getElementById("toast");

    // ============================================================
    // STORAGE HELPERS
    // ============================================================

    function getStoredValue(keys) {
        for (const key of keys) {
            const sessionValue = sessionStorage.getItem(key);
            if (sessionValue) return sessionValue;

            const localValue = localStorage.getItem(key);
            if (localValue) return localValue;
        }

        return "";
    }

    function getAccessToken() {
        // access_token is the backend's documented JWT storage key.
        // eventra_token/token are retained as compatibility fallbacks.
        return getStoredValue([
            "access_token",
            "eventra_token",
            "token"
        ]);
    }

    function getPaymentReference() {
        const params = new URLSearchParams(window.location.search);

        return (
            params.get("reference") ||
            params.get("trxref") ||
            getStoredValue([
                "eventra_payment_reference",
                "payment_reference"
            ])
        );
    }

    // ============================================================
    // TOAST
    // ============================================================

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.remove("opacity-0", "translate-y-2");
        toast.classList.add("opacity-100", "translate-y-0");
    }

    // ============================================================
    // PROGRESS
    // ============================================================

    function updateProgress(percentage, statusText) {
        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressStatus) progressStatus.textContent = statusText;
    }

    // ============================================================
    // PAYMENT STEPS
    // ============================================================

    function setStepState(step, state) {
        if (!step) return;

        const circle = step.querySelector("[data-step-circle]");
        const icon = step.querySelector("[data-step-icon]");
        const text = step.querySelector("[data-step-text]");

        if (state === "completed") {
            step.dataset.state = "completed";

            if (circle) {
                circle.classList.remove("bg-[#DCE8FF]", "bg-[#6428FF]");
                circle.classList.add("bg-[#6428FF]");
            }

            if (icon) {
                icon.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12l4 4L19 6"></path>
                    </svg>
                `;
            }

            if (text) {
                text.classList.remove("text-[#566078]", "text-[#6428FF]");
                text.classList.add("text-[#10213B]");
            }
        }

        if (state === "active") {
            step.dataset.state = "active";

            if (circle) {
                circle.classList.remove("bg-[#DCE8FF]");
                circle.classList.add("bg-[#6428FF]");
            }

            if (icon) {
                icon.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="white" stroke-width="2">
                        <circle cx="12" cy="12" r="7"></circle>
                        <path d="M12 9v3l2 1" stroke-linecap="round"></path>
                    </svg>
                `;
            }

            if (text) {
                text.classList.remove("text-[#566078]", "text-[#10213B]");
                text.classList.add("text-[#6428FF]");
            }
        }

        if (state === "pending") {
            step.dataset.state = "pending";

            if (circle) {
                circle.classList.remove("bg-[#6428FF]");
                circle.classList.add("bg-[#DCE8FF]");
            }

            if (icon) {
                icon.innerHTML = `
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                        stroke="#64748B" stroke-width="2">
                        <rect x="5" y="6" width="14" height="12" rx="2"></rect>
                        <path d="M8 10h8"></path>
                        <path d="M8 14h5"></path>
                    </svg>
                `;
            }

            if (text) {
                text.classList.remove("text-[#6428FF]", "text-[#10213B]");
                text.classList.add("text-[#566078]");
            }
        }
    }

    // ============================================================
    // SAVE VERIFIED PAYMENT DATA
    // ============================================================

    function savePaymentValue(key, value) {
        if (value === undefined || value === null || value === "") return;
        sessionStorage.setItem(key, String(value));
        localStorage.setItem(key, String(value));
    }

    function findNestedValue(objects, keys) {
        for (const object of objects) {
            if (!object || typeof object !== "object") continue;

            for (const key of keys) {
                if (object[key] !== undefined && object[key] !== null && object[key] !== "") {
                    return object[key];
                }
            }
        }

        return "";
    }

    function extractVerifiedIds(result) {
        const data = result?.data || {};
        const booking = data?.booking || result?.booking || {};

        const containers = [
            data,
            result,
            booking,
            data?.payment,
            result?.payment
        ];

        let bookingId = findNestedValue(containers, [
            "booking_id",
            "bookingId",
            "id"
        ]);

        let ticketId = findNestedValue(containers, [
            "ticket_id",
            "ticketId"
        ]);

        const ticketCollections = [
            data?.tickets,
            data?.Tickets,
            result?.tickets,
            result?.Tickets,
            booking?.tickets,
            booking?.Tickets
        ];

        for (const tickets of ticketCollections) {
            if (Array.isArray(tickets) && tickets.length) {
                ticketId = ticketId || tickets[0]?.id || tickets[0]?.ticket_id || "";
                break;
            }
        }

        // The booking created during Screen 12 already contains Tickets.
        // Keep those real IDs if the verification response only returns payment data.
        if (!bookingId) {
            bookingId = getStoredValue([
                "eventra_booking_id"
            ]);
        }

        if (!ticketId) {
            const bookingDataRaw = sessionStorage.getItem("eventra_booking_data");
            if (bookingDataRaw) {
                try {
                    const bookingData = JSON.parse(bookingDataRaw);
                    const bookingObject = bookingData?.data || bookingData;
                    bookingId = bookingId || bookingObject?.id || "";
                    ticketId =
                        bookingObject?.Tickets?.[0]?.id ||
                        bookingObject?.tickets?.[0]?.id ||
                        ticketId;
                } catch (error) {
                    console.warn("Could not read stored booking data:", error);
                }
            }
        }

        return { bookingId, ticketId };
    }

    function saveVerifiedPayment(result, reference) {
        const { bookingId, ticketId } = extractVerifiedIds(result);

        if (bookingId) {
            savePaymentValue("eventra_booking_id", bookingId);
        }

        if (ticketId) {
            savePaymentValue("eventra_ticket_id", ticketId);
            savePaymentValue("eventra_selected_ticket_id", ticketId);
        }

        savePaymentValue("eventra_payment_reference", reference);
        sessionStorage.setItem("eventra_payment_verification", JSON.stringify(result));
        localStorage.setItem("eventra_payment_verification", JSON.stringify(result));

        return { bookingId, ticketId };
    }

    // ============================================================
    // VERIFY PAYMENT WITH BACKEND
    // ============================================================

    async function verifyPayment(reference) {
        const accessToken = getAccessToken();

        if (!reference) {
            console.error("[Eventra] No Paystack reference was returned.");
            return { verified: false, reason: "missing_reference" };
        }

        if (!accessToken) {
            console.error("[Eventra] No access_token was found in storage.");
            return { verified: false, reason: "missing_token" };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/payments/verify`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ reference })
            });

            const result = await response.json().catch(() => ({}));

            console.log("[Eventra] Payment verification response:", {
                httpStatus: response.status,
                result
            });

            if (!response.ok) {
                return {
                    verified: false,
                    reason: "http_error",
                    httpStatus: response.status,
                    result
                };
            }

            const data = result?.data || {};
            const payment = data?.payment || result?.payment || {};
            const transaction = data?.transaction || result?.transaction || {};

            const status = String(
                data?.status ||
                data?.payment_status ||
                data?.paymentStatus ||
                data?.transaction_status ||
                data?.transactionStatus ||
                payment?.status ||
                payment?.payment_status ||
                transaction?.status ||
                transaction?.payment_status ||
                result?.status ||
                ""
            ).toLowerCase();

            const verified =
                result?.status === "success" ||
                result?.success === true ||
                data?.success === true ||
                ["success", "successful", "completed", "paid"].includes(status);

            if (!verified) {
                return {
                    verified: false,
                    reason: "not_successful",
                    result
                };
            }

            saveVerifiedPayment(result, reference);

            return {
                verified: true,
                result
            };
        } catch (error) {
            console.error("[Eventra] Payment verification request failed:", error);

            return {
                verified: false,
                reason: "network_error",
                error
            };
        }
    }

    // ============================================================
    // FIVE-SECOND CONFIRMED PAYMENT TRANSITION
    // ============================================================

    function goToPaymentSuccess(reference) {
        let seconds = SUCCESS_DELAY_SECONDS;

        updateProgress(100, `Payment confirmed! Continuing in ${seconds}s...`);
        setStepState(secureAuthorizationStep, "completed");
        setStepState(ticketGenerationStep, "completed");

        if (authorizationStatus) {
            authorizationStatus.textContent =
                `Payment confirmed. Continuing to Payment Success in ${seconds} seconds.`;
        }

        const interval = setInterval(() => {
            seconds -= 1;

            if (seconds > 0) {
                updateProgress(100, `Payment confirmed! Continuing in ${seconds}s...`);
                if (authorizationStatus) {
                    authorizationStatus.textContent =
                        `Payment confirmed. Continuing to Payment Success in ${seconds} seconds.`;
                }
                return;
            }

            clearInterval(interval);

            const url =
                `${SUCCESS_PAGE}?reference=${encodeURIComponent(reference)}`;

            window.location.replace(url);
        }, 1000);
    }

    // ============================================================
    // INITIAL STATE
    // ============================================================

    updateProgress(35, "Waiting for secure payment confirmation...");
    setStepState(paymentRequestStep, "completed");
    setStepState(secureAuthorizationStep, "active");
    setStepState(ticketGenerationStep, "pending");

    if (authorizationStatus) {
        authorizationStatus.textContent =
            "Waiting for Paystack confirmation";
    }

    // ============================================================
    // RETURNED PAYSTACK REFERENCE
    // ============================================================

    const returnedReference = getPaymentReference();

    if (returnedReference) {
        sessionStorage.setItem("eventra_payment_reference", returnedReference);
        localStorage.setItem("eventra_payment_reference", returnedReference);

        (async () => {
            let verifiedResponse = null;

            for (let attempt = 1; attempt <= VERIFY_RETRY_COUNT; attempt += 1) {
                updateProgress(
                    Math.min(90, 40 + attempt * 7),
                    attempt === 1
                        ? "Confirming payment with Eventra..."
                        : `Confirming payment with Eventra (attempt ${attempt}/${VERIFY_RETRY_COUNT})...`
                );

                if (authorizationStatus) {
                    authorizationStatus.textContent =
                        "Securely verifying your Paystack payment";
                }

                verifiedResponse = await verifyPayment(returnedReference);

                if (verifiedResponse.verified) {
                    break;
                }

                if (attempt < VERIFY_RETRY_COUNT) {
                    await new Promise(resolve =>
                        setTimeout(resolve, VERIFY_RETRY_DELAY)
                    );
                }
            }

            if (verifiedResponse?.verified) {
                sessionStorage.removeItem("eventra_paystack_active");
                sessionStorage.removeItem("eventra_paystack_started_at");

                goToPaymentSuccess(returnedReference);
                return;
            }

            const reason = verifiedResponse?.reason || "unknown";

            console.error(
                "[Eventra] Payment verification did not complete.",
                {
                    reference: returnedReference,
                    reason,
                    bookingId: getStoredValue(["eventra_booking_id"])
                }
            );

            updateProgress(90, "Payment confirmation is still pending.");

            if (authorizationStatus) {
                authorizationStatus.textContent =
                    "We could not confirm the payment yet. Please do not make another payment. Try again shortly.";
            }

            showToast(
                "Payment verification is still pending. The page will keep checking automatically."
            );

            // Give the user a safe manual retry after the automatic window.
            // This never marks the payment as successful without backend verification.
            const retryButton = document.createElement("button");
            retryButton.type = "button";
            retryButton.textContent = "Check Payment Again";
            retryButton.style.cssText = [
                "position:fixed",
                "left:50%",
                "bottom:24px",
                "transform:translateX(-50%)",
                "z-index:99999",
                "padding:12px 18px",
                "border:0",
                "border-radius:12px",
                "background:#6428FF",
                "color:#fff",
                "font:600 14px Arial,sans-serif",
                "cursor:pointer",
                "box-shadow:0 10px 30px rgba(0,0,0,.18)"
            ].join(";");

            retryButton.addEventListener("click", () => {
                retryButton.disabled = true;
                retryButton.textContent = "Checking...";
                window.location.reload();
            });

            document.body.appendChild(retryButton);
        })();
    } else {
        updateProgress(
            35,
            "Waiting for Paystack to return your payment result..."
        );

        if (authorizationStatus) {
            authorizationStatus.textContent =
                "Waiting for Paystack to return your payment result";
        }
    }

    // ============================================================
    // PREVENT ACCIDENTAL BACK NAVIGATION
    // ============================================================

    history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", () => {
        history.pushState(null, "", window.location.href);
    });

});
