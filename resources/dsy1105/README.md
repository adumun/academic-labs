# DSY1105 — Recursos de actividades REST

Esta carpeta contiene dos actividades Android independientes y un backend de apoyo. **Todo el ciclo de trabajo se realiza desde Android Studio: importar, sincronizar, ejecutar, probar y depurar. No se requiere abrir una terminal.**

## Proyectos

- `pokedex-android-starter/`: Android nativo con Kotlin + Jetpack Compose. El estudiante implementa la conexión y consumo de PokéAPI.
- `support-desk-android-starter/`: cliente Android Kotlin + Jetpack Compose. El estudiante implementa la conexión y consumo de Support Desk API.
- `support-desk-api/`: backend Java + Spring Boot + H2, construido con Gradle para importarlo y ejecutarlo desde Android Studio.

## Obtener el repositorio y abrir los proyectos

1. En la pantalla inicial de Android Studio selecciona **Get from VCS**.
2. Pega `https://github.com/adumun/academic-labs.git` y elige una carpeta local de destino.
3. Espera a que termine la descarga del repositorio.
4. En Android Studio selecciona **File → Open** y elige una de estas carpetas:
   - `resources/dsy1105/pokedex-android-starter`
   - `resources/dsy1105/support-desk-android-starter`
   - `resources/dsy1105/support-desk-api`
5. Acepta **Trust Project** si aparece.
6. Espera a que termine **Gradle Sync** y la descarga inicial de dependencias.
7. Si solicita un JDK, selecciona JDK 17. Para Android, configura también Android SDK 35 desde SDK Manager.

Cada carpeta es un proyecto independiente. Ábrelos en ventanas separadas de Android Studio cuando necesites alternar entre app y backend; no selecciones la carpeta `resources/dsy1105` completa como si fuera un único proyecto.

## Pokédex Android

1. Abre `pokedex-android-starter/`.
2. Espera Gradle Sync.
3. Selecciona la configuración `app` y un emulador API 26 o superior.
4. Pulsa **Run ▶**.
5. Para compilar sin instalar, usa **Build → Make Project** o la tarea `Tasks → build → assembleDebug` del panel Gradle.
6. Para validar la interfaz demo, navega entre listado y detalle. No debe necesitar Internet ni PokéAPI.

## Support Desk Android

1. Abre `support-desk-android-starter/`.
2. Espera Gradle Sync.
3. Selecciona la configuración `app` y un emulador API 26 o superior.
4. Pulsa **Run ▶**.
5. Recorre listado, detalle, alta, edición y confirmación de eliminación. Las acciones son locales y demostrativas hasta que el estudiante implemente REST.

## Backend Support Desk desde Android Studio

1. Abre `support-desk-api/` con **File → Open**. Android Studio lo importa como proyecto Gradle Java.
2. Espera Gradle Sync y selecciona JDK 17 si se solicita.
3. Abre `SupportDeskApiApplication.java` y pulsa el icono verde **Run ▶** junto al método `main`. También puedes abrir el panel **Gradle** y ejecutar `Tasks → application → bootRun`.
4. La API queda disponible en `http://localhost:8080`.
5. Abre el navegador integrado o externo desde Android Studio para consultar Swagger UI: `http://localhost:8080/swagger-ui/index.html`.
6. Para ejecutar la prueba integral CRUD, abre `TicketApiIntegrationTest.java` y pulsa **Run ▶** junto a la clase o al método de prueba. Alternativamente, desde el panel Gradle ejecuta `Tasks → verification → test`.
7. Revisa el resultado en la ventana **Run** o **Test Results**.

## Conectar el emulador Android al backend

Con Support Desk API ejecutándose desde Android Studio, configura en la implementación del estudiante:

- Emulador Android Studio: `http://10.0.2.2:8080`.
- Dispositivo físico: `http://IP_LAN_DEL_COMPUTADOR:8080` (ambos equipos en la misma red).

No uses `localhost` desde el emulador: apunta al propio emulador, no al computador anfitrión. El backend de laboratorio no incorpora autenticación ni TLS.

## Decisión pedagógica

**Los dos Android Starter deben ejecutar su interfaz con datos locales antes de que el estudiante escriba código de integración.** Se entrega UI, navegación, modelos de presentación y datos demo. Se omite intencionalmente cliente HTTP, serialización/DTO remotos, repositorio y solicitudes HTTP.

El backend Support Desk sí está completo: el foco de aprendizaje está en el cliente Android.

## Requisitos

- Android Studio actualizado.
- JDK 17.
- Android SDK 35 y emulador API 26 o superior.
- Gradle Wrapper 8.9 (incluido mediante launcher autocontenido y verificado).
- Conexión a Internet durante la primera sincronización para descargar Gradle y dependencias.

No se exige Maven instalado, PowerShell, CMD ni ejecución manual de comandos.
