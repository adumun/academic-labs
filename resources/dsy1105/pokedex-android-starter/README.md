# Pokédex Android Starter

Proyecto Android nativo con Kotlin y Jetpack Compose.

## Requisitos

- Android Studio compatible con Android Gradle Plugin 8.7.3.
- JDK 17.
- Android SDK 35.
- Emulador o dispositivo Android API 26+.

## Ejecutar

Abre esta carpeta como proyecto en Android Studio, espera la sincronización de Gradle y ejecuta la app. No requiere backend ni conexión a PokéAPI para mostrar los datos locales de muestra.

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

Busca `TODO(REST)` en el código. La interfaz está preparada para ser conectada a tu implementación. Documentación de API: https://pokeapi.co/docs/v2

## Sugerencia de contrato para la capa de datos

Define por tu cuenta un repositorio que pueda:
- solicitar una página del listado a partir de offset/limit;
- obtener el detalle por id o nombre.

No pongas llamadas de red dentro de los Composables. Mantén la UI desacoplada de los DTO de la API.
