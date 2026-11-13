# Pokédex Android Starter

Proyecto Android nativo con Kotlin y Jetpack Compose. Debe abrir y ejecutar la interfaz de demostración sin depender de PokéAPI.

## Abrir y ejecutar desde Android Studio

1. En Android Studio selecciona **File → Open**.
2. Selecciona esta carpeta `pokedex-android-starter`.
3. Acepta la confianza del proyecto si Android Studio lo solicita.
4. Espera a que finalice Gradle Sync. En la primera apertura se descargan Gradle y las dependencias.
5. En **Tools → Device Manager**, crea o inicia un emulador API 26 o superior.
6. Selecciona la configuración `app` en la barra superior y pulsa **Run ▶**.
7. Para compilar sin instalar, selecciona **Build → Make Project** o abre el panel Gradle y ejecuta `Tasks → build → assembleDebug`.

Requisitos: Android Studio actualizado, JDK 17 y Android SDK 35. Si Android Studio solicita un JDK, selecciona 17 en Gradle JDK.

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

Busca `TODO(REST)` en el código. La interfaz está preparada para conectarse a tu implementación. Documentación de referencia: https://pokeapi.co/docs/v2

## Ejecutar y depurar

Utiliza **Run ▶** para iniciar la app en el emulador. Usa **Debug 🐞** para recorrer el código con breakpoints y **Logcat** para inspeccionar mensajes. El listado y detalle deben funcionar con los datos demo, sin backend ni conexión de red.

## Sugerencia de arquitectura

Define un repositorio que pueda:
- solicitar una página del listado a partir de offset/limit;
- obtener el detalle por id o nombre.

No pongas llamadas de red dentro de los Composables. Mantén la UI desacoplada de los DTO de la API.


## Windows + WSL2

Si el repositorio está en WSL2 y Android Studio corre en Windows, abre este proyecto desde **File → Open** usando la ruta UNC `\\wsl.localhost\<DISTRIBUCION>\home\<USUARIO_LINUX>\projects\academic-labs\resources\dsy1105\pokedex-android-starter`. Android Studio utilizará el JDK y Android SDK de Windows. La primera sincronización e indexado sobre UNC puede ser más lento; si presenta problemas persistentes, utiliza una copia de trabajo NTFS sincronizada por Git. No mantengas dos copias editándose simultáneamente.
