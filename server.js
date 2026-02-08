import express from "express";
import neo4j from "neo4j-driver";
import {
  sampleGraph,
  samplePeople,
  sampleProjects,
  sampleSignals
} from "./data/sample-data.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const neo4jUri = process.env.NEO4J_URI;
const neo4jUsername = process.env.NEO4J_USERNAME;
const neo4jPassword = process.env.NEO4J_PASSWORD;

let driver;
if (neo4jUri && neo4jUsername && neo4jPassword) {
  driver = neo4j.driver(
    neo4jUri,
    neo4j.auth.basic(neo4jUsername, neo4jPassword)
  );
}

const formatNode = (node) => {
  const labels = node.labels || [];
  const properties = node.properties || {};
  return {
    id: properties.id || node.identity?.toString(),
    label: properties.name || properties.summary || properties.id,
    group: labels[0] || "Entity",
    ...properties
  };
};

const buildSampleGraph = () => {
  const nodes = [
    ...sampleGraph.people.map((person) => ({
      id: person.id,
      label: person.name,
      group: "Person",
      ...person
    })),
    ...sampleGraph.projects.map((project) => ({
      id: project.id,
      label: project.name,
      group: "Project",
      ...project
    })),
    ...sampleGraph.signals.map((signal) => ({
      id: signal.id,
      label: signal.type,
      group: "Signal",
      ...signal
    }))
  ];

  const links = [];
  const addLinks = (pairs, type) => {
    pairs.forEach(([source, target]) => {
      links.push({ source, target, type });
    });
  };

  addLinks(sampleGraph.relationships.worksOn, "WORKS_ON");
  addLinks(sampleGraph.relationships.authored, "AUTHORED");
  addLinks(sampleGraph.relationships.about, "ABOUT");
  addLinks(sampleGraph.relationships.knows, "KNOWS");

  return { nodes, links };
};

const getGraphFromNeo4j = async () => {
  if (!driver) {
    return buildSampleGraph();
  }

  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (n)
       WHERE n:Person OR n:Project OR n:Signal
       OPTIONAL MATCH (n)-[r]->(m)
       RETURN collect(DISTINCT n) AS nodes,
              collect(DISTINCT m) AS related,
              collect(DISTINCT r) AS rels`
    );

    const record = result.records[0];
    const nodes = new Map();
    const idLookup = new Map();

    record.get("nodes").forEach((node) => {
      const key = node.elementId || node.identity?.toString();
      const formatted = formatNode(node);
      nodes.set(key, formatted);
      idLookup.set(key, formatted.id);
    });

    record.get("related").forEach((node) => {
      if (!node) return;
      const key = node.elementId || node.identity?.toString();
      const formatted = formatNode(node);
      nodes.set(key, formatted);
      idLookup.set(key, formatted.id);
    });

    const links = record.get("rels").map((rel) => ({
      source:
        idLookup.get(rel.startNodeElementId || rel.startNodeId?.toString()) ||
        rel.startNodeElementId ||
        rel.startNodeId?.toString(),
      target:
        idLookup.get(rel.endNodeElementId || rel.endNodeId?.toString()) ||
        rel.endNodeElementId ||
        rel.endNodeId?.toString(),
      type: rel.type
    }));

    return { nodes: Array.from(nodes.values()), links };
  } finally {
    await session.close();
  }
};

const translateQuestionToCypher = async (question) => {
  if (process.env.OPENAI_API_KEY) {
    const response = await fetch(
      process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You translate user questions into Cypher for a Neo4j graph with Person, Project, Signal nodes. Return JSON with keys cypher and intent only."
            },
            { role: "user", content: question }
          ],
          temperature: 0.2
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      try {
        const parsed = JSON.parse(content);
        if (parsed.cypher) {
          return parsed;
        }
      } catch (error) {
        console.warn("Failed to parse LLM response", error);
      }
    }
  }

  const normalized = question.toLowerCase();
  if (
    normalized.includes("best") &&
    (normalized.includes("graph") || normalized.includes("graphing"))
  ) {
    return {
      cypher: `MATCH (p:Person)
OPTIONAL MATCH (p)-[:AUTHORED]->(s:Signal)
WITH p, count(s) AS signalCount
WHERE any(skill IN p.skills WHERE skill CONTAINS "graph")
RETURN p.name AS name, p.role AS role, p.skills AS skills, signalCount
ORDER BY signalCount DESC
LIMIT 3`,
      intent: "skill_match"
    };
  }

  return {
    cypher: `MATCH (p:Person)-[:WORKS_ON]->(proj:Project)
OPTIONAL MATCH (p)-[:AUTHORED]->(s:Signal)
WITH p, proj, count(s) AS signalCount
RETURN p.name AS name, p.role AS role, proj.name AS project, signalCount
ORDER BY signalCount DESC
LIMIT 5`,
    intent: "team_overview"
  };
};

const runCypher = async (cypher, params = {}) => {
  if (!driver) {
    return { records: [] };
  }
  const session = driver.session();
  try {
    return await session.run(cypher, params);
  } finally {
    await session.close();
  }
};

const recordsToAnswer = (records) => {
  if (!records.length) {
    return "I couldn't find matches in Neo4j, so try rephrasing or seed sample data.";
  }

  return records
    .map((record) => {
      const entries = record.keys.map((key) => {
        const value = record.get(key);
        if (Array.isArray(value)) {
          return `${key}: ${value.join(", ")}`;
        }
        return `${key}: ${value}`;
      });
      return `• ${entries.join(" | ")}`;
    })
    .join("\n");
};

const answerFromSampleData = (intent) => {
  if (intent === "skill_match") {
    const matches = samplePeople.filter((person) =>
      person.skills.some((skill) => skill.includes("graph"))
    );
    return matches
      .map(
        (person) =>
          `• name: ${person.name} | role: ${person.role} | skills: ${person.skills.join(
            ", "
          )}`
      )
      .join("\n");
  }

  return samplePeople
    .slice(0, 5)
    .map(
      (person) =>
        `• name: ${person.name} | role: ${person.role} | focus: ${person.focus}`
    )
    .join("\n");
};

app.get("/api/graph", async (_req, res) => {
  try {
    const graph = await getGraphFromNeo4j();
    res.json(graph);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/filters", (_req, res) => {
  res.json({
    people: samplePeople.map((person) => ({ id: person.id, name: person.name })),
    projects: sampleProjects.map((project) => ({
      id: project.id,
      name: project.name
    })),
    signalTypes: Array.from(new Set(sampleSignals.map((signal) => signal.type)))
  });
});

app.post("/api/chat", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  try {
    const translation = await translateQuestionToCypher(question);
    if (!driver) {
      return res.json({
        cypher: translation.cypher,
        answer: answerFromSampleData(translation.intent),
        intent: translation.intent,
        note: "Using bundled sample data because Neo4j credentials are missing."
      });
    }

    const result = await runCypher(translation.cypher);

    res.json({
      cypher: translation.cypher,
      answer: recordsToAnswer(result.records),
      intent: translation.intent
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`AICOS server listening on http://localhost:${port}`);
});
