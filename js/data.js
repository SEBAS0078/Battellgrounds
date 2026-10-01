// Loading and scoring logic for Battellgrounds seasons.
// All season data lives in /data as JSON (see README for the format).

async function getJSON(path) {
    // "no-cache" makes the browser check for a newer copy on every visit,
    // so score and event updates show up right away without renaming files.
    const response = await fetch(path, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Couldn't load ${path} (${response.status})`);
    return response.json();
}

export function loadRegistry() {
    return getJSON("data/seasons.json");
}

export function loadSeason(id) {
    return getJSON(`data/${id}.json`);
}

// Seasons that are over, newest first
export function completedSeasonIds(registry) {
    return registry.seasons.filter(id => id !== registry.current);
}

// Floors with their points. Points are a running total per floor, updated by hand
// in the season's JSON file as results come in.
export function floorTotals(season) {
    return season.floors.map(({ floor, ras = [], points = 0 }) => ({ floor, ras, points }));
}

export function rankFloors(floors) {
    return [...floors].sort((a, b) => b.points - a.points);
}

export function champion(season) {
    return rankFloors(floorTotals(season))[0];
}

export function hasResults(event) {
    return event.winner != null || event.attendance != null || event.scored === false;
}

// An event counts as past once results are in or its start time has passed
export function isPast(event, now = new Date()) {
    return hasResults(event) || (event.start != null && new Date(event.start) < now);
}

export function totalAttendance(season) {
    return season.events.reduce((sum, event) => sum + (event.attendance ?? 0), 0);
}

// e.g. "6 events · 223+ total attendance" ("+" when some attendance wasn't recorded)
export function seasonSummary(season) {
    const incomplete = season.events.some(event => isPast(event) && event.attendance == null);
    return `${season.events.length} events · ${totalAttendance(season)}${incomplete ? "+" : ""} total attendance`;
}
