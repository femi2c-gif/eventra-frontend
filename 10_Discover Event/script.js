// ============================================================
// EVENTRA
// SCREEN 10 - DISCOVER EVENTS
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
        "../05_Home/index.html",

    discover:
        "../10_Discover Event/index.html",

    tickets:
        "../17_MyTicket/index.html",

    notifications:
        "../18_Notification/index.html",

    profile:
        "../19_User Profile/index.html",

    eventDetails:
        "../11_Event Details/index.html"

};

// ============================================================
// LOCAL FALLBACK EVENTS
// ============================================================

const localEvents = [

  {
    id: "tech-conference-2026",
    title: "Tech Conference 2026",
    venue: "Landmark Centre",
    location: "Lagos",
    date: "Oct 12, 2026",
    time: "10:00 AM",
    price: "₦15,000",
    category: "Tech",
    image: "./Tech Conference 2026.png"
  },


  {
    id: "lagos-food-festival",
    title: "Lagos Food Festival",
    venue: "Muri Okunola Park",
    location: "Lagos",
    date: "Nov 5, 2026",
    time: "12:00 PM",
    price: "₦5,000",
    category: "Food",
    image: "./Lagos Food Festival.png"
  },


  {
    id: "comedy-nights",
    title: "Comedy Nights",
    venue: "Terra Kulture",
    location: "Lagos",
    date: "Oct 30, 2026",
    time: "7:00 PM",
    price: "₦8,000",
    category: "Comedy",
    image: "./Comedy.png"
  },


  {
    id: "art-exhibition",
    title: "Art Exhibition",
    venue: "Nike Art Gallery",
    location: "Lagos",
    date: "Nov 15, 2026",
    time: "10:00 AM",
    price: "₦3,000",
    category: "Arts",
    image: "./Art Exhibition.png"
  }

];


// ============================================================
// STATE
// ============================================================

let allEvents = [...localEvents];

let filteredEvents = [...localEvents];

let selectedCategory = "All";

let searchTerm = "";

let sortMode = "default";

let favourites =
  JSON.parse(
    localStorage.getItem(
      "eventra_favourites"
    ) || "[]"
  );


// ============================================================
// ELEMENTS
// ============================================================

const eventsContainer =
  document.getElementById(
    "eventsContainer"
  );

const emptyState =
  document.getElementById(
    "emptyState"
  );

const resultCount =
  document.getElementById(
    "resultCount"
  );

const searchInput =
  document.getElementById(
    "searchInput"
  );

const backButton =
  document.getElementById(
    "backButton"
  );

const filterButton =
  document.getElementById(
    "filterButton"
  );

const filterModal =
  document.getElementById(
    "filterModal"
  );

const closeFilter =
  document.getElementById(
    "closeFilter"
  );

const applyFilter =
  document.getElementById(
    "applyFilter"
  );

const sortButton =
  document.getElementById(
    "sortButton"
  );

const categoryOptions =
  document.querySelectorAll(
    ".category-option"
  );


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

  if (
    value === undefined ||
    value === null
  ) {

    return "";

  }

  return String(value)
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
// NORMALIZE API EVENT
// ============================================================

function normalizeEvent(event, index) {

  return {

    id:
      event.id ||
      event._id ||
      `api-event-${index}`,

    title:
      event.title ||
      event.name ||
      "Event",

    venue:
      event.venue ||
      event.venue_name ||
      event.location ||
      "Lagos",

    location:
      event.city ||
      event.location ||
      "Lagos",

    date:
      event.date ||
      event.event_date ||
      event.start_date ||
      "Date TBA",

    time:
      event.time ||
      event.event_time ||
      event.start_time ||
      "Time TBA",

    price:
      event.price ||
      event.ticket_price ||
      event.starting_price ||
      "Price TBA",

    category:
      event.category ||
      event.event_category ||
      "Events",

    image:
      event.image ||
      event.image_url ||
      event.cover_image ||
      localEvents[
        index % localEvents.length
      ].image

  };

}


// ============================================================
// LOAD EVENTS FROM API
// ============================================================

async function loadEvents() {

  try {

    const response =
      await fetch(
        `${API_BASE_URL}/events`
      );


    if (!response.ok) {

      throw new Error(
        "Unable to load events"
      );

    }


    const data =
      await response.json();


    let apiEvents = [];


    if (Array.isArray(data)) {

      apiEvents =
        data;

    } else if (
      Array.isArray(data.events)
    ) {

      apiEvents =
        data.events;

    } else if (
      Array.isArray(data.data)
    ) {

      apiEvents =
        data.data;

    }


    if (
      apiEvents.length > 0
    ) {

      allEvents =
        apiEvents.map(
          normalizeEvent
        );

    }


  } catch (error) {

    console.warn(
      "API events unavailable. Using local event data.",
      error
    );


    allEvents =
      [...localEvents];

  }


  filteredEvents =
    [...allEvents];

  applyFilters();

}


// ============================================================
// RENDER EVENTS
// ============================================================

function renderEvents(events) {

  eventsContainer.innerHTML =
    "";


  if (
    events.length === 0
  ) {

    eventsContainer.classList.add(
      "hidden"
    );

    emptyState.classList.remove(
      "hidden"
    );

    resultCount.textContent =
      "0 events found";

    return;

  }


  eventsContainer.classList.remove(
    "hidden"
  );

  emptyState.classList.add(
    "hidden"
  );


  resultCount.textContent =
    `${events.length} events found`;


  events.forEach(
    (event) => {

      eventsContainer.insertAdjacentHTML(
        "beforeend",
        createEventCard(event)
      );

    }
  );


  attachEventListeners();

}


// ============================================================
// EVENT CARD
// ============================================================

function createEventCard(event) {

  const isFavourite =
    favourites.includes(
      String(event.id)
    );


  return `

    <article
      class="
        event-card
        flex
        min-h-[96px]
        cursor-pointer
        gap-3
        rounded-[15px]
        border
        border-[#EDF0F5]
        bg-white
        p-3
        shadow-card
        transition
        hover:-translate-y-[1px]
        hover:shadow-lg

        md:min-h-[120px]
        md:gap-4
        md:rounded-[17px]
        md:p-4
      "
      data-event-id="${escapeHTML(event.id)}"
    >


      <!-- EVENT IMAGE -->

      <div
        class="
          h-[72px]
          w-[72px]
          shrink-0
          overflow-hidden
          rounded-[10px]
          bg-[#EEF1F6]

          sm:h-[76px]
          sm:w-[76px]

          md:h-[92px]
          md:w-[92px]
          md:rounded-[12px]
        "
      >

        <img
          src="${escapeHTML(event.image)}"
          alt="${escapeHTML(event.title)}"
          class="
            h-full
            w-full
            object-cover
          "
          onerror="
            this.src='./Tech Conference 2026.png'
          "
        >

      </div>



      <!-- EVENT INFORMATION -->

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

          <h2
            class="
              line-clamp-1
              text-[12px]
              font-bold
              leading-5
              text-[#172033]

              sm:text-[13px]

              md:text-[15px]
              md:leading-5
            "
          >

            ${escapeHTML(event.title)}

          </h2>


          <!-- FAVOURITE -->

          <button
            type="button"
            class="
              favourite-button
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              rounded-full
              text-[#8FA0B7]
              transition
              hover:bg-[#F4F1FF]
              hover:text-[#6230F5]
              active:scale-90
            "
            data-favourite-id="${escapeHTML(event.id)}"
            aria-label="Add to favourites"
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="${isFavourite ? "#6230F5" : "none"}"
              stroke="${isFavourite ? "#6230F5" : "currentColor"}"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >

              <path
                d="M20.8 8.7c0 5-8.8 10.3-8.8 10.3S3.2 13.7 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"
              ></path>

            </svg>

          </button>

        </div>



        <!-- VENUE -->

        <p
          class="
            mt-0.5
            truncate
            text-[10px]
            leading-4
            text-[#71809A]

            sm:text-[11px]

            md:text-[12px]
          "
        >

          ${escapeHTML(event.venue)}, ${escapeHTML(event.location)}

        </p>



        <!-- DATE -->

        <p
          class="
            mt-0.5
            text-[10px]
            leading-4
            text-[#91A0B7]

            sm:text-[11px]

            md:text-[12px]
          "
        >

          ${escapeHTML(event.date)}
          <span class="mx-1">•</span>
          ${escapeHTML(event.time)}

        </p>



        <!-- PRICE -->

        <p
          class="
            mt-1
            text-[10px]
            font-bold
            text-[#6230F5]

            sm:text-[11px]

            md:text-[12px]
          "
        >

          From ${escapeHTML(event.price)}

        </p>

      </div>

    </article>

  `;

}


// ============================================================
// ATTACH EVENT LISTENERS
// ============================================================

function attachEventListeners() {

  document
    .querySelectorAll(".event-card")
    .forEach(
      (card) => {

        card.addEventListener(
          "click",
          function () {

            const eventId =
              this.dataset.eventId;


            sessionStorage.setItem(
              "eventra_selected_event_id",
              eventId
            );


            window.location.href =
              `${ROUTES.eventDetails}?id=${encodeURIComponent(eventId)}`;

          }
        );

      }
    );


  document
    .querySelectorAll(".favourite-button")
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          function (event) {

            event.stopPropagation();


            const eventId =
              this.dataset.favouriteId;


            toggleFavourite(
              eventId
            );

          }
        );

      }
    );

}


// ============================================================
// TOGGLE FAVOURITE
// ============================================================

function toggleFavourite(
  eventId
) {

  const id =
    String(eventId);


  if (
    favourites.includes(id)
  ) {

    favourites =
      favourites.filter(
        item => item !== id
      );

  } else {

    favourites.push(
      id
    );

  }


  localStorage.setItem(
    "eventra_favourites",
    JSON.stringify(
      favourites
    )
  );


  renderEvents(
    filteredEvents
  );

}


// ============================================================
// APPLY FILTERS
// ============================================================

function applyFilters() {

  let result =
    [...allEvents];


  // SEARCH

  if (
    searchTerm
  ) {

    const query =
      searchTerm.toLowerCase();


    result =
      result.filter(
        event => {

          const searchableText = `

            ${event.title}

            ${event.venue}

            ${event.location}

            ${event.category}

          `.toLowerCase();


          return searchableText.includes(
            query
          );

        }
      );

  }


  // CATEGORY

  if (
    selectedCategory !== "All"
  ) {

    result =
      result.filter(
        event => {

          return (
            event.category
              .toLowerCase()
              .includes(
                selectedCategory.toLowerCase()
              )
          );

        }
      );

  }


  // SORT

  if (
    sortMode === "name"
  ) {

    result.sort(
      (a, b) =>
        a.title.localeCompare(
          b.title
        )
    );

  }


  filteredEvents =
    result;


  renderEvents(
    filteredEvents
  );

}


// ============================================================
// SEARCH
// ============================================================

searchInput.addEventListener(
  "input",
  function () {

    searchTerm =
      this.value.trim();

    applyFilters();

  }
);


// ============================================================
// FILTER MODAL
// ============================================================

filterButton.addEventListener(
  "click",
  function () {

    filterModal.classList.remove(
      "hidden"
    );

    filterModal.classList.add(
      "flex"
    );

  }
);


closeFilter.addEventListener(
  "click",
  closeFilterModal
);


function closeFilterModal() {

  filterModal.classList.add(
    "hidden"
  );

  filterModal.classList.remove(
    "flex"
  );

}


filterModal.addEventListener(
  "click",
  function (event) {

    if (
      event.target ===
      filterModal
    ) {

      closeFilterModal();

    }

  }
);


// ============================================================
// CATEGORY OPTIONS
// ============================================================

categoryOptions.forEach(
  option => {

    option.addEventListener(
      "click",
      function () {

        categoryOptions.forEach(
          item => {

            item.classList.remove(
              "bg-[#6230F5]",
              "text-white",
              "font-semibold"
            );

            item.classList.add(
              "bg-[#F3F4F8]",
              "text-[#40506A]",
              "font-medium"
            );

          }
        );


        this.classList.remove(
          "bg-[#F3F4F8]",
          "text-[#40506A]",
          "font-medium"
        );


        this.classList.add(
          "bg-[#6230F5]",
          "text-white",
          "font-semibold"
        );


        selectedCategory =
          this.dataset.category;

      }
    );

  }
);


// ============================================================
// APPLY FILTER
// ============================================================

applyFilter.addEventListener(
  "click",
  function () {

    applyFilters();

    closeFilterModal();

  }
);


// ============================================================
// SORT
// ============================================================

sortButton.addEventListener(
  "click",
  function () {

    if (
      sortMode === "default"
    ) {

      sortMode =
        "name";

      this.childNodes[0].textContent =
        "A-Z ";

    } else {

      sortMode =
        "default";

      this.childNodes[0].textContent =
        "Sort ";

    }


    applyFilters();

  }
);


// ============================================================
// DATE FILTER
// ============================================================

document
  .getElementById("dateFilter")
  .addEventListener(
    "click",
    function () {

      window.alert(
        "Date filtering will be connected to the event date data from the backend."
      );

    }
  );


// ============================================================
// LOCATION FILTER
// ============================================================

document
  .getElementById("locationFilter")
  .addEventListener(
    "click",
    function () {

      window.alert(
        "Location: Lagos"
      );

    }
  );


// ============================================================
// CATEGORY QUICK BUTTON
// ============================================================

document
  .getElementById("categoryFilter")
  .addEventListener(
    "click",
    function () {

      filterModal.classList.remove(
        "hidden"
      );

      filterModal.classList.add(
        "flex"
      );

    }
  );


// ============================================================
// NAVIGATION
// ============================================================

document
  .getElementById("homeNav")
  .addEventListener(
    "click",
    function () {

      window.location.href =
        ROUTES.home;

    }
  );


document
  .getElementById("discoverNav")
  .addEventListener(
    "click",
    function () {

      window.location.href =
        ROUTES.discover;

    }
  );


document
  .getElementById("ticketsNav")
  .addEventListener(
    "click",
    function () {

      window.location.href =
        ROUTES.tickets;

    }
  );


document
  .getElementById("notificationsNav")
  .addEventListener(
    "click",
    function () {

      window.location.href =
        ROUTES.notifications;

    }
  );


document
  .getElementById("profileNav")
  .addEventListener(
    "click",
    function () {

      window.location.href =
        ROUTES.profile;

    }
  );


// ============================================================
// BACK BUTTON
// ============================================================

backButton.addEventListener(
  "click",
  function () {

    if (
      window.history.length > 1
    ) {

      window.history.back();

    } else {

      window.location.href =
        ROUTES.home;

    }

  }
);


// ============================================================
// INITIALIZE
// ============================================================

loadEvents();