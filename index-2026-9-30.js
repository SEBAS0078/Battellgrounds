

// import the JSON data about the crowd funded games from the games.js file
import EVENTS_DATA from './events-2026-9-30.js';
import { LEADERBOARD } from './leaderboard-2026-9-30.js';
import { renderStandings } from './standings.js';

// create a list of objects to store the data about the games using JSON.parse
const EVENTS_JSON = JSON.parse(EVENTS_DATA); 

// grab the element with the id games-container
const eventContainer = document.getElementById("events-container");


// create a function that adds all data from the games array to the page
function addEventsToPage(events) {
    events.forEach(event => {
        let eventCard = document.createElement("div");
        eventCard.classList.add("event-card");

        let extraInfo = "";
        if (event.status === "past") {
            extraInfo = `
                <p class="winning-floor"><strong>Winner:</strong> ${event.winner}</p>
                <p class="attendees">${event.attendance} attended</p>
            `;
        } else {
            extraInfo = `
                <p class="winning-floor">${event.status}</p>
            `;
        }

        let hostInfo = "";
        if (event.hosts && event.hosts.length) {
            hostInfo = `<p><strong>Hosted by:</strong> ${event.hosts.join(" & ")}</p>`;
        }

        eventCard.innerHTML = `
            <h2 class="event-title">${event.title}</h2>
            <p><strong>${event.date}</strong></p>
            <p><strong>${event.time}</strong></p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p>${event.description}</p>
            ${hostInfo}
            ${extraInfo}
        `;

        eventContainer.appendChild(eventCard);
    });
}

// call the function we just defined using the correct variable
addEventsToPage(EVENTS_JSON); 



// Automatically populate the leaderboard
renderStandings(document.getElementById("leaderboard-list"), LEADERBOARD);


let currentIndex = 0;

const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");

function updateCarousel() {
    const cardWidth = document.querySelector(".event-card").offsetWidth + 16; // 16 = gap
    eventContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

nextBtn.addEventListener("click", () => {
    const totalCards = document.querySelectorAll(".event-card").length;
    if (currentIndex < totalCards - 1) {
        currentIndex++;
        updateCarousel();
    }
});

prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});