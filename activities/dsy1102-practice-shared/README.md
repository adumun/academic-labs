# ADU-230 — prácticas reutilizables de DSY1102

13 bancos web (47 ejercicios) y 12 laboratorios híbridos. Fuentes fijas: commit a28dbca877a9ef6e0105777cae48ba4fa252f10c del repositorio docente. Manifiestos banks-01-08.json, banks-09-14.json y labs.json. Los bancos presentan las consignas vigentes; los labs presentan los requisitos y checkpoints, enlazando las instrucciones completas originales por paso. No se duplican ni se eliminan las ocho actividades DSY1102 existentes. Las duraciones se omiten donde no existe una duración documentada; los dos labs JDBC mantienen 90 min.

Cada actividad funciona como página estática sin cuenta ni backend. El código se ejecuta en el IDE/entorno local del estudiante. Los datos de los formularios son temporales, no se envían a servidores. TXT con SHA-256 cuando Web Crypto está disponible: integridad, no prueba de autoría ni calificación. La evidencia declarada no certifica la ejecución. Preservar archivos/commits/capturas externos si la actividad lo exige. La entrega oficial se mantiene en AVA o el canal que indique el docente.

## Verificación

`node --check activities/dsy1102-practice-shared/practice.js`

`node scripts/test-dsy1102-practice.mjs`

El test verifica catálogo, rutas, número de tareas, IDs, labels, anclas y enlaces fuente. No sustituye revisión pedagógica, HTTP, ejecución Java/JavaFX/JDBC ni prueba móvil del comportamiento/exportación. Cloudflare preview y aceptación antes de merge. No extender el código compartido a otras modalidades si no hay necesidad real.
