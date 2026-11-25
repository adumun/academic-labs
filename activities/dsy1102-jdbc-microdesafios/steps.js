(() => {
    "use strict";

    const items = [...document.querySelectorAll("[data-item]")];
    const el = id => document.getElementById(id);
    const nav = el("step-index");
    const controls = document.querySelector(".step-controls");
    const buttons = [];
    let current = 0;

    function completed(item) {
        return item.querySelector("[data-confirm]").checked;
    }

    function started(item) {
        return [...item.querySelectorAll("textarea")].some(field => field.value.trim());
    }

    function ready(item) {
        return [...item.querySelectorAll("textarea[required]")].every(field => field.value.trim());
    }

    function refresh() {
        items.forEach((item, index) => {
            const done = completed(item);
            const pending = started(item) && !done;
            const button = buttons[index];
            button.textContent = (index + 1) + (done ? " ✓" : pending ? " ·" : "");
            button.setAttribute("aria-label", "Desafío " + (index + 1) + ": " + (done ? "completo" : pending ? "en progreso" : "pendiente"));
            button.classList.toggle("done", done);
            button.classList.toggle("active", index === current);
            if (index === current) {
                button.setAttribute("aria-current", "step");
            } else {
                button.removeAttribute("aria-current");
            }
        });
        if (current < items.length) {
            el("step-next").disabled = !ready(items[current]);
            el("step-next").textContent = current === items.length - 1 ? "Confirmar y finalizar" : "Confirmar y avanzar →";
        }
        el("step-prev").disabled = current === 0;
    }

    function show(index, moveFocus = true) {
        current = Math.max(0, Math.min(items.length, index));
        const summary = current === items.length;
        items.forEach((item, i) => item.hidden = i !== current);
        el("step-summary").hidden = !summary;
        controls.hidden = summary;
        el("step-position").textContent = summary ? "Resumen de entrega" : "Desafío " + (current + 1) + " de " + items.length;
        if (summary) {
            const total = items.filter(completed).length;
            el("summary-text").textContent = total + " de " + items.length + " desafíos confirmados. Puedes descargar el TXT o completar los pendientes.";
            const list = el("summary-items");
            list.replaceChildren();
            items.forEach((item, i) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "secondary summary-link";
                btn.textContent = item.querySelector("[data-title]").textContent + " — " + (completed(item) ? "Completo" : "Pendiente");
                btn.addEventListener("click", () => show(i));
                list.append(btn);
            });
            el("resume-pending").hidden = total === items.length;
        }
        refresh();
        if (moveFocus) {
            const heading = summary ? el("step-summary").querySelector("h2") : items[current].querySelector("h2");
            heading.tabIndex = -1;
            heading.focus({preventScroll: true});
            heading.scrollIntoView({block: "start"});
        }
    }

    items.forEach((item, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "secondary";
        btn.addEventListener("click", () => show(i));
        buttons.push(btn);
        nav.append(btn);
        item.addEventListener("input", refresh);
        item.addEventListener("change", refresh);
    });

    el("step-prev").addEventListener("click", () => show(current - 1));
    el("step-skip").addEventListener("click", () => show(current + 1));
    el("step-next").addEventListener("click", () => {
        const item = items[current];
        if (!item || !ready(item)) return;
        const checkbox = item.querySelector("[data-confirm]");
        if (!checkbox.checked) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event("change", {bubbles: true}));
        }
        show(current + 1);
    });
    el("resume-pending").addEventListener("click", () => {
        const i = items.findIndex(item => !completed(item));
        if (i >= 0) show(i);
    });
    el("clear").addEventListener("click", () => {
        // The shared handler performs confirmation and clears all fields first.
        show(current, false);
    });
    show(0, false);
})();
