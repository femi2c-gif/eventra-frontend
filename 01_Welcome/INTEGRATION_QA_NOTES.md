# Eventra Frontend Integration / QA Update

## Updated in this build

- Authentication session handling preserved for access/refresh tokens.
- Sign-up now remains direct to Sign In; the retired OTP screen is no longer in the active registration route.
- Fixed broken Sign In route references caused by the `09_Sign_In` folder name.
- Home and Discover now treat backend event data as the source of truth instead of silently replacing it with demo events when the API is unavailable.
- Home now promotes **Explore Events Near You** near the top of the page.
- Home featured/priority content is populated from the first backend event when available.
- Event Details now loads an event by ID and attempts to load its ticket types so a real `ticket_type_id` can be carried into checkout.
- Checkout now creates a real booking with `POST /api/bookings` before moving to payment.
- Payment now calls `POST /api/bookings/:bookingId/checkout` with `payment_method: "paystack"` and redirects to the returned Paystack `authorization_url`.
- The payment-processing screen no longer fabricates a successful payment with a timer.
- Payment verification is supported from a returned Paystack reference.
- My Tickets now loads and renders the authenticated user's backend tickets.
- Digital Ticket now loads a real ticket by ID and no longer shows a fake ticket when no ticket is selected.
- Profile now loads from the backend and supports editing first name, last name, phone and bio.
- Change Password is connected to the backend change-password endpoint.
- Profile photo selection provides a local preview. Persistent server-side image upload is not implemented because the supplied backend contract exposes `profile_picture_url` but no binary upload endpoint.
- Notifications now attempt to load the authenticated user's backend notifications.
- Desktop navigation dropdown was added while the mobile bottom navigation remains available on smaller screens.
- Logout now calls the backend logout endpoint when a token is available and clears local/session auth state.
- All JavaScript files pass `node --check` syntax validation.
- All numbered HTML screens return successfully from a local static server.

## Backend-dependent items that cannot be completed purely in this frontend

1. **Organizer Dashboard:** there is no organizer dashboard screen in the supplied frontend codebase. The backend documentation defines organizer endpoints, but a dashboard UI/design is not included here.
2. **Persistent profile image upload:** the supplied profile API accepts a `profile_picture_url`; no file-upload endpoint was supplied. The frontend therefore provides a local preview rather than pretending a file was uploaded to the server.
3. **Paystack callback destination:** the frontend verifies a returned `reference`/`trxref` when Paystack returns to a frontend success/processing URL. The backend must have the Paystack callback/redirect configuration pointed at the intended Eventra frontend URL.
4. **Backend availability/CORS:** the frontend uses the production Render API URL. The backend must keep the Vercel production origin whitelisted.

## Expected final QA journey

Sign In → Home → Explore/Discover → Event Details → Select quantity → Create Booking → Paystack → Payment verification → Payment Success → Digital Ticket → My Tickets → Profile/Edit Profile → Logout → Sign In again.


## Paystack verification update — 2026-10-07

- Screen 14 now reads the Paystack `reference` from the callback URL (`reference` or `trxref`) or stored payment reference.
- Screen 14 retrieves the JWT from `localStorage.access_token` first, with existing Eventra token keys retained as fallbacks.
- `POST /api/payments/verify` is called with `Authorization: Bearer <access_token>` and `{ "reference": "..." }`.
- Screen 14 does not treat the Paystack hosted success page as proof of payment; it waits for the backend verification response.
- Successful verification preserves booking/ticket IDs and payment verification data, then shows a 5-second confirmed-payment countdown before routing to Screen 15.
- Screen 15 now waits 5 seconds before automatically opening Screen 16; the manual digital-pass button remains available.
- The frontend must still receive a successful response from `/api/payments/verify`; a backend HTTP 500 cannot be safely bypassed.

## 2026-10-07 Payment verification + signup password reveal update

- Screen 14 payment verification now sends the Bearer access token and reference to `/api/payments/verify` and keeps retrying for up to 30 attempts (2 seconds apart) before showing a manual `Check Payment Again` action.
- The frontend does not bypass backend verification. A successful Paystack payment can only proceed to Screen 15 after the verification API confirms success.
- The current DevTools evidence from testing shows `/api/payments/verify` returning HTTP 500. This is a backend verification failure; the frontend request is reaching the endpoint and must not be treated as a successful payment until the backend returns a successful verification response.
- Screen 02 Create Account now has an eye-button password reveal/hide control so users can inspect the password they entered before submitting the form.
