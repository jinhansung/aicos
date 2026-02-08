const graphContainer = document.getElementById("graph");
const personFilter = document.getElementById("personFilter");
const projectFilter = document.getElementById("projectFilter");
const signalFilter = document.getElementById("signalFilter");
const resetButton = document.getElementById("resetFilters");
const chatForm = document.getElementById("chatForm");
const chatQuestion = document.getElementById("chatQuestion");
const chatHistory = document.getElementById("chatHistory");

const nodeColors = {
  Person: "#5eead4",
  Project: "#60a5fa",
  Signal: "#f472b6",
  Entity: "#94a3b8"
};

const Graph = ForceGraph3D()(graphContainer)
  .backgroundColor("#0b1120")
  .nodeLabel((node) => `${node.group}: ${node.label}`)
  .nodeAutoColorBy("group")
  .nodeColor((node) => nodeColors[node.group] || nodeColors.Entity)
  .linkColor(() => "rgba(148, 163, 184, 0.4)")
  .linkDirectionalParticles(2)
  .linkDirectionalParticleWidth(1.5)
  .linkDirectionalParticleSpeed(0.006);

const fetchGraph = async () => {
  const response = await fetch("/api/graph");
  return response.json();
};

const fetchFilters = async () => {
  const response = await fetch("/api/filters");
  return response.json();
};

const populateSelect = (select, options, label) => {
  select.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = `All ${label}`;
  select.append(defaultOption);

  options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option.id || option;
    opt.textContent = option.name || option;
    select.append(opt);
  });
};

const filterGraphData = (data) => {
  const personValue = personFilter.value;
  const projectValue = projectFilter.value;
  const signalValue = signalFilter.value;

  let filteredNodes = data.nodes;

  if (personValue) {
    filteredNodes = filteredNodes.filter(
      (node) => node.id === personValue || node.group !== "Person"
    );
  }

  if (projectValue) {
    filteredNodes = filteredNodes.filter(
      (node) => node.id === projectValue || node.group !== "Project"
    );
  }

  if (signalValue) {
    filteredNodes = filteredNodes.filter(
      (node) => node.type === signalValue || node.group !== "Signal"
    );
  }

  const nodeIds = new Set(filteredNodes.map((node) => node.id));
  const filteredLinks = data.links.filter(
    (link) => nodeIds.has(link.source) && nodeIds.has(link.target)
  );

  return { nodes: filteredNodes, links: filteredLinks };
};

const renderGraph = async () => {
  const data = await fetchGraph();
  const filtered = filterGraphData(data);
  Graph.graphData(filtered);
};

const addChatBubble = (text, type) => {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${type}`;
  bubble.textContent = text;
  chatHistory.append(bubble);
  chatHistory.scrollTop = chatHistory.scrollHeight;
};

const sendQuestion = async (question) => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });
  return response.json();
};

const init = async () => {
  const filters = await fetchFilters();
  populateSelect(personFilter, filters.people, "People");
  populateSelect(projectFilter, filters.projects, "Projects");
  populateSelect(signalFilter, filters.signalTypes, "Signals");

  await renderGraph();
};

[personFilter, projectFilter, signalFilter].forEach((select) => {
  select.addEventListener("change", renderGraph);
});

resetButton.addEventListener("click", () => {
  personFilter.value = "";
  projectFilter.value = "";
  signalFilter.value = "";
  renderGraph();
});

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = chatQuestion.value.trim();
  if (!question) return;

  addChatBubble(question, "user");
  chatQuestion.value = "";

  const response = await sendQuestion(question);
  const answer = `${response.answer || "No answer returned."}\n\nCypher:\n${
    response.cypher || ""
  }`;
  addChatBubble(answer, "response");
});

init();
