// Entry point for every page. Each HTML page loads this as js/app.js?v=N and sets
// <body data-page="...">. The ?v=N is passed on to the other scripts so that bumping
// it in the HTML refreshes all of the code at once.
const VERSION = new URL(import.meta.url).search;

const [data, render] = await Promise.all([
    import(`./data.js${VERSION}`),
    import(`./render.js${VERSION}`)
]);

const pages = { home: renderHome, archive: renderArchive, season: renderSeason };

try {
    await pages[document.body.dataset.page]();
} catch (error) {
    console.error(error);
    const message = document.createElement("p");
    message.className = "load-error";
    message.textContent = "Something went wrong loading Battellgrounds data. Try refreshing the page.";
    document.querySelector(".header").after(message);
}

// Photo gallery, shown once a season has photos
function renderGallery(season) {
    if (!season.gallery?.length) {
        document.querySelector('nav a[href="#gallery"]')?.remove();
        return;
    }
    document.getElementById("gallery").hidden = false;
    render.renderGallery(document.getElementById("gallery-grid"), season.gallery, season.label);
}

// Plaque slots for finished seasons, oldest first
function plaqueChampions(completedSeasons) {
    return [...completedSeasons].reverse().map(season => ({
        label: season.label,
        floor: data.champion(season).floor,
        href: `season.html?id=${season.id}`
    }));
}

// ---------------- Homepage ----------------

async function renderHome() {
    const registry = await data.loadRegistry();
    const [season, ...pastSeasons] = await Promise.all([
        data.loadSeason(registry.current),
        ...data.completedSeasonIds(registry).map(data.loadSeason)
    ]);
    const lastSeason = pastSeasons[0];

    if (lastSeason) {
        const winner = data.champion(lastSeason);
        document.getElementById("last-champion").innerHTML = `
            Last year’s champion: <strong>${winner.floor}</strong> 🏆 —
            <a href="season.html?id=${lastSeason.id}">see the ${lastSeason.label} season</a>
        `;
    }

    // Events carousel, opening on the next upcoming event
    const container = document.getElementById("events-container");
    const now = new Date();
    season.events.forEach(event => {
        container.appendChild(render.eventCard(event, { past: data.isPast(event, now) }));
    });
    setUpCarousel(container, season.events.findIndex(event => !data.isPast(event, now)));

    render.renderStandings(document.getElementById("leaderboard-list"), data.floorTotals(season));

    // Perpetual plaque + archive link
    render.renderPlaque(document.getElementById("plaque-slots"), plaqueChampions(pastSeasons), registry.current);
    if (lastSeason) {
        const photos = lastSeason.gallery?.length ?? 0;
        document.getElementById("archive-teaser-detail").textContent =
            `Relive the ${lastSeason.label} season: ${lastSeason.events.length} events, the final standings` +
            (photos ? `, and ${photos} photos.` : ".");
    }

    renderGallery(season);
    render.renderRules(document.getElementById("rules-body"), season.scoring);
    document.getElementById("rules-intro").textContent = season.scoring.intro;
}

function setUpCarousel(container, nextIndex) {
    const cards = container.querySelectorAll(".event-card");
    // Start on the most recent past event so the next one sits right beside it
    let currentIndex = nextIndex === -1 ? Math.max(cards.length - 1, 0) : Math.max(nextIndex - 1, 0);

    // Distance from one card to the next, including margins and gap
    function step() {
        return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth;
    }

    // Furthest we can scroll while still filling the view with cards
    function maxIndex() {
        const visible = Math.max(1, Math.floor(container.parentElement.clientWidth / step()));
        return Math.max(0, cards.length - visible);
    }

    function update() {
        if (!cards.length) return;
        currentIndex = Math.min(currentIndex, maxIndex());
        container.style.transform = `translateX(-${currentIndex * step()}px)`;
    }

    document.getElementById("next-btn").addEventListener("click", () => {
        if (cards.length && currentIndex < maxIndex()) {
            currentIndex++;
            update();
        }
    });
    document.getElementById("prev-btn").addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            update();
        }
    });
    window.addEventListener("resize", update);
    update();
}

// ---------------- Archive ----------------

async function renderArchive() {
    const registry = await data.loadRegistry();
    const completed = data.completedSeasonIds(registry);
    const seasons = await Promise.all(completed.map(data.loadSeason));

    // Season cards, newest first
    const list = document.getElementById("seasons-container");
    seasons.forEach(season => {
        const card = document.createElement("a");
        card.className = "season-card";
        card.href = `season.html?id=${season.id}`;
        card.innerHTML = `
            <h2 class="season-title">${season.label}</h2>
            <p class="season-tagline">${season.tagline}</p>
            <p class="winning-floor">🏆 Champion: ${data.champion(season).floor}</p>
            <p class="season-meta">${data.seasonSummary(season)}</p>
        `;
        list.appendChild(card);
    });

    render.renderPlaque(document.getElementById("plaque-slots"), plaqueChampions(seasons), registry.current);
}

// ---------------- Season page ----------------

async function renderSeason() {
    const registry = await data.loadRegistry();
    const id = new URLSearchParams(location.search).get("id") ?? data.completedSeasonIds(registry)[0];

    if (!registry.seasons.includes(id)) {
        document.getElementById("season-heading").textContent = "Season not found";
        document.getElementById("champion").innerHTML = `<p>We couldn’t find that season. <a href="archive.html">See all seasons</a>.</p>`;
        document.querySelectorAll("#standings, #events, #scoring").forEach(section => (section.hidden = true));
        return;
    }

    const season = await data.loadSeason(id);
    const inProgress = id === registry.current;
    const totals = data.floorTotals(season);
    const leader = data.rankFloors(totals)[0];

    document.title = `Battellgrounds ${season.label}`;
    document.getElementById("season-heading").textContent = `Battellgrounds ${season.label}`;
    document.getElementById("season-tagline").textContent = season.tagline;

    document.getElementById("champion").innerHTML = leader.points > 0 ? `
        <div class="champion-banner">
            <p class="champion-label">${inProgress ? "Season in progress · Current leader" : "New Battell Cup Champion"}</p>
            <h2 class="champion-floor">🏆 ${leader.floor}</h2>
            <p class="champion-points">${Math.round(leader.points)} points</p>
            ${leader.ras.length ? `<p class="champion-ras">RAs: ${render.formatNames(leader.ras)}</p>` : ""}
        </div>
    ` : `
        <div class="champion-banner">
            <p class="champion-label">Season in progress</p>
            <h2 class="champion-floor">🏆 Up for grabs</h2>
        </div>
    `;

    document.getElementById("standings-heading").textContent = inProgress ? "Standings" : "Final Standings";
    render.renderStandings(document.getElementById("standings-list"), totals);
    renderGallery(season);

    document.getElementById("events-summary").textContent = data.seasonSummary(season);
    const grid = document.getElementById("season-events");
    season.events.forEach(event => {
        grid.appendChild(render.eventCard(event, {
            past: !inProgress || data.isPast(event),
            archived: !inProgress,
            cardClass: "archive-event"
        }));
    });

    render.renderRules(document.getElementById("scoring-body"), season.scoring, { past: !inProgress });
    document.getElementById("scoring-intro").textContent = season.scoring.intro;
    if (inProgress) document.querySelector("#scoring h2").textContent = "How Points Work";

    if (season.notes?.length) {
        document.getElementById("record-notes").hidden = false;
        document.getElementById("record-notes-list").innerHTML = season.notes.map(note => `<li>${note}</li>`).join("");
    }
}
