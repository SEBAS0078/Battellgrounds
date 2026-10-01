import { findSeason, rankFloors, totalAttendance } from './seasons.js';
import { formatRAs, ordinal, renderStandings } from '../standings.js';

const seasonId = new URLSearchParams(location.search).get("id");
const season = findSeason(seasonId);

if (!season) {
    document.getElementById("season-heading").textContent = "Season not found";
    document.getElementById("champion").innerHTML = `
        <p>We couldn’t find that season. <a href="archive.html">See all seasons</a>.</p>
    `;
} else {
    renderSeason(season);
}

function renderSeason(season) {
    const ranked = rankFloors(season);
    const champion = ranked[0];

    document.title = `Battellgrounds ${season.label}`;
    document.getElementById("season-heading").textContent = `Battellgrounds ${season.label}`;
    document.getElementById("season-tagline").textContent = season.tagline;

    // Champion banner
    document.getElementById("champion").innerHTML = `
        <div class="champion-banner">
            <p class="champion-label">New Battell Cup Champion</p>
            <h2 class="champion-floor">🏆 ${champion.floor}</h2>
            <p class="champion-points">${Math.round(champion.points)} points</p>
            <p class="champion-ras">RAs: ${formatRAs(champion.ras)}</p>
        </div>
    `;

    // Final standings
    renderStandings(document.getElementById("standings-list"), season.standings, { showRAs: true });

    // Events
    document.getElementById("events-summary").textContent =
        `${season.events.length} events · ${totalAttendance(season)} total attendance`;

    const eventsContainer = document.getElementById("season-events");
    season.events.forEach(event => {
        const eventCard = document.createElement("div");
        eventCard.classList.add("archive-event");

        eventCard.innerHTML = `
            <h2 class="event-title">${event.title}</h2>
            <p><strong>${event.date}</strong></p>
            <p><strong>${event.time}</strong></p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p>${event.description}</p>
            <p class="winning-floor"><strong>Winner:</strong> ${event.winner}</p>
            <p class="attendees">${event.attendance} attended</p>
        `;

        eventsContainer.appendChild(eventCard);
    });

    // Scoring rules
    const placementTiles = season.scoring.placements
        .map((points, index) => `
            <div class="placement placement-${index + 1}">
                <p class="placement-place">${ordinal(index + 1)}</p>
                <p class="placement-value">${points}</p>
            </div>
        `)
        .join("");
    const noteItems = season.scoring.notes.map(note => `<li>${note}</li>`).join("");

    document.getElementById("scoring-body").innerHTML = `
        <div class="rule-card">
            <p class="rule-icon">🙋</p>
            <h3>Participation</h3>
            <p>${season.scoring.participation}</p>
        </div>
        <div class="rule-card">
            <p class="rule-icon">🏅</p>
            <h3>Competition Results</h3>
            <p>Events with clear rankings awarded bonus points by placement:</p>
            <div class="placement-points">${placementTiles}</div>
        </div>
        <div class="rule-card rule-wide">
            <h3>Good to know</h3>
            <ul class="fine-print">${noteItems}</ul>
        </div>
    `;
}
