# Support Desk Android Starter

Proyecto Android nativo Kotlin + Jetpack Compose. Contiene listado, detalle y formulario con datos de muestra locales para explorar la UI.

## Requisitos

- Android Studio compatible con Android Gradle Plugin 8.7.3.
- JDK 17, Android SDK 35 y emulador/dispositivo API 26+.

## Ejecutar

Abre esta carpeta en Android Studio, sincroniza Gradle y ejecuta. No requiere backend para mostrar la interfaz.

## Alcance provisto

- Pantalla de listado.
- Pantalla de detalle.
- Formulario inicial de creación.
- Navegación y datos de muestra en memoria.

Las acciones locales marcadas como demo son únicamente demostrativas: no persisten ni representan consumo REST.

## Implementación del estudiante

No se incluye permiso INTERNET, cliente HTTP, DTO de API, serialización, repositorio remoto ni solicitudes. Implementa:
- GET /api/tickets y GET /api/tickets/{id}
- POST /api/tickets
- PUT /api/tickets/{id}
- PATCH /api/tickets/{id}/status
- DELETE /api/tickets/{id}

Busca `TODO(REST)` y reemplaza los datos locales por la API. No agregues llamadas de red directamente a los Composables.
