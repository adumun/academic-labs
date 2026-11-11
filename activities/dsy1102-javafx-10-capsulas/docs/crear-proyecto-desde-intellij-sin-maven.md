# Crear el proyecto JavaFX desde cero en IntelliJ IDEA (sin Maven)

Esta alternativa es para quien prefiera no utilizar Maven. Se utilizará **Gradle** como gestor de dependencias y construcción. No se elimina el uso de una herramienta de construcción: se reemplaza Maven por Gradle.

El asistente JavaFX de IntelliJ genera un proyecto de ejemplo configurado y permite ejecutarlo desde el IDE. Consulta también la [documentación oficial de JetBrains](https://www.jetbrains.com/help/idea/javafx.html).

## 1. Habilitar el soporte JavaFX

1. Abre IntelliJ IDEA.
2. Ingresa a **Settings → Plugins** (atajo habitual: `Ctrl+Alt+S`).
3. Busca el plugin integrado **JavaFX** y verifica que esté habilitado.
4. Reinicia IntelliJ si lo solicita.

Si no aparece el generador JavaFX, comprueba que estás utilizando una versión de IntelliJ IDEA que incluya ese generador y que el plugin esté habilitado.

## 2. Crear el proyecto con el asistente

1. Desde la pantalla inicial, selecciona **New Project**. Si ya tienes un proyecto abierto, utiliza **File → New → Project**.
2. En la lista de generadores, selecciona **JavaFX**.
3. Completa los datos:
   - **Name:** `EstacionSur` (o el nombre que prefieras).
   - **Language:** `Java`.
   - **Build system:** `Gradle` (no Maven).
   - **Group:** `cl.adumun.academiclabs.dsy1102.estacionsur`.
   - **JDK:** `21`.
4. Pulsa **Next**.
5. En la selección de bibliotecas, incluye:
   - `javafx.controls` para controles como Button, ComboBox y TableView.
   - `javafx.fxml` para cargar las vistas FXML.
6. Pulsa **Create** y espera a que IntelliJ termine la sincronización de Gradle.

## 3. Comprobar que JavaFX funciona

1. Abre la clase generada por IntelliJ, normalmente `HelloApplication.java`.
2. Ejecuta su método `main` con el botón verde del margen del editor.
3. Comprueba que aparece la ventana de ejemplo.

Si no aparece la ventana, revisa que la sincronización de Gradle haya terminado y que el proyecto utilice JDK 21. No agregues manualmente un SDK JavaFX al JDK: el asistente configura las dependencias del proyecto.

## 4. Incorporar el modelo del caso Estación Sur

El asistente crea un ejemplo JavaFX, pero **no crea el modelo de negocio del caso** ni resuelve las cápsulas.

Para comenzar con el mismo modelo que incluye el ZIP Maven:

1. Descomprime el proyecto base descargable.
2. Copia únicamente las clases `Taller.java`, `TallerPresencial.java` y `TallerVirtual.java` desde `src/main/java/.../model/`.
3. Pégalas en el paquete `cl.adumun.academiclabs.dsy1102.estacionsur.model` de tu proyecto Gradle.
4. Conserva la clase de arranque y la estructura JavaFX que generó IntelliJ.

**No copies** el `pom.xml` ni la configuración de ejecución Maven `.run/JavaFX - Ejecutar aplicación.run.xml`: pertenecen a la alternativa Maven. Tampoco reemplaces el archivo de construcción Gradle por el del ZIP.

Desde aquí puedes desarrollar las cápsulas con la misma base de dominio. Las vistas FXML, los controladores, la TableView, el DAO y la persistencia siguen siendo trabajo del estudiante.

## 5. Agregar Jackson cuando llegues a persistencia JSON

El asistente JavaFX no agrega Jackson automáticamente. Cuando llegues a la cápsula de persistencia, incorpora Jackson Databind en el bloque `dependencies` del archivo Gradle.

Si el proyecto utiliza **Groovy DSL** (`build.gradle`):

```groovy
dependencies {
    implementation 'com.fasterxml.jackson.core:jackson-databind:2.22.4'
}
```

Si utiliza **Kotlin DSL** (`build.gradle.kts`):

```kotlin
dependencies {
    implementation("com.fasterxml.jackson.core:jackson-databind:2.22.4")
}
```

Después, pulsa **Load Gradle Changes** o **Reload All Gradle Projects**. En el código se utiliza Jackson (`ObjectMapper`); no se utiliza Gson.

## 6. Diferencias entre las dos alternativas

| Proyecto Maven descargable | Proyecto JavaFX creado con Gradle |
|---|---|
| Abres la carpeta que contiene `pom.xml`. | Creas el proyecto con el generador JavaFX. |
| Ejecutas con `javafx:run` o la configuración compartida. | Ejecutas la clase generada desde el botón verde de IntelliJ. |
| Las dependencias se declaran en `pom.xml`. | Las dependencias se declaran en `build.gradle` o `build.gradle.kts`. |
| Pruebas con `mvn test`. | Pruebas con `./gradlew test` (o `gradlew.bat test` en Windows). |

Ambos caminos permiten trabajar las mismas cápsulas. Elige uno y mantén el mismo sistema de construcción durante todo el proyecto; no mezcles archivos de configuración Maven y Gradle.

## Entorno Windows y WSL2

El proyecto Gradle también debe ejecutarse con el JDK del entorno donde está ubicado:

- **Windows:** utiliza un JDK 21 instalado y configurado en IntelliJ para Windows.
- **WSL2:** guarda el proyecto dentro del filesystem Linux (por ejemplo, `~/projects`), utiliza el JDK 21 de WSL y abre/ejecuta el proyecto con la integración WSL de IntelliJ. Para mostrar ventanas gráficas necesitas WSLg.

No mezcles un Gradle/JDK de Windows con dependencias nativas descargadas para Linux, ni al revés.
