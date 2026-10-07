(() => {
  const ROUTES = {
    home: "../05_Home/index.html",
    discover: "../10_Discover%20Event/index.html",
    tickets: "../17_MyTicket/index.html",
    notifications: "../18_Notification/index.html",
    profile: "../19_User%20Profile/index.html",
    signIn: "../09_Sign_In/index.html"
  };

  const token = () => localStorage.getItem("eventra_token") || localStorage.getItem("access_token") || sessionStorage.getItem("eventra_token") || sessionStorage.getItem("access_token");

  function setup() {
    document.documentElement.dataset.eventraPlatform = window.innerWidth >= 768 ? "web" : "mobile";
    localStorage.setItem("eventra_platform", window.innerWidth >= 768 ? "web" : "mobile");
    window.addEventListener("resize", () => {
      document.documentElement.dataset.eventraPlatform = window.innerWidth >= 768 ? "web" : "mobile";
    localStorage.setItem("eventra_platform", window.innerWidth >= 768 ? "web" : "mobile");
    });

    if (document.getElementById("eventraDesktopNav")) return;

    const style = document.createElement("style");
    style.textContent = `
      @media (min-width: 768px) {
        .bottom-nav, .bottom-navigation, nav.fixed.bottom-0 { display:none !important; }
        #eventraDesktopNav { display:block !important; }
      }
      @media (max-width: 767px) { #eventraDesktopNav { display:none !important; } }
    `;
    document.head.appendChild(style);

    const nav = document.createElement("div");
    nav.id = "eventraDesktopNav";
    nav.style.cssText = "display:none;position:fixed;right:24px;top:18px;z-index:99999;font-family:Outfit,Arial,sans-serif";
    nav.innerHTML = `
      <details style="position:relative">
        <summary style="list-style:none;cursor:pointer;background:#fff;border:1px solid #e5e7eb;border-radius:999px;padding:10px 15px;font-size:14px;font-weight:600;color:#29354D;box-shadow:0 8px 24px rgba(15,23,42,.10)">Eventra Menu ▾</summary>
        <div style="position:absolute;right:0;top:48px;width:190px;background:#fff;border:1px solid #e8ebf2;border-radius:14px;padding:8px;box-shadow:0 14px 36px rgba(15,23,42,.14)">
          <a data-route="home" href="${ROUTES.home}" style="display:block;padding:10px 12px;color:#29354D;text-decoration:none;border-radius:9px">Home</a>
          <a data-route="discover" href="${ROUTES.discover}" style="display:block;padding:10px 12px;color:#29354D;text-decoration:none;border-radius:9px">Discover Events</a>
          <a data-route="tickets" href="${ROUTES.tickets}" style="display:block;padding:10px 12px;color:#29354D;text-decoration:none;border-radius:9px">My Tickets</a>
          <a data-route="notifications" href="${ROUTES.notifications}" style="display:block;padding:10px 12px;color:#29354D;text-decoration:none;border-radius:9px">Notifications</a>
          <a data-route="profile" href="${ROUTES.profile}" style="display:block;padding:10px 12px;color:#29354D;text-decoration:none;border-radius:9px">Profile</a>
          <button id="eventraDesktopLogout" type="button" style="width:100%;text-align:left;border:0;background:none;padding:10px 12px;color:#dc2626;border-radius:9px;cursor:pointer;font:inherit">Sign Out</button>
        </div>
      </details>`;
    document.body.appendChild(nav);

    document.querySelectorAll("#eventraDesktopNav a").forEach(a => {
      a.addEventListener("click", () => { localStorage.setItem("eventra_platform", "web"); });
    });
    document.getElementById("eventraDesktopLogout")?.addEventListener("click", async () => {
      const access = token();
      try {
        if (access) {
          await fetch("https://eventra-backend-aidf.onrender.com/api/auth/logout", {
            method: "POST",
            headers: { Authorization: `Bearer ${access}`, Accept: "application/json" }
          });
        }
      } catch (_) {}
      ["access_token","refresh_token","eventra_token","eventra_user","eventra_unverified_login"].forEach(k => { localStorage.removeItem(k); sessionStorage.removeItem(k); });
      window.location.assign(new URL(ROUTES.signIn, window.location.href));
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup); else setup();
})();
