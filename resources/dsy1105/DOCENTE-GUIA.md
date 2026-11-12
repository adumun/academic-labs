# DSY1105 — Guía docente rápida
## Consumo de APIs REST desde Android

Dos actividades independientes. Ambas usan Android nativo, Kotlin y Jetpack Compose. El docente entrega la interfaz y el backend de Support Desk; los estudiantes implementan la integración HTTP.

## Preparación antes de la clase

1. Descargar/clonar Academic Labs y entrar a `resources/dsy1105/`.
2. Abrir cada proyecto Android de manera independiente en Android Studio.
3. Ejecutar `gradlew.bat :app:assembleDebug` en cada Starter.
4. Ejecutar los APK en un emulador y comprobar listado/detalle/formulario con datos demo.
5. Abrir `support-desk-api/` y ejecutar `mvn test`, luego `mvn spring-boot:run`.
6. Verificar Swagger UI: http://localhost:8080/swagger-ui/index.html.

> Los launchers Android hacen bootstrap del Wrapper Gradle 8.9, verifican su SHA-256 y descargan la distribución. La primera ejecución requiere Internet. El backend también requiere resolver dependencias Maven la primera vez.

## Secuencia sugerida de enseñanza

### Bloque A — Pokédex (90 minutos)

| Tiempo | Contenido / actividad |
|---|---|
| 0–10 min | API REST, HTTP GET, JSON, endpoint y recurso |
| 10–20 min | Inspeccionar respuesta PokéAPI y reconocer `count`, `next`, `previous`, `results` |
| 20–35 min | Cliente HTTP, permiso INTERNET, corrutinas y ejecución fuera del hilo UI |
| 35–50 min | Modelos de respuesta y conversión a modelo de presentación |
| 50–65 min | GET del listado y estado de pantalla |
| 65–80 min | Paginación limit/offset |
| 80–90 min | Detalle y checkpoint; scroll infinito como ampliación |

### Bloque B — Support Desk (120 minutos)

| Tiempo | Contenido / actividad |
|---|---|
| 0–15 min | Repaso REST y diferencia entre GET/POST/PUT/PATCH/DELETE |
| 15–30 min | Levantar API, inspeccionar Swagger y probar GET |
| 30–45 min | Configurar URL base y conectar Android con emulador |
| 45–60 min | GET colección/detalle |
| 60–75 min | POST y validaciones |
| 75–90 min | PUT y PATCH |
| 90–105 min | DELETE, confirmación y actualización UI |
| 105–120 min | Manejo de errores HTTP, evidencia y cierre |

Los bloques pueden distribuirse en sesiones según el avance real del curso. No es necesario completar todos los desafíos en una sola clase.

## Red local Android

- Android Emulator hacia el host: `http://10.0.2.2:8080`.
- Dispositivo físico: `http://IP_LAN_DEL_PC:8080`; ambos en la misma red Wi-Fi.
- No usar `localhost` en el emulador para llegar al computador.
- El backend tiene CORS abierto para laboratorio, aunque Android nativo no aplica la política CORS de navegador.
- El Starter Support Desk habilita cleartext HTTP solo para este ejercicio local. No usar este backend en producción.

## Checkpoints rápidos

### Pokédex

- [ ] GET listado retorna datos.
- [ ] La UI muestra los resultados sin bloquearse.
- [ ] La paginación no duplica registros.
- [ ] El detalle corresponde al elemento seleccionado.
- [ ] Error de red muestra estado recuperable.
- [ ] Scroll infinito carga la siguiente página (si se aborda).

### Support Desk

- [ ] GET colección y detalle.
- [ ] POST devuelve 201 y el ticket aparece al refrescar.
- [ ] PUT modifica los campos editables.
- [ ] PATCH cambia estado.
- [ ] DELETE devuelve 204 y el ticket desaparece.
- [ ] Solicitud inválida devuelve 400 con campos.
- [ ] ID inexistente devuelve 404.

## Pruebas rápidas de backend

```bash
curl http://localhost:8080/api/tickets
curl http://localhost:8080/api/tickets/1
```

Crear:

```bash
curl -X POST http://localhost:8080/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"title":"No puedo entrar","description":"Error al iniciar sesión","category":"Acceso","priority":"ALTA","requester":"Estudiante"}'
```

Cambiar estado:

```bash
curl -X PATCH http://localhost:8080/api/tickets/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"EN_PROCESO"}'
```

## Qué debe quedar para el estudiante

- No entregar código de conexión HTTP en Android.
- No entregar DTOs remotos ni repositorio que consuma API.
- Sí entregar UI compilable, navegación, modelos de presentación y datos demo.
- En Support Desk, el backend Spring Boot sí se entrega completo.
- La evaluación debe observar consumo real: no basta con modificar listas locales de demostración.
