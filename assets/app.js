(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const grid = $("activity-grid");
  const search = $("search-input");
  const topicFilter = $("topic-filter");
  const courseFilter = $("course-filter");
  const resultsCount = $("activity-total");
  const empty = $("no-results");
  const form = $("explore-form");
  const clearButton = $("clear-filters");
  const state = { activities: [], topics: new Map(), courses: new Map() };
  const normalize = value => String(value || "").toLocaleLowerCase("es")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  function create(tag, className, value) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (value !== undefined) element.textContent = String(value);
    return element;
  }

  function loadParams() {
    const params = new URLSearchParams(window.location.search);
    search.value = (params.get("q") || "").slice(0,120);
    topicFilter.value = state.topics.has(params.get("topic")) ? params.get("topic") : "";
    courseFilter.value = state.courses.has(params.get("course")) ? params.get("course") : "";
  }

  function currentUrl() {
    const params = new URLSearchParams();
    const q = search.value.trim();
    if (q) params.set("q", q);
    if (topicFilter.value) params.set("topic", topicFilter.value);
    if (courseFilter.value) params.set("course", courseFilter.value);
    const query = params.toString();
    return "/explore/" + (query ? "?" + query : "");
  }

  function updateUrl(push = false) {
    const target = currentUrl();
    if (target === window.location.pathname + window.location.search) return;
    window.history[push ? "pushState" : "replaceState"](null, "", target);
  }

  function renderCard(activity) {
    const card = create("article", "activity-card");
    const top = create("div", "activity-top");
    const icon = create("span", "activity-icon", activity.icon || "🧪");
    icon.setAttribute("aria-hidden", "true");
    top.append(icon, create("span", "course-tag",
      state.topics.get(activity.topicIds[0])?.name || "Laboratorio"));
    const title = create("h3", "", activity.title);
    const description = create("p", "", activity.description);
    const details = create("div", "activity-details");
    [
      ...activity.topicIds.slice(1).map(id => state.topics.get(id)?.name),
      ...activity.courseCodes,
      activity.durationMinutes ? activity.durationMinutes + " minutos aprox." : "",
      activity.evidence === "txt" ? "Evidencia TXT" : ""
    ].filter(Boolean).forEach(label => details.append(create("span", "", label)));
    const href = String(activity.path || "");
    if (!/^\/activities\/[a-z0-9/-]+\/$/.test(href)) return null;
    const link = create("a", "activity-link", "Abrir laboratorio");
    link.href = href;
    const arrow = create("span", "", "↗");
    arrow.setAttribute("aria-hidden", "true");
    link.append(arrow);
    card.append(top, title, description, details, link);
    return card;
  }

  function render() {
    const q = normalize(search.value.trim());
    const topic = topicFilter.value;
    const course = courseFilter.value;
    const matches = state.activities.filter(activity => {
      if (topic && !activity.topicIds.includes(topic)) return false;
      if (course && !activity.courseCodes.includes(course)) return false;
      const text = [
        activity.title, activity.description,
        ...activity.topicIds.flatMap(id => {
          const t = state.topics.get(id);
          return t ? [t.name, t.area, t.description] : [];
        }),
        ...activity.courseCodes.flatMap(code => {
          const c = state.courses.get(code);
          return c ? [c.code, c.name] : [];
        }),
        ...(activity.learningObjectives || []), ...(activity.tags || [])
      ].join(" ");
      return normalize(text).includes(q);
    });
    grid.replaceChildren();
    matches.forEach(activity => {
      const card = renderCard(activity);
      if (card) grid.append(card);
    });
    empty.hidden = matches.length !== 0;
    clearButton.hidden = !search.value.trim() && !topic && !course;
    resultsCount.textContent = matches.length +
      (matches.length === 1 ? " actividad" : " actividades");
  }

  function clearFilters() {
    search.value = "";
    topicFilter.value = "";
    courseFilter.value = "";
    updateUrl(true);
    render();
    search.focus();
  }

  async function init() {
    if (!grid || !search || !topicFilter || !courseFilter || !form) return;
    try {
      const response = await fetch("/catalog.json", { cache: "no-cache" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const catalog = await response.json();
      if (catalog.schemaVersion !== 2 || !Array.isArray(catalog.activities) ||
          !Array.isArray(catalog.topics) || !Array.isArray(catalog.courses)) {
        throw new Error("Esquema del catálogo no compatible");
      }
      state.topics = new Map(catalog.topics.map(t => [t.id, t]));
      state.courses = new Map(catalog.courses.map(c => [c.code, c]));
      state.activities = catalog.activities.filter(a =>
        a && a.status === "published" && a.title && a.path &&
        Array.isArray(a.topicIds) && a.topicIds.length > 0 &&
        a.topicIds.every(id => state.topics.has(id)) &&
        Array.isArray(a.courseCodes) && a.courseCodes.every(code => state.courses.has(code))
      );
      [...state.topics.values()].sort((a,b) => a.name.localeCompare(b.name, "es"))
        .forEach(t => {
          const option = create("option", "", t.name);
          option.value = t.id;
          topicFilter.append(option);
        });
      [...state.courses.values()].sort((a,b) => a.code.localeCompare(b.code))
        .forEach(c => {
          const option = create("option", "", c.code + " · " + c.name);
          option.value = c.code;
          courseFilter.append(option);
        });
      loadParams();
      search.addEventListener("input", () => { updateUrl(); render(); });
      topicFilter.addEventListener("change", () => { updateUrl(true); render(); });
      courseFilter.addEventListener("change", () => { updateUrl(true); render(); });
      form.addEventListener("submit", event => {
        event.preventDefault();
        updateUrl(true);
        render();
      });
      clearButton.addEventListener("click", clearFilters);
      $("empty-clear").addEventListener("click", clearFilters);
      window.addEventListener("popstate", () => { loadParams(); render(); });
      render();
    } catch (error) {
      grid.replaceChildren(create("p", "error-card",
        "No pudimos cargar las actividades. Recarga la página o intenta de nuevo más tarde."));
      resultsCount.textContent = "Catálogo no disponible";
      empty.hidden = true;
      console.error("Academic Labs: error al cargar el catálogo:", error);
    }
  }
  init();
})();