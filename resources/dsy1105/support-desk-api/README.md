# Support Desk API — DSY1105

Backend REST didáctico completo para la actividad de consumo de APIs desde Android. Está configurado como proyecto Gradle Java para abrirse, ejecutarse y probarse desde Android Studio, sin instalar Maven ni utilizar una terminal.

## Abrir y ejecutar desde Android Studio

1. Selecciona **File → Open**.
2. Selecciona esta carpeta `support-desk-api` (la que contiene `settings.gradle.kts`).
3. Espera Gradle Sync. En la primera apertura se descargan Gradle y dependencias.
4. Configura **Gradle JDK 17** si Android Studio lo solicita.
5. Abre `src/main/java/cl/adumun/dsy1105/supportdesk/SupportDeskApiApplication.java`.
6. Pulsa el icono verde **Run ▶** junto al método `main`. También puedes abrir el panel Gradle y ejecutar `Tasks → application → bootRun`.
7. La API queda en `http://localhost:8080`. La consola **Run** de Android Studio permite detener y revisar el proceso.

## Ejecutar pruebas desde Android Studio

1. Abre `src/test/java/cl/adumun/dsy1105/supportdesk/TicketApiIntegrationTest.java`.
2. Pulsa **Run ▶** junto a la clase o al método `supportsTicketCrudAndValidation`.
3. Revisa la ventana **Test Results**: debe mostrar la prueba en verde.
4. Alternativamente, abre el panel Gradle y ejecuta `Tasks → verification → test`.

La prueba verifica GET de colección y detalle, POST (201), PUT, PATCH, DELETE (204), inexistencia (404) y validación (400). No se debe marcar PASS hasta ejecutar la prueba y observar el resultado.

## Inspeccionar la API

- Swagger UI: http://localhost:8080/swagger-ui/index.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs
- Consola H2: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:file:./data/supportdesk`
  - User: `sa`
  - Password: vacío

La base H2 utiliza almacenamiento local en archivo, por lo que los tickets sobreviven al reinicio del proceso.

## Android: URL base

- Emulador Android Studio: `http://10.0.2.2:8080`
- Dispositivo físico: `http://IP_LAN_DEL_COMPUTADOR:8080` (ambos equipos en la misma red).

No uses `localhost` desde el emulador: apunta al propio emulador, no al computador anfitrión. Para pruebas docentes, Android puede requerir permitir tráfico HTTP cleartext en el manifiesto de desarrollo. No se configura TLS ni autenticación en esta API didáctica.

## Endpoints

| Método | Ruta | Respuesta |
|---|---|---|
| GET | /api/tickets | 200 + arreglo |
| GET | /api/tickets/{id} | 200 + ticket / 404 |
| POST | /api/tickets | 201 + ticket creado |
| PUT | /api/tickets/{id} | 200 + ticket actualizado |
| PATCH | /api/tickets/{id}/status | 200 + ticket actualizado |
| DELETE | /api/tickets/{id} | 204 sin cuerpo |

## Contratos JSON

POST requiere `title`, `description`, `category`, `priority` y `requester`. El estado inicial es `ABIERTO`; las fechas las genera el servidor.

PUT recibe todos los campos editables. PATCH recibe un objeto con `status`, cuyos valores válidos son `ABIERTO`, `EN_PROCESO`, `RESUELTO` y `CERRADO`.

Prioridades válidas: `BAJA`, `MEDIA`, `ALTA`, `CRITICA`.

Validaciones:
- `title`: obligatorio, máximo 100 caracteres.
- `description`: obligatorio, máximo 1000 caracteres.
- `category`: obligatorio, máximo 60 caracteres.
- `priority`: obligatorio y debe coincidir con el enum.
- `requester`: obligatorio, máximo 100 caracteres.
- `status`: obligatorio y debe coincidir con el enum para PATCH.

Errores:
- 400: JSON inválido, enum desconocido o validación de campos. El cuerpo identifica los campos.
- 404: ticket inexistente.
- 201: ticket creado.
- 204: ticket eliminado correctamente.

## Alcance intencional

No incluye autenticación, autorización, Spring Security, JWT, Docker ni microservicios. CORS está abierto para facilitar el laboratorio local. No desplegar esta API públicamente ni reutilizarla como backend productivo.


## Windows + WSL2

Si el repositorio está en WSL2 y Android Studio corre en Windows, abre este proyecto desde **File → Open** usando la ruta UNC `\\wsl.localhost\<DISTRIBUCION>\home\<USUARIO_LINUX>\projects\academic-labs\resources\dsy1105\support-desk-api`. Android Studio utilizará el JDK de Windows para ejecutar Gradle y Spring Boot. La primera sincronización e indexado sobre UNC puede ser más lento; si presenta problemas persistentes, utiliza una copia de trabajo NTFS sincronizada por Git. No mantengas dos copias editándose simultáneamente.

Cuando el backend se ejecuta desde Android Studio Windows, Android Emulator lo alcanza mediante `http://10.0.2.2:8080`.
