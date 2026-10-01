// Battellgrounds 2025–2026: the inaugural season, frozen as it stood at the end of the year.
// Events and points are copied verbatim from events-2025-2-28.js and leaderboard-2025-2-28.js.
// Do not edit scores here unless correcting the historical record.

export default {
  id: "2025-2026",
  label: "2025–2026",
  tagline: "The inaugural season",

  // RA names for each floor go in the "ras" arrays, e.g. ["Karolina", "David"]
  standings: [
    { floor: "1st Floor", points: 359.97, ras: ["Sebastian", "Zaina"] },
    { floor: "2nd Floor", points: 188.36, ras: ["Paw", "Alvaro", "Ananya", "Carlos"] },
    { floor: "3rd Floor", points: 633.55, ras: ["Jesus", "Houda", "Angel", "Nam", "Doreen"] },
    { floor: "4th Floor", points: 439.65, ras: ["Karo", "Elly", "David", "Liz", "Chimmy"] }
  ],

  // Chronological order
  events: [
    {
      title: "Trivia Night",
      date: "Thursday, September 18, 2025",
      time: "8:00 – 10:00 PM",
      location: "New Battell First Floor Lounge",
      description: "Test your knowledge in History, Geography, Science & Nature, General Knowledge, and Sports. Snacks and refreshments provided!",
      attendance: 81,
      winner: "3rd floor"
    },
    {
      title: "Pumpkin Carving",
      date: "Saturday, October 25, 2025",
      time: "4:00 – 6:00 PM",
      location: "New Battell First Floor Lounge",
      description: "Join us for a fun pumpkin carving competition and represent your floor for October’s Battellgrounds event!",
      attendance: 40,
      winner: "4th, 3rd and 1st Floors"
    },
    {
      title: "Table Tennis Tournament",
      date: "Thursday, January 22, 2026",
      time: "6:30 – 8:30 PM",
      location: "New Battell First Floor Lounge",
      description: "Compete for your floor in a Battell Grounds table tennis tournament hosted by RAs Karolina and David. Complete the arts and crafts station to enter the tournament, or hang out with crafts, snacks, and hot chocolate. Bring friends from any building to boost your floor’s score.",
      attendance: 61,
      winner: "4th floor"
    },
    {
      title: "Board Game Competition",
      date: "Friday, February 27, 2026",
      time: "4:30 – 6:00 PM",
      location: "New Battell First Floor Lounge",
      description: "Compete to bring honor for your floor in a game tournament. Featuring Smash Bros, UNO, and Connect 4. There will be prizes and snacks",
      attendance: 37,
      winner: "3rd and 1st Floors"
    }
  ],

  // Scoring rules in effect this season
  scoring: {
    participation: "Each floor earned points based on the percentage of its residents who attended.",
    placements: [200, 100, 60, 40],
    notes: [
      "Ties for a placement split that placement’s points evenly.",
      "Events without clear rankings were scored at the organizers’ discretion."
    ]
  }
};
