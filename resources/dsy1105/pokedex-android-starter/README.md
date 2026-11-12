# Pokédex Android Starter

Proyecto Android nativo con Kotlin y Jetpack Compose. Debe abrir y ejecutar la interfaz de demostración sin depender de PokéAPI.

## Requisitos

- Android Studio reciente.
- JDK 17.
- Android SDK 35.
- Emulador o dispositivo Android API 26+.

## Primera ejecución

En Windows, desde esta carpeta ejecuta en PowerShell o CMD:

```bat
gradlew.bat :app:assembleDebug
```

En Linux/macOS:

```bash
./gradlew :app:assembleDebug
```

El launcher descarga el Gradle Wrapper oficial 8.9 desde el repositorio oficial de Gradle, verifica su SHA-256 publicado y luego ejecuta la distribución Gradle 8.9 fijada en `gradle/wrapper/gradle-wrapper.properties`. Requiere conexión a Internet solo la primera vez (para descargar wrapper y distribución, y resolver dependencias). Después abre esta carpeta en Android Studio y ejecuta la configuración `app`.

## Qué incluye

- Pantalla de listado y pantalla de detalle.
- Navegación simple entre ambas pantallas.
- Datos locales de demostración.
- Modelo de presentación `PokemonUiModel`.

## Qué NO incluye (debe implementarlo el estudiante)

- Permiso de Internet.
- Cliente HTTP.
- Serialización JSON.
- Modelos de respuesta de PokéAPI.
- Repositorio remoto ni solicitudes GET.
- Paginación ni scroll infinito real.

Busca `TODO(REST)` en el código. La interfaz está preparada para ser conectada a tu implementación. Documentación: https://pokeapi.co/docs/v2

## Sugerencia de arquitectura

Define un repositorio que pueda:
- solicitar una página del listado a partir de offset/limit;
- obtener el detalle por id o nombre.

No pongas llamadas de red dentro de los Composables. Mantén la UI desacoplada de los DTO de la API.
