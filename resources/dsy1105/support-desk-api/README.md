# Support Desk API — DSY1105

Backend REST didáctico completo para la actividad de consumo de APIs desde Android.

## Requisitos

- JDK 17
- Maven 3.9+ (o Maven Wrapper si se incorpora al entorno)
- Puerto TCP 8080 disponible

## Ejecutar

Desde esta carpeta:

```bash
mvn spring-boot:run
```

Windows PowerShell:

```powershell
mvn spring-boot:run
```

La API queda en `http://localhost:8080`.

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

Para pruebas docentes, Android puede requerir permitir tráfico HTTP cleartext en el manifiesto de desarrollo. No se configura TLS ni autenticación en esta API didáctica.

## Endpoints

| Método | Ruta | Respuesta |
|---|---|---|
| GET | /api/tickets | 200 + arreglo |
| GET | /api/tickets/{id} | 200 + ticket / 404 |
| POST | /api/tickets | 201 + ticket creado |
| PUT | /api/tickets/{id} | 200 + ticket actualizado |
| PATCH | /api/tickets/{id}/status | 200 + ticket actualizado |
| DELETE | /api/tickets/{id} | 204 sin cuerpo |

## Crear ticket — POST

```http
POST /api/tickets
Content-Type: application/json
```

```json
{
  "title": "No puedo acceder al portal",
  "description": "Al iniciar sesión aparece un mensaje de error.",
  "category": "Acceso",
  "priority": "ALTA",
  "requester": "Alex González"
}
```

El estado inicial siempre es `ABIERTO`; las fechas las genera el servidor.

## Actualizar ticket — PUT

Enviar todos los campos editables:

```json
{
  "title": "No puedo acceder al portal",
  "description": "El error continúa después de restablecer la contraseña.",
  "category": "Acceso",
  "priority": "CRITICA",
  "requester": "Alex González"
}
```

## Cambiar estado — PATCH

```json
{ "status": "EN_PROCESO" }
```

Valores válidos de estado: `ABIERTO`, `EN_PROCESO`, `RESUELTO`, `CERRADO`.

Valores válidos de prioridad: `BAJA`, `MEDIA`, `ALTA`, `CRITICA`.

## Validaciones

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

## Estructura

```text
src/main/java/cl/adumun/dsy1105/supportdesk/
  config/       DataInitializer
  controller/   TicketController, ApiExceptionHandler
  dto/          TicketRequest, TicketStatusRequest, TicketResponse
  model/        Ticket, TicketStatus, TicketPriority
  repository/   TicketRepository
  service/      TicketService, TicketNotFoundException
```
