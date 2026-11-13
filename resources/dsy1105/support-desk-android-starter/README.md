# Support Desk Android Starter

Proyecto Android nativo Kotlin + Jetpack Compose. Contiene listado, detalle y formulario con datos de muestra locales para explorar la UI.

## Abrir y ejecutar desde Android Studio

1. En Android Studio selecciona **File → Open**.
2. Selecciona esta carpeta `support-desk-android-starter`.
3. Acepta la confianza del proyecto si Android Studio lo solicita.
4. Espera a que finalice Gradle Sync.
5. Inicia un emulador API 26 o superior desde **Tools → Device Manager**.
6. Selecciona la configuración `app` y pulsa **Run ▶**.
7. Para compilar sin instalar, usa **Build → Make Project** o la tarea `Tasks → build → assembleDebug` del panel Gradle.

Requisitos: Android Studio actualizado, JDK 17 y Android SDK 35.

## Alcance provisto

- Pantalla de listado.
- Pantalla de detalle.
- Formulario de alta y edición.
- Navegación y datos de muestra en memoria.
- Acciones demo locales para observar el comportamiento de la UI.
- Confirmación antes de eliminar un registro.

Las acciones locales son únicamente demostrativas: no persisten ni representan consumo REST.

## Implementación del estudiante

No se incluye permiso INTERNET, cliente HTTP, DTO de API, serialización, repositorio remoto ni solicitudes. Implementa:

- GET /api/tickets y GET /api/tickets/{id}
- POST /api/tickets
- PUT /api/tickets/{id}
- PATCH /api/tickets/{id}/status
- DELETE /api/tickets/{id}

Busca `TODO(REST)` y reemplaza los datos locales por la API. No agregues llamadas de red directamente a los Composables.

## Depuración

Usa **Debug 🐞** y **Logcat** desde Android Studio. La aplicación debe iniciar y permitir recorrer sus datos demo aunque Support Desk API esté detenida.


## Windows + WSL2

Si el repositorio está en WSL2 y Android Studio corre en Windows, abre este proyecto desde **File → Open** usando la ruta UNC `\\wsl.localhost\<DISTRIBUCION>\home\<USUARIO_LINUX>\projects\academic-labs\resources\dsy1105\support-desk-android-starter`. Android Studio utilizará el JDK y Android SDK de Windows. La primera sincronización e indexado sobre UNC puede ser más lento; si presenta problemas persistentes, utiliza una copia de trabajo NTFS sincronizada por Git. No mantengas dos copias editándose simultáneamente.
