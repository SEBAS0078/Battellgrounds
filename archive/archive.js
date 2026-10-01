import { SEASONS, rankFloors, totalAttendance } from './seasons.js';

const seasonsContainer = document.getElementById("seasons-container");

SEASONS.forEach(season => {
    const champion = rankFloors(season)[0];

    const seasonCard = document.createElement("a");
    seasonCard.classList.add("season-card");
    seasonCard.href = `season.html?id=${season.id}`;

    seasonCard.innerHTML = `
        <h2 class="season-title">${season.label}</h2>
        <p class="season-tagline">${season.tagline}</p>
        <p class="winning-floor">🏆 Champion: ${champion.floor}</p>
        <p class="season-meta">${season.events.length} events · ${totalAttendance(season)} total attendance</p>
    `;

    seasonsContainer.appendChild(seasonCard);
});
