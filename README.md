# Academic Labs · ADÜMÜN

**Actividades prácticas abiertas para aprender haciendo.** El proyecto publica ejercicios interactivos creados con HTML, CSS y JavaScript estándar. Un docente puede compartir un enlace público en su AVA/LMS sin cuentas en Academic Labs; el estudiante resuelve la actividad y entrega el archivo de evidencia al propio docente.

**Repositorio canónico:** https://github.com/adumun/academic-labs
**Ticket rector:** https://adumun.atlassian.net/browse/ADU-119
**Implementación GitHub:** https://github.com/adumun/academic-labs/issues/1

## Principios del MVP

- Los ejercicios se **crean y mantienen fuera del portal** (localmente o con asistencia de IA), nunca mediante una pantalla de administración.
- GitHub es la fuente de verdad; Cloudflare Pages publica los archivos del repositorio.
- Público, sin login, sin backend, sin tracking central de estudiantes y sin depender de una institución.
- Cada actividad es autónoma. Puede ser un único HTML autocontenido o una carpeta con HTML/CSS/JS y recursos relativos.
- El catálogo se mantiene editando un archivo JSON versionado en Git.
- Las respuestas de los estudiantes no se reciben en nuestros servidores. Las actividades que lo permiten exportan un TXT para entregar por el AVA/LMS de cada profesor.
- Un TXT **no acredita criptográficamente autoría ni integridad**. Las validaciones y firmas confiables requieren un backend en una fase futura.

## Estructura

- \`index.html\`: portada pública y catálogo.
- \`assets/styles.css\` y \`assets/app.js\`: estilos y comportamiento de la portada (sin framework).
- \`catalog.json\`: entradas publicadas (una por actividad).
- \`activities/<asignatura>/<slug>/index.html\`: carpeta de cada práctica. 
- \`activities/dsy1107/detectives-de-eventos/index.html\`: primer laboratorio, recuperado desde la actividad original.

## Crear una actividad

1. Prepara localmente una carpeta en \`activities/<asignatura>/<slug>/\` con su \`index.html\`, y CSS/JS opcionales. Procura que las rutas de assets sean relativas. No incluyas claves ni material reservado.
2. Comprueba que funciona sin servicios externos ni credenciales.
3. Agrega una entrada a \`catalog.json\`. Usa un \`id\` único, una ruta local absoluta del tipo \`/activities/<asignatura>/<slug>/\` y \`status: "published"\`.
4. Crea una rama, realiza los commits y abre un Pull Request hacia \`master\`, referenciando el ticket Jira/GitHub relacionado. Revisa los enlaces, la legibilidad móvil y la exportación (si existe).
5. Fusiona tras la revisión. Cloudflare Pages desplegará el contenido automáticamente una vez conectado a GitHub.

> La presencia de una carpeta sin entrada en catálogo **no la oculta de Internet**: la ruta sigue siendo pública. Nunca subas respuestas correctas reservadas, datos privados o secretos al repositorio.

## Comprobar localmente

Con Python instalado, desde la raíz del repositorio:

\`\`\`bash
python -m http.server 8000
\`\`\`

Abre \`http://localhost:8000\`. Es preferible a abrir el HTML mediante \`file://\`, porque el catálogo se carga con \`fetch('./catalog.json')\`.

Revisa portada, filtro, búsqueda, acceso al ejercicio y descarga del TXT. En caso de usar un \`iframe\` en un LMS, la institución puede restringir scripts o descargas según su política de sandbox.

## Desplegar con Cloudflare Pages (una sola vez)

1. En Cloudflare: **Workers & Pages → Create application → Pages → Connect to Git**.
2. Selecciona GitHub y autoriza el acceso al repositorio \`adumun/academic-labs\`.
3. Framework preset: **None**. Production branch: **master**.
4. Build command: **vacío** (no hay compilación), o \`exit 0\` si la interfaz lo exige.
5. Build output directory: `.` (la raíz, donde está `index.html`); root directory: raíz del repositorio.
6. Completa el despliegue y verifica la URL temporal \`*.pages.dev\`.
7. Opcionalmente configura un dominio personalizado (por ejemplo \`labs.academy.adumun.cl\`) desde Cloudflare Pages y comprueba DNS/HTTPS.
8. Los nuevos PRs podrán generar previews, y los merges a \`master\` actualizarán producción. No necesitamos GitHub Actions.

Documentación oficial: https://developers.cloudflare.com/pages/configuration/git-integration/

## Contrato pedagógico para evidencias (recomendado)

Para una actividad que permita exportación, incluir al menos: identificador y versión de la actividad, enunciados/preguntas y respuestas, y fecha local de exportación. No añadir rut, correo u otros datos personales sin una razón pedagógica justificada. La evidencia se guarda en el equipo del estudiante y se entrega mediante los mecanismos definidos por cada docente.

La actividad «Detectives de eventos» conserva su formato TXT actual; este contrato será una guía para nuevas prácticas, sin cambiar retroactivamente su exportación.

## Acceso público, atribución y licencias

Las actividades son gratuitas para **acceder y utilizar en línea**, y sus enlaces se pueden compartir con fines educativos. La publicación pública **no equivale a una licencia de reproducción, modificación o redistribución de código y contenidos**: esa licencia debe definirse explícitamente antes de autorizar esas operaciones. Los materiales se atribuyen a ADÜMÜN y a sus autores cuando corresponda.

## Fuera del MVP

Editor visual, cuentas, notas, backend, firmas de entrega, detector de plagio/GenAI, panel docente, integración LTI/Blackboard y GradeOps AI.

## Riesgos reconocidos

- La información y código publicados son accesibles públicamente; no se pueden proteger respuestas secretas solo con JS cliente.
- En computadores compartidos, \`localStorage\` puede exponer respuestas a otros usuarios del mismo navegador. Cada actividad debe advertirlo y facilitar la exportación/limpieza.
- Una aplicación de clase futura que necesite autenticación no debe ejecutar JavaScript arbitrario de prácticas bajo el mismo origen que sesiones de identidad o APIs privadas.
