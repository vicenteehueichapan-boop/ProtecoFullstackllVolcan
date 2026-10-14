# Distribuidora de Gas El Volcán

Proyecto frontend de la Evaluación Parcial 2 de **DSY1104 Desarrollo Fullstack II**. La aplicación reconstruye en React el caso trabajado durante la Evaluación Parcial 1 y utiliza datos simulados dentro del navegador.

## Equipo

**Nombre:** Equipo Gas El Volcán  
**Modalidad actual:** trabajo individual

### Integrante

- Vicente Hueichapan — vi.hueichapan@duocuc.cl

## Caso

Distribuidora de Gas El Volcán entrega cilindros y accesorios a clientes residenciales y comerciales de Chillán y comunas cercanas. La aplicación permitirá consultar el catálogo, solicitar pedidos y revisar su avance. El personal podrá organizar despachos y mantener la información del catálogo desde vistas adaptadas a sus responsabilidades.

## Alcance actual

La aplicación incluye:

- Proyecto creado con Vite y React.
- Diseño adaptable mediante React Bootstrap.
- Estilos externos compartidos, portada renovada y controles cómodos en móvil, sin incorporar otra biblioteca de interfaz.
- Navegación entre Inicio, Catálogo, Categorías, Detalle, Registro, Ingreso y los recorridos de pedidos y administración.
- Recorrido público de compra separado del área del personal, con plantillas y menús distintos. El acceso del personal está en el pie de la tienda y en `/personal`. Las rutas exigen un perfil de demostración del personal y verifican su rol; no es autenticación real de servidor.
- Componentes organizados con Atomic Design.
- Los catorce productos del Excel Forma C, con sus códigos, nombres, descripciones, categorías, unidades, tarifas y existencias iniciales.
- Tarifas residenciales y comerciales.
- Estado compartido mediante Context.
- Lectura inicial de productos desde un servicio con `localStorage`.
- Pantalla de ingreso construida con dos átomos, una molécula y un organismo.
- CRUD de productos: listar, crear, editar, eliminar y restaurar el catálogo.
- Pedido de cilindros con dirección, zona, cantidad, resumen, confirmación, éxito y error.
- Seguimiento por identificador, asignación desde operadora y actualización desde repartidor.
- Estados ordenados: pendiente → asignado → en camino → entregado.
- Asignación validada contra los tres repartidores de demostración; una selección inválida no modifica el pedido guardado.
- Pruebas unitarias y de comportamiento con Vitest y Testing Library.
- Carrito persistente de varios cilindros: agregar, cambiar cantidades, quitar, vaciar con confirmación y seleccionar tarifa.
- Confirmación del carrito con nombre, apellidos, correo, dirección y zona, seguida de resumen y registro del pedido.

Ingreso y registro de compradores validan datos, pero todavía no crean cuentas ni autentican. Acceso del personal usa una sesión de demostración en memoria: identifica un correo ficticio, valida el formato del formulario y limita rutas por rol. No verifica contraseñas ni identidad. Al recargar o salir se pierde la sesión. El repartidor ve únicamente los pedidos del perfil activo, sin selector de otros repartidores. Los datos se conservan solo en este navegador; otro equipo tiene sus propios datos. La cantidad se valida contra el stock, aunque todavía no se reserva ni descuenta inventario al confirmar.

Spring Boot, microservicios, base de datos y Docker corresponden a la Evaluación Parcial 3. El frontend puede publicarse como sitio estático en EC2; ese despliegue sigue pendiente.

## Requisitos

- Node.js 22.12 o superior.
- npm incluido con Node.js.

## Instalación

Después de descargar o clonar el repositorio, abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm ci
```

## Ejecución

```bash
npm run dev
```

La terminal mostrará una dirección local. Ábrela en el navegador para recorrer la aplicación.

Esta versión React utiliza Vite: abrir `index.html` con doble clic no ejecuta el proyecto correctamente. Para comprobar la compilación de publicación, ejecuta `npm run build` y después `npm run preview`.

## Demostración práctica

1. Busca un producto en Catálogo, cambia la tarifa y abre el detalle de un cilindro.
2. Selecciona Agregar al carrito. Agrega otro cilindro si lo necesitas, ajusta cantidades y tarifa, y recarga para comprobar la persistencia. Continúa con la entrega, completa nombre, apellidos, correo, dirección y zona, revisa todas las líneas y confirma.
3. Guarda el identificador, por ejemplo `PED-0001`, y consulta el seguimiento.
4. En el pie, abre Acceso del personal. Usa operadora@ejemplo.cl y un texto ficticio de al menos seis caracteres en Contraseña. Solo se valida su formato, no se verifica como credencial. Entra a Operadora y asigna el pedido a un repartidor.
5. En Mi área de trabajo, cierra la sesión del personal. Ingresa con repartidor1@ejemplo.cl (o repartidor2/repartidor3, según la asignación), entra a Repartidor y marca En camino y luego Entregado. No podrá consultar entregas de los otros perfiles desde esta vista.
6. Vuelve al seguimiento y recarga para comprobar que el estado persiste.
7. Cierra la sesión anterior y entra con administracion@ejemplo.cl. En Administración, agrega un producto ficticio, edítalo y elimínalo. Usa Volver a la tienda para revisar los cambios en el catálogo.
8. Muestra los mensajes de error y un envío válido en ingreso y registro.

## Comprobaciones

También están disponibles los nombres de comandos usados en las guías 15 y 16:

```bash
npm run test:run
npm run test:cov
```

Son equivalentes a `npm test` y `npm run test:coverage`. Para limitar memoria se puede añadir `-- --maxWorkers=1 --no-file-parallelism`; esto conserva el aislamiento entre archivos.

Ejecutar las pruebas unitarias:

```bash
npm test
```

Generar el informe de cobertura:

```bash
npm run test:coverage
```

Revisar el código:

```bash
npm run lint
```

Comprobar que la aplicación puede compilarse:

```bash
npm run build
```

## Organización principal

```text
src/
├── assets/       Recursos gráficos del caso
├── components/   Átomos, moléculas, organismos y plantillas
├── context/      Estado compartido de productos y pedidos
├── data/         Catálogo, zonas y repartidores de demostración
├── hooks/        Acceso reutilizable al estado compartido
├── pages/        Páginas asociadas a las rutas
├── routes/       Navegación de la aplicación
├── services/     Acceso y persistencia de datos
├── tests/        Configuración común de pruebas
└── utils/        Reglas y funciones reutilizables
```

Las páginas coordinan la vista. Los componentes presentan la información. El Context comparte el estado. Los servicios se ocupan de los datos y `localStorage`. Las funciones de `utils` contienen reglas que no dependen de React.

### Composición comprobada en Inicio y Catálogo

```text
PlantillaPublica → Outlet → Inicio o Catalogo
Inicio → CoberturaDespacho (organismo) → TarjetaZona (molécula)
Inicio y Catalogo → CatalogoGas (organismo) → TarjetaProducto (molécula)
TarjetaProducto → Precio y BotonAccion (átomos)
```

Inicio selecciona los cilindros y entrega las zonas mediante props; CoberturaDespacho no consulta servicios. Catálogo mantiene la tarifa seleccionada y coordina los filtros; sus funciones buscarProducto y cambiarCategoria reciben los valores de FiltrosCatalogo. Las listas utilizan identificadores estables como claves, no posiciones.

La sintaxis `({ producto, tipoCliente })` desestructura el objeto de props: no representa desorden ni elimina la jerarquía. En BotonAccion, `children` identifica el contenido entre las etiquetas y `...propiedades` permite entregar al control sus eventos, ruta y atributos accesibles. Las etiquetas HTML y los controles de Bootstrap no necesitan un componente propio para cada elemento.

### Trabajo con ramas

Aunque el trabajo es individual, los cambios se preparan en una rama, se revisan con pruebas y se incorporan a main mediante una combinación de ramas o solicitud de incorporación, según la Guía 13. No se reconstruye ni se cambia el historial anterior para simular esa práctica.

### Límites de esta auditoría

Revisión del 7 de octubre de 2026 contra las guías 10–13 recibidas. El flujo de desarrollo remoto en EC2 solicitado por la Guía 10 aún no está acreditado; preparar Nginx no demuestra ese trabajo. También falta el enlace público real de Drive solicitado por la Guía 12 y contrastar la entrega con la pauta oficial EP2 cuando esté disponible. No se declara ausencia total de deuda técnica ni cumplimiento de instrucciones no recibidas.

### Incremento del 14 de octubre: hooks, validación y seguimiento

Se recibieron las guías 14, 15 y 16. La referencia anterior a instrucciones EP2 no recibidas describe la revisión histórica del 7 de octubre, no el estado actual.

- `utils/validaciones.js` reúne reglas puras de ingreso y registro: no modifica estado, no navega y no accede al almacenamiento. Ambos formularios requieren una contraseña de al menos seis caracteres.
- CampoFormulario presenta valor, cambios y error. FormularioIngreso conserva el estado, valida todos los campos y solo llama a alIngresar si son válidos; Ingreso decide qué mostrar después. Todavía no existe autenticación ni sesión simulada.
- `useTituloPagina` usa useEffect para sincronizar la pestaña con el título recibido. Se llama sin condiciones en Inicio y Catálogo; su dependencia es titulo y su limpieza restaura el valor anterior.
- BuscadorPedido es una molécula sin dependencias de React Router. Su estado contiene el texto escrito y alBuscar avisa a la página. SeguimientoPedido lee useParams y navega con useNavigate. Su key cambia con el identificador de la ruta para reiniciar solo el buscador al volver o avanzar en el historial.
- Las pruebas verifican reglas, límites, callback válido/inválido, actualización y limpieza del hook, y navegación atrás/adelante entre dos pedidos.

Un campo controlado recibe value y onChange. preventDefault cancela el envío HTML que recargaría la página; los errores viven en un objeto de estado y CampoFormulario usa isInvalid y retroalimentación junto al campo. useState devuelve el valor actual y una función para actualizarlo. Un efecto con dependencias se repite cuando estas cambian; con [] se configura al montar, y sin arreglo se ejecuta tras cada renderizado. Los hooks se llaman en el nivel superior de componentes u otros hooks, no dentro de condiciones ni manejadores.

Fuentes para estudiar: [campos controlados](https://react.dev/reference/react-dom/components/input), [hooks propios](https://react.dev/learn/reusing-logic-with-custom-hooks), [useEffect](https://react.dev/reference/react/useEffect), [validación con React Bootstrap](https://react-bootstrap.github.io/docs/forms/validation/) y [useNavigate](https://reactrouter.com/api/hooks/useNavigate).

En el primer incremento del 14 de octubre todavía faltaban carrito persistente y datos de confirmación. El incremento siguiente, descrito abajo, los incorpora. Siguen pendientes sesión simulada para autocompletar, vistas informativas y ofertas, y módulos administrativos adicionales de la Guía 16. También falta revisar la dependencia directa de Link en otros componentes de presentación frente a la separación de navegación enseñada en la Guía 14. No se incorporó backend, almacenamiento de contraseñas ni una API ficticia para imitar ejemplos.

### Carrito y confirmación: segundo incremento del 14 de octubre

El recorrido principal es Detalle → Carrito → Datos de entrega → Resumen → Pedido confirmado → Seguimiento. Inicio, menú y pie conducen al carrito; el detalle tiene una sola acción de solicitud, Agregar al carrito. La ruta anterior /nuevo-pedido continúa accesible para compatibilidad, pero no se ofrece desde la tienda. Su retirada o migración definitiva sigue pendiente; no se cuenta como la confirmación completa exigida por la Guía 16.

```text
Carrito (página) → ListaCarrito (organismo) → LineaCarrito (molécula)
LineaCarrito → BotonAccion (átomo)
ConfirmarPedido (página) → FormularioEntrega (organismo) → CampoFormulario (molécula)
Páginas → useCarrito → CarritoProvider → carritoService → localStorage
```

El carrito guarda códigos, cantidades y tarifa. Los precios y subtotales se derivan del catálogo actual mediante resumirCarrito; al revisar se conserva una instantánea del importe que el servicio de pedidos vuelve a verificar antes de registrar. Cambiar el catálogo no modifica importes de pedidos confirmados.

- Las cantidades deben ser enteros positivos y no superar el stock.
- Si un cilindro desaparece o queda sin disponibilidad, la línea se conserva para corregirla; no se confirma un carrito inválido.
- Un carrito malformado no se sobrescribe automáticamente: se muestra el problema y la persona puede vaciarlo con confirmación.
- El Context solo actualiza las líneas después de una escritura válida; un fallo no se presenta como éxito.
- Si falla el registro, se conservan selección y datos del formulario. Si el pedido se guarda pero falla el vaciado, se muestra éxito con advertencia para evitar reenviarlo por error.
- El resumen muestra todas las líneas y subtotales, no solo el primer producto.

Solo se persiste la selección y tarifa del carrito. Los datos personales del formulario no se recuperan tras cerrar o recargar la confirmación. No existe sincronización automática entre pestañas o dispositivos, ni reserva/descuento de stock. La sesión simulada y el autocompletado siguen pendientes. Usa datos ficticios.

La auditoría local exige pruebas, análisis estático, compilación y revisión del diff antes de incorporar. La habilidad auditar-gas-volcan-ep2 orienta la revisión técnica; no es un proceso en segundo plano ni sustituye las comprobaciones. La documentación académica registra qué se revisó y qué sigue pendiente.

## Tecnologías

- React.
- Vite.
- React Bootstrap y Bootstrap.
- React Router.
- Vitest.
- React Testing Library.
- `localStorage` como persistencia simulada de EP2.

## Datos del caso

Los productos provienen del catálogo entregado para la Forma C. El catálogo inicial contiene los catorce registros de Productos y Tarifas!A4:H17. Las cinco zonas proceden de la segunda hoja. El Excel no se modifica ni se interpreta como información de usuarios o credenciales: esos datos no están en el archivo. Las imágenes son ilustraciones locales, no fotografías entregadas en el catálogo.

Si el navegador conserva la versión antigua de diez productos, Administración ofrece Incorporar faltantes del Excel. Con confirmación añade los códigos ausentes sin reemplazar productos editados o propios. También reincorpora productos del caso eliminados anteriormente; la advertencia lo explica. Restaurar catálogo es diferente: reemplaza todos los datos por el original y también requiere confirmación. Los precios se guardan como números y la función `precioSegunCliente` decide qué tarifa corresponde mostrar.

## Estado de las pruebas

La cantidad y los porcentajes vigentes se consultan ejecutando las comprobaciones anteriores. La cobertura incluye todo el código de `src`, por lo que también muestra pantallas que aún tienen cobertura parcial. El informe detallado queda en `coverage/index.html`, generado localmente y excluido del repositorio.

Entre los comportamientos comprobados se encuentran:

- Precio residencial.
- Precio comercial.
- Rechazo de un tipo de cliente desconocido.
- Inicialización de catorce productos y comparación de códigos, tarifas y stock contra una transcripción independiente del Excel.
- Recuperación de los productos almacenados.
- Restauración del catálogo cuando el almacenamiento contiene una estructura incorrecta.
- Presentación de datos y tarifas en la tarjeta de producto.
- Mensajes de validación del formulario de ingreso.
- Entrega de los datos cuando el formulario es válido.

También se comprueban el CRUD, los códigos duplicados, la secuencia de estados, los Context, el registro y las cancelaciones de eliminación/restauración. La cantidad mínima de diez pruebas de la ruta ya fue alcanzada. Una suite aprobada no sustituye revisar manualmente los recorridos ni garantiza cobertura total.

## Evidencias de responsividad

Se midieron 14 rutas a 360, 375, 768 y 1280 píxeles: 56 comprobaciones sin desbordamiento horizontal. Se inspeccionaron además capturas de Inicio, Catálogo y Pedido, y se comprobó el menú móvil. Esta revisión no certifica accesibilidad completa.

Las capturas del ingreso en los tres anchos solicitados por la Guía 12 se conservan en:

- `docs/evidencias/ingreso-375.png` — teléfono.
- `docs/evidencias/ingreso-768.png` — tableta.
- `docs/evidencias/ingreso-1280.png` — escritorio.

## Material complementario

El código vive únicamente en GitHub. El enlace público de Google Drive para la ERS V2 y los demás documentos académicos se incorporará cuando la carpeta del equipo esté disponible.

La entrega descrita en la Guía 13 considera repositorio público, proyecto comprimido, ERS V2 y documento de cobertura. Antes de entregar se debe contrastar esta versión con las instrucciones oficiales de EP2 y ensayar los 15 minutos de presentación y 5 de preguntas de la Guía 16. No se deben atribuir commits a integrantes que no participaron.

## Despliegue en AWS

La instancia EC2 del equipo se utilizará como entorno remoto y posteriormente podrá publicar la compilación estática del frontend. El despliegue todavía no está realizado. Cuando se configure, el servidor deberá devolver `index.html` para rutas como `/catalogo` e `/ingreso`, de modo que React Router también funcione al actualizar directamente esas direcciones.

El archivo `deploy/nginx-gas-volcan.conf` deja preparada esa regla de navegación. No contiene direcciones privadas, usuarios ni claves.

### Catálogo y acceso del personal: tercer incremento del 14 de octubre

El catálogo inicial se completó con los catorce registros del Excel. No se importan usuarios, teléfonos ni credenciales desde el libro: no contiene esas hojas. El registro inicial se mantiene en data, los servicios gestionan el CRUD, Context comparte los cambios y las páginas coordinan las acciones.

Acceso del personal identifica perfiles ficticios por correo. La contraseña solo valida el formato del formulario y no verifica identidad. Usa texto inventado, nunca una contraseña real. No se guardan contraseñas ni la sesión en localStorage. AccesoPorRol exige sesión y rol en las rutas existentes; una sesión de operadora no abre administración, y cada repartidor ve su propia asignación. La sesión se pierde al recargar. Los correos de demostración se muestran en esa pantalla para poder defender cada recorrido.

Los apartados anteriores identificados como primer o segundo incremento describen sus estados históricos. El selector de repartidor ya fue retirado. La sesión de compradores y autocompletado siguen pendientes, al igual que las vistas informativas/destacados, los módulos administrativos adicionales de la Guía 16 y el cierre de EC2 y entregables. No se declara EP2 terminada. El carrito continúa limitado a cilindros: agregar otros artículos del catálogo está pendiente de resolver frente a la Guía 16.

La revisión agregó 13 casos y conservó los anteriores: 151 pruebas en 28 archivos con cobertura, análisis estático y compilación aprobados. La cobertura no acredita ausencia de errores. Se comprobaron catálogo y personal en tres anchos y se revisaron capturas; no es una auditoría completa de accesibilidad o seguridad.
