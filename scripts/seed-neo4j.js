import neo4j from "neo4j-driver";
import {
  samplePeople,
  sampleProjects,
  sampleSignals,
  sampleRelationships
} from "../data/sample-data.js";

const neo4jUri = process.env.NEO4J_URI;
const neo4jUsername = process.env.NEO4J_USERNAME;
const neo4jPassword = process.env.NEO4J_PASSWORD;

if (!neo4jUri || !neo4jUsername || !neo4jPassword) {
  throw new Error("Missing NEO4J credentials in environment variables.");
}

const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUsername, neo4jPassword)
);

const seed = async () => {
  const session = driver.session();
  try {
    await session.run("MATCH (n) DETACH DELETE n");

    for (const person of samplePeople) {
      await session.run(
        `MERGE (p:Person {id: $id})
         SET p.name = $name,
             p.role = $role,
             p.skills = $skills,
             p.focus = $focus`,
        person
      );
    }

    for (const project of sampleProjects) {
      await session.run(
        `MERGE (p:Project {id: $id})
         SET p.name = $name,
             p.focus = $focus`,
        project
      );
    }

    for (const signal of sampleSignals) {
      await session.run(
        `MERGE (s:Signal {id: $id})
         SET s.type = $type,
             s.summary = $summary,
             s.timestamp = $timestamp`,
        signal
      );
    }

    for (const [personId, projectId] of sampleRelationships.worksOn) {
      await session.run(
        `MATCH (p:Person {id: $personId}), (proj:Project {id: $projectId})
         MERGE (p)-[:WORKS_ON]->(proj)`,
        { personId, projectId }
      );
    }

    for (const [personId, signalId] of sampleRelationships.authored) {
      await session.run(
        `MATCH (p:Person {id: $personId}), (s:Signal {id: $signalId})
         MERGE (p)-[:AUTHORED]->(s)`,
        { personId, signalId }
      );
    }

    for (const [signalId, targetId] of sampleRelationships.about) {
      await session.run(
        `MATCH (s:Signal {id: $signalId})
         MATCH (t {id: $targetId})
         MERGE (s)-[:ABOUT]->(t)`,
        { signalId, targetId }
      );
    }

    for (const [sourceId, targetId] of sampleRelationships.knows) {
      await session.run(
        `MATCH (a:Person {id: $sourceId}), (b:Person {id: $targetId})
         MERGE (a)-[:KNOWS]->(b)`,
        { sourceId, targetId }
      );
    }

    console.log("Neo4j seeded with sample AICOS data.");
  } finally {
    await session.close();
    await driver.close();
  }
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
