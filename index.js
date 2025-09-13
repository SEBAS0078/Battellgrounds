

// import the JSON data about the crowd funded games from the games.js file
import EVENTS_DATA from './events.js';
import { LEADERBOARD } from './leaderboard.js';

// create a list of objects to store the data about the games using JSON.parse
const EVENTS_JSON = JSON.parse(EVENTS_DATA); 

// grab the element with the id games-container
const eventContainer = document.getElementById("events-container");

// create a function that adds all data from the games array to the page
function addEventsToPage(events) {
    for (let event of events) {
        let eventCard = document.createElement("div"); // create a new div element, which will become the game card
        eventCard.classList.add("event-card"); // add the class game-card to the list
        
        eventCard.innerHTML = `
            <h2 class="event-title">${event.title}</h2>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p>${event.description}</p>
        `;
        eventContainer.appendChild(eventCard);
    }
}

// call the function we just defined using the correct variable
addEventsToPage(EVENTS_JSON); 


//Automatically populate the leaderboard
const leaderboardTable = document.getElementById("leaderboard-body");
const sortedfloors =  LEADERBOARD.sort( (item1, item2) => {
    return item2.points - item1.points;
});

function populateLeaderboard(data) {
    // Clear existing rows
    leaderboardTable.innerHTML = '';

    data.forEach((floor, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${floor.floor}</td>
            <td>${floor.points}</td>
        `;

        leaderboardTable.appendChild(row);
    });
}

// Call the function to populate
populateLeaderboard(sortedfloors);