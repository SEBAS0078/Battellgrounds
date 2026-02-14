# Battellgrounds 🏆

Battellgrounds is New Battell’s first building-wide competition. Floors earn points through monthly events, participation, and friendly competition throughout the academic year. At the end of the year, the floor with the highest score takes home the **New Battell Cup** and receives an extra budget for a floor celebration.

This project powers a lightweight, front-end site that displays events, tracks attendance and winners, and automatically ranks floors on a live leaderboard.

## Features

- 📅 **Monthly Events**
  - Displays past and upcoming events
  - Shows event details, attendance, and winning floors
- 📊 **Live Leaderboard**
  - Automatically ranks floors by total points
  - Updates dynamically based on data changes
- 🧩 **Simple Data Management**
  - Events and leaderboard data stored in plain JavaScript files
  - Easy to update without touching core logic

## How Points Are Calculated

Points for each monthly event are split into two categories:

### Participation
Each floor earns points based on the percentage of its residents who attend an event. Higher attendance percentages earn higher participation scores.

### Competition Results
For events with clear rankings, additional points are awarded:

- 1st Place: 200 points  
- 2nd Place: 100 points  
- 3rd Place: 60 points  
- 4th Place: 40 points  

If multiple floors tie for a placement, the points for that placement are divided evenly.  
Some events may not have clear rankings. In those cases, points are assigned at the organizers’ discretion.




## Events Data (`events.js`)

Events are stored as a JSON string inside a JavaScript file for easy editing:

```js
const events = `[
  {
    "title": "Trivia Night",
    "date": "Thursday, September 18",
    "time": "8:00 – 10:00 PM",
    "location": "New Battell First Floor Lounge",
    "description": "...",
    "attendance": 81,
    "winner": "3rd floor",
    "status": "past"
  }
]`;
```
- status: "past" displays attendance and winner

- Future events can use another status value (for example "upcoming")

- Leaderboard Data (leaderboard.js)
Floor scores are stored in a simple array:

```js
export const LEADERBOARD = [
  { floor: "1st Floor", points: 247.2 },
  { floor: "2nd Floor", points: 130.67 },
  { floor: "3rd Floor", points: 412.77 },
  { floor: "4th Floor", points: 377.65 }
];
```
The leaderboard is automatically sorted and rounded when rendered.

## Logic Overview (index.js)
- Parses event data and dynamically creates event cards

- Conditionally displays winners and attendance for past events

- Sorts leaderboard data by points

- Automatically populates the leaderboard table in descending order

- No backend or database required.

## Why This Approach
- Easy for RAs to update events and scores

- No external dependencies

- Beginner-friendly and maintainable

- Ideal for small, community-driven projects

## Future Improvements
- Admin form for adding events

- Automatic point calculation from attendance

_Built for New Battell, by RAs, for community._
