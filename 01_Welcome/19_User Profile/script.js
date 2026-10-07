"use strict";


/* =========================================================
   EVENTRA — SCREEN 19
   USER PROFILE
========================================================= */


const ROUTES = {

    home:
        "../05_Home/index.html",

    discover:
        "../10_Discover%20Event/index.html",

    tickets:
        "../17_MyTicket/index.html",

    notifications:
        "../18_Notification/index.html",

    profile:
        "../19_User%20Profile/index.html"

};


/* =========================================================
   TOAST
========================================================= */

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

let toastTimer;


function showToast(message) {

    if (!toast || !toastMessage) {
        return;
    }


    toastMessage.textContent =
        message;


    toast.classList.remove(
        "opacity-0",
        "pointer-events-none"
    );


    toast.classList.add(
        "opacity-100"
    );


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toast.classList.remove(
            "opacity-100"
        );

        toast.classList.add(
            "opacity-0",
            "pointer-events-none"
        );

    }, 2200);

}


/* =========================================================
   NAVIGATION
========================================================= */

document
    .querySelectorAll("[data-nav]")
    .forEach((button) => {

        button.addEventListener(
            "click",
            (event) => {

                event.preventDefault();


                const destination =
                    button.dataset.nav;


                const route =
                    ROUTES[destination];


                if (!route) {
                    return;
                }


                const target =
                    new URL(
                        route,
                        window.location.href
                    );


                window.location.assign(
                    target.href
                );

            }
        );

    });



/* =========================================================
   BACKEND PROFILE
========================================================= */
const API_BASE_URL = "https://eventra-backend-aidf.onrender.com/api";

function getToken() {
    return localStorage.getItem("eventra_token") || localStorage.getItem("access_token") || sessionStorage.getItem("eventra_token") || sessionStorage.getItem("access_token") || "";
}

function getStoredUser() {
    try { return JSON.parse(localStorage.getItem("eventra_user") || sessionStorage.getItem("eventra_user") || "null"); } catch (_) { return null; }
}

function normalizeProfile(result) {
    return result?.data?.user || result?.data || result?.user || result || {};
}

function updateProfileUI(user) {
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Eventra User";
    document.querySelectorAll(".profile-name").forEach(el => { const badge = el.querySelector(".verified-badge"); el.textContent = fullName; if (badge) el.appendChild(badge); });
    document.querySelectorAll(".profile-email").forEach(el => el.textContent = user.email || "");
    document.querySelectorAll(".profile-avatar").forEach(el => {
        if (user.profile_picture_url) {
            el.style.backgroundImage = `url("${user.profile_picture_url}")`;
            el.style.backgroundSize = "cover";
            el.style.backgroundPosition = "center";
            el.textContent = "";
        } else {
            el.style.backgroundImage = "";
            el.textContent = `${(user.first_name || "E")[0]}${(user.last_name || "U")[0]}`.toUpperCase();
        }
    });
    localStorage.setItem("eventra_user", JSON.stringify(user));
    localStorage.setItem("eventra_first_name", user.first_name || "");
    localStorage.setItem("eventra_last_name", user.last_name || "");
    localStorage.setItem("eventra_email", user.email || "");
}

async function loadProfile() {
    const token = getToken();
    if (!token) return;
    try {
        const response = await fetch(`${API_BASE_URL}/users/profile`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
        if (!response.ok) throw new Error(`Profile request failed: ${response.status}`);
        const user = normalizeProfile(await response.json());
        updateProfileUI(user);
    } catch (error) {
        console.warn("Could not load profile:", error);
        const stored = getStoredUser();
        if (stored) updateProfileUI(stored);
    }
}

function openProfileEditor() {
    const user = getStoredUser() || {};
    const existing = document.getElementById("eventraProfileEditor");
    if (existing) existing.remove();
    const modal = document.createElement("div");
    modal.id = "eventraProfileEditor";
    modal.style.cssText = "position:fixed;inset:0;z-index:100000;background:rgba(15,23,42,.45);display:flex;align-items:center;justify-content:center;padding:20px;font-family:Outfit,Arial,sans-serif";
    modal.innerHTML = `<form style="width:min(520px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:20px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.2)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><h2 style="margin:0;font-size:20px;color:#172033">Edit Profile</h2><button type="button" data-close style="border:0;background:#f2f4f8;border-radius:50%;width:34px;height:34px;cursor:pointer">×</button></div>
      <label style="display:block;margin:12px 0 6px;font-size:13px;font-weight:600">First name</label><input name="first_name" value="${String(user.first_name || "").replace(/"/g,"&quot;")}" style="width:100%;height:48px;border:1px solid #dfe4ee;border-radius:10px;padding:0 12px;font:inherit">
      <label style="display:block;margin:12px 0 6px;font-size:13px;font-weight:600">Last name</label><input name="last_name" value="${String(user.last_name || "").replace(/"/g,"&quot;")}" style="width:100%;height:48px;border:1px solid #dfe4ee;border-radius:10px;padding:0 12px;font:inherit">
      <label style="display:block;margin:12px 0 6px;font-size:13px;font-weight:600">Phone</label><input name="phone" value="${String(user.phone || "").replace(/"/g,"&quot;")}" style="width:100%;height:48px;border:1px solid #dfe4ee;border-radius:10px;padding:0 12px;font:inherit">
      <label style="display:block;margin:12px 0 6px;font-size:13px;font-weight:600">Bio</label><textarea name="bio" rows="4" style="width:100%;border:1px solid #dfe4ee;border-radius:10px;padding:12px;font:inherit">${String(user.bio || "")}</textarea>
      <button type="submit" style="width:100%;height:50px;border:0;border-radius:12px;background:#5B00E8;color:#fff;font:600 15px Outfit,Arial,sans-serif;margin-top:18px">Save Changes</button>
      <p data-status style="margin:12px 0 0;text-align:center;font-size:13px;color:#69738A"></p>
    </form>`;
    document.body.appendChild(modal);
    modal.querySelector("[data-close]").onclick = () => modal.remove();
    modal.querySelector("form").addEventListener("submit", async e => {
        e.preventDefault();
        const status = modal.querySelector("[data-status]");
        const form = new FormData(e.currentTarget);
        const payload = Object.fromEntries(form.entries());
        const token = getToken();
        if (!token) { status.textContent = "Please sign in again."; return; }
        status.textContent = "Saving...";
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, { method:"PUT", headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json",Accept:"application/json"}, body:JSON.stringify(payload) });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result?.message || "Unable to update profile.");
            const updated = normalizeProfile(result);
            updateProfileUI(updated);
            status.textContent = "Profile updated successfully.";
            setTimeout(() => modal.remove(), 500);
        } catch (error) { status.textContent = error.message; }
    });
}


/* =========================================================
   PROFILE ACTIONS
========================================================= */

document
    .querySelectorAll("[data-action]")
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;


                switch (action) {

                    case "personal":

                        openProfileEditor();

                        break;


                    case "payment-history":

                        showToast(
                            "Payment History & Orders"
                        );

                        break;


                    case "payment-methods":

                        showToast(
                            "Linked Payment Methods"
                        );

                        break;


                    case "notifications":

                        window.location.assign(
                            new URL(
                                ROUTES.notifications,
                                window.location.href
                            ).href
                        );

                        break;


                    case "saved-events":

                        showToast(
                            "Saved Events & Wishlist"
                        );

                        break;


                    case "security":

                        showToast(
                            "Account Security & 2FA"
                        );

                        break;


                    case "support":

                        showToast(
                            "Help & 24/7 Support"
                        );

                        break;


                    default:

                        showToast(
                            "Coming soon"
                        );

                }

            }
        );

    });


/* =========================================================
   SWITCH MODE
========================================================= */

const switchModeButton =
    document.getElementById(
        "switchModeButton"
    );


if (switchModeButton) {

    switchModeButton.addEventListener(
        "click",
        () => {

            showToast(
                "Organizer dashboard is not included in this attendee frontend. Backend configuration is still required."
            );

        }
    );

}


/* =========================================================
   CHANGE PHOTO
========================================================= */

const changePhotoButton =
    document.getElementById(
        "changePhotoButton"
    );


if (changePhotoButton) {

    changePhotoButton.addEventListener(
        "click",
        () => {

            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = () => {
                const file = input.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                    document.querySelectorAll(".profile-avatar").forEach(el => { el.style.backgroundImage = `url("${reader.result}")`; el.style.backgroundSize = "cover"; el.style.backgroundPosition = "center"; el.textContent = ""; });
                    localStorage.setItem("eventra_profile_photo_preview", String(reader.result));
                    showToast("Photo preview updated. Server upload requires a backend upload endpoint.");
                };
                reader.readAsDataURL(file);
            };
            input.click();

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to log out?"
                );


            if (!confirmed) {
                return;
            }


            const token = getToken();
            fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}`, Accept: "application/json" } : {}
            }).catch(() => {});

            localStorage.removeItem(
                "eventra_token"
            );

            localStorage.removeItem(
                "eventra_user"
            );
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            sessionStorage.removeItem(
                "eventra_token"
            );

            sessionStorage.removeItem(
                "eventra_user"
            );
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("refresh_token");


            showToast(
                "Logged out successfully"
            );


            setTimeout(() => {

                const signIn =
                    new URL(
                        "../09_Sign_In/index.html",
                        window.location.href
                    );


                window.location.assign(
                    signIn.href
                );

            }, 700);

        }
    );

}

document.addEventListener("DOMContentLoaded", loadProfile);

/* =========================================================
   CHANGE PASSWORD
========================================================= */
function openChangePasswordEditor() {
    const old = document.getElementById("eventraPasswordEditor");
    if (old) old.remove();
    const modal = document.createElement("div");
    modal.id = "eventraPasswordEditor";
    modal.style.cssText = "position:fixed;inset:0;z-index:100000;background:rgba(15,23,42,.45);display:flex;align-items:center;justify-content:center;padding:20px;font-family:Outfit,Arial,sans-serif";
    modal.innerHTML = `<form style="width:min(430px,100%);background:#fff;border-radius:20px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.2)">
      <div style="display:flex;justify-content:space-between;align-items:center"><h2 style="margin:0;font-size:20px;color:#172033">Change Password</h2><button type="button" data-close style="border:0;background:#f2f4f8;border-radius:50%;width:34px;height:34px;cursor:pointer">×</button></div>
      <label style="display:block;margin:18px 0 6px;font-size:13px;font-weight:600">Current password</label><input name="old_password" type="password" required style="width:100%;height:48px;border:1px solid #dfe4ee;border-radius:10px;padding:0 12px;font:inherit">
      <label style="display:block;margin:12px 0 6px;font-size:13px;font-weight:600">New password</label><input name="new_password" type="password" minlength="8" required style="width:100%;height:48px;border:1px solid #dfe4ee;border-radius:10px;padding:0 12px;font:inherit">
      <button type="submit" style="width:100%;height:50px;border:0;border-radius:12px;background:#5B00E8;color:#fff;font:600 15px Outfit,Arial,sans-serif;margin-top:18px">Update Password</button>
      <p data-status style="margin:12px 0 0;text-align:center;font-size:13px;color:#69738A"></p>
    </form>`;
    document.body.appendChild(modal);
    modal.querySelector("[data-close]").onclick = () => modal.remove();
    modal.querySelector("form").addEventListener("submit", async e => {
        e.preventDefault();
        const status = modal.querySelector("[data-status]");
        const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
        const token = getToken();
        status.textContent = "Updating...";
        try {
            const response = await fetch(`${API_BASE_URL}/users/change-password`, { method:"PUT", headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json",Accept:"application/json"}, body:JSON.stringify(payload) });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result?.message || "Unable to change password.");
            status.textContent = "Password changed successfully.";
            setTimeout(() => modal.remove(), 700);
        } catch (error) { status.textContent = error.message; }
    });
}

// Override settings actions that now have real destinations.
document.querySelectorAll('[data-action="payment-history"]').forEach(btn => btn.addEventListener("click", () => window.location.assign(new URL(ROUTES.tickets, window.location.href))));
document.querySelectorAll('[data-action="saved-events"]').forEach(btn => btn.addEventListener("click", () => window.location.assign(new URL(ROUTES.discover, window.location.href))));
document.querySelectorAll('[data-action="security"]').forEach(btn => btn.addEventListener("click", openChangePasswordEditor));
