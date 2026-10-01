// Registry of archived Battellgrounds seasons, newest first.
// To archive a season: copy its data into a new file in this folder and add it here.
import season2025 from './2025-2026.js';

export const SEASONS = [season2025];

export function findSeason(id) {
    return SEASONS.find(season => season.id === id);
}

// Floors sorted by final points, highest first
export function rankFloors(season) {
    return [...season.standings].sort((a, b) => b.points - a.points);
}

export function totalAttendance(season) {
    return season.events.reduce((sum, event) => sum + event.attendance, 0);
}
