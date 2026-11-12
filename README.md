# ADÜMÜN Labs — Plataforma de laboratorios

**Un punto de entrada para explorar videojuegos, experiencias educativas, prototipos y experimentos tecnológicos.** Los laboratorios mantienen sus repositorios y ciclos de publicación independientes; el portal ofrece catálogo y rutas públicas estables.

- **Portal transversal (en preparación):** https://labs.adumun.cl/
- **Vertical educativo existente:** https://academic-labs.adumun.cl/
- **Repositorio de plataforma:** https://github.com/adumun/academic-labs
- **Ticket de evolución:** https://adumun.atlassian.net/browse/ADU-143
- **MVP educativo original:** https://adumun.atlassian.net/browse/ADU-119

## Vertical educativo: Academic Labs

Academic Labs sigue siendo el módulo educativo de ADÜMÜN Labs. Sus rutas existentes, catálogo, actividades y exportación de evidencias se preservan. El detalle del MVP y sus reglas originales se mantiene en las secciones siguientes.

## Principios del MVP educativo

- Los ejercicios se **crean y mantienen fuera del portal** (localmente o con asistencia de IA), nunca mediante una pantalla de administración.
- GitHub es la fuente de verdad; Cloudflare Pages publica los archivos del repositorio.
- Público, sin login, sin backend, sin tracking central de estudiantes y sin depender de una institución.
- Cada actividad es autónoma. Puede ser un único HTML autocontenido o una carpeta con HTML/CSS/JS y recursos relativos.
- El catálogo se mantiene editando un archivo JSON versionado en Git.
- Las respuestas de los estudiantes no se reciben en nuestros servidores. Las actividades que lo permiten exportan un TXT para entregar por el AVA/LMS de cada profesor.
- Un TXT **no acredita criptográficamente autoría ni integridad**. Las validaciones y firmas confiables requieren un backend en una fase futura.

## Estructura de navegación

- `/`: landing pública de presentación, orientación y búsqueda simple.
- `/explore/`: página de exploración, resultados y filtros (temática, asignatura, texto). La búsqueda de la portada utiliza `GET /explore/?q=...`.
- `/explore/?q=eventos&topic=acciones-y-hechos&course=DSY1107`: ejemplo de URL compartible con los filtros aplicados.
- `/activities/<slug>/`: enlaces directos y estables a cada laboratorio, independientes de cursos.

Cloudflare Pages sirve la página `/explore/` desde `explore/index.html`. La portada no duplica el catálogo ni crea otra experiencia de búsqueda.

## Estructura

- `index.html`: landing pública con buscador que redirige a `/explore/`.
- `explore/index.html`: explorador independiente del landing, con resultados y filtros.
- `assets/styles.css`: estilos compartidos por la portada y el explorador.
- `assets/app.js`: búsqueda, filtros y resultados de `/explore/` (sin framework).
- `catalog.json`: temáticas académicas reutilizables (`topics`), asignaturas (`courses`) y actividades (`activities`). La relación es muchos-a-muchos.
- `activities/<slug>/index.html`: carpeta de cada práctica. 
- `activities/detectives-de-eventos/index.html`: primer laboratorio, recuperado desde la actividad original.

## Modelo académico mínimo

Una actividad pertenece primordialmente a **temáticas/contenidos académicos**. Las asignaturas son contextos de uso, no contenedores exclusivos. `topics` tiene identificadores estables; cada actividad declara uno o varios `topicIds`, objetivos (`learningObjectives`) y referencias opcionales a asignaturas (`courseCodes`). Ejemplo: «Detectives de eventos» trabaja la distinción transversal entre **acciones y hechos** y la aplicación técnica en **mensajería asíncrona**. Puede aprovecharse en Lenguaje y Comunicación, aunque su enunciado actual conserva referencias a desarrollo de sistemas. No dupliques la misma actividad para cada asignatura: reutiliza su ID y enlace público.

## Crear una actividad

1. Prepara localmente una carpeta en `activities/<slug>/` con su `index.html`, y CSS/JS opcionales. Procura que las rutas de assets sean relativas. No incluyas claves ni material reservado.
2. Comprueba que funciona sin servicios externos ni credenciales.
3. Agrega una entrada en `catalog.json`: `id` único, ruta `/activities/<slug>/`, `status: "published"`, uno o más `topicIds` válidos y cero o más `courseCodes`. Registra cada tema una sola vez en `topics` y cada asignatura una sola vez en `courses`.
4. Crea una rama, realiza los commits y abre un Pull Request hacia `master`, referenciando el ticket Jira/GitHub relacionado. Revisa los enlaces, la legibilidad móvil y la exportación (si existe).
5. Fusiona tras la revisión. Cloudflare Pages desplegará el contenido automáticamente una vez conectado a GitHub.

> La presencia de una carpeta sin entrada en catálogo **no la oculta de Internet**: la ruta sigue siendo pública. Nunca subas respuestas correctas reservadas, datos privados o secretos al repositorio.

## Comprobar localmente

Con Python instalado, desde la raíz del repositorio:

```bash
python -m http.server 8000
```

Abre `http://localhost:8000`. Es preferible a abrir el HTML mediante `file://`, porque el explorador carga el catálogo mediante una petición HTTP a `/catalog.json`.

Revisa la portada, envía una búsqueda (por ejemplo `eventos`) y comprueba que navega a `/explore/?q=eventos` con resultados. Valida filtros por tema y asignatura, URL compartible, resultados vacíos, acceso al ejercicio y descarga del TXT. En caso de usar un `iframe` en un LMS, la institución puede restringir scripts o descargas según su política de sandbox.

## Configuración de Cloudflare Pages (ya realizada)

El proyecto **`academic-labs` ya está creado** y conectado a GitHub. Esta sección documenta su configuración para mantenimiento o recuperación; no hay que volver a crear el proyecto.

1. Configuración original: **Workers & Pages → Pages → Connect to Git**, utilizando la instalación GitHub existente.
2. Selecciona GitHub y autoriza el acceso al repositorio `adumun/academic-labs`.
3. Framework preset: **None**. Production branch: **master**.
4. Build command: **vacío** (no hay compilación), o `exit 0` si la interfaz lo exige.
5. Build output directory: `.` (la raíz, donde está `index.html`); root directory: raíz del repositorio.
6. Producción activa en **https://academic-labs.adumun.cl/**, con el dominio alternativo **https://academic-labs.pages.dev/** disponible.
7. Dominio personalizado configurado desde **Pages → academic-labs → Custom domains**. DNS: CNAME proxied `academic-labs` → `academic-labs.pages.dev`, TTL Auto y TLS activo. No crear registros duplicados ni modificar otros proyectos.
8. Los nuevos PRs podrán generar previews, y los merges a `master` actualizarán producción. No necesitamos GitHub Actions.

Documentación oficial: https://developers.cloudflare.com/pages/configuration/git-integration/

## Verificar una publicación

1. Confirma que el PR correspondiente está aprobado y fusionado en `master`; conserva su referencia al ticket Jira.
2. En **Cloudflare Dashboard → Workers & Pages → academic-labs → Deployments**, comprueba el estado del despliegue de producción y el commit asociado. Si falla, inspecciona **View details → Build log**.
3. Abre `https://academic-labs.adumun.cl/` y `https://academic-labs.adumun.cl/explore/?q=eventos`. Comprueba que aparezca el catálogo y que sus filtros respondan.
4. Abre `https://academic-labs.adumun.cl/activities/detectives-de-eventos/`. Comprueba que cargue la actividad y que el TXT se descargue cuando corresponda.
5. Confirma que `https://academic-labs.pages.dev/` sigue accesible. Registra el commit, la URL, el resultado y cualquier incidente en Jira.

## Revertir una publicación (rollback)

Utiliza el rollback si una nueva publicación provoca un fallo que afecta a estudiantes o docentes. **No borres el proyecto, no cambies DNS y no hagas force push a `master`.**

### Recuperación inmediata desde Cloudflare Pages

1. Registra el síntoma, la hora, el commit afectado y la URL, y comunícalo al responsable del ticket.
2. Entra en la cuenta Cloudflare que administra ADÜMÜN. Ve a **Workers & Pages → academic-labs → Deployments → All deployments**.
3. Localiza el **último despliegue de producción exitoso que funcionaba correctamente**. Comprueba el commit antes de seleccionarlo: los despliegues de preview no son objetivos válidos para rollback.
4. Abre el menú de tres puntos de ese despliegue y selecciona **Rollback to this deployment**; revisa el destino y confirma.
5. Cuando aparezca la versión anterior, comprueba la portada, `/explore/`, una actividad y ambas URLs HTTPS (`academic-labs.adumun.cl` y `academic-labs.pages.dev`). Registra la versión restaurada en Jira.

**Importante:** esta operación cambia el despliegue servido en producción; **no deshace los commits en GitHub**. Un merge posterior en `master` activará otro despliegue automático. Para una corrección permanente, crea o actualiza un ticket, prepara un PR que repare o revierta los cambios defectuosos, revísalo y fusiónalo por el flujo normal. No reescribas la historia compartida.

Si no existe un despliegue de producción anterior apto para rollback, no selecciones una preview como sustituto; prepara una corrección o reversión revisada en Git y publícala mediante el flujo habitual.

Documentación oficial: https://developers.cloudflare.com/pages/configuration/rollbacks/

## Contrato pedagógico para evidencias (recomendado)

Para una actividad que permita exportación, incluir al menos: identificador y versión de la actividad, enunciados/preguntas y respuestas, y fecha local de exportación. No añadir rut, correo u otros datos personales sin una razón pedagógica justificada. La evidencia se guarda en el equipo del estudiante y se entrega mediante los mecanismos definidos por cada docente.

La actividad «Detectives de eventos» conserva su formato TXT actual; este contrato será una guía para nuevas prácticas, sin cambiar retroactivamente su exportación.

## Acceso público, atribución y licencias

Las actividades son gratuitas para **acceder y utilizar en línea**, y sus enlaces se pueden compartir con fines educativos. La publicación pública **no equivale a una licencia de reproducción, modificación o redistribución de código y contenidos**: esa licencia debe definirse explícitamente antes de autorizar esas operaciones. Los materiales se atribuyen a ADÜMÜN y a sus autores cuando corresponda.

## Fuera del MVP

Editor visual, cuentas, notas, backend, firmas de entrega, detector de plagio/GenAI, panel docente, integración LTI/Blackboard y GradeOps AI.

## Riesgos reconocidos

- La información y código publicados son accesibles públicamente; no se pueden proteger respuestas secretas solo con JS cliente.
- En computadores compartidos, `localStorage` puede exponer respuestas a otros usuarios del mismo navegador. Cada actividad debe advertirlo y facilitar la exportación/limpieza.
- Una aplicación de clase futura que necesite autenticación no debe ejecutar JavaScript arbitrario de prácticas bajo el mismo origen que sesiones de identidad o APIs privadas.


## ADÜMÜN Labs — portal multiárea

La evolución transversal se documenta en [docs/ADUMUN-LABS-PLATFORM.md](docs/ADUMUN-LABS-PLATFORM.md).

- `labs.adumun.cl/`: portal general de descubrimiento.
- `labs.adumun.cl/games/`: catálogo de demos de videojuegos.
- `labs.adumun.cl/games/<slug>/`: ruta estable de cada demo, independiente de la estructura interna de su repositorio. Pages Functions puede resolverla contra la raíz o contra un `upstreamPath` registrado en `labs-catalog.json`; el índice `/games/` es un asset estático y no invoca Functions.
- `labs.adumun.cl/education/`: entrada al módulo educativo.
- `academic-labs.adumun.cl/`: conserva la landing educativa anterior y todos sus enlaces compartidos.

El registro declarativo de categorías y aplicaciones está en `labs-catalog.json`. El índice del catálogo se sirve estáticamente; solo las rutas de demos invocan Pages Functions. El proxy solo acepta slugs registrados y orígenes HTTPS `*.pages.dev`; no es un proxy abierto. Una demo permanece `pending` hasta que su proyecto Cloudflare Pages se cree y se valide. No se debe cambiar su estado a `published` solo porque exista un workflow de CI.

La integración del nuevo dominio y los tres proyectos de demos requiere una intervención en Cloudflare Dashboard descrita en la guía operativa. No modificar DNS ni dominios existentes fuera de ese procedimiento.
