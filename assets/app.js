(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const grid = $("activity-grid");
  const search = $("search-input");
  const filter = $("course-filter");
  const total = $("activity-total");
  const empty = $("no-results");
  const state = { activities: [] };
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
    const tag = create("span", "course-tag", activity.course?.code || "Actividad");
    top.append(icon, tag);
    const title = create("h3", "", activity.title);
    const description = create("p", "", activity.description);
    const details = create("div", "activity-details");
    [activity.topic, activity.durationMinutes ? activity.durationMinutes + " minutos aprox." : "", activity.evidence === "txt" ? "Evidencia TXT" : ""].filter(Boolean).forEach((detail) => details.append(create("span", "", detail)));
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
    const shown = state.activities.filter((a) => {
      if (course && a.course?.code !== course) return false;
      const searchable = [a.title, a.description, a.topic, a.course?.code, a.course?.name, ...(a.tags || [])].join(" ");
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
      if (!Array.isArray(catalog.activities)) throw new Error("Catálogo inválido");
      state.activities = catalog.activities.filter((a) => a && a.status === "published" && a.title && a.path);
      const courses = new Map();
      state.activities.forEach((a) => {
        if (a.course?.code) courses.set(a.course.code, a.course.name || a.course.code);
      });
      [...courses.entries()].sort((a, b) => a[0].localeCompare(b[0])).forEach(([code, name]) => {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = code + " · " + name;
        filter.append(option);
      });
      search.addEventListener("input", render);
      filter.addEventListener("change", render);
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