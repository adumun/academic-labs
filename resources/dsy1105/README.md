# DSY1105 — Recursos de actividades REST

Esta carpeta contiene dos actividades independientes y sus proyectos descargables.

- `pokedex-android-starter/`: Android nativo con Kotlin + Jetpack Compose. El estudiante implementa la conexión y consumo de PokéAPI.
- `support-desk-android-starter/`: cliente Android Kotlin + Jetpack Compose. El estudiante implementa la conexión y consumo de Support Desk API.
- `support-desk-api/`: backend Java + Spring Boot completo, con H2, validaciones y Swagger UI. Se entrega listo para ejecutar.

## Decisión pedagógica

**Los dos Android Starter deben compilar y ejecutar su interfaz con datos locales antes de que el estudiante escriba código de integración.** Se entrega UI, navegación, modelos de presentación y datos demo. Se omite intencionalmente cliente HTTP, serialización/DTO remotos, repositorio y solicitudes HTTP.

El backend Support Desk sí está completo: el foco de aprendizaje está en el cliente Android.

## Herramientas Android

- Android Studio reciente.
- JDK 17 y Android SDK 35.
- Android Gradle Plugin 8.7.3 + Kotlin 2.0.21 + Gradle 8.9.
- Ambos starters incluyen launchers `gradlew` y `gradlew.bat` con bootstrap del Wrapper oficial 8.9: descargan el JAR oficial y verifican SHA-256 antes de ejecutarlo. La primera ejecución necesita Internet para descargar Gradle y dependencias.

Desde cada carpeta Android:

```bat
gradlew.bat :app:assembleDebug
```

En Linux/macOS:

```bash
./gradlew :app:assembleDebug
```

## Backend

- JDK 17.
- Maven 3.9+.
- Ejecuta `mvn spring-boot:run` desde `support-desk-api/`.
- Ejecuta `mvn test` para la prueba de integración CRUD.
- Swagger UI: http://localhost:8080/swagger-ui/index.html

Los proyectos se abren individualmente desde Android Studio o IntelliJ IDEA. Academic Labs publica las guías y enlaza a estos recursos versionados en Git.
