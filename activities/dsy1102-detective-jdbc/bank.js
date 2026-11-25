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
  }
];
