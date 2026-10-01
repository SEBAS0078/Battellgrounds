// Shared rendering for floor rankings, used by the homepage leaderboard and archived seasons.

const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

export function ordinal(n) {
    return ORDINALS[n - 1] ?? `${n}th`;
}

export function formatRAs(ras) {
    if (!ras.length) return `<span class="muted">Not recorded</span>`;
    if (ras.length === 1) return ras[0];
    return `${ras.slice(0, -1).join(", ")} and ${ras[ras.length - 1]}`;
}

// Fills `container` with one row per floor, highest points first.
// Tied floors share a rank. Before anyone scores, no podium is shown.
export function renderStandings(container, floors, { showRAs = false } = {}) {
    const ranked = [...floors].sort((a, b) => b.points - a.points);
    const topPoints = ranked.length ? ranked[0].points : 0;
    const started = topPoints > 0;

    container.innerHTML = "";

    let rank = 0;
    ranked.forEach((floor, index) => {
        if (index === 0 || floor.points !== ranked[index - 1].points) rank = index + 1;

        const share = started ? (floor.points / topPoints) * 100 : 0;
        const rasLine = showRAs && floor.ras
            ? `<p class="standing-ras">RAs: ${formatRAs(floor.ras)}</p>`
            : "";

        const row = document.createElement("div");
        row.classList.add("standing-row");
        if (started) row.classList.add(`rank-${rank}`);

        row.innerHTML = `
            <div class="standing-rank" title="${started ? ordinal(rank) + " place" : ""}">${started ? rank : "–"}</div>
            <div class="standing-info">
                <p class="standing-floor">${floor.floor}</p>
                ${rasLine}
                <div class="standing-bar"><span style="width: ${share}%"></span></div>
            </div>
            <p class="standing-points" title="${floor.points}">${Math.round(floor.points)}<small>points</small></p>
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
