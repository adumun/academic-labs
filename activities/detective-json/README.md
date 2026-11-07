# Detective JSON · Actividad transversal

**ID:** `detective-json` · **Versión:** `1.0.0` · **Ticket:** [ADU-129](https://adumun.atlassian.net/browse/ADU-129) · **GitHub Issue:** [#4](https://github.com/adumun/academic-labs/issues/4)

## Resultado pedagógico
Una persona que aún no estudia JavaScript puede distinguir:
- arreglo y objeto JSON;
- sintaxis correcta y errores de comillas/comas;
- estructura JSON distinta de la esperada por la aplicación;
- dato inválido para el negocio aunque el JSON sea sintácticamente correcto;
- clave duplicada dentro de un mismo objeto y por qué Jackson configurado estrictamente la rechaza.

**Duración estimada:** 15–25 minutos. **Audiencia inicial:** DSY1102, reusable por tema en otras asignaturas.

## Implementación

Un único `index.html` con HTML/CSS/JS estándar, sin dependencias, backend, cuentas ni analíticas. Seis casos editables; respuestas seleccionadas y reflexión se descargan en TXT local. Ningún dato viaja a un servidor. El TXT no certifica autoría ni integridad ante adulteración.

La actividad ejecuta `JSON.parse` **solo para comprobar sintaxis y tipo de raíz**: ese parser puede aceptar claves duplicadas, así que el caso correspondiente exige diagnóstico conceptual por la persona. No confundir con `STRICT_DUPLICATE_DETECTION` de Jackson en Java.

## Probar localmente

Desde la raíz de `academic-labs`:

```bash
python -m http.server 8000
```

Abre `http://localhost:8000/activities/detective-json/`, realiza un caso correcto y uno inválido, y descarga el TXT. Revisa `http://localhost:8000/explore/?q=json` para verificar el catálogo y filtro por tema.

## Fuentes y créditos

- [Guías canónicas de puentes DSY1102 Unidad 2](https://github.com/cmartinezs/DSY1102-DESARROLLO-ORIENTADO-OBJETOS-2026-2/tree/master/docs/extras/puentes-unidad-02)
- [Proyecto JavaFX que motivó el caso](https://github.com/cmartinezs/DSY1102-JFX-TIME-CAPSULE)
- [Jira ADU-129](https://adumun.atlassian.net/browse/ADU-129)

El recurso es público para **acceso y uso educativo**. La reutilización del código y la publicación fuera de ADÜMÜN requiere revisar el régimen de licencias y las atribuciones del proyecto; acceso público no equivale automáticamente a una licencia de código abierto.

**Estado:** piloto listo para PR; no afirmar URL de producción hasta merge, despliegue de Cloudflare y QA de acceso.
