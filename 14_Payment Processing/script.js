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
        localStorage.getItem("token") ||
        localStorage.getItem("eventra_token") ||
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
    // INITIAL STATE
    // ============================================================

    updateProgress(
        10,
        "Initializing payment..."
    );


    setStepState(
        paymentRequestStep,
        "active"
    );


    setStepState(
        secureAuthorizationStep,
        "pending"
    );


    setStepState(
        ticketGenerationStep,
        "pending"
    );


    // ============================================================
    // PROCESSING ANIMATION
    //
    // Total frontend demo processing time:
    // approximately 7 seconds.
    // ============================================================

    const processingSteps = [

        {
            delay: 700,
            progress: 25,
            status: "Payment request initiated...",
            authorization: "Initializing authorization..."
        },

        {
            delay: 1800,
            progress: 48,
            status: "Payment request confirmed...",
            authorization: "Connecting to bank..."
        },

        {
            delay: 3000,
            progress: 68,
            status: "Bank authorization in progress...",
            authorization: "Awaiting bank confirmation..."
        },

        {
            delay: 4400,
            progress: 82,
            status: "Bank authorization successful...",
            authorization: "Authorization approved"
        },

        {
            delay: 5600,
            progress: 94,
            status: "Generating your ticket...",
            authorization: "Preparing ticket & QR..."
        },

        {
            delay: 6500,
            progress: 100,
            status: "Payment confirmed!",
            authorization: "Payment successful"
        }

    ];


    processingSteps.forEach(
        (step) => {

            setTimeout(
                () => {

                    updateProgress(
                        step.progress,
                        step.status
                    );


                    if (
                        authorizationStatus
                    ) {

                        authorizationStatus.textContent =
                            step.authorization;

                    }


                    // ------------------------------------------------
                    // PAYMENT REQUEST COMPLETED
                    // ------------------------------------------------

                    if (
                        step.progress >= 48
                    ) {

                        setStepState(
                            paymentRequestStep,
                            "completed"
                        );

                        setStepState(
                            secureAuthorizationStep,
                            "active"
                        );

                    }


                    // ------------------------------------------------
                    // BANK AUTHORIZATION COMPLETED
                    // ------------------------------------------------

                    if (
                        step.progress >= 82
                    ) {

                        setStepState(
                            secureAuthorizationStep,
                            "completed"
                        );

                        setStepState(
                            ticketGenerationStep,
                            "active"
                        );

                    }


                    // ------------------------------------------------
                    // EVERYTHING COMPLETED
                    // ------------------------------------------------

                    if (
                        step.progress === 100
                    ) {

                        setStepState(
                            ticketGenerationStep,
                            "completed"
                        );


                        if (authorizationStatus) {

                            authorizationStatus.textContent =
                                "Payment confirmed";

                        }

                    }

                },
                step.delay
            );

        }
    );


    // ============================================================
    // AUTOMATIC REDIRECT
    //
    // Wait a little after 100% so the user sees the completed
    // processing state.
    // ============================================================

    setTimeout(
        () => {

            updateProgress(
                100,
                "Payment successful!"
            );


            if (authorizationStatus) {

                authorizationStatus.textContent =
                    "Payment confirmed";

            }


            showToast(
                "Payment successful. Preparing your ticket..."
            );


            // Give the user a short moment to see the
            // completed state.

            setTimeout(
                () => {

                    window.location.href =
                        SUCCESS_PAGE;

                },
                900
            );

        },
        7000
    );


    // ============================================================
    // OPTIONAL REAL PAYMENT VERIFICATION
    //
    // This function is NOT automatically used in the demo timer.
    //
    // When the real Paystack flow is connected, this function
    // can be called after Paystack returns the payment reference.
    // ============================================================

    async function verifyPayment(
        reference
    ) {

        if (
            !reference ||
            !token
        ) {

            return false;

        }


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/payments/verify`,
                    {
                        method: "POST",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                reference:
                                    reference
                            })
                    }
                );


            if (!response.ok) {

                return false;

            }


            const result =
                await response.json();


            if (
                result &&
                result.status === "success" &&
                result.data &&
                result.data.status === "completed"
            ) {

                sessionStorage.setItem(
                    "eventra_payment_reference",
                    reference
                );


                return true;

            }


            return false;

        }

        catch (error) {

            console.error(
                "Payment verification error:",
                error
            );


            return false;

        }

    }


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