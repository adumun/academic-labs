(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const grid = $("activity-grid");
  const search = $("search-input");
  const filter = $("course-filter");
  const topicFilter = $("topic-filter");
  const total = $("activity-total");
  const empty = $("no-results");
  const state = { activities: [], topics: new Map(), courses: new Map() };
  const normalize = (value) => String(value || "").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  function create(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = String(value);
    return node;
  }
  function renderCard(activity) {
    const card = create("article", "activity-card");
    const top = create("div", "activity-top");
    const icon = create("span", "activity-icon", activity.icon || "🧪");
    icon.setAttribute("aria-hidden", "true");
    const tag = create("span", "course-tag", state.topics.get(activity.topicIds[0])?.name || "Laboratorio");
    top.append(icon, tag);
    const title = create("h3", "", activity.title);
    const description = create("p", "", activity.description);
    const details = create("div", "activity-details");
    [...activity.topicIds.slice(1).map(id => state.topics.get(id)?.name), ...activity.courseCodes, activity.durationMinutes ? activity.durationMinutes + " minutos aprox." : "", activity.evidence === "txt" ? "Evidencia TXT" : ""].filter(Boolean).forEach((detail) => details.append(create("span", "", detail)));
    const link = create("a", "activity-link", "Abrir laboratorio");
    const href = String(activity.path || "");
    if (!/^\/activities\/[a-z0-9/-]+\/$/.test(href)) return null;
    link.href = href;
    const arrow = create("span", "", "↗");
    arrow.setAttribute("aria-hidden", "true");
    link.append(arrow);
    card.append(top, title, description, details, link);
    return card;
  }
  function render() {
    const query = normalize(search.value.trim());
    const course = filter.value;
    const topic = topicFilter.value;
    const shown = state.activities.filter((a) => {
      if (course && !a.courseCodes.includes(course)) return false;
      if (topic && !a.topicIds.includes(topic)) return false;
      const searchable = [a.title, a.description, ...a.topicIds.flatMap(id => { const t=state.topics.get(id); return t ? [t.name,t.area,t.description] : []; }), ...a.courseCodes.flatMap(code => { const c=state.courses.get(code); return c ? [c.code,c.name] : []; }), ...(a.learningObjectives || []), ...(a.tags || [])].join(" ");
      return normalize(searchable).includes(query);
    });
    grid.replaceChildren();
    shown.forEach((a) => {
      const card = renderCard(a);
      if (card) grid.append(card);
    });
    empty.hidden = shown.length > 0;
    total.textContent = shown.length + (shown.length === 1 ? " actividad" : " actividades");
  }
  async function init() {
    try {
      const response = await fetch("./catalog.json", { cache: "no-cache" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const catalog = await response.json();
      if (catalog.schemaVersion !== 2 || !Array.isArray(catalog.activities) || !Array.isArray(catalog.topics) || !Array.isArray(catalog.courses)) throw new Error("Catálogo inválido");
      state.topics = new Map(catalog.topics.map(t => [t.id,t]));
      state.courses = new Map(catalog.courses.map(c => [c.code,c]));
      state.activities = catalog.activities.filter(a => a && a.status === "published" && a.title && a.path && Array.isArray(a.topicIds) && a.topicIds.length > 0 && a.topicIds.every(id => state.topics.has(id)) && Array.isArray(a.courseCodes) && a.courseCodes.every(code => state.courses.has(code)));
      [...state.topics.values()].sort((a,b) => a.name.localeCompare(b.name,"es")).forEach(t => {
        const option=document.createElement("option"); option.value=t.id; option.textContent=t.name; topicFilter.append(option);
      });
      [...state.courses.values()].sort((a,b) => a.code.localeCompare(b.code)).forEach(c => {
        const option=document.createElement("option"); option.value=c.code; option.textContent=c.code+" · "+c.name; filter.append(option);
      });
      search.addEventListener("input", render);
      filter.addEventListener("change", render);
      topicFilter.addEventListener("change", render);
      render();
    } catch (error) {
      grid.replaceChildren(create("p", "error-card", "No fue posible cargar el catálogo. Intenta recargar la página. Para ejecutar el proyecto localmente utiliza un servidor HTTP (ver README)."));
      total.textContent = "Catálogo no disponible";
      empty.hidden = true;
      console.error("Academic Labs: error al cargar el catálogo:", error);
    }
  }
  init();
})();