# Battellgrounds 🏆

Battellgrounds is New Battell's building-wide competition. Floors earn points through monthly events and participation throughout the academic year. At the end of the year, the floor with the most points wins the **New Battell Cup**, a slot on the perpetual plaque, and a celebration event.

This repo is the website: a static site with no build step, no backend, and no dependencies.

## Pages

| Page | What it shows |
|---|---|
| `index.html` | The current season: events, leaderboard, gallery, and rules |
| `archive.html` | The perpetual plaque and every past season |
| `season.html?id=2025-2026` | One season's full record: champion, standings, events, gallery, and rules that year |

## Updating the site

All content lives in JSON files in [`data/`](data/). **For everyday updates you only edit these files.** No renaming is needed: the site checks for a fresh copy of the data on every visit.

### Add or update an event

Open the current season's file (for example `data/2026-2027.json`) and edit the `events` list. Events go in date order.

```json
{
  "title": "Trivia Night",
  "start": "2026-09-30T20:45",
  "end": "2026-09-30T22:00",
  "location": "New Battell First Floor Lounge",
  "description": "Test your knowledge and win points for your floor.",
  "hosts": ["Houda", "Olti"]
}
```

- `start` / `end` use the format `YYYY-MM-DDTHH:MM` (24-hour clock). The site turns them into "Wednesday, September 30" and "8:45 – 10:00 PM", and shows an **Add to calendar** button. `end` is optional.
- If the date isn't set yet, leave out `start` and write it out instead: `"date": "October — date TBA"`.
- `location` and `hosts` are optional.

### Enter results after an event

Add the attendance and winner to the event:

```json
"attendance": 74,
"winner": "3rd Floor"
```

For an event that didn't count toward the competition, add `"scored": false`.

### Update the leaderboard

Each floor keeps one running total in the season file's `floors` section. After an event, add that event's points to each floor's total:

```json
"floors": [
  { "floor": "1st Floor", "points": 140, "ras": ["Clare", "Jonathan"] },
  { "floor": "2nd Floor", "points": 30, "ras": ["Ale", "Cassidy", "Houda", "Olti"] },
  ...
]
```

The leaderboard sorts itself and rounds the points for display.

### Add photos to the gallery

Each season has one photo gallery. Put the images in `assets/photos/<season>/` (for example `assets/photos/2026-2027/`) and list them in the season file's `gallery`:

```json
"gallery": [
  "assets/photos/2026-2027/trivia-night.jpg",
  { "src": "assets/photos/2026-2027/baking.jpg", "caption": "Baking Competition" }
]
```

Captions are optional. Keep photos reasonably small (under ~500 KB each) so the page loads fast on phones. The Gallery section only appears once a season has photos.

### Floor RAs

List each floor's RAs in the season file's `floors` section. They show on the leaderboard and are kept in the archive.

```json
{ "floor": "1st Floor", "ras": ["Sebastian", "Zaina"] }
```

## End of the year: archiving a season

1. Make sure the season file has the final points, the RAs for each floor, and the photos.
2. Create the next season's file, e.g. `data/2027-2028.json`. Copy the current file's structure, empty the `events`, and update `id`, `label`, `tagline`, and `scoring` if the rules change.
3. In `data/seasons.json`, add the new season to the front of `seasons` and set `current` to it:

```json
{
  "current": "2027-2028",
  "seasons": ["2027-2028", "2026-2027", "2025-2026"]
}
```

That's it. The finished season moves to the archive, its champion goes on the plaque, and the homepage shows the new season.

## How points are calculated

The rules are written in each season's `scoring` section and shown on the site.

- **Participation:** each floor earns points based on the percentage of its residents who attend. Guests count toward the floor of the person who brought them.
- **Competition results:** 1st place earns 200 points, 2nd 100, 3rd 60, and 4th 40. Tied floors split the points for that placement.
- Events without clear placements are scored at the organizers' discretion.

## Changing code or styles

Code is in [`js/`](js/) and styles are in `style.css`:

- `js/app.js`: page logic (each page sets `<body data-page="...">`)
- `js/data.js`: loading data and ranking floors
- `js/render.js`: event cards, leaderboard, gallery, rules, calendar files

After changing any code or styles, **bump the `?v=` number** in the `<link>` and `<script>` tags of `index.html`, `archive.html`, and `season.html` (e.g. `?v=1` → `?v=2`). That makes every visitor's browser load the new version.

To preview locally, run a small web server from the project folder (opening the HTML file directly won't load the data):

```
python -m http.server
```

Then open http://localhost:8000.

_Built for New Battell, by RAs, for community._
