# Especificación de requisitos de software — versión 2

**Proyecto:** Distribuidora de Gas El Volcán (Forma C) · DSY1104 Desarrollo Fullstack II · Evaluación Parcial 2
**Autor:** Vicente Hueichapan (trabajo individual) · **Fecha:** 18 de octubre de 2026
**Fuentes:** documento del caso Forma C (Word), catálogo Forma C (Excel), guías 10 a 16 del curso.

Este documento reemplaza la versión 2 anterior (que acumulaba avances fechados). Describe lo que la
aplicación hace hoy y separa con claridad lo que queda fuera de esta etapa.

## 1. Propósito y alcance

La distribuidora recibe entre 80 y 120 pedidos diarios por teléfono, anotados en cuadernos. Eso
provoca llamadas repetidas, duplicados, pedidos no atendidos, falta de historial por cliente,
stock sin visibilidad y cobros en efectivo sin registro (Word, sección 3).

La versión 2 es un **frontend en React** (SPA) con datos simulados en `localStorage`, como pide la
Guía 16. Queda fuera de alcance, por corresponder a la Evaluación Parcial 3: backend Spring Boot,
microservicios, API REST, base de datos, autenticación segura con token, mapa y Docker.

## 2. Actores

| Actor | Responsabilidad en la aplicación |
|---|---|
| Visitante | Consulta catálogo, categorías, destacados, blog y contacto; arma el carrito y pide sin cuenta. |
| Cliente con cuenta | Lo anterior, con entrega autocompletada, historial en Mis pedidos y seguimiento sin escribir el correo. |
| Operadora | Ve los pedidos de hoy y los pendientes anteriores; los asigna a un repartidor activo. |
| Repartidor | Ve solo sus entregas; las marca En camino y Entregado (se registra el cobro). |
| Administración | Gestiona catálogo, categorías, usuarios y stock; consulta pedidos, órdenes, reportes y su perfil. |

## 3. Requisitos funcionales

| ID | Requisito | Fuente |
|---|---|---|
| RF01 | Inicio con presentación del negocio, cilindros y zonas de despacho. | Guía 16 §3.2 |
| RF02 | Catálogo con búsqueda por nombre, código o descripción y filtro por categoría guardados en la URL. | Guía 16 §3.2, Guía 14 |
| RF03 | Detalle de cada producto con tarifa residencial o comercial y botón para agregarlo al carrito. | Guía 16 §3.2, Guía 13 |
| RF04 | Categorías con sus productos (catálogo filtrado). | Guía 16 §3.2 |
| RF05 | Destacados: productos marcados por administración, con su precio habitual. | Guía 16 §3.2 (Ofertas) |
| RF06 | Nosotros, Blog con 2 entradas y su detalle, y Contacto que registra mensajes. | Guía 16 §3.2 |
| RF07 | Registro e ingreso de clientes con validación junto a cada campo, sin `alert()`. | Guía 14, Guía 16 §3.2 |
| RF08 | Carrito persistente con líneas, cantidades, subtotales, total y tarifa; quitar, vaciar con confirmación y continuar. | Guía 16 §3.2 |
| RF09 | Confirmación con nombre, apellidos, correo, dirección y zona; se completa sola con sesión de cliente. | Guía 16 §3.2 |
| RF10 | Resultado exitoso (número, resumen, total) o con error (motivo y botón para reintentar sin perder datos). | Guía 16 §3.2 |
| RF11 | Seguimiento del estado: pendiente → asignado → en camino → entregado. | Word §0.1, Guía 16 §3.1 |
| RF12 | Mis pedidos: historial de la cuenta del cliente. | Word §3.3, Guía 16 §3.3 |
| RF13 | La operadora asigna pedidos pendientes a repartidores activos. | Word §0.2, Guía 16 §3.1 |
| RF14 | El repartidor ve solo sus entregas y avanza su estado. | Word §0.2 |
| RF15 | Al entregar se registra el cobro en efectivo del pedido. | Word §4 |
| RF16 | Al registrar un pedido se descuenta el stock de cada línea. | Word §3.2 y §4 |
| RF17 | Panel de administración con resumen de pedidos, catálogo y usuarios, y acceso a cada módulo. | Guía 16 §3.3 |
| RF18 | Pedidos recibidos con filtros y orden de pedido (comprobante interno) de cada uno. | Guía 16 §3.3 |
| RF19 | Catálogo: crear, mostrar, editar y eliminar productos; incorporar faltantes del Excel y restaurar el original. | Guía 16 §3.3, Guía 13 |
| RF20 | Productos críticos (stock ≤ 10) con reposición. | Guía 16 §3.3 |
| RF21 | Categorías: crear y editar; renombrar actualiza sus productos. | Guía 16 §3.3 |
| RF22 | Usuarios: crear, mostrar, editar y desactivar personal y clientes; asignar rol al personal. | Guía 16 §3.3, Word §0.2 |
| RF23 | Historial de pedidos de un cliente y entregas de un repartidor desde su ficha. | Guía 16 §3.3 |
| RF24 | Reportes calculados desde los pedidos: efectivo registrado, por cobrar, estados, zonas, tarifas y productos. | Guía 16 §3.3 |
| RF25 | Perfil de quien administra, con edición de su nombre. | Guía 16 §3.3 |
| RF26 | Rutas del personal protegidas por rol, también al escribir la dirección. | Word §0.2 |

## 4. Reglas de negocio

1. **Tarifa:** el precio depende del tipo de cliente (`utils/precioSegunCliente`). Guía 13.
2. **Pago:** efectivo al recibir; no hay pasarela. El cobro se registra al marcar la entrega.
3. **Stock:** no se acepta una cantidad mayor al stock. Al registrar el pedido se descuenta; si no
   se puede guardar el pedido, el stock se devuelve.
4. **Precio vigente:** antes de registrar se vuelve a validar existencia, stock y precio del catálogo.
5. **Secuencia de estados:** no se permiten saltos ni retrocesos.
6. **Repartidores:** solo perfiles activos con rol repartidor reciben pedidos. El pedido guarda su
   identificador y el nombre de ese momento.
7. **Privacidad:** un pedido solo se muestra a la cuenta que lo registró o a quien escribe su número
   y el correo usado; el correo no viaja en la URL. Word §5.
8. **Administración activa:** siempre debe quedar al menos un perfil de administración activo.
9. **Comprador ≠ personal:** el registro público no permite elegir rol ni usar un correo del personal.
10. **Categorías:** cada producto pertenece a una categoría registrada.
11. **Datos dañados:** si lo guardado no se puede leer, se informa y no se borra; solo una
    restauración explícita lo reemplaza.

## 5. Decisiones del equipo (no vienen de las fuentes)

| Decisión | Motivo |
|---|---|
| Umbral de stock crítico = 10 unidades (`utils/stockCritico.js`). | El caso y el Excel no fijan un umbral. Se cambia en un solo lugar. |
| Destacados iniciales CL002, MG004 y AC003 (`data/destacadosIniciales.js`). | El caso no define ofertas; se apoya en descripciones del Excel. Administración los cambia. |
| El carrito acepta todo el catálogo, no solo cilindros. | La Guía 16 pide botón de agregar en cada ítem y los accesorios se reparten junto al gas. |
| Contraseñas solo validadas y nunca guardadas. | La autenticación segura requiere backend (EP3); guardar claves en el navegador sería inseguro. |
| Formulario de Contacto sin restricción de dominios de correo. | La regla de EP1 (duoc.cl, gmail.com) no corresponde a clientes de una distribuidora. |
| Resultado con error dentro de la confirmación, no en otra página. | Así se reintenta sin perder lo escrito (Guía 16: "volver a intentarlo"). |
| La operadora ve hoy + pendientes anteriores. | Evita que un pedido de las 23:50 desaparezca a medianoche sin asignar. |

## 6. Requisitos no funcionales

| ID | Requisito | Cómo se cumple |
|---|---|---|
| RNF01 | Responsivo en 360, 768 y 1280 px. | Grilla de React Bootstrap; revisado en navegador sin desborde horizontal. |
| RNF02 | Accesible con teclado y lector de pantalla. | Etiquetas en todos los campos, errores asociados con `aria-describedby`, enlace "Saltar al contenido", títulos por página. |
| RNF03 | Persistencia al recargar. | Servicios con `localStorage`. |
| RNF04 | Mantenible y explicable. | Atomic Design, servicios sin React, Context como puente, reglas puras en `utils`. |
| RNF05 | Probado. | 422 pruebas con Vitest y cobertura (ver `docs/Cobertura_de_pruebas.md`). |
| RNF06 | Pocos pasos para operadora y repartidor. | Asignar es elegir y pulsar; el repartidor solo ve el siguiente paso válido. |

## 7. Datos

- **Productos:** 14 registros del Excel (CL001–CL004, RG001–RG003, MG001–MG004, AC001–AC003) con
  sus 8 campos y las dos tarifas en CLP. Las imágenes son ilustraciones propias, no del Excel.
- **Zonas:** 5 zonas del Excel con comunas, días, horario y tiempo estimado (una estimación, no una
  hora garantizada). No se agrega costo de despacho porque las fuentes no lo indican.
- **Personal:** 5 perfiles ficticios (`@ejemplo.cl`); no son datos del Excel.
- **Empresa:** datos del Word; no se inventan teléfonos ni direcciones.

## 8. Trazabilidad

| Requisitos | Archivos principales | Pruebas |
|---|---|---|
| RF02–RF04 | `pages/Catalogo.jsx`, `pages/DetalleProducto.jsx`, `pages/Categorias.jsx`, `organisms/CatalogoGas.jsx` | `Catalogo.test.jsx`, `DetalleProducto.test.jsx`, `Categorias.test.jsx` |
| RF05 | `pages/Destacados.jsx`, `services/productoService.js` | `Destacados.test.jsx`, `productoService.test.js` |
| RF06 | `pages/Blog.jsx`, `pages/DetalleBlog.jsx`, `pages/Contacto.jsx`, `services/mensajeService.js` | `Blog.test.jsx`, `Contacto.test.jsx`, `mensajeService.test.js` |
| RF07 | `organisms/FormularioRegistro.jsx`, `organisms/FormularioIngreso.jsx`, `utils/validaciones.js`, `services/clienteService.js` | `FormularioRegistro.test.jsx`, `Registro.test.jsx`, `Ingreso.test.jsx`, `validaciones.test.js` |
| RF08–RF10 | `pages/Carrito.jsx`, `pages/ConfirmarPedido.jsx`, `services/carritoService.js`, `utils/resumirCarrito.js` | `Carrito.test.jsx`, `carritoService.test.js`, `resumirCarrito.test.js` |
| RF11–RF12 | `pages/SeguimientoPedido.jsx`, `pages/MisPedidos.jsx`, `utils/puedeVerPedido.js` | `SeguimientoPedido.test.jsx`, `MisPedidos.test.jsx`, `puedeVerPedido.test.js` |
| RF13–RF16 | `services/pedidoService.js`, `pages/OperadoraPedidos.jsx`, `pages/RepartidorEntregas.jsx`, `utils/pedidosParaOperadora.js` | `pedidoService.test.js`, `OperadoraPedidos.test.jsx`, `RepartidorEntregas.test.jsx`, `App.test.jsx` |
| RF17–RF25 | `pages/PanelAdministracion.jsx` y demás páginas de administración, `services/personalService.js`, `services/categoriaService.js`, `utils/generarReporte.js` | pruebas de cada página de administración, `personalService.test.js`, `categoriaService.test.js`, `generarReporte.test.js` |
| RF26 | `routes/AccesoPorRol.jsx`, `context/SesionPersonalContext.jsx` | `AccesoPersonal.test.jsx`, `PanelAdministracion.test.jsx`, `SesionPersonalContext.test.jsx` |

## 9. Pendientes y fuera de alcance

- **EP3:** autenticación con servidor, API REST, microservicios, base de datos 3FN, mapa, Docker.
- **Requiere acción humana:** trabajo en la instancia EC2, enlace público de Drive (Guía 12),
  carga en AVA y ensayo de la presentación.
- Los datos no se sincronizan entre navegadores ni pestañas abiertas al mismo tiempo.
