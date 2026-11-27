(() => {
    "use strict";
    const items = [...document.querySelectorAll("article[data-item]")];
    const progress = document.querySelector("progress");
    const count = document.getElementById("count");
    const status = document.getElementById("status");

    function update() {
        for (const item of items) {
            const fields = [...item.querySelectorAll("textarea")];
            const confirm = item.querySelector("[data-confirm]");
            const ready = fields.every(field => field.value.trim() !== "");
            confirm.disabled = !ready;
            if (!ready) confirm.checked = false;
            item.querySelector("[data-state]").textContent = confirm.checked
                ? "Comprobado por ti (no es calificación)."
                : ready ? "Registros completos; confirma después de probar."
                    : "Registra tu solución y el resultado observado.";
        }
        const checked = items.filter(item => item.querySelector("[data-confirm]").checked).length;
        progress.value = checked;
        count.textContent = checked + " de " + items.length + " comprobaciones declaradas";
    }

    for (const item of items) {
        item.querySelector("[data-confirm]").addEventListener("change", update);
        for (const field of item.querySelectorAll("textarea")) {
            field.addEventListener("input", () => {
                item.querySelector("[data-confirm]").checked = false;
                update();
            });
        }
    }

    document.getElementById("export").addEventListener("click", async () => {
        const lines = [
            "Academic Labs · ADÜMÜN",
            "Actividad: " + document.body.dataset.activity,
            "Versión: " + document.body.dataset.version,
            "Fuente: " + document.body.dataset.source,
            "Fecha: " + new Date().toISOString(),
            "Evidencia declarada; no certifica ejecución, autoría, nota ni competencia.",
            ""
        ];

        for (const item of items) {
            lines.push(item.querySelector("h2").textContent,
                "Estado: " + (item.querySelector("[data-confirm]").checked ? "Comprobado" : "Pendiente"),
                "Solución / explicación:", item.querySelector("[data-solution]").value.trim() || "(sin registro)",
                "Prueba y resultado:", item.querySelector("[data-proof]").value.trim() || "(sin registro)", "");
        }

        let body = lines.join("\n");
        try {
            if (globalThis.crypto?.subtle) {
                const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body));
                body += "\nSHA-256 del contenido anterior: " + Array.from(new Uint8Array(hash),
                    value => value.toString(16).padStart(2, "0")).join("");
            } else {
                body += "\nSHA-256 no disponible en este entorno.";
            }
        } catch {
            body += "\nSHA-256 no disponible en este entorno.";
        }

        const url = URL.createObjectURL(new Blob([body], { type: "text/plain;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = document.body.dataset.activity + "-evidencia.txt";
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        status.textContent = "Descarga solicitada. Comprueba el archivo antes de cerrar.";
    });

    document.getElementById("clear").addEventListener("click", () => {
        if (!window.confirm("¿Limpiar todo el registro local de esta página?")) return;
        for (const item of items) {
            item.querySelector("[data-confirm]").checked = false;
            for (const field of item.querySelectorAll("textarea")) field.value = "";
        }
        update();
        status.textContent = "Registro limpiado.";
    });

    update();
})();