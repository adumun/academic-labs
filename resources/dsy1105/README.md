# DSY1105 — Recursos de actividades REST

Esta carpeta contiene los proyectos base descargables para las dos actividades de consumo REST.

- `pokedex-android-starter/`: Android nativo con Kotlin + Jetpack Compose. La conexión y consumo de PokéAPI deben ser implementados por el estudiante.
- `support-desk-android-starter/`: cliente Android Kotlin + Jetpack Compose. La conexión y consumo de Support Desk API deben ser implementados por el estudiante.
- `support-desk-api/`: backend Java + Spring Boot completo, con H2 y validaciones. Se entrega listo para ejecutar.

## Decisión pedagógica

Los starters Android contienen UI, navegación y datos locales de demostración. No incluyen cliente HTTP, repositorio remoto, serialización de respuestas ni solicitudes. Los TODO marcan los puntos que debe implementar el estudiante.

El backend Support Desk sí está completo: el foco de aprendizaje está en el cliente móvil y su integración.

Los proyectos se abren individualmente desde Android Studio o IntelliJ IDEA. Academic Labs publica las guías y enlaza a estos recursos versionados en Git.

## Herramientas y ejecución rápida

### Proyectos Android

- Android Studio reciente y JDK 17.
- Android Gradle Plugin 8.7.3 requiere Gradle 8.9.
- Si tu instalación de Android Studio solicita el wrapper y el proyecto no lo tiene, instala Gradle 8.9 y ejecuta `gradle wrapper --gradle-version 8.9` desde la raíz del proyecto Android. Después abre/sincroniza con Android Studio.
- Ambos proyectos usan Jetpack Compose y no requieren librerías HTTP adicionales preinstaladas.

### Backend

- JDK 17 y Maven 3.9+.
- Ejecuta `mvn spring-boot:run` desde `support-desk-api/`.
- Ejecuta `mvn test` para la prueba de integración CRUD.

Los proyectos no incluyen credenciales ni servicios externos. La API está pensada para uso local en el laboratorio.
