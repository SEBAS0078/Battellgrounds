// Shared rendering for the homepage, archive and season pages.

const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

export function ordinal(n) {
    return ORDINALS[n - 1] ?? `${n}th`;
}

export function formatNames(names) {
    if (!names || !names.length) return "";
    if (names.length === 1) return names[0];
    return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

function round(points) {
    return Math.round(points);
}

// ---------------- Dates ----------------

// "Thursday, September 18" (or "..., 2025" with the year)
function formatDate(start, withYear) {
    return new Date(start).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        ...(withYear && { year: "numeric" })
    });
}

function clock(date) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// "8:45 PM", or "8:00 – 10:00 PM" when there's an end time
function formatTime(start, end) {
    const from = clock(new Date(start));
    if (!end) return from;
    const to = clock(new Date(end));
    const sameHalf = from.slice(-2) === to.slice(-2);
    return `${sameHalf ? from.slice(0, -3) : from} – ${to}`;
}

function isToday(start) {
    return new Date(start).toDateString() === new Date().toDateString();
}

// ---------------- Calendar (.ics) ----------------

function icsDate(date) {
    const pad = n => String(n).padStart(2, "0");
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

function icsText(text) {
    return text.replace(/<[^>]*>/g, "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

// Downloads a calendar file that opens in Apple, Google or Outlook calendars.
// Events without an end time are assumed to last two hours.
export function downloadCalendarFile(event) {
    const start = new Date(event.start);
    const end = event.end ? new Date(event.end) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const slug = event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//New Battell//Battellgrounds//EN",
        "BEGIN:VEVENT",
        `UID:${icsDate(start)}-${slug}@battellgrounds`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
        `DTSTART:${icsDate(start)}`,
        `DTEND:${icsDate(end)}`,
        `SUMMARY:${icsText(`Battellgrounds: ${event.title}`)}`,
        event.location && `LOCATION:${icsText(event.location)}`,
        event.description && `DESCRIPTION:${icsText(event.description)}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].filter(Boolean);

    const file = new Blob([lines.join("\r\n")], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = `${slug}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
}

// ---------------- Photo viewer ----------------

function openPhoto(src, alt) {
    let viewer = document.getElementById("photo-viewer");
    if (!viewer) {
        viewer = document.createElement("dialog");
        viewer.id = "photo-viewer";
        viewer.innerHTML = `<img alt=""><button type="button" class="photo-close" aria-label="Close photo">✕</button>`;
        viewer.addEventListener("click", () => viewer.close());
        document.body.appendChild(viewer);
    }
    const image = viewer.querySelector("img");
    image.src = src;
    image.alt = alt;
    viewer.showModal();
}

// ---------------- Event cards ----------------

// Builds one event card.
// past:     show results instead of "Upcoming"
// archived: the season is over, so missing results read "not recorded"
export function eventCard(event, { past, archived = false, cardClass = "event-card" }) {
    const card = document.createElement("div");
    card.classList.add(cardClass);

    const date = event.date ?? (event.start ? formatDate(event.start, archived) : "Date TBA");
    const time = event.time ?? (event.start ? formatTime(event.start, event.end) : null);

    let badges;
    if (!past) {
        badges = `<p class="winning-floor">${event.start && isToday(event.start) ? "Today!" : "Upcoming"}</p>`;
        if (event.start) badges += `<button type="button" class="calendar-btn">📅 Add to calendar</button>`;
    } else if (event.scored === false) {
        badges = `<p class="winning-floor unrecorded">Not scored</p>`;
    } else if (event.winner) {
        badges = `<p class="winning-floor"><strong>Winner:</strong> ${event.winner}</p>`;
    } else {
        badges = `<p class="winning-floor unrecorded">${archived ? "Winner not recorded" : "Results coming soon"}</p>`;
    }
    if (past && event.attendance != null) {
        badges += `<p class="attendees">${event.attendance} attended</p>`;
    } else if (archived) {
        badges += `<p class="attendees unrecorded">Attendance not recorded</p>`;
    }

    card.innerHTML = `
        <h2 class="event-title">${event.title}</h2>
        <p><strong>${date}</strong></p>
        ${time ? `<p><strong>${time}</strong></p>` : ""}
        ${event.location ? `<p><strong>Location:</strong> ${event.location}</p>` : ""}
        <p>${event.description}</p>
        ${event.hosts ? `<p><strong>Hosted by:</strong> ${formatNames(event.hosts)}</p>` : ""}
        <div class="event-badges">${badges}</div>
    `;

    card.querySelector(".calendar-btn")?.addEventListener("click", () => downloadCalendarFile(event));

    return card;
}

// ---------------- Standings ----------------

// Fills `container` with one row per floor, highest points first.
// Tied floors share a rank. Before anyone scores, no podium is shown.
export function renderStandings(container, floors) {
    const ranked = [...floors].sort((a, b) => b.points - a.points);
    const topPoints = ranked.length ? ranked[0].points : 0;
    const started = topPoints > 0;

    container.innerHTML = "";

    let rank = 0;
    ranked.forEach((floor, index) => {
        if (index === 0 || floor.points !== ranked[index - 1].points) rank = index + 1;

        const share = started ? (floor.points / topPoints) * 100 : 0;
        const row = document.createElement("div");
        row.classList.add("standing-row");
        if (started) row.classList.add(`rank-${rank}`);

        row.innerHTML = `
            <div class="standing-rank" title="${started ? ordinal(rank) + " place" : ""}">${started ? rank : "–"}</div>
            <div class="standing-info">
                <p class="standing-floor">${floor.floor}</p>
                ${floor.ras?.length ? `<p class="standing-ras">RAs: ${formatNames(floor.ras)}</p>` : ""}
                <div class="standing-bar"><span style="width: ${share}%"></span></div>
            </div>
            <p class="standing-points" title="${floor.points}">${round(floor.points)}<small>points</small></p>
        `;

        container.appendChild(row);
    });

    if (!started) {
        const note = document.createElement("p");
        note.classList.add("standings-note");
        note.textContent = "No points yet. Check back after the first event!";
        container.appendChild(note);
    }
}

// ---------------- Perpetual plaque ----------------

// champions: [{ label, floor, href }] for finished seasons, oldest first.
// Adds this season as "Up for grabs", then empty slots for future years.
export function renderPlaque(container, champions, currentId, totalSlots = 8) {
    const slots = [...champions];
    let year = Number(currentId.slice(0, 4));
    const label = start => `${start}–${start + 1}`;
    slots.push({ label: label(year), floor: "Up for grabs", current: true });
    while (slots.length < totalSlots) slots.push({ label: label(++year) });

    container.innerHTML = "";
    slots.forEach(slot => {
        const plate = document.createElement(slot.href ? "a" : "div");
        plate.className = `plaque-slot${slot.floor ? "" : " plaque-empty"}${slot.current ? " plaque-current" : ""}`;
        if (slot.href) plate.href = slot.href;
        plate.innerHTML = `
            <span class="plaque-year">${slot.label}</span>
            <span class="plaque-floor">${slot.floor ?? ""}</span>
        `;
        container.appendChild(plate);
    });
}

// ---------------- Gallery ----------------

// Photos are paths like "assets/photos/2025-2026/field-day.jpg", or
// { "src": "...", "caption": "..." } to add a caption.
export function renderGallery(container, photos, seasonLabel) {
    container.innerHTML = "";
    photos.forEach((photo, i) => {
        const { src, caption = "" } = typeof photo === "string" ? { src: photo } : photo;
        const alt = caption || `Battellgrounds ${seasonLabel} photo ${i + 1}`;

        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "gallery-photo";
        const image = document.createElement("img");
        image.src = src;
        image.alt = alt;
        image.loading = "lazy";
        tile.appendChild(image);
        if (caption) {
            const label = document.createElement("span");
            label.className = "gallery-caption";
            label.textContent = caption;
            tile.appendChild(label);
        }
        tile.addEventListener("click", () => openPhoto(src, alt));
        container.appendChild(tile);
    });
}

// ---------------- Rules ----------------

export function renderRules(container, scoring, { past = false } = {}) {
    const tiles = scoring.placements.map((points, index) => `
        <div class="placement placement-${index + 1}">
            <p class="placement-place">${ordinal(index + 1)}</p>
            <p class="placement-value">${points}</p>
        </div>
    `).join("");

    container.innerHTML = `
        <div class="rule-card">
            <p class="rule-icon">🙋</p>
            <h3>Participation</h3>
            <p>${scoring.participation}</p>
            ${scoring.guests ? `<p class="rule-callout">${scoring.guests}</p>` : ""}
        </div>
        <div class="rule-card">
            <p class="rule-icon">🏅</p>
            <h3>Competition Results</h3>
            <p>Events with clear rankings ${past ? "awarded" : "award"} bonus points by placement:</p>
            <div class="placement-points">${tiles}</div>
        </div>
        ${scoring.prize ? `
        <div class="rule-card rule-wide rule-prize">
            <p class="rule-icon">🏆</p>
            <h3>The Prize</h3>
            <p>${scoring.prize}</p>
        </div>` : ""}
        <div class="rule-card rule-wide">
            <h3>Good to know</h3>
            <ul class="fine-print">${scoring.notes.map(note => `<li>${note}</li>`).join("")}</ul>
        </div>
    `;
}
