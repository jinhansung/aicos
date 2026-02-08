# AICOS — AI Chief of Staff

A minimal Neo4j-powered demo for tracking people, projects, and signals. Includes:

- **Neo4j sample data** (10 people, 3 projects, 20 signals)
- **3D graph interface** with filters
- **Chat-to-Cypher flow** that answers natural language questions

## Quick start

```bash
npm install
cp .env.example .env
# Update .env with your Neo4j credentials
npm run seed
npm start
```

Open `http://localhost:3000`.

## Chat examples

- “who is the best team member for complex graphing?”
- “show top contributors by signals”

## Notes

- The server uses Neo4j when credentials are present; otherwise it falls back to bundled sample data for the graph view.
- The chat endpoint returns the Cypher used and a natural language summary of the results.
- Optional: add `OPENAI_API_KEY` to `.env` to enable live LLM-based Cypher translation.
