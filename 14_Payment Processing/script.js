document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // EVENTRA PAYMENT PROCESSING
    // SCREEN 14
    // ============================================================

    const API_BASE_URL =
        "https://eventra-backend-aidf.onrender.com/api";

    const SUCCESS_PAGE =
        "../15_Payment%20Success/index.html";


    // ============================================================
    // ELEMENTS
    // ============================================================

    const progressBar =
        document.getElementById("progressBar");

    const progressStatus =
        document.getElementById("progressStatus");

    const authorizationStatus =
        document.getElementById("authorizationStatus");

    const paymentRequestStep =
        document.getElementById("paymentRequestStep");

    const secureAuthorizationStep =
        document.getElementById("secureAuthorizationStep");

    const ticketGenerationStep =
        document.getElementById("ticketGenerationStep");

    const toast =
        document.getElementById("toast");


    // ============================================================
    // PAYMENT DATA
    // ============================================================

    const paymentReference =
        sessionStorage.getItem(
            "eventra_payment_reference"
        ) ||
        sessionStorage.getItem(
            "payment_reference"
        ) ||
        "";


    const token =
        localStorage.getItem("eventra_token") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("eventra_token") ||
        sessionStorage.getItem("access_token") ||
        sessionStorage.getItem("token") ||
        "";


    // ============================================================
    // SHOW TOAST
    // ============================================================

    function showToast(message) {

        if (!toast) {
            return;
        }

        toast.textContent = message;

        toast.classList.remove(
            "opacity-0",
            "translate-y-2"
        );

        toast.classList.add(
            "opacity-100",
            "translate-y-0"
        );

    }


    // ============================================================
    // UPDATE PROGRESS
    // ============================================================

    function updateProgress(
        percentage,
        statusText
    ) {

        if (progressBar) {

            progressBar.style.width =
                `${percentage}%`;

        }


        if (progressStatus) {

            progressStatus.textContent =
                statusText;

        }

    }


    // ============================================================
    // UPDATE PAYMENT STEPS
    // ============================================================

    function setStepState(
        step,
        state
    ) {

        if (!step) {
            return;
        }


        const circle =
            step.querySelector(
                "[data-step-circle]"
            );


        const icon =
            step.querySelector(
                "[data-step-icon]"
            );


        const text =
            step.querySelector(
                "[data-step-text]"
            );


        // --------------------------------------------------------
        // COMPLETED
        // --------------------------------------------------------

        if (state === "completed") {

            step.dataset.state =
                "completed";


            if (circle) {

                circle.classList.remove(
                    "bg-[#DCE8FF]",
                    "bg-[#6428FF]"
                );

                circle.classList.add(
                    "bg-[#6428FF]"
                );

            }


            if (icon) {

                icon.innerHTML = `
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M5 12l4 4L19 6"></path>
                    </svg>
                `;

            }


            if (text) {

                text.classList.remove(
                    "text-[#566078]",
                    "text-[#6428FF]"
                );

                text.classList.add(
                    "text-[#10213B]"
                );

            }

        }


        // --------------------------------------------------------
        // ACTIVE
        // --------------------------------------------------------

        if (state === "active") {

            step.dataset.state =
                "active";


            if (circle) {

                circle.classList.remove(
                    "bg-[#DCE8FF]"
                );

                circle.classList.add(
                    "bg-[#6428FF]"
                );

            }


            if (icon) {

                icon.innerHTML = `
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        stroke-width="2"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="7"
                        ></circle>

                        <path
                            d="M12 9v3l2 1"
                            stroke-linecap="round"
                        ></path>
                    </svg>
                `;

            }


            if (text) {

                text.classList.remove(
                    "text-[#566078]",
                    "text-[#10213B]"
                );

                text.classList.add(
                    "text-[#6428FF]"
                );

            }

        }


        // --------------------------------------------------------
        // PENDING
        // --------------------------------------------------------

        if (state === "pending") {

            step.dataset.state =
                "pending";


            if (circle) {

                circle.classList.remove(
                    "bg-[#6428FF]"
                );

                circle.classList.add(
                    "bg-[#DCE8FF]"
                );

            }


            if (icon) {

                icon.innerHTML = `
                    <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#64748B"
                        stroke-width="2"
                    >
                        <rect
                            x="5"
                            y="6"
                            width="14"
                            height="12"
                            rx="2"
                        ></rect>

                        <path
                            d="M8 10h8"
                        ></path>

                        <path
                            d="M8 14h5"
                        ></path>
                    </svg>
                `;

            }


            if (text) {

                text.classList.remove(
                    "text-[#6428FF]",
                    "text-[#10213B]"
                );

                text.classList.add(
                    "text-[#566078]"
                );

            }

        }

    }


    // ============================================================
    // REAL PAYMENT RETURN / VERIFICATION
    // ============================================================

    async function verifyPayment(reference) {
        if (!reference || !token) return false;

        try {
            const response = await fetch(`${API_BASE_URL}/payments/verify`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ reference })
            });

            const result = await response.json().catch(() => ({}));
            if (!response.ok) return false;

            const data = result?.data || result;
            const bookingId =
                data?.booking_id ||
                data?.booking?.id ||
                sessionStorage.getItem("eventra_booking_id") ||
                localStorage.getItem("eventra_booking_id") ||
                "";

            const ticketId =
                data?.ticket_id ||
                data?.ticket?.id ||
                data?.tickets?.[0]?.id ||
                sessionStorage.getItem("eventra_ticket_id") ||
                localStorage.getItem("eventra_ticket_id") ||
                "";

            if (bookingId) {
                sessionStorage.setItem("eventra_booking_id", String(bookingId));
                localStorage.setItem("eventra_booking_id", String(bookingId));
            }

            if (ticketId) {
                sessionStorage.setItem("eventra_selected_ticket_id", String(ticketId));
                sessionStorage.setItem("eventra_ticket_id", String(ticketId));
                localStorage.setItem("eventra_selected_ticket_id", String(ticketId));
                localStorage.setItem("eventra_ticket_id", String(ticketId));
            }

            sessionStorage.setItem("eventra_payment_reference", String(reference));
            localStorage.setItem("eventra_payment_reference", String(reference));
            sessionStorage.setItem("eventra_payment_verification", JSON.stringify(result));

            const paymentStatus = String(
                data?.status ||
                data?.payment_status ||
                result?.status ||
                ""
            ).toLowerCase();

            return (
                paymentStatus === "completed" ||
                paymentStatus === "success" ||
                paymentStatus === "successful" ||
                result?.status === "success"
            );
        } catch (error) {
            console.error("Payment verification error:", error);
            return false;
        }
    }

    updateProgress(35, "Waiting for secure payment confirmation...");
    setStepState(paymentRequestStep, "completed");
    setStepState(secureAuthorizationStep, "active");
    setStepState(ticketGenerationStep, "pending");

    if (authorizationStatus) authorizationStatus.textContent = "Waiting for Paystack confirmation";

    const params = new URLSearchParams(window.location.search);
    const returnedReference =
        params.get("reference") ||
        params.get("trxref") ||
        sessionStorage.getItem("eventra_payment_reference") ||
        "";

    if (returnedReference) {
        // Paystack can finish successfully before its hosted page redirects.
        // Give the backend a few chances to report the completed transaction.
        (async () => {
            let verified = false;
            for (let attempt = 1; attempt <= 5; attempt += 1) {
                verified = await verifyPayment(returnedReference);
                if (verified) break;
                if (attempt < 5) {
                    updateProgress(45 + attempt * 8, "Confirming payment with Paystack...");
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }

            if (verified) {
                sessionStorage.removeItem("eventra_paystack_active");
                sessionStorage.removeItem("eventra_paystack_started_at");
                updateProgress(100, "Payment confirmed!");
                setStepState(secureAuthorizationStep, "completed");
                setStepState(ticketGenerationStep, "completed");
                if (authorizationStatus) authorizationStatus.textContent = "Payment confirmed";
                setTimeout(() => window.location.assign(`${SUCCESS_PAGE}?reference=${encodeURIComponent(returnedReference)}`), 500);
            } else {
                console.error(
                    "[Eventra] Payment verification did not return a completed status.",
                    {
                        reference: returnedReference,
                        bookingId: sessionStorage.getItem("eventra_booking_id") || "",
                        verification: sessionStorage.getItem("eventra_payment_verification") || null
                    }
                );

                // Do NOT send the user back to Screen 13 automatically.
                // Keep the user on Processing so the payment flow does not
                // loop back to the previous screen after a Paystack success.
                updateProgress(100, "Payment confirmation is taking longer than expected.");
                if (authorizationStatus) {
                    authorizationStatus.textContent =
                        "We are still confirming your payment. Please wait or try again.";
                }
                showToast("We are still confirming your payment.");
            }
        })();
    } else {
        // This screen is retained as a real-payment return state. It must never fabricate a successful payment.
        setTimeout(() => {
            if (progressStatus) progressStatus.textContent = "Waiting for Paystack to return your payment result...";
        }, 500);
    }


    // ============================================================
    // OPTIONAL REAL PAYMENT VERIFICATION
    // Verification is handled above when Paystack returns a reference.


    // ============================================================
    // PREVENT ACCIDENTAL BACK NAVIGATION
    //
    // The processing screen should not encourage the user to
    // leave while payment is being processed.
    // ============================================================

    history.pushState(
        null,
        "",
        window.location.href
    );


    window.addEventListener(
        "popstate",
        () => {

            history.pushState(
                null,
                "",
                window.location.href
            );

        }
    );

});