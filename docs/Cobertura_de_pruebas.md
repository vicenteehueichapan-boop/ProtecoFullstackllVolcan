# Documento de cobertura del testing

**Proyecto:** Distribuidora de Gas El Volcán · Evaluación Parcial 2 · Vicente Hueichapan
**Fecha de la medición:** 16 de octubre de 2026 · rama `pulido-y-pruebas`

Contenido pedido por la Guía 15 (sección 8) y la Guía 16 (sección 5): herramientas y versiones,
comando, captura del reporte, tabla de qué se probó y lo que no se probó y por qué.

## 1. Herramientas y versiones

Versiones instaladas según `package-lock.json`. Se instalaron con `npm install -D` (Guía 15, §4.1)
y se reproducen con `npm ci`.

| Herramienta | Versión | Para qué |
|---|---|---|
| Vitest | 5.0.3 | Corredor de pruebas; `describe`, `it`, `expect`, `vi`. |
| @vitest/coverage-v8 | 5.0.3 | Reporte de cobertura. |
| jsdom | 30.1.1 | Simula el navegador dentro de la terminal. |
| @testing-library/react | 16.3.3 | `render`, `screen`, `renderHook`. |
| @testing-library/jest-dom | 7.0.1 | Aserciones del DOM (`toBeInTheDocument`, `toHaveAccessibleDescription`…). |
| @testing-library/user-event | 14.6.7 | Simula clics y escritura de una persona. |
| Node.js / npm | 24.19.0 / 11.17.0 | Entorno de ejecución usado en la medición. |

Configuración (`vite.config.js`, bloque `test`): `environment: 'jsdom'`, `setupFiles:
'./src/tests/configuracion.js'` (carga jest-dom) y cobertura `v8` sobre todo `src`, excluyendo los
archivos de prueba, los ayudantes de `src/tests` y `src/main.jsx` (solo monta la aplicación).

## 2. Comando

```bash
npm run test:cov -- --maxWorkers=1 --no-file-parallelism
```

`test:cov` ejecuta `vitest run --coverage`. Las opciones limitan el uso de memoria sin quitar el
aislamiento entre archivos.

## 3. Resultado

```text
 Test Files  105 passed (105)
      Tests  422 passed (422)

=============================== Coverage summary ===============================
Statements   : 96.4% ( 1581/1640 )
Branches     : 91.92% ( 842/916 )
Functions    : 97.08% ( 532/548 )
Lines        : 97.1% ( 1375/1416 )
================================================================================
```

La salida completa de la terminal, sin editar, está en `docs/evidencias/cobertura-terminal.txt`.
**Captura de pantalla:** se toma de la terminal al ejecutar el comando anterior (ver la Guía de
defensa); el reporte HTML queda en `coverage/index.html` como apoyo y no se sube a GitHub.

Cobertura por carpeta:

| Carpeta | Sentencias | Ramas | Funciones | Líneas |
|---|---|---|---|---|
| components/atoms | 100 % | 100 % | 100 % | 100 % |
| components/molecules | 97,91 % | 96,77 % | 96,42 % | 97,72 % |
| components/organisms | 94,81 % | 94,26 % | 95,49 % | 96,89 % |
| components/templates | 88,88 % | 100 % | 80 % | 88,88 % |
| context | 99,35 % | 91,66 % | 98,11 % | 100 % |
| hooks | 94,59 % | 84,61 % | 100 % | 96,66 % |
| pages | 94,91 % | 86,14 % | 95,07 % | 95,35 % |
| services | 96,66 % | 91,83 % | 99,32 % | 97,34 % |
| utils | 99,34 % | 99,13 % | 100 % | 100 % |

## 4. Tipos de prueba (clasificación honesta)

Según la Guía 15, una prueba **unitaria** revisa una unidad aislada y una de **integración**
comprueba piezas reales trabajando juntas (por ejemplo, un servicio con `localStorage` real).

| Tipo | Carpetas | Casos |
|---|---|---|
| Unitarias | `utils` (69), componentes (91: átomos 15, moléculas 24, organismos 52), `hooks` (5), `data` (11) | **176** |
| Integración | `services` con `localStorage` real (128), `context` (25), `pages` (91), `App` (2) | **246** |
| **Total** | | **422** |

La rúbrica cuenta 10 pruebas unitarias bien hechas. Estas son las 10 elegidas para explicar en la
presentación (detalle en la Guía de defensa):

| # | Archivo | Qué verifica |
|---|---|---|
| 1 | `utils/precioSegunCliente.test.js` | Tarifa residencial, comercial y error con tipo desconocido. |
| 2 | `utils/resumirCarrito.test.js` | Subtotales y total por línea, también con accesorios. |
| 3 | `utils/validaciones.test.js` | Reglas de registro: informa todos los errores a la vez. |
| 4 | `utils/puedeVerPedido.test.js` | Privacidad: dueño o correo correcto ven el pedido; otros no. |
| 5 | `utils/pedidosParaOperadora.test.js` | Un pendiente de anoche sigue visible después de medianoche. |
| 6 | `utils/generarReporte.test.js` | Separa efectivo cobrado de lo pendiente y suma por producto. |
| 7 | `components/organisms/FormularioRegistro.test.jsx` | Errores junto al campo; el callback (mock `vi.fn`) solo se llama con datos válidos. |
| 8 | `components/atoms/EnlaceInterno.test.jsx` | Navega sin recargar en clic simple y respeta Ctrl + clic. |
| 9 | `components/organisms/ListaEntregas.test.jsx` | Muestra todas las líneas y solo el siguiente paso válido. |
| 10 | `hooks/useAhora.test.js` | Hook con `beforeEach`/`afterEach`, reloj simulado y limpieza del temporizador. |

## 5. Qué se probó (por unidad)

| Unidad | Casos | Comportamientos |
|---|---|---|
| `services/productoService` | 28 | CRUD, códigos duplicados, categorías existentes, destacados y su migración, stock por líneas, datos dañados. |
| `services/pedidoService` | 43 | Validación de datos y totales, catálogo vigente, stock con reversión, secuencia de estados, repartidores activos, cobro, datos dañados. |
| `services/carritoService` | 17 | Cantidades válidas, stock, todo el catálogo, carrito dañado conservado. |
| `services/clienteService` | 20 | Registro sin contraseña, duplicados, correos reservados, activación, sesión, errores por campo. |
| `services/personalService` | 10 | Alta, edición, administración activa obligatoria, perfiles inactivos. |
| `services/categoriaService` | 7 | Crear, editar, nombres únicos, incorporación y restauración. |
| `services/mensajeService` | 3 | Registro de mensajes y datos dañados. |
| `utils/*` | 69 | Reglas puras listadas arriba y validaciones de formularios. |
| `data/*` | 11 | 14 productos y 5 zonas contra valores copiados a mano del Excel; blog. |
| Componentes | 91 | Props, estado propio, callbacks con `vi.fn`, accesibilidad de errores. |
| Context | 25 | Puente servicio-estado, errores sin cerrar la app, sesiones derivadas. |
| Páginas e integración | 93 | Recorrido completo cliente → operadora → repartidor → seguimiento, administración, privacidad, rutas protegidas. |

Los números por archivo se obtienen con `npx vitest run --reporter=verbose`.

## 6. Lo que no se probó y por qué

| Elemento | Motivo |
|---|---|
| `src/main.jsx` | Solo monta `App` en el `div#root`; excluido de la cobertura. `App` sí se prueba. |
| Archivos `data/*` sin lógica (empresa, perfiles, destacados iniciales) | Son datos (Guía 15: "datos, no necesita prueba propia"); se usan en pruebas de servicios y páginas. |
| Archivos base de Context (`createContext`) | Una línea; se prueban a través de su hook, incluido el error sin proveedor. |
| Ramas restantes en páginas y plantillas (por ejemplo el botón de cerrar sesión de la plantilla del personal) | Se recorren en el navegador; no se agregaron pruebas solo para subir el porcentaje. |
| Navegación real, estilos, diseño responsivo y foco | jsdom no dibuja la página. Se revisaron en el navegador a 360, 768 y 1280 px (sin desborde, un `h1` por página, imágenes con `alt`). |
| Varias pestañas abiertas a la vez | No hay sincronización entre pestañas en EP2. |
| Seguridad real de autenticación | No existe en EP2 (corresponde al backend de EP3). |

**El 100 % no significa "sin errores"** (Guía 15): significa que cada línea se ejecutó. Por eso cada
caso tiene un nombre que describe el comportamiento y aserciones sobre datos, mensajes y llamadas.
