export type EventCategory = "tech" | "cultural" | "gaming" | "literary";

export interface IgnitiaEvent {
  slug: string;
  title: string;
  category: EventCategory;
  tagline: string;
  description: string;
  rules: string[];
  teamSize: string;
  date: string;
  time: string;
  venue: string;
  prize: string;
  chip: "lavender" | "blue" | "mint" | "peach";
}

export const events: IgnitiaEvent[] = [
  {
    slug: "hackathon",
    title: "Phoenix Hackathon",
    category: "tech",
    tagline: "24 hours. One spark. Infinite ideas.",
    description:
      "A flagship 24-hour hackathon where teams build real, working products around themes spanning AI, sustainability, fintech and social impact. Mentors from leading startups walk the floor through the night.",
    rules: [
      "Teams of 2 to 4 members from any college.",
      "All code must be written during the event window.",
      "Open-source libraries are allowed; pre-built projects are not.",
      "Final pitch is limited to 4 minutes followed by Q&A.",
    ],
    teamSize: "2 – 4",
    date: "Aug 1 – 2, 2026",
    time: "Starts 10:00 AM",
    venue: "IEM Gold Building, Auditorium A",
    prize: "₹75,000 pool",
    chip: "peach",
  },
  {
    slug: "coding-contest",
    title: "Code Forge",
    category: "tech",
    tagline: "Algorithms under the spotlight.",
    description:
      "A 3-hour individual competitive programming contest with problems spanning ad-hoc, data structures, graphs and dynamic programming. Live leaderboard, ICPC-style scoring.",
    rules: [
      "Individual participation only.",
      "Allowed languages: C, C++, Java, Python.",
      "No external help, AI assistants or pre-written libraries.",
      "Top 10 from prelims qualify for the on-site final.",
    ],
    teamSize: "Solo",
    date: "Aug 1, 2026",
    time: "2:00 PM – 5:00 PM",
    venue: "Lab Block, 4th Floor",
    prize: "₹25,000 pool",
    chip: "blue",
  },
  {
    slug: "gaming-tournament",
    title: "Arena Royale",
    category: "gaming",
    tagline: "Glory belongs to the bold.",
    description:
      "Multi-title esports tournament featuring Valorant (5v5), BGMI (squad) and FIFA (1v1). Group stage, knockouts and a grand final streamed live.",
    rules: [
      "Bring your own peripherals; PCs and consoles provided.",
      "All matches follow official tournament rulesets.",
      "Any form of cheating leads to immediate disqualification.",
      "Decisions of admins are final.",
    ],
    teamSize: "Solo / Squad",
    date: "Aug 1 – 2, 2026",
    time: "11:00 AM onwards",
    venue: "Esports Arena, Block C",
    prize: "₹40,000 pool",
    chip: "lavender",
  },
  {
    slug: "debate",
    title: "The Open Floor",
    category: "literary",
    tagline: "Sharper minds. Sharper words.",
    description:
      "A British Parliamentary debate tournament with three preliminary rounds, semi-finals and a grand final. Motions span policy, ethics and contemporary affairs.",
    rules: [
      "Teams of 2 speakers.",
      "15 minutes of prep time per motion.",
      "7 minutes per speaker, with POIs after the first minute.",
      "Adjudication by an external panel.",
    ],
    teamSize: "2",
    date: "Aug 2, 2026",
    time: "10:00 AM – 5:00 PM",
    venue: "UEM Seminar Hall",
    prize: "₹15,000 pool",
    chip: "mint",
  },
  {
    slug: "quiz",
    title: "Trivia Inferno",
    category: "literary",
    tagline: "Where curiosity is currency.",
    description:
      "A general quiz with a written prelim followed by an on-stage final featuring six teams. Categories range from sci-tech to pop culture, sports and history.",
    rules: [
      "Teams of 2 members.",
      "No phones or smart devices during the prelim.",
      "On-stage final uses dry-pass-and-bounce format.",
      "Quizmaster's decision is final.",
    ],
    teamSize: "2",
    date: "Aug 1, 2026",
    time: "11:00 AM – 1:30 PM",
    venue: "IEM Auditorium B",
    prize: "₹12,000 pool",
    chip: "blue",
  },
  {
    slug: "guess-who",
    title: "Guess Who",
    category: "literary",
    tagline: "Faces, hints, and a ticking clock.",
    description:
      "A fast-paced personality identification game with visual, audio and cryptic clues. Designed to be light, social and very, very competitive.",
    rules: [
      "Solo or pairs, your choice.",
      "Three rounds: visual, audio and cryptic.",
      "Negative marking on wrong shouts in the final round.",
      "Shortest cumulative time wins ties.",
    ],
    teamSize: "1 – 2",
    date: "Aug 2, 2026",
    time: "3:00 PM – 5:00 PM",
    venue: "IEM Atrium",
    prize: "₹8,000 pool",
    chip: "lavender",
  },
  {
    slug: "cultural-night",
    title: "Cultural Night",
    category: "cultural",
    tagline: "Music, motion and a thousand voices.",
    description:
      "The grand cultural finale featuring band performances, classical and contemporary dance showcases, and a celebrity headliner act under the stars.",
    rules: [
      "Open to all registered participants and pass holders.",
      "Performance slots are curated by the cultural committee.",
      "Original compositions encouraged; covers must credit artists.",
      "Strict no-glass and no-flame policy on stage.",
    ],
    teamSize: "Open",
    date: "Aug 2, 2026",
    time: "6:30 PM onwards",
    venue: "Open Air Stage, IEM Campus",
    prize: "Featured slot + ₹20,000",
    chip: "peach",
  },
];

export const getEvent = (slug: string) => events.find((e) => e.slug === slug);
