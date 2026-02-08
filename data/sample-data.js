export const samplePeople = [
  {
    id: "p1",
    name: "Ava Patel",
    role: "Graph Architect",
    skills: ["graph modeling", "cypher", "knowledge graphs"],
    focus: "Complex graphing"
  },
  {
    id: "p2",
    name: "Noah Kim",
    role: "Signals Engineer",
    skills: ["event pipelines", "observability", "streaming"],
    focus: "Signals ingestion"
  },
  {
    id: "p3",
    name: "Maya Chen",
    role: "Product Lead",
    skills: ["requirements", "roadmaps", "stakeholders"],
    focus: "Product strategy"
  },
  {
    id: "p4",
    name: "Liam Osei",
    role: "Data Scientist",
    skills: ["ranking", "ml", "recommendations"],
    focus: "Team ranking"
  },
  {
    id: "p5",
    name: "Sofia Alvarez",
    role: "Frontend Engineer",
    skills: ["3d viz", "three.js", "ux"],
    focus: "3D visualization"
  },
  {
    id: "p6",
    name: "Ethan Brooks",
    role: "Backend Engineer",
    skills: ["apis", "neo4j", "performance"],
    focus: "Graph APIs"
  },
  {
    id: "p7",
    name: "Isla Novak",
    role: "Researcher",
    skills: ["llms", "prompting", "summaries"],
    focus: "LLM reasoning"
  },
  {
    id: "p8",
    name: "Kai Rivera",
    role: "Security",
    skills: ["access control", "audit", "compliance"],
    focus: "Trust & safety"
  },
  {
    id: "p9",
    name: "Zara Malik",
    role: "Design",
    skills: ["visual systems", "branding", "ui"],
    focus: "Dark tech aesthetic"
  },
  {
    id: "p10",
    name: "Owen Hart",
    role: "DevRel",
    skills: ["docs", "enablement", "community"],
    focus: "Enablement"
  }
];

export const sampleProjects = [
  { id: "proj1", name: "AICOS Core", focus: "Graph intelligence platform" },
  { id: "proj2", name: "SignalStream", focus: "Signals ingestion" },
  { id: "proj3", name: "Insight Lens", focus: "Decision support UI" }
];

export const sampleSignals = [
  {
    id: "s1",
    type: "git_commit",
    summary: "Implemented new traversal heuristics for graph ranking.",
    timestamp: "2024-05-10T10:12:00Z"
  },
  {
    id: "s2",
    type: "meeting_summary",
    summary: "Aligned on graph schema for people, projects, signals.",
    timestamp: "2024-05-11T14:30:00Z"
  },
  {
    id: "s3",
    type: "email",
    summary: "Customer asked for stronger signal filtering.",
    timestamp: "2024-05-12T09:00:00Z"
  },
  {
    id: "s4",
    type: "doc",
    summary: "Drafted query patterns for best-member recommendations.",
    timestamp: "2024-05-12T16:45:00Z"
  },
  {
    id: "s5",
    type: "git_commit",
    summary: "Added 3D graph rendering pipeline.",
    timestamp: "2024-05-13T11:20:00Z"
  },
  {
    id: "s6",
    type: "meeting_summary",
    summary: "Reviewed performance budget for Neo4j queries.",
    timestamp: "2024-05-13T15:30:00Z"
  },
  {
    id: "s7",
    type: "email",
    summary: "Partner sent sample signals dataset.",
    timestamp: "2024-05-14T08:15:00Z"
  },
  {
    id: "s8",
    type: "git_commit",
    summary: "Implemented chat-to-cypher translation stub.",
    timestamp: "2024-05-14T13:50:00Z"
  },
  {
    id: "s9",
    type: "doc",
    summary: "Authored design spec for dark tech UI.",
    timestamp: "2024-05-15T10:05:00Z"
  },
  {
    id: "s10",
    type: "meeting_summary",
    summary: "Defined KPI signals for team performance.",
    timestamp: "2024-05-15T17:25:00Z"
  },
  {
    id: "s11",
    type: "git_commit",
    summary: "Added filter chips for people and projects.",
    timestamp: "2024-05-16T09:40:00Z"
  },
  {
    id: "s12",
    type: "email",
    summary: "CTO requested insights on complex graphing experts.",
    timestamp: "2024-05-16T14:55:00Z"
  },
  {
    id: "s13",
    type: "doc",
    summary: "Outlined security controls for signal retention.",
    timestamp: "2024-05-17T07:45:00Z"
  },
  {
    id: "s14",
    type: "meeting_summary",
    summary: "Planned demo narrative for AI Chief of Staff.",
    timestamp: "2024-05-17T12:10:00Z"
  },
  {
    id: "s15",
    type: "git_commit",
    summary: "Integrated Neo4j driver with API server.",
    timestamp: "2024-05-18T09:05:00Z"
  },
  {
    id: "s16",
    type: "email",
    summary: "Shared visualization benchmarks for 3D graphs.",
    timestamp: "2024-05-18T13:20:00Z"
  },
  {
    id: "s17",
    type: "doc",
    summary: "Captured glossary for signals and knowledge nodes.",
    timestamp: "2024-05-19T10:30:00Z"
  },
  {
    id: "s18",
    type: "meeting_summary",
    summary: "Synced with design on minimalist UI layout.",
    timestamp: "2024-05-19T16:00:00Z"
  },
  {
    id: "s19",
    type: "git_commit",
    summary: "Added heuristics for skill-based recommendations.",
    timestamp: "2024-05-20T08:50:00Z"
  },
  {
    id: "s20",
    type: "email",
    summary: "Collected stakeholder feedback on signal clarity.",
    timestamp: "2024-05-20T15:35:00Z"
  }
];

export const sampleRelationships = {
  worksOn: [
    ["p1", "proj1"],
    ["p2", "proj2"],
    ["p3", "proj1"],
    ["p4", "proj1"],
    ["p5", "proj3"],
    ["p6", "proj1"],
    ["p7", "proj2"],
    ["p8", "proj1"],
    ["p9", "proj3"],
    ["p10", "proj2"]
  ],
  authored: [
    ["p1", "s1"],
    ["p1", "s4"],
    ["p2", "s3"],
    ["p2", "s7"],
    ["p3", "s2"],
    ["p3", "s10"],
    ["p4", "s19"],
    ["p5", "s5"],
    ["p5", "s11"],
    ["p6", "s15"],
    ["p6", "s6"],
    ["p7", "s8"],
    ["p7", "s17"],
    ["p8", "s13"],
    ["p9", "s9"],
    ["p9", "s18"],
    ["p10", "s14"],
    ["p4", "s12"],
    ["p6", "s16"],
    ["p3", "s20"]
  ],
  about: [
    ["s1", "proj1"],
    ["s2", "proj1"],
    ["s3", "proj2"],
    ["s4", "proj1"],
    ["s5", "proj3"],
    ["s6", "proj1"],
    ["s7", "proj2"],
    ["s8", "proj1"],
    ["s9", "proj3"],
    ["s10", "proj1"],
    ["s11", "proj3"],
    ["s12", "p1"],
    ["s13", "proj1"],
    ["s14", "proj2"],
    ["s15", "proj1"],
    ["s16", "p5"],
    ["s17", "proj2"],
    ["s18", "proj3"],
    ["s19", "p1"],
    ["s20", "proj3"]
  ],
  knows: [
    ["p1", "p5"],
    ["p1", "p6"],
    ["p2", "p7"],
    ["p3", "p4"],
    ["p5", "p9"],
    ["p6", "p2"],
    ["p7", "p3"],
    ["p8", "p6"],
    ["p9", "p10"],
    ["p10", "p3"]
  ]
};

export const sampleGraph = {
  people: samplePeople,
  projects: sampleProjects,
  signals: sampleSignals,
  relationships: sampleRelationships
};
