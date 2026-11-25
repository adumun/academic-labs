window.DETECTIVE_BANK = [
  {
    "id": "conexion-1",
    "topic": "conexion",
    "type": "single",
    "seconds": 35,
    "stem": "MariaDB escucha en 3306. ¿Cuál es el defecto más evidente?",
    "code": "String url = \"jdbc:mariadb://localhost:3307/preparacion_db\";",
    "options": [
      "Puerto incorrecto",
      "Falta una TableView",
      "ResultSet vacío",
      "Falta ORDER BY"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "conexion-2",
    "topic": "conexion",
    "type": "multiple",
    "seconds": 50,
    "stem": "Selecciona dos comprobaciones pertinentes ante Connection refused.",
    "code": null,
    "options": [
      "Servidor iniciado",
      "Puerto y host correctos",
      "Nombre del getter del modelo",
      "Ancho de columna JavaFX"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "conexion-3",
    "topic": "conexion",
    "type": "boolean",
    "seconds": 20,
    "stem": "Un error Access denied demuestra necesariamente que el servidor está apagado.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      1
    ]
  },
  {
    "id": "parametros-1",
    "topic": "parametros",
    "type": "single",
    "seconds": 35,
    "stem": "¿Qué asignación corresponde al primer parámetro?",
    "code": "UPDATE libro SET titulo = ? WHERE id = ?;",
    "options": [
      "setString(1, titulo)",
      "setInt(1, id)",
      "setString(0, titulo)",
      "setInt(2, titulo)"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "parametros-2",
    "topic": "parametros",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué dos afirmaciones son correctas sobre PreparedStatement?",
    "code": null,
    "options": [
      "Los índices empiezan en 1",
      "Los valores se vinculan mediante setters",
      "Elimina la necesidad de WHERE",
      "Los índices empiezan en 0"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "parametros-3",
    "topic": "parametros",
    "type": "boolean",
    "seconds": 20,
    "stem": "PreparedStatement permite parametrizar valores, pero no sustituye automáticamente nombres de tablas por medio de ?.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "cursor-1",
    "topic": "cursor",
    "type": "single",
    "seconds": 35,
    "stem": "¿Qué falta antes de leer la primera fila?",
    "code": "try (ResultSet rs = ps.executeQuery()) {\n    System.out.println(rs.getString(\"titulo\"));\n}",
    "options": [
      "Avanzar con rs.next() y verificar su resultado",
      "Ejecutar executeUpdate()",
      "Cerrar rs antes de leer",
      "Crear una TableColumn"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "cursor-2",
    "topic": "cursor",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué dos afirmaciones describen ResultSet?",
    "code": null,
    "options": [
      "next() devuelve false al agotarse las filas",
      "El cursor inicialmente está antes de la primera fila",
      "getString avanza automáticamente el cursor",
      "Siempre contiene una fila"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "cursor-3",
    "topic": "cursor",
    "type": "boolean",
    "seconds": 20,
    "stem": "Si una consulta devuelve cero filas, el cuerpo de while (rs.next()) no se ejecuta.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "mapeo-1",
    "topic": "mapeo",
    "type": "single",
    "seconds": 35,
    "stem": "Libro recibe (int id, String titulo). ¿Qué error tiene este código?",
    "code": "Libro libro = new Libro(\n        rs.getInt(\"titulo\"),\n        rs.getString(\"id\")\n);",
    "options": [
      "Las columnas están intercambiadas",
      "El constructor debe recibir ResultSet",
      "Falta un DELETE",
      "El ID debe ser el índice de la lista"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "mapeo-2",
    "topic": "mapeo",
    "type": "multiple",
    "seconds": 50,
    "stem": "Selecciona dos mapeos coherentes con SQL.",
    "code": null,
    "options": [
      "INT a int para un ID no nulo",
      "DATE no nulo a LocalDate mediante conversión",
      "VARCHAR a Connection",
      "DATE a TableView"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "mapeo-3",
    "topic": "mapeo",
    "type": "boolean",
    "seconds": 20,
    "stem": "El índice de una fila en TableView es necesariamente igual a su clave primaria SQL.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      1
    ]
  },
  {
    "id": "crud-1",
    "topic": "crud",
    "type": "single",
    "seconds": 35,
    "stem": "Inspección estática: no ejecutes esta consulta. ¿Qué riesgo presenta?",
    "code": "UPDATE libro SET titulo = ?;",
    "options": [
      "Puede modificar todas las filas",
      "Solo modifica la primera fila",
      "Solo modifica el último ID",
      "Nunca modifica registros"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "crud-2",
    "topic": "crud",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué dos verificaciones son relevantes al eliminar un libro por ID?",
    "code": null,
    "options": [
      "Comprobar las filas afectadas",
      "Verificar que los demás IDs permanecen",
      "Borrar la tabla para confirmar",
      "Cambiar el título de todos"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "crud-3",
    "topic": "crud",
    "type": "boolean",
    "seconds": 20,
    "stem": "executeUpdate() devuelve un ResultSet que se recorre con next().",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      1
    ]
  },
  {
    "id": "fxml-1",
    "topic": "fxml",
    "type": "single",
    "seconds": 35,
    "stem": "La vista declara fx:id=\"tablaLibros\". ¿Cuál es el defecto?",
    "code": "@FXML\nprivate TableView<Libro> tabla;",
    "options": [
      "El nombre del campo no coincide con fx:id",
      "El campo debe ser Connection",
      "La tabla requiere executeUpdate()",
      "FXML no permite campos privados"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "fxml-2",
    "topic": "fxml",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué dos comprobaciones corresponden a un fallo de inyección FXML?",
    "code": null,
    "options": [
      "fx:id coincide con el campo",
      "fx:controller referencia al controlador correcto",
      "El puerto SQL siempre es 80",
      "La consulta tiene ORDER BY"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "fxml-3",
    "topic": "fxml",
    "type": "boolean",
    "seconds": 20,
    "stem": "Un campo privado anotado con @FXML puede recibir un control cuyo fx:id coincide con el nombre del campo, si el acceso del módulo lo permite.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "refresco-1",
    "topic": "refresco",
    "type": "single",
    "seconds": 35,
    "stem": "La BD guarda correctamente, pero la tabla no cambia. ¿Qué falta?",
    "code": "dao.insertar(libro);\ntxtTitulo.clear();",
    "options": [
      "Actualizar los elementos de la tabla desde el DAO",
      "Reinstalar MariaDB",
      "Cambiar id por índice visual",
      "Eliminar todos los registros"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "refresco-2",
    "topic": "refresco",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué dos pruebas demuestran que la interfaz refleja la persistencia?",
    "code": null,
    "options": [
      "Comparar tabla con SELECT tras guardar",
      "Reiniciar y comprobar los datos",
      "Cambiar el color de una fila",
      "Comprobar solo que abre la ventana"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "refresco-3",
    "topic": "refresco",
    "type": "boolean",
    "seconds": 20,
    "stem": "Agregar un objeto a ObservableList garantiza por sí solo que se guardó en MariaDB.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      1
    ]
  },
  {
    "id": "validacion-1",
    "topic": "validacion",
    "type": "single",
    "seconds": 35,
    "stem": "¿Qué entrada inválida acepta esta condición?",
    "code": "if (titulo.length() <= 120) {\n    dao.insertar(new Libro(0, titulo));\n}",
    "options": [
      "Un título vacío",
      "Un título de 121 caracteres",
      "Un título de 200 caracteres",
      "Ninguna"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "validacion-2",
    "topic": "validacion",
    "type": "multiple",
    "seconds": 50,
    "stem": "Selecciona dos comportamientos correctos si el formulario es inválido.",
    "code": null,
    "options": [
      "Mostrar un mensaje claro",
      "No llamar al DAO para guardar",
      "Borrar toda la base",
      "Anunciar éxito aunque falle"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "validacion-3",
    "topic": "validacion",
    "type": "boolean",
    "seconds": 20,
    "stem": "Si SQLException impide guardar, la interfaz debe anunciar que el registro se guardó correctamente.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      1
    ]
  },
  {
    "id": "conexion-4",
    "topic": "conexion",
    "type": "single",
    "seconds": 35,
    "stem": "La conexión devuelve Unknown database. ¿Qué revisar primero?",
    "code": "DriverManager.getConnection(\"jdbc:mariadb://localhost:3306/preparacion_db\", user, password);",
    "options": [
      "Existencia y nombre del esquema",
      "Getter de título",
      "Número de columnas visuales",
      "Orden del ResultSet"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "conexion-5",
    "topic": "conexion",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué prácticas ayudan a gestionar credenciales y conexiones?",
    "code": null,
    "options": [
      "Leer secretos desde variables de entorno",
      "Cerrar Connection mediante try-with-resources",
      "Subir la contraseña al repositorio",
      "Mantener una conexión abierta indefinidamente sin control"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "conexion-6",
    "topic": "conexion",
    "type": "boolean",
    "seconds": 20,
    "stem": "Cerrar una conexión obtenida en try-with-resources ocurre también si el bloque lanza una excepción.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "parametros-4",
    "topic": "parametros",
    "type": "single",
    "seconds": 35,
    "stem": "¿Qué índice corresponde al ID en esta consulta?",
    "code": "DELETE FROM libro WHERE id = ?;",
    "options": [
      "1",
      "0",
      "2",
      "El valor del propio ID"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "parametros-5",
    "topic": "parametros",
    "type": "multiple",
    "seconds": 50,
    "stem": "Para INSERT INTO libro(titulo, autor) VALUES (?, ?) selecciona las asignaciones correctas.",
    "code": null,
    "options": [
      "ps.setString(1, titulo)",
      "ps.setString(2, autor)",
      "ps.setString(0, titulo)",
      "ps.setString(1, autor)"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "parametros-6",
    "topic": "parametros",
    "type": "boolean",
    "seconds": 20,
    "stem": "Si la entrada contiene un apóstrofo, un parámetro setString puede transmitirlo como dato sin concatenar SQL.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "cursor-4",
    "topic": "cursor",
    "type": "single",
    "seconds": 35,
    "stem": "¿Qué devuelve este método si no existen filas?",
    "code": "List<Libro> libros = new ArrayList<>();\nwhile (rs.next()) {\n    libros.add(new Libro(rs.getInt(\"id\"), rs.getString(\"titulo\")));\n}\nreturn libros;",
    "options": [
      "Una lista vacía",
      "Una lista con null",
      "Siempre una excepción",
      "Un ResultSet"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "cursor-5",
    "topic": "cursor",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué recursos conviene declarar en try-with-resources al consultar?",
    "code": null,
    "options": [
      "Connection",
      "PreparedStatement",
      "ResultSet",
      "ArrayList"
    ],
    "correct": [
      0,
      1,
      2
    ]
  },
  {
    "id": "cursor-6",
    "topic": "cursor",
    "type": "boolean",
    "seconds": 20,
    "stem": "Usar if (rs.next()) en vez de while permite procesar todas las filas de cualquier consulta.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      1
    ]
  },
  {
    "id": "mapeo-4",
    "topic": "mapeo",
    "type": "single",
    "seconds": 35,
    "stem": "La columna SQL fecha_apertura es DATE no nula. ¿Qué expresión produce LocalDate?",
    "code": null,
    "options": [
      "rs.getDate(\"fecha_apertura\").toLocalDate()",
      "rs.getInt(\"fecha_apertura\")",
      "rs.getString(\"fecha_apertura\")",
      "rs.next()"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "mapeo-5",
    "topic": "mapeo",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué dos decisiones hacen más legible el mapeo JDBC?",
    "code": null,
    "options": [
      "Usar nombres de columnas coherentes",
      "Construir el objeto antes de agregarlo a la lista",
      "Usar el índice visual como clave primaria",
      "Intercambiar argumentos del constructor"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "mapeo-6",
    "topic": "mapeo",
    "type": "boolean",
    "seconds": 20,
    "stem": "Una lista de objetos ya construidos puede utilizarse después de cerrar el ResultSet si no depende de sus recursos.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "crud-4",
    "topic": "crud",
    "type": "single",
    "seconds": 35,
    "stem": "Una eliminación por ID devuelve 0 filas afectadas. ¿Qué significa?",
    "code": "int filas = ps.executeUpdate();",
    "options": [
      "No se eliminó ninguna fila",
      "Se eliminó exactamente una fila",
      "La consulta devolvió una lista",
      "Se borró toda la tabla"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "crud-5",
    "topic": "crud",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué operaciones de JDBC normalmente utilizan executeUpdate()?",
    "code": null,
    "options": [
      "INSERT",
      "UPDATE",
      "DELETE",
      "SELECT que devuelve filas"
    ],
    "correct": [
      0,
      1,
      2
    ]
  },
  {
    "id": "crud-6",
    "topic": "crud",
    "type": "boolean",
    "seconds": 20,
    "stem": "Una clave primaria permite identificar un registro independientemente del orden en que se muestra la tabla.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "fxml-4",
    "topic": "fxml",
    "type": "single",
    "seconds": 35,
    "stem": "El getter del modelo se llama getTitulo(). ¿Qué propiedad corresponde?",
    "code": "new PropertyValueFactory<Libro, String>( /* propiedad */ );",
    "options": [
      "titulo",
      "getTitulo()",
      "Libro",
      "tituloLibro siempre"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "fxml-5",
    "topic": "fxml",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué dos elementos pertenecen al controlador JavaFX?",
    "code": null,
    "options": [
      "Atender eventos del formulario",
      "Coordinar la carga de la TableView",
      "Administrar directamente el servidor MariaDB",
      "Definir el SQL de todas las operaciones como responsabilidad principal"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "fxml-6",
    "topic": "fxml",
    "type": "boolean",
    "seconds": 20,
    "stem": "FXML puede declarar onAction=\"#guardar\" para un método compatible del controlador.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "refresco-4",
    "topic": "refresco",
    "type": "single",
    "seconds": 35,
    "stem": "¿Qué debería ocurrir tras una inserción exitosa?",
    "code": "int filas = dao.insertar(libro);",
    "options": [
      "Refrescar la tabla desde el DAO",
      "Insertar nuevamente sin comprobar",
      "Reiniciar MariaDB",
      "Ignorar las filas afectadas siempre"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "refresco-5",
    "topic": "refresco",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué acciones NO demuestran por sí solas persistencia?",
    "code": null,
    "options": [
      "Agregar un elemento a ObservableList",
      "Mostrar un mensaje de éxito sin comprobar la BD",
      "Consultar SQL después de reiniciar y encontrar el ID",
      "Leer desde el DAO tras reiniciar"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "refresco-6",
    "topic": "refresco",
    "type": "boolean",
    "seconds": 20,
    "stem": "TableView y la base de datos pueden quedar temporalmente desincronizadas si no se refresca la vista después de guardar.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "validacion-4",
    "topic": "validacion",
    "type": "single",
    "seconds": 35,
    "stem": "¿Qué condición rechaza títulos vacíos o de solo espacios?",
    "code": null,
    "options": [
      "titulo.isBlank()",
      "titulo.length() > 0",
      "titulo != null solamente",
      "titulo.equals(\"Java\")"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "validacion-5",
    "topic": "validacion",
    "type": "multiple",
    "seconds": 50,
    "stem": "Antes de actualizar un registro desde el formulario, ¿qué debes comprobar?",
    "code": null,
    "options": [
      "Existe una fila seleccionada",
      "Los datos cumplen las restricciones",
      "El servidor usa siempre puerto 3307",
      "El índice visual sustituye el ID"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "validacion-6",
    "topic": "validacion",
    "type": "boolean",
    "seconds": 20,
    "stem": "La validación del formulario puede reemplazar completamente las restricciones de integridad de la base de datos.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      1
    ]
  },
  {
    "id": "conexion-7",
    "topic": "conexion",
    "type": "single",
    "seconds": 35,
    "stem": "¿Qué componente aporta la implementación JDBC para MariaDB?",
    "code": null,
    "options": [
      "MariaDB Connector/J",
      "Scene Builder",
      "FXMLLoader",
      "TableColumn"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "conexion-8",
    "topic": "conexion",
    "type": "multiple",
    "seconds": 50,
    "stem": "Ante un error de conexión, ¿qué información es razonable registrar sin exponer secretos?",
    "code": null,
    "options": [
      "Mensaje de excepción revisado para evitar secretos",
      "Host y puerto no sensibles del entorno de práctica",
      "Contraseña en texto plano",
      "Token de acceso"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "conexion-9",
    "topic": "conexion",
    "type": "boolean",
    "seconds": 20,
    "stem": "La dependencia Maven del driver instala automáticamente un servidor MariaDB local.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      1
    ]
  },
  {
    "id": "parametros-7",
    "topic": "parametros",
    "type": "single",
    "seconds": 35,
    "stem": "¿Por qué falla esta asignación?",
    "code": "String sql = \"SELECT * FROM libro WHERE titulo = ?\";\nps.setString(2, titulo);",
    "options": [
      "Solo existe un parámetro y su índice es 1",
      "SELECT no admite parámetros",
      "El título requiere setInt",
      "Los índices son negativos"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "parametros-8",
    "topic": "parametros",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué acciones son correctas al ejecutar un SELECT parametrizado?",
    "code": null,
    "options": [
      "Preparar SQL con ?",
      "Asignar el valor antes de ejecutar",
      "Usar executeQuery()",
      "Concatenar el valor además del parámetro"
    ],
    "correct": [
      0,
      1,
      2
    ]
  },
  {
    "id": "parametros-9",
    "topic": "parametros",
    "type": "boolean",
    "seconds": 20,
    "stem": "PreparedStatement elimina automáticamente los errores de nombres de columnas.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      1
    ]
  },
  {
    "id": "cursor-7",
    "topic": "cursor",
    "type": "single",
    "seconds": 35,
    "stem": "¿Cuál es el resultado de rs.next() cuando hay una fila disponible para avanzar?",
    "code": null,
    "options": [
      "true",
      "false",
      "El objeto Libro",
      "El número total de filas"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "cursor-8",
    "topic": "cursor",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué dos errores pueden causar problemas al leer ResultSet?",
    "code": null,
    "options": [
      "Leer antes de avanzar el cursor",
      "Usar un nombre de columna inexistente",
      "Cerrar los recursos después de leer",
      "Crear una lista vacía antes del bucle"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "cursor-9",
    "topic": "cursor",
    "type": "boolean",
    "seconds": 20,
    "stem": "ResultSet.getString() cierra automáticamente la conexión JDBC.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      1
    ]
  },
  {
    "id": "mapeo-7",
    "topic": "mapeo",
    "type": "single",
    "seconds": 35,
    "stem": "El constructor espera (int id, String titulo). ¿Qué argumento debería ir primero?",
    "code": null,
    "options": [
      "rs.getInt(\"id\")",
      "rs.getString(\"titulo\")",
      "rs.next()",
      "lista.size()"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "mapeo-8",
    "topic": "mapeo",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué responsabilidades corresponden al modelo Libro?",
    "code": null,
    "options": [
      "Representar sus atributos",
      "Exponer getters coherentes",
      "Ejecutar consultas SQL desde cada getter",
      "Gestionar los eventos FXML"
    ],
    "correct": [
      0,
      1
    ]
  },
  {
    "id": "mapeo-9",
    "topic": "mapeo",
    "type": "boolean",
    "seconds": 20,
    "stem": "El orden de los argumentos del constructor importa aunque dos atributos tengan tipos compatibles.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "crud-7",
    "topic": "crud",
    "type": "single",
    "seconds": 35,
    "stem": "¿Qué consulta recupera registros sin modificarlos?",
    "code": null,
    "options": [
      "SELECT id, titulo FROM libro",
      "DELETE FROM libro",
      "UPDATE libro SET titulo = ?",
      "INSERT INTO libro(titulo) VALUES (?)"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "crud-8",
    "topic": "crud",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué condiciones favorecen una modificación controlada por ID?",
    "code": null,
    "options": [
      "WHERE id = ?",
      "Vincular el ID correcto",
      "Comprobar filas afectadas",
      "Eliminar WHERE para simplificar"
    ],
    "correct": [
      0,
      1,
      2
    ]
  },
  {
    "id": "crud-9",
    "topic": "crud",
    "type": "boolean",
    "seconds": 20,
    "stem": "Si el ID es autoincremental, el INSERT puede omitir la columna ID para que la BD lo genere.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "fxml-7",
    "topic": "fxml",
    "type": "single",
    "seconds": 35,
    "stem": "¿Qué componente JavaFX carga un documento FXML?",
    "code": null,
    "options": [
      "FXMLLoader",
      "DriverManager",
      "PreparedStatement",
      "ResultSet"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "fxml-8",
    "topic": "fxml",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué pertenece a una separación MVC y DAO coherente?",
    "code": null,
    "options": [
      "Modelo sin controles JavaFX",
      "DAO responsable del acceso a datos",
      "Controlador coordinando vista y DAO",
      "SQL dentro del archivo FXML"
    ],
    "correct": [
      0,
      1,
      2
    ]
  },
  {
    "id": "fxml-9",
    "topic": "fxml",
    "type": "boolean",
    "seconds": 20,
    "stem": "Un DAO debe importar TableView para poder devolver una List<Libro>.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      1
    ]
  },
  {
    "id": "refresco-7",
    "topic": "refresco",
    "type": "single",
    "seconds": 35,
    "stem": "¿Qué método sustituye los elementos de una lista observable por los recuperados?",
    "code": "tablaLibros.getItems(). /* método */ (dao.listarTodos());",
    "options": [
      "setAll",
      "getInt",
      "executeUpdate",
      "next"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "refresco-8",
    "topic": "refresco",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué pruebas son útiles después de eliminar desde JavaFX?",
    "code": null,
    "options": [
      "El ID desaparece de la tabla",
      "El ID ya no aparece en SQL",
      "Los otros registros permanecen",
      "Solo cambia el color de la fila"
    ],
    "correct": [
      0,
      1,
      2
    ]
  },
  {
    "id": "refresco-9",
    "topic": "refresco",
    "type": "boolean",
    "seconds": 20,
    "stem": "Limpiar los campos de un formulario elimina automáticamente el registro de MariaDB.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      1
    ]
  },
  {
    "id": "validacion-7",
    "topic": "validacion",
    "type": "single",
    "seconds": 35,
    "stem": "El usuario cancela el diálogo de eliminación. ¿Qué debe ocurrir?",
    "code": null,
    "options": [
      "No ejecutar DELETE",
      "Eliminar y luego informar cancelación",
      "Borrar toda la tabla",
      "Actualizar el ID a cero"
    ],
    "correct": [
      0
    ]
  },
  {
    "id": "validacion-8",
    "topic": "validacion",
    "type": "multiple",
    "seconds": 50,
    "stem": "¿Qué comportamientos son adecuados ante SQLException al guardar?",
    "code": null,
    "options": [
      "Informar un error comprensible",
      "Evitar anunciar éxito",
      "Conservar los datos del formulario cuando sea posible",
      "Ocultar el error y continuar como si guardara"
    ],
    "correct": [
      0,
      1,
      2
    ]
  },
  {
    "id": "validacion-9",
    "topic": "validacion",
    "type": "boolean",
    "seconds": 20,
    "stem": "Comprobar que una fecha obligatoria no es null antes de convertirla evita un fallo de acceso nulo.",
    "code": null,
    "options": [
      "Verdadero",
      "Falso"
    ],
    "correct": [
      0
    ]
  }
];
