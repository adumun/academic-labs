# ADÜMÜN Labs — Arquitectura y operación

**Ticket:** [ADU-143](https://adumun.atlassian.net/browse/ADU-143)  
**Repositorio de plataforma:** `adumun/academic-labs`  
**Cloudflare Pages existente:** `academic-labs`  
**Dominio objetivo:** `https://labs.adumun.cl/`

## 1. Decisión de arquitectura

Se reutiliza el proyecto Cloudflare Pages `academic-labs`; no se crea un segundo portal ni se migra el vertical educativo existente.

- `labs.adumun.cl` presenta el portal transversal ADÜMÜN Labs.
- `academic-labs.adumun.cl` conserva la landing educativa original.
- `/education/` ofrece una entrada al catálogo académico actual.
- `/games/` muestra el catálogo de videojuegos.
- `/games/<slug>/` sirve cada demo desde un proyecto Pages independiente o desde una subruta explícitamente registrada del mismo origen.

Cada aplicación conserva su repositorio privado y su pipeline de despliegue. El portal y el catálogo son estáticos; Pages Functions actúa como proxy de allowlist para las rutas de demos.

No se crea una base de datos, panel de administración, autenticación ni un Worker independiente. La función forma parte del proyecto Pages existente.

## 2. Componentes y responsabilidades

| Componente | Responsabilidad |
| --- | --- |
| `labs/index.html` | Portal general ADÜMÜN Labs |
| `labs-catalog.json` | Categorías, estado y registro de aplicaciones |
| `games/index.html` | Catálogo de demos (asset estático) |
| `education/index.html` | Entrada al vertical educativo |
| `functions/index.js` | Selección de landing según hostname |
| `functions/games/[[slug]].js` | Carga catálogo y ejecuta proxy para demos |
| `functions/_lib/demo-proxy.mjs` | Allowlist, validación y proxy HTTP |
| `functions/_lib/demos-index-fallback.mjs` | Respaldo estático si el catch-all recibe una ruta sin slug |
| `_routes.json` | Incluye raíz y demos; excluye el índice estático `/games/` |

Cloudflare Pages Functions usa rutas basadas en archivos y permite parámetros multipath mediante `[[param]].js`. La función obtiene assets estáticos mediante `env.ASSETS.fetch()`. Referencias:
- https://developers.cloudflare.com/pages/functions/routing/
- https://developers.cloudflare.com/pages/functions/api-reference/

## 3. Contrato de publicación de demos

Los proyectos Pages deben crearse con estos nombres para que coincidan con los orígenes declarados en `labs-catalog.json`:

| Repositorio privado | Proyecto Pages | Origen esperado | Build | Output |
| --- | --- | --- | --- | --- |
| `adumun/starborne-voyager` | `labs-starborne-voyager` | `https://labs-starborne-voyager.pages.dev` | `npm run build` | `dist` |
| `adumun/web-game-prototypes` | `labs-web-game-prototypes` | `https://labs-web-game-prototypes.pages.dev` | `npm run build` | `dist` |
| `adumun/neon-pursuit` | `labs-neon-pursuit` | `https://labs-neon-pursuit.pages.dev` | `npm run build` | `dist` |

Configuración común:
- Framework preset: Vite o None con los valores explícitos indicados.
- Root directory: `/`.
- Production branch: `master`.
- Build command: `npm run build`.
- Build output directory: `dist`.
- Build environment: `NODE_VERSION=22`.
- Mantener previews de ramas/PR habilitadas.
- No habilitar Cloudflare Access en los sitios de producción: las demos deben ser públicas.

Los repositorios Starborne Voyager y Web Game Prototypes ya declaran `base: "./"` en Vite. Web Game Prototypes también tiene abierto [PR #2](https://github.com/adumun/web-game-prototypes/pull/2) para compilar localmente Tailwind de los HTML standalone y retirar el runtime CDN antes de producción. Neon Pursuit requiere integrar [PR #1](https://github.com/adumun/neon-pursuit/pull/1), que cambia su base de `/neon-pursuit/` a `./`. Estas correcciones permiten servir assets relativos bajo el subpath del portal.

**Estado verificado al 10-11-2026:** Cloudflare Workers & Pages está configurado con `Only select repositories`, manteniendo `academic-labs` y agregando únicamente `starborne-voyager`, `web-game-prototypes` y `neon-pursuit`. Los proyectos `labs-starborne-voyager` y `labs-web-game-prototypes` ya están creados y desplegados desde `master`; sus orígenes `pages.dev` fueron verificados. `labs-neon-pursuit` queda pendiente de creación hasta integrar PR #1. Las dos demos con origen verificado están marcadas `published` únicamente en la rama de preview para probar el proxy bajo el subpath; el cambio no afecta producción mientras PR #6 siga abierto. Neon Pursuit permanece `pending`.

Si un nombre de proyecto Pages no está disponible en la cuenta, elegir otro nombre y actualizar el `origin` correspondiente en `labs-catalog.json` antes de habilitar la demo.

### Rutas públicas e implementación interna

La URL pública representa una demo, no la estructura del repositorio ni el hosting que la publica. Por ejemplo, estas rutas son canónicas:

| Demo | URL pública | Origen interno | Subruta interna |
| --- | --- | --- | --- |
| Light Thief | `/games/light-thief/` | `labs-web-game-prototypes.pages.dev` | `/prototypes/light-thief/` |
| Neon Tetris | `/games/neon-tetris/` | `labs-web-game-prototypes.pages.dev` | `/prototypes/neon-tetris/` |
| Ajedrez Real | `/games/super-chess/` | `labs-web-game-prototypes.pages.dev` | `/prototypes/super-chess/` |

`upstreamPath` es opcional en el registro. Si no existe, la demo usa la raíz `/` del origen, como Starborne Voyager. Si existe, el proxy agrega esa subruta únicamente al consultar el origen y la oculta al visitante. No se deben publicar enlaces con `/prototypes/`, `index.html` ni el nombre del repositorio como parte de la ruta canónica.

La entrada histórica `web-game-prototypes` puede permanecer registrada con `visible: false` para conservar enlaces antiguos, pero no se muestra como demo duplicada en el catálogo.

La ruta anterior `/games/demos/` se conserva únicamente como compatibilidad: el índice redirige a `/games/` y las rutas antiguas de cada juego redirigen con `308` a su equivalente bajo `/games/`. Las nuevas publicaciones y enlaces deben usar exclusivamente el namespace `/games/`.

### Habilitar una demo

Una entrada de `labs-catalog.json` permanece con `status: "pending"` mientras el proyecto Pages no esté creado y validado. Solo después de comprobar:
1. Build y deployment de producción exitosos.
2. Origen `pages.dev` respondiendo con la aplicación esperada.
3. Assets JS/CSS, imágenes, audio y navegación funcionando.
4. Refresh y rutas internas funcionando bajo el proxy.

se cambia a `status: "published"`. El portal solo muestra el enlace de juego en ese estado; el router devuelve 503 mientras siga pendiente.

## 4. Seguridad y límites del proxy

El proxy no acepta destinos enviados por el visitante. Resuelve el slug exclusivamente contra `labs-catalog.json` y solo permite orígenes HTTPS cuyo hostname termine en `.pages.dev`.

- Solo permite métodos GET y HEAD.
- No reenvía cookies ni encabezados Authorization.
- Rechaza segmentos de path vacíos, traversal, separadores codificados y barras invertidas.
- Preserva query strings.
- Reescribe redirects que apunten al mismo origen Pages para mantener la URL estable de ADÜMÜN Labs y respetar el `upstreamPath` de cada demo.
- Sigue internamente (server-side) los redirects same-origin del origen Pages, resolviendo `Location` relativo contra la URL upstream efectiva. La respuesta 308 canónica `index.html` → `/directorio/` se consume dentro del proxy y el navegador recibe directamente el HTML final, no una segunda navegación pública. Se limita la cadena a 8 saltos y se detectan ciclos; redirects externos se devuelven sin que el proxy los consulte. Esta estrategia se implementó después de que Chrome confirmara que el origen respondía 308 → 200 sin ciclos, mientras la navegación pública seguía fallando.
- Slugs no registrados devuelven 404; demos pendientes devuelven 503; orígenes inválidos no se consultan.
- No es un proxy genérico ni permite introducir una URL arbitraria.

Los juegos deben ser aplicaciones estáticas cliente. No se garantiza compatibilidad con APIs privadas, WebSockets, cookies de sesión, OAuth ni endpoints backend. Cualquier necesidad de ese tipo requiere diseño y ticket aparte.

### Coste de Functions

`_routes.json` incluye la raíz y `/games/*`, pero excluye explícitamente `/games` y `/games/`. El catálogo de demos (`games/index.html`) se sirve como asset estático, sin invocar Functions. Las páginas y assets estáticos del portal/vertical educativo tampoco invocan Pages Functions. Cada request a una demo registrada (HTML, JS, CSS, imágenes, audio) atraviesa el proxy y cuenta como una invocación de Function; revisar métricas de uso si aumenta el tráfico.

## 5. Compatibilidad del vertical educativo

No se renombran ni mueven:
- `/` en `academic-labs.adumun.cl`.
- `/explore/`.
- `/activities/<slug>/`.
- `/catalog.json`.
- Assets y exportación TXT de actividades existentes.

La función de raíz solo sirve `/labs/` cuando el hostname es exactamente `labs.adumun.cl`; para el hostname educativo y los previews, sirve el asset raíz existente. Las pruebas de aceptación deben verificar ambos hostnames.

## 6. Intervención requerida en Cloudflare y GitHub

La conexión Git de Cloudflare Pages ya existe para `adumun/academic-labs`. Para crear los tres proyectos privados hay que ampliar el alcance de la GitHub App **Cloudflare Workers & Pages**.

### A. Ampliar repositorios autorizados

1. Abrir https://github.com/organizations/adumun/settings/installations
2. Seleccionar **Cloudflare Workers & Pages → Configure**.
3. En Repository access, conservar **Only select repositories**.
4. Mantener `academic-labs` seleccionado y agregar únicamente:
   - `starborne-voyager`
   - `web-game-prototypes`
   - `neon-pursuit`
5. Guardar.

No conceder acceso a todos los repositorios de la organización. La cuenta GitHub que configura la instalación debe ser owner o tener el rol GitHub Apps Manager.

### B. Crear proyectos Pages

En Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git:
1. Seleccionar la organización `adumun`.
2. Crear cada proyecto con el nombre y repositorio de la tabla anterior.
3. Configurar branch, build command, output directory y `NODE_VERSION=22`.
4. Esperar el primer deployment de producción y comprobar el hostname `pages.dev`.

Documentación:
- https://developers.cloudflare.com/pages/configuration/git-integration/
- https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/

### C. Asociar el dominio del portal

En Workers & Pages → Pages → `academic-labs` → Custom domains → Set up a domain:
1. Agregar `labs.adumun.cl`.
2. Confirmar la asociación del dominio al proyecto existente.
3. Esperar el estado Active y el certificado TLS.
4. No eliminar ni editar el CNAME actual `academic-labs`.
5. No crear manualmente un CNAME antes de asociar el dominio en Pages.

Cloudflare documenta que los subdominios se asocian mediante el flujo Custom domains y que, si la zona está en la misma cuenta, Pages puede gestionar el CNAME. Referencia: https://developers.cloudflare.com/pages/configuration/custom-domains/

## 7. Verificación de extremo a extremo

Tras el merge a `master`, y después de las acciones en Cloudflare:

| Prueba | Resultado esperado |
| --- | --- |
| `https://labs.adumun.cl/` | Portal ADÜMÜN Labs |
| `https://academic-labs.adumun.cl/` | Landing educativa original |
| `https://academic-labs.adumun.cl/explore/` | Explorador académico original |
| `https://labs.adumun.cl/education/` | Entrada educativa |
| `https://labs.adumun.cl/games/` | Catálogo de demos |
| Demo pendiente | No aparece botón de juego; URL devuelve 503 |
| Slug inexistente | 404 |
| Demo publicada | HTML y assets sirven bajo `/games/<slug>/` |
| Asset JS/CSS | 200, sin solicitud a raíz incorrecta |
| Query string | Llega al origen |
| Refresh en ruta interna | No rompe la aplicación |

Tests locales de la lógica proxy:
```bash
node --test scripts/test-labs-router.mjs
```

Validación de sintaxis:
```bash
node --check functions/index.js
node --check 'functions/games/[[slug]].js'
node --check functions/_lib/demo-proxy.mjs
```

## 8. Rollback

- Un fallo del portal/router se revierte desde Cloudflare Pages → `academic-labs` → Deployments, seleccionando el último deployment de producción conocido como bueno.
- Un fallo de un juego se revierte en su proyecto Pages independiente.
- El rollback de Cloudflare no modifica commits de GitHub. La corrección permanente se realiza mediante PR.
- No retirar los workflows GitHub Pages antiguos hasta validar cada demo en Cloudflare y confirmar que los enlaces nuevos están operativos.

## 9. Estado al preparar la implementación

- [x] Ticket ADU-143 creado y en curso.
- [x] Branch de implementación creada en `adumun/academic-labs`.
- [x] Portal transversal y catálogo inicial preparados.
- [x] Router Pages Functions con allowlist preparado.
- [x] Compatibilidad de hostname para preservar la landing educativa preparada.
- [x] Pruebas unitarias del proxy: 9/9 PASS en Node 22 (ejecución previa).
- [x] Regresión aislada anterior: 12/12 PASS en Node 22; no bastó para aceptar la corrección porque el navegador seguía fallando.
- [x] Instrumentación temporal confirmó para Light Thief, Neon Tetris y Ajedrez Real la misma cadena upstream 308 → 200, `cycleDetected: false`, `error: null`.
- [x] Nueva estrategia de proxy implementada: seguir redirects same-origin server-side, con detección de ciclos, límite de 8 saltos y rechazo de destinos con credenciales.
- [x] Check Cloudflare Pages del commit `82d1abd`: deploy PASS (check run `130645320136`).
- [ ] Ejecutar localmente `node --test scripts/test-labs-router.mjs`; el entorno de despliegue de Pages no ejecuta esta suite.
- [x] 4/4 verificaciones de configuración/ruta del índice y fallback ejecutadas en un harness Node 22 aislado; sintaxis de proxy, fallback y handler validada.
- [x] Índice `/games/` excluido de Functions para resolver el defecto `Demo not found` reportado en preview.
- [x] GitHub App Cloudflare limitada a repositorios seleccionados; autorizados `academic-labs` y los tres repositorios de videojuegos.
- [x] Proyectos Pages `labs-starborne-voyager` y `labs-web-game-prototypes` creados y desplegados; URLs de origen verificadas.
- [x] Sintaxis de los handlers Pages Functions y módulo proxy validada.
- [x] Check de Cloudflare Pages para el preview del PR #6: PASS (commit `82d1abd`; check run `130645320136`).
- [x] PR #2 de Web Game Prototypes desplegado en preview; Neon Pursuit A/B validados en Chrome con CSS local (506 reglas, responsive y sin solicitud al CDN).
- [x] Chrome: catálogo `/games/` PASS; Starborne Voyager PASS; portal académico y `/explore/` PASS.
- [x] Chrome: capturar las tres cadenas upstream; todas responden 308 → 200 sin ciclos ni errores.
- [ ] Chrome: validar que el proxy actualizado devuelve directamente la respuesta final y que los tres juegos se visualizan sin `ERR_TOO_MANY_REDIRECTS` (usar una sesión limpia o deshabilitar caché para evitar redirects 308 antiguos almacenados).
- [ ] Retirar el diagnóstico temporal `?__trace_proxy=chain` después de la aceptación funcional y antes de producción.
- [ ] Revisar y fusionar [PR #6](https://github.com/adumun/academic-labs/pull/6) de plataforma.
- [x] Autorizar Cloudflare Workers & Pages con acceso selectivo a los repositorios requeridos.
- [x] Crear y desplegar los proyectos Cloudflare Pages de Starborne Voyager y Web Game Prototypes.
- [ ] Revisar y fusionar [Web Game Prototypes PR #2](https://github.com/adumun/web-game-prototypes/pull/2) después de validar su preview y CSS generado.
- [ ] Integrar Neon Pursuit PR #1 y crear su proyecto Cloudflare Pages.
- [ ] Asociar `labs.adumun.cl` al proyecto Pages existente.
- [ ] Integrar Neon Pursuit PR #1.
- [ ] Repetir con Chrome los tres previews de Web Game Prototypes tras desplegar el seguimiento server-side de redirects; confirmar que las demos funcionan bajo sus subpaths.
- [ ] Crear Neon Pursuit Pages tras integrar PR #1 y habilitarlo solo después de sus smoke tests.
