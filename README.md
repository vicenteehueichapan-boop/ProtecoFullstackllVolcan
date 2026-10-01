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
- Recorrido público de compra separado del área del personal, con plantillas y menús distintos. El acceso del personal está en el pie de la tienda y en `/personal`. Esta separación de interfaz no constituye control de permisos.
- Componentes organizados con Atomic Design.
- Diez productos reales tomados del catálogo de la Forma C.
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

Ingreso y registro validan datos, pero todavía no crean cuentas ni autentican. Las vistas del personal permiten demostrar sus responsabilidades y no aplican permisos reales. El selector de repartidor sirve para la demostración. Los datos se conservan solo en este navegador; otro equipo tiene sus propios datos. La cantidad se valida contra el stock, aunque todavía no se reserva ni descuenta inventario al confirmar.

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
2. Selecciona Solicitar cilindro, completa el formulario, revisa el resumen y confirma.
3. Guarda el identificador, por ejemplo `PED-0001`, y consulta el seguimiento.
4. En el pie de la tienda, abre Acceso del personal → Entrar a Operadora y asigna el pedido a un repartidor.
5. En Elegir área de trabajo → Entrar a Repartidor, selecciona el mismo repartidor y marca En camino y luego Entregado.
6. Vuelve al seguimiento y recarga para comprobar que el estado persiste.
7. En el área del personal → Entrar a Administración, agrega un producto ficticio, edítalo y elimínalo. Usa Volver a la tienda para revisar los cambios en el catálogo.
8. Muestra los mensajes de error y un envío válido en ingreso y registro.

## Comprobaciones

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

## Tecnologías

- React.
- Vite.
- React Bootstrap y Bootstrap.
- React Router.
- Vitest.
- React Testing Library.
- `localStorage` como persistencia simulada de EP2.

## Datos del caso

Los productos provienen del catálogo entregado para la Forma C. El primer incremento utiliza diez registros de las cuatro categorías principales. Los precios se guardan como números y la función `precioSegunCliente` decide qué tarifa corresponde mostrar.

## Estado de las pruebas

La cantidad y los porcentajes vigentes se consultan ejecutando las comprobaciones anteriores. La cobertura incluye todo el código de `src`, por lo que también muestra pantallas que aún tienen cobertura parcial. El informe detallado queda en `coverage/index.html`, generado localmente y excluido del repositorio.

Entre los comportamientos comprobados se encuentran:

- Precio residencial.
- Precio comercial.
- Rechazo de un tipo de cliente desconocido.
- Inicialización de diez productos.
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

La entrega descrita en la Guía 13 considera repositorio público, proyecto comprimido, ERS V2 y documento de cobertura. Antes de entregar se debe contrastar esta versión con las instrucciones oficiales de EP2 y ensayar los 10 minutos de presentación y 5 de preguntas. No se deben atribuir commits a integrantes que no participaron.

## Despliegue en AWS

La instancia EC2 del equipo se utilizará como entorno remoto y posteriormente podrá publicar la compilación estática del frontend. El despliegue todavía no está realizado. Cuando se configure, el servidor deberá devolver `index.html` para rutas como `/catalogo` e `/ingreso`, de modo que React Router también funcione al actualizar directamente esas direcciones.

El archivo `deploy/nginx-gas-volcan.conf` deja preparada esa regla de navegación. No contiene direcciones privadas, usuarios ni claves.
