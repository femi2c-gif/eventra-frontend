// ============================================================
// EVENTRA
// SCREEN 05 - ATTENDEE HOME
// ============================================================


// ============================================================
// API
// ============================================================

const API_BASE_URL =
  "https://eventra-backend-aidf.onrender.com/api";


// ============================================================
// ROUTES
// ============================================================

const ROUTES = {

  home:
    "./index.html",

  discover:
    "../10_Discover%20Event/index.html",

  tickets:
    "../17_MyTicket/index.html",

  notifications:
    "../18_Notification/index.html",

  profile:
    "../19_User%20Profile/index.html"

};


// ============================================================
// DOM ELEMENTS
// ============================================================

const searchInput =
  document.getElementById(
    "searchInput"
  );

const trendingEvents =
  document.getElementById(
    "trendingEvents"
  );

const welcomeName =
  document.getElementById(
    "welcomeName"
  );

const profileInitials =
  document.getElementById(
    "profileInitials"
  );

const locationText =
  document.getElementById(
    "locationText"
  );

const locationBtn =
  document.getElementById(
    "locationBtn"
  );

const notificationBtn =
  document.getElementById(
    "notificationBtn"
  );

const profileBtn =
  document.getElementById(
    "profileBtn"
  );

const editVibeBtn =
  document.getElementById(
    "editVibeBtn"
  );

const featuredTicketsBtn =
  document.getElementById(
    "featuredTicketsBtn"
  );

const claimBtn =
  document.getElementById(
    "claimBtn"
  );

const seeAllBtn =
  document.getElementById(
    "seeAllBtn"
  );

const exploreMapBtn =
  document.getElementById(
    "exploreMapBtn"
  );

const vibeContainer =
  document.getElementById(
    "vibeContainer"
  );


// ============================================================
// USER
// ============================================================

const firstName =
  localStorage.getItem(
    "eventra_first_name"
  ) || "John";

const lastName =
  localStorage.getItem(
    "eventra_last_name"
  ) || "";


// ============================================================
// NAME
// ============================================================

welcomeName.textContent =
  firstName;


// ============================================================
// INITIALS
// ============================================================

function createInitials(
  first,
  last
) {

  const firstInitial =
    first
      ? first.charAt(0)
      : "";

  const lastInitial =
    last
      ? last.charAt(0)
      : "";

  return (
    firstInitial +
    lastInitial
  ).toUpperCase();

}


profileInitials.textContent =
  createInitials(
    firstName,
    lastName
  ) || "JD";


// ============================================================
// CITY
// ============================================================

const savedCity =
  localStorage.getItem(
    "eventra_city"
  );

if (savedCity) {

  locationText.textContent =
    savedCity;

}


// ============================================================
// FALLBACK EVENTS
// ============================================================

const fallbackEvents = [

  {

    id:
      "lagos-food-festival",

    title:
      "Lagos Food & Culture Festival",

    date:
      "Nov 5",

    time:
      "12:00 PM",

    venue:
      "Muri Okunola Park, VI",

    price:
      "₦5,000",

    category:
      "Food & Drinks",

    tag:
      "Popular in VI",

    image:
      "./Lagos Food Festival.png",

    type:
      "music"

  },


  {

    id:
      "lagos-comedy",

    title:
      "Lagos Comedy & Vibes Night",

    date:
      "Oct 30",

    time:
      "7:00 PM",

    venue:
      "Terra Kulture, VI",

    price:
      "₦8,000",

    category:
      "Comedy",

    tag:
      "Top Rated",

    image:
      "./Event Comedy.png",

    type:
      "all"

  },


  {

    id:
      "nike-art",

    title:
      "Nike Art Gallery Horizon Expo",

    date:
      "Nov 15",

    time:
      "10:00 AM",

    venue:
      "Lekki Phase 1, Lagos",

    price:
      "₦3,000",

    category:
      "Arts & Culture",

    tag:
      "This Month",

    image:
      "./Art Exhibition.png",

    type:
      "all"

  }

];


// ============================================================
// STATE
// ============================================================

let allEvents =
  [];

let currentVibe =
  "all";


// ============================================================
// FORMAT API EVENT
// ============================================================

function formatApiEvent(
  event
) {

  const image =
    event.image ||
    event.image_url ||
    event.cover_image ||
    event.banner_image ||
    "./Event Visual.png";


  const title =
    event.title ||
    event.name ||
    "Eventra Event";


  const venue =
    event.venue ||
    event.location ||
    event.venue_name ||
    "Lagos";


  const firstTicket = Array.isArray(event.ticket_types)
    ? (event.ticket_types.find(t => Number(t.available ?? t.quantity ?? 1) > 0) || event.ticket_types[0])
    : null;

  const price =
    event.price ||
    event.ticket_price ||
    event.min_price ||
    firstTicket?.price ||
    "Price TBA";


  const dateValue =
    event.date ||
    event.start_date ||
    event.start_time ||
    "";


  const formattedDate =
    formatDate(
      dateValue
    );


  return {

    id:
      event.id ||
      event._id ||
      title,

    title,

    date:
      formattedDate.date,

    time:
      formattedDate.time,

    venue,

    price:
      formatPrice(price),

    category:
      event.category ||
      "Events",

    tag:
      event.tag ||
      "Popular",

    image,

    type:
      detectEventType(
        event
      )

  };

}


// ============================================================
// DATE
// ============================================================

function formatDate(
  value
) {

  if (!value) {

    return {

      date:
        "Upcoming",

      time:
        "Time TBA"

    };

  }


  const parsed =
    new Date(value);


  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {

    return {

      date:
        String(value),

      time:
        "Time TBA"

    };

  }


  return {

    date:
      parsed.toLocaleDateString(
        "en-NG",
        {
          month: "short",
          day: "numeric"
        }
      ),

    time:
      parsed.toLocaleTimeString(
        "en-NG",
        {
          hour: "numeric",
          minute: "2-digit"
        }
      )

  };

}


// ============================================================
// PRICE
// ============================================================

function formatPrice(
  price
) {

  if (
    typeof price === "number"
  ) {

    return (
      "₦" +
      price.toLocaleString()
    );

  }


  return String(
    price || "₦5,000"
  );

}


// ============================================================
// EVENT TYPE
// ============================================================

function detectEventType(
  event
) {

  const value = (

    event.category ||
    event.type ||
    event.name ||
    ""

  ).toLowerCase();


  if (
    value.includes("tech") ||
    value.includes("startup")
  ) {

    return "tech";

  }


  if (
    value.includes("music") ||
    value.includes("afro")
  ) {

    return "music";

  }


  return "all";

}


// ============================================================
// LOAD EVENTS
// ============================================================

async function loadEvents() {

  try {

    const response =
      await fetch(
        `${API_BASE_URL}/events`
      );


    if (
      !response.ok
    ) {

      throw new Error(
        `Events API returned ${response.status}`
      );

    }


    const result =
      await response.json();


    let apiEvents = [];


    if (
      Array.isArray(result)
    ) {

      apiEvents =
        result;

    }

    else if (
      Array.isArray(
        result.events
      )
    ) {

      apiEvents =
        result.events;

    }

    else if (Array.isArray(result.data)) {
      apiEvents = result.data;
    } else if (Array.isArray(result.data?.events)) {
      apiEvents = result.data.events;
    }


    if (
      apiEvents.length
    ) {

      allEvents =
        apiEvents.map(
          formatApiEvent
        );
      updateFeaturedUI(allEvents[0]);

    }


  } catch (error) {

    console.warn(
      "API unavailable. Using local events.",
      error
    );

    allEvents =
      [];

  }


  renderTrendingEvents();

}


// ============================================================
// FEATURED EVENT FROM API
// ============================================================
function updateFeaturedUI(event) {
  if (!event) return;
  const image = document.getElementById("featuredEventImage");
  const title = document.getElementById("featuredEventTitle");
  const venue = document.getElementById("featuredEventVenue");
  const time = document.getElementById("featuredEventTime");
  const month = document.getElementById("featuredEventMonth");
  const day = document.getElementById("featuredEventDay");
  const priorityImage = document.getElementById("priorityEventImage");
  const priorityTitle = document.getElementById("priorityEventTitle");
  const priorityVenue = document.getElementById("priorityEventVenue");
  const priorityPrice = document.getElementById("priorityEventPrice");
  if (image) image.src = event.image || image.src;
  if (title) title.textContent = event.title;
  if (venue) venue.textContent = `${event.venue}${event.location ? `, ${event.location}` : ""}`;
  if (time) time.textContent = `${event.date} • ${event.time}`;
  const rawDate = new Date(event.date);
  if (!Number.isNaN(rawDate.getTime())) {
    if (month) month.textContent = rawDate.toLocaleString("en-NG", {month:"short"}).toUpperCase();
    if (day) day.textContent = rawDate.getDate();
  }
  if (priorityImage) priorityImage.src = event.image || priorityImage.src;
  if (priorityTitle) priorityTitle.textContent = event.title;
  if (priorityVenue) priorityVenue.textContent = `${event.venue}${event.location ? `, ${event.location}` : ""}`;
  if (priorityPrice) priorityPrice.textContent = event.price;
}

// ============================================================
// RENDER TRENDING
// ============================================================

function renderTrendingEvents() {

  const searchTerm =
    searchInput.value
      .trim()
      .toLowerCase();


  let filteredEvents =
    [...allEvents];


  if (
    currentVibe !== "all"
  ) {

    filteredEvents =
      filteredEvents.filter(
        function (event) {

          return (

            event.type ===
              currentVibe ||

            event.category
              .toLowerCase()
              .includes(
                currentVibe
              )

          );

        }
      );

  }


  if (
    searchTerm
  ) {

    filteredEvents =
      filteredEvents.filter(
        function (event) {

          const text = (

            event.title +
            " " +
            event.venue +
            " " +
            event.category

          ).toLowerCase();


          return text.includes(
            searchTerm
          );

        }
      );

  }


  if (
    filteredEvents.length === 0
  ) {

    trendingEvents.innerHTML = `

      <div
        class="
          rounded-[16px]
          bg-white
          px-5
          py-10
          text-center
          shadow-soft
        "
      >

        <p
          class="
            text-[16px]
            font-semibold
            text-[#344054]
          "
        >
          No events found
        </p>

        <p
          class="
            mt-2
            text-[14px]
            text-[#98A2B3]
          "
        >
          Try another search or vibe.
        </p>

      </div>

    `;

    return;

  }


  trendingEvents.innerHTML =
    filteredEvents
      .map(
        renderEventCard
      )
      .join("");


  attachEventListeners();

}


// ============================================================
// EVENT CARD
// ============================================================

function renderEventCard(
  event
) {

  return `

    <article
      class="
        event-card
        flex
        gap-3
        rounded-[16px]
        bg-white
        p-3
        shadow-soft

        sm:p-4
      "
      data-event-id="${escapeHtml(
        event.id
      )}"
    >

      <img
        src="${escapeHtml(
          event.image
        )}"
        alt="${escapeHtml(
          event.title
        )}"
        class="
          h-[112px]
          w-[112px]
          shrink-0
          rounded-[12px]
          object-cover

          sm:h-[125px]
          sm:w-[125px]
        "
        onerror="
          this.src='./Event Visual.png'
        "
      >


      <div
        class="
          min-w-0
          flex-1
        "
      >

        <div
          class="
            flex
            items-start
            justify-between
            gap-2
          "
        >

          <p
            class="
              text-[13px]
              font-semibold
              leading-5
              text-[#344054]

              sm:text-[14px]
            "
          >

            ${escapeHtml(
              event.date
            )}

            •

            ${escapeHtml(
              event.time
            )}

          </p>


          <button
            type="button"
            class="
              heart-btn
              shrink-0
              text-[#344054]
            "
            aria-label="Favourite event"
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-5 w-5"
            >

              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
              />

            </svg>

          </button>

        </div>


        <h3
          class="
            mt-1
            line-clamp-2
            text-[16px]
            font-bold
            leading-[1.4]
            text-[#344054]

            sm:text-[17px]
          "
        >

          ${escapeHtml(
            event.title
          )}

        </h3>


        <p
          class="
            mt-1
            line-clamp-1
            text-[14px]
            leading-5
            text-[#344054]

            sm:text-[15px]
          "
        >

          ${escapeHtml(
            event.venue
          )}

        </p>


        <div
          class="
            mt-1
            flex
            items-center
            justify-between
            gap-2
          "
        >

          <p
            class="
              truncate
              text-[16px]
              font-bold
              text-[#344054]

              sm:text-[17px]
            "
          >

            From
            ${escapeHtml(
              event.price
            )}

          </p>


          <span
            class="
              shrink-0
              text-[13px]
              text-[#344054]

              sm:text-[14px]
            "
          >

            ${escapeHtml(
              event.tag
            )}

          </span>

        </div>

      </div>

    </article>

  `;

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(
  value
) {

  return String(
    value ?? ""
  )

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


// ============================================================
// EVENT CARD LISTENERS
// ============================================================

function attachEventListeners() {

  const eventCards =
    document.querySelectorAll(
      ".event-card"
    );


  eventCards.forEach(
    function (card) {

      const heart =
        card.querySelector(
          ".heart-btn"
        );


      heart.addEventListener(
        "click",
        function (event) {

          event.stopPropagation();

          heart.classList.toggle(
            "active"
          );

        }
      );


      card.addEventListener(
        "click",
        function () {

          const eventId =
            card.dataset.eventId;


          localStorage.setItem(
            "eventra_selected_event",
            eventId
          );


          window.location.href =
            "../11_Event%20Details/index.html";

        }
      );

    }
  );

}


// ============================================================
// SEARCH
// ============================================================

searchInput.addEventListener(
  "input",
  function () {

    renderTrendingEvents();

  }
);


// ============================================================
// VIBE BUTTONS
// ============================================================

const vibeButtons =
  document.querySelectorAll(
    ".vibe-chip"
  );


vibeButtons.forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        vibeButtons.forEach(
          function (item) {

            item.classList.remove(
              "active"
            );

          }
        );


        button.classList.add(
          "active"
        );


        currentVibe =
          button.dataset.vibe;


        renderTrendingEvents();

      }
    );

  }
);


// ============================================================
// IMPORTANT FIX
// VIBE HORIZONTAL DRAG / SWIPE
// ============================================================

let isDown =
  false;

let startX =
  0;

let scrollLeft =
  0;


vibeContainer.addEventListener(
  "pointerdown",
  function (event) {

    isDown =
      true;

    vibeContainer.classList.add(
      "dragging"
    );

    startX =
      event.clientX;

    scrollLeft =
      vibeContainer.scrollLeft;

  }
);


vibeContainer.addEventListener(
  "pointermove",
  function (event) {

    if (!isDown) {
      return;
    }


    const distance =
      event.clientX -
      startX;


    vibeContainer.scrollLeft =
      scrollLeft -
      distance;

  }
);


function stopDragging() {

  isDown =
    false;

  vibeContainer.classList.remove(
    "dragging"
  );

}


vibeContainer.addEventListener(
  "pointerup",
  stopDragging
);

vibeContainer.addEventListener(
  "pointercancel",
  stopDragging
);

vibeContainer.addEventListener(
  "pointerleave",
  stopDragging
);


// ============================================================
// LOCATION
// ============================================================

locationBtn.addEventListener(
  "click",
  function () {

    const locations = [

      "Lagos",
      "Abuja",
      "Ibadan",
      "Port Harcourt"

    ];


    const currentIndex =
      locations.indexOf(
        locationText.textContent
      );


    const nextIndex =
      (
        currentIndex + 1
      ) % locations.length;


    const nextLocation =
      locations[nextIndex];


    locationText.textContent =
      nextLocation;


    localStorage.setItem(
      "eventra_city",
      nextLocation
    );

  }
);


// ============================================================
// NOTIFICATIONS
// ============================================================

notificationBtn.addEventListener(
  "click",
  function () {

    window.location.href =
      ROUTES.notifications;

  }
);


// ============================================================
// PROFILE
// ============================================================

profileBtn.addEventListener(
  "click",
  function () {

    window.location.href =
      ROUTES.profile;

  }
);


// ============================================================
// EDIT VIBE
// ============================================================

editVibeBtn.addEventListener(
  "click",
  function () {

    window.history.back();

  }
);


// ============================================================
// FEATURED TICKETS
// ============================================================

featuredTicketsBtn.addEventListener(
  "click",
  function () {

    const eventId = allEvents[0]?.id;
    if (!eventId) { showErrorToast("No events are available right now."); return; }
    localStorage.setItem("eventra_selected_event", String(eventId));


    window.location.href =
      "../11_Event%20Details/index.html";

  }
);


// ============================================================
// CLAIM
// ============================================================

claimBtn.addEventListener(
  "click",
  function () {

    const eventId = allEvents[0]?.id;
    if (!eventId) { showErrorToast("No events are available right now."); return; }
    localStorage.setItem("eventra_selected_event", String(eventId));


    window.location.href =
      "../11_Event%20Details/index.html";

  }
);


// ============================================================
// SEE ALL
// ============================================================

seeAllBtn.addEventListener(
  "click",
  function () {

    window.location.href =
      ROUTES.discover;

  }
);


// ============================================================
// MAP
// ============================================================

exploreMapBtn.addEventListener(
  "click",
  function () {

    window.location.href =
      ROUTES.discover;

  }
);


// ============================================================
// BOTTOM NAVIGATION
// ============================================================

const navButtons =
  document.querySelectorAll(
    ".nav-btn"
  );


navButtons.forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        const destination =
          button.dataset.nav;


        if (
          destination ===
          "home"
        ) {

          window.location.href =
            ROUTES.home;

          return;

        }


        if (
          destination ===
          "discover"
        ) {

          window.location.href =
            ROUTES.discover;

          return;

        }


        if (
          destination ===
          "tickets"
        ) {

          window.location.href =
            ROUTES.tickets;

          return;

        }


        if (
          destination ===
          "notifications"
        ) {

          window.location.href =
            ROUTES.notifications;

          return;

        }


        if (
          destination ===
          "profile"
        ) {

          window.location.href =
            ROUTES.profile;

        }

      }
    );

  }
);



// ============================================================
// TOP-LEVEL EXPLORE SECTION
// ============================================================
function setupExploreSection() {
  const section = document.getElementById("exploreNearbySection");
  const curated = document.getElementById("curatedHeader");
  if (section && curated) curated.parentNode.insertBefore(section, curated);
}

function showErrorToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = "position:fixed;left:50%;bottom:88px;transform:translateX(-50%);z-index:99999;background:#172033;color:#fff;padding:12px 16px;border-radius:10px;font:600 13px Outfit,Arial,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.18)";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2400);
}

// ============================================================
// INITIALIZE
// ============================================================

renderTrendingEvents();

loadEvents();

if (document.readyState !== "loading") setupExploreSection(); else document.addEventListener("DOMContentLoaded", setupExploreSection);
