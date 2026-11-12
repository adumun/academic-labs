(() => {
  "use strict";

  const catalogUrl = "/labs-catalog.json";
  const categoryIcons = {
    games: "🎮",
    education: "🧭",
    ai: "✳",
    technology: "⌘",
  };

  const create = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  function renderCategories(categories) {
    const container = document.getElementById("category-grid");
    if (!container) return;
    container.replaceChildren();

    for (const category of categories) {
      const card = create("article", "category-card");
      card.append(create("span", "category-icon", categoryIcons[category.id] || "◈"));
      card.append(create("h3", "", category.title));
      card.append(create("p", "", category.description));

      if (category.status === "active" && category.href) {
        const link = create("a", "", "Explorar " + category.title + " ↗");
        link.href = category.href;
        card.append(link);
      } else {
        card.append(create("span", "coming-soon", "PRÓXIMAMENTE"));
      }
      container.append(card);
    }
  }

  function renderApplications(applications, targetId) {
    const container = document.getElementById(targetId);
    if (!container) return;
    container.replaceChildren();

    const visible = applications.filter((app) =>
      app.categoryId === "games" && app.visible !== false
    );
    if (!visible.length) {
      container.append(create("p", "empty-state", "Todavía no hay experiencias publicadas en esta área."));
      return;
    }

    for (const app of visible) {
      const card = create("article", "app-card");
      card.append(create("span", "app-icon", "🎮"));

      const copy = create("div", "app-copy");
      copy.append(create("strong", "", app.title));
      copy.append(create("p", "", app.description));
      card.append(copy);

      if (app.status === "published") {
        card.append(create("span", "app-status live", "DISPONIBLE"));
        const link = create("a", "app-link", "Jugar ↗");
        link.href = "/games/" + encodeURIComponent(app.slug) + "/";
        card.append(link);
      } else {
        card.append(create("span", "app-status", "EN PREPARACIÓN"));
      }
      container.append(card);
    }
  }

  async function init() {
    try {
      const response = await fetch(catalogUrl, { cache: "no-cache" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const catalog = await response.json();
      if (
        catalog.schemaVersion !== 1 ||
        !Array.isArray(catalog.categories) ||
        !Array.isArray(catalog.applications)
      ) {
        throw new Error("Unsupported catalog schema");
      }

      const page = document.body.dataset.page || "home";
      if (page === "home") renderCategories(catalog.categories);
      renderApplications(catalog.applications, "featured-list");
      renderApplications(catalog.applications, "demo-list");
      renderApplications(catalog.applications, "game-list");
    } catch (error) {
      for (const id of ["category-grid", "featured-list", "demo-list", "game-list"]) {
        const target = document.getElementById(id);
        if (target) target.replaceChildren(create("p", "error", "No pudimos cargar el catálogo. Intenta nuevamente."));
      }
      console.error("ADÜMÜN Labs catalog error:", error);
    }
  }

  init();
})();
