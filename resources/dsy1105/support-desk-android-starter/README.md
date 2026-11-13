# Support Desk Android Starter

Proyecto Android nativo Kotlin + Jetpack Compose. Contiene listado, detalle y formulario con datos de muestra locales para explorar la UI.

## Requisitos

- Android Studio reciente.
- JDK 17 y Android SDK 35.
- Emulador o dispositivo API 26+.

## Primera ejecución

Windows (PowerShell o CMD):

```bat
gradlew.bat :app:assembleDebug
```

Linux/macOS:

```bash
./gradlew :app:assembleDebug
```

El launcher descarga el Gradle Wrapper oficial 8.9 desde el repositorio oficial de Gradle, verifica su SHA-256 publicado y luego ejecuta la distribución Gradle 8.9 fijada en `gradle/wrapper/gradle-wrapper.properties`. Requiere conexión a Internet la primera vez. Después abre esta carpeta en Android Studio y ejecuta la configuración `app`.

## Alcance provisto

- Pantalla de listado.
- Pantalla de detalle.
- Formulario de alta y edición.
- Navegación y datos de muestra en memoria.
- Acciones demo locales para observar el comportamiento de la UI.

Las acciones locales son únicamente demostrativas: no persisten ni representan consumo REST.

## Implementación del estudiante

No se incluye permiso INTERNET, cliente HTTP, DTO de API, serialización, repositorio remoto ni solicitudes. Implementa:
- GET /api/tickets y GET /api/tickets/{id}
- POST /api/tickets
- PUT /api/tickets/{id}
- PATCH /api/tickets/{id}/status
- DELETE /api/tickets/{id}

Busca `TODO(REST)` y reemplaza los datos locales por la API. No agregues llamadas de red directamente a los Composables.
