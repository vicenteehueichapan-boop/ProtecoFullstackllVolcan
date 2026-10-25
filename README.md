# Distribuidora de Gas El Volcán

Proyecto frontend de la **Evaluación Parcial 2** de DSY1104 Desarrollo Fullstack II (Duoc UC, 2026).
Aplicación en React que lleva a una SPA el caso trabajado en la Evaluación Parcial 1, con datos
simulados guardados en el navegador. El backend con Spring Boot y base de datos corresponde a la
Evaluación Parcial 3 y **no** forma parte de esta entrega.

## Equipo

- **Nombre:** Equipo Gas El Volcán (trabajo individual)
- **Integrante:** Vicente Hueichapan — vi.hueichapan@duocuc.cl

## Caso

Forma C: **Distribuidora de Gas El Volcán**.

Empresa familiar de Chillán (Ñuble), fundada en 1998, que reparte cilindros de gas licuado y
accesorios a clientes residenciales y comerciales. Hoy recibe entre 80 y 120 pedidos diarios por
teléfono y los anota en cuadernos. La aplicación permite pedir sin llamar y seguir el estado de la
entrega. La operadora asigna los pedidos a repartidores, el repartidor marca su avance y cobra en
efectivo, y administración mantiene catálogo, categorías, usuarios y reportes.

## Qué incluye

**Tienda (público):** Inicio, Catálogo con búsqueda y filtro por categoría, Categorías, Detalle de
producto, Destacados, Nosotros, Blog (2 entradas con detalle), Contacto, Registro e Ingreso, Carrito
persistente, Confirmación de entrega (se completa sola con sesión), resultado exitoso o con error,
Mis pedidos y Seguimiento.

**Personal:**

- Operadora: pedidos del día y pendientes anteriores; asignación a repartidores activos.
- Repartidor: solo sus entregas; marca En camino y Entregado, y se registra el cobro.
- Administración: panel, pedidos y orden de pedido, catálogo (CRUD), productos críticos con
  reposición, categorías, usuarios (personal y clientes, con historial), reportes y perfil.

Recorrido del caso: el cliente pide → pedido pendiente → la operadora asigna → el repartidor lo
marca en camino → entregado (se registra el cobro) → el cliente consulta el estado.

## Límites conocidos

- **No hay autenticación real.** Clientes y personal se identifican por su correo; la contraseña
  solo se valida (mínimo 6 caracteres) y **nunca se guarda**. Las rutas del personal se protegen por
  rol en la interfaz, no en un servidor.
- La sesión del personal vive en memoria y se pierde al recargar. La sesión del cliente guarda solo
  su identificador.
- Los datos viven en `localStorage` de cada navegador: no se comparten entre equipos.
- Sin mapa, sin API REST, sin base de datos: corresponden a la Evaluación Parcial 3.
- Umbral de stock crítico (10 unidades) y destacados iniciales son decisiones del equipo; el caso
  no los define (se justifican en la ERS versión 2).

## Estructura del proyecto

```text
src/
├── components/
│   ├── atoms/        piezas mínimas: BotonAccion, CampoEntrada, EnlaceInterno, Precio…
│   ├── molecules/    CampoFormulario, TarjetaProducto, TarjetaPedido, FiltrosCatalogo…
│   ├── organisms/    BarraNavegacion, CatalogoGas, formularios, tablas, OrdenDePedido…
│   └── templates/    PlantillaPublica, PlantillaPersonal, PlantillaAdministracion
├── pages/            una página por ruta (coordina datos y navegación)
├── routes/           AccesoPorRol (protección de rutas por rol)
├── context/          estado compartido (puente entre servicios y pantallas)
├── services/         CRUD y persistencia en localStorage (JavaScript sin React)
├── hooks/            hooks propios: useTituloPagina, useAhora y acceso a cada Context
├── utils/            reglas puras: precioSegunCliente, validaciones, generarReporte…
├── data/             datos del caso (Excel Forma C) y perfiles ficticios
├── estilos/          CSS propio (se importa después de Bootstrap)
├── tests/            ayudantes comunes de las pruebas
├── App.jsx           mapa de rutas y proveedores de contexto
└── setupTests.js     configuración de Vitest (jest-dom y limpieza)
```

Cada archivo de prueba vive junto al código que prueba (`Nombre.test.jsx`). Solo páginas y
plantillas usan el router; átomos, moléculas y organismos reciben `alNavegar` por props.

## Tecnologías

React 19, Vite 8, React Bootstrap 2 y Bootstrap 5, React Router 7, Vitest 5, Testing Library
(react, jest-dom, user-event), jsdom y oxlint. Versiones exactas en `package-lock.json`.

## Cómo ejecutar el proyecto

Requiere Node.js 22.12 o superior.

```bash
npm ci
```

```bash
npm run dev
```

Abre la dirección que muestra la terminal (por defecto `http://localhost:5173`). Abrir
`index.html` con doble clic no funciona: Vite debe servir la aplicación.

## Comprobaciones

```bash
npm run test:run
```

```bash
npm run test:cov
```

```bash
npm run lint
```

```bash
npm run build
```

`npm test` deja las pruebas en modo vigilante mientras se desarrolla.
En equipos con poca memoria se puede agregar `-- --maxWorkers=1 --no-file-parallelism`.

## Demostración rápida

Perfiles ficticios del personal (la contraseña es cualquier texto ficticio de 6 o más caracteres):
`administracion@ejemplo.cl`, `operadora@ejemplo.cl`, `repartidor1@ejemplo.cl`,
`repartidor2@ejemplo.cl` y `repartidor3@ejemplo.cl`.

1. Regístrate con datos ficticios, agrega un cilindro y un accesorio al carrito y confirma: la
   entrega se completa con tu cuenta. El stock baja.
2. En el pie, **Acceso del personal** → operadora → asigna el pedido.
3. Cierra sesión del personal → repartidor asignado → En camino → Entregado.
4. Vuelve a **Mis pedidos** y abre el seguimiento: el pedido aparece entregado.
5. Ingresa como administración: revisa el panel, la orden de pedido con el cobro registrado,
   los reportes, repone un producto crítico y crea un repartidor nuevo (aparece en la asignación).

## Evidencias responsivas

Capturas del ingreso en los tres anchos de la Guía 12: `docs/evidencias/ingreso-375.png`,
`docs/evidencias/ingreso-768.png` y `docs/evidencias/ingreso-1280.png`.

## Material complementario

La ERS versión 2 y el informe de pruebas unitarias y cobertura se entregan en Blackboard junto con
el proyecto comprimido.

## Despliegue en AWS

`deploy/nginx-gas-volcan.conf` es la configuración de nginx para servir la compilación (`dist/`) en
una instancia EC2 y que las rutas de React Router funcionen al recargar la página.

## Bitácora

Trabajo individual: todas las tareas son de Vicente Hueichapan.

**Cuentas que aparecen en el historial.** Las tres corresponden a la misma persona:

| Autor en GitHub | Correo | Uso |
|---|---|---|
| `Vicente Hueichapan` | vi.hueichapan@duocuc.cl | Commits de desarrollo desde el equipo personal |
| `vicenteehueichapan-boop` | correo personal de Gmail | Cuenta de GitHub dueña del repositorio (creó el repositorio) |
| `perropa` | el mismo correo personal | Nombre con que quedan las fusiones de solicitudes hechas desde GitHub (14/10 y 24/10) |

| Fecha | Tarea |
|---|---|
| 30/09 | Crea el proyecto React + Vite, la navegación, el catálogo inicial, React Bootstrap, el ingreso, productos y pedidos con persistencia y sus primeras pruebas. |
| 01/10 | Corrige la asignación de repartidores y separa la tienda del área de trabajo del personal. |
| 07/10 | Revisa la estructura de Atomic Design en Inicio y Catálogo y prueba sus componentes. |
| 14/10 | Guía 14: reglas de validación separadas, hook `useTituloPagina` y corrección del seguimiento. Carrito persistente con tarifas y confirmación de varios cilindros. Catálogo completo del Excel y acceso del personal por rol. Tres solicitudes de incorporación fusionadas en `main`. |
| 16/10 | Persistencia segura ante datos dañados; cuentas de cliente, Mis pedidos y seguimiento privado; navegación por props en los componentes; Blog, Nosotros, Contacto y Destacados; descuento de stock y registro del cobro; categorías registradas; panel de administración completo; pruebas de todos los niveles de Atomic Design. |
| 18/10 | README y documentación ordenados; formulario de productos con validación por campo e imagen por categoría; mapa de rutas en `App.jsx`; `setupTests.js` y scripts de la Guía 15; capturas responsivas actualizadas. |
| 24/10 | Bitácora en el README. Incorporación a `main` de las siete ramas de trabajo mediante solicitudes de incorporación. |

**Contingencias:** desde el 16/10 el trabajo avanzó en siete ramas encadenadas (`persistencia-segura`
→ `sesion-cliente` → `navegacion-por-props` → `carrito-catalogo-completo` → `vistas-informativas` →
`panel-administracion` → `pulido-y-pruebas`), que se incorporan a `main` en ese orden.
