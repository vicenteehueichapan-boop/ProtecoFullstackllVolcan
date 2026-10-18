# Guía de defensa — Evaluación Parcial 2

Material de estudio personal (no es un entregable que pida el profesor). La presentación pesa
60 % del parcial: se evalúa que **expliques** la arquitectura, los componentes y las pruebas, no
solo que la aplicación funcione (Guía 16, §4). Si no sabes algo, dilo y explica cómo lo
averiguarías.

Duración según la Guía 16: **15 minutos + 5 de preguntas** (tus notas dicen 10 + 5; confírmalo con
el docente y ensaya con el tiempo más corto).

## 0. Antes de entrar

```bash
npm ci
```

```bash
npm run test:run
```

```bash
npm run dev
```

- Ten abiertos en VS Code: `src/App.jsx`, `src/routes/RutasAplicacion.jsx`,
  `src/components/organisms/FormularioRegistro.jsx`, `src/services/pedidoService.js`,
  `src/utils/precioSegunCliente.test.js` y `vite.config.js`.
- Ten GitHub abierto en la lista de commits y en las solicitudes de incorporación.
- Navegador con herramientas de desarrollo (F12, `Ctrl + Shift + M`) para mostrar 375/768/1280 px.
- Datos limpios: en la consola del navegador, `localStorage.clear()` y recarga.

## 1. Guion de 15 minutos

| Minutos | Qué mostrar | Indicador |
|---|---|---|
| 0–2 | El caso: llamadas y cuadernos → pedidos en línea con seguimiento. Recorrido cliente → operadora → repartidor. | IE2.1.3 |
| 2–5 | Demostración: registro, carrito con cilindro y regulador, confirmación autocompletada, operadora asigna, repartidor entrega, Mis pedidos. | IE2.1.1 |
| 5–8 | Estructura: Atomic Design, `services` → `context` → `pages`, rutas por rol. | IE2.1.3 |
| 8–11 | Un componente con props, estado y callback (`FormularioRegistro`); Bootstrap responsivo en vivo. | IE2.1.4 |
| 11–13 | Pruebas: un archivo unitario, un mock, ejecución con Vitest y la prueba que falla a propósito. | IE2.2.2 |
| 13–15 | Proceso de testeo: configuración, `beforeEach`/`afterEach`, cobertura y lo que no se probó. | IE2.3.2 |

## 2. Diseño del proyecto (IE2.1.3)

**¿Cómo organizaste las carpetas?** Cada carpeta tiene una responsabilidad (Guía 13):

- `components/atoms` → `molecules` → `organisms` → `templates`: interfaz por nivel de Atomic Design.
- `pages`: una por ruta; coordina datos y navegación.
- `services`: CRUD y `localStorage`, en JavaScript sin React. Por eso se prueban solos.
- `context`: el puente. Guarda la lista en el estado de React y llama al servicio.
- `utils`: reglas pequeñas y puras (`precioSegunCliente`, `validaciones`, `generarReporte`).
- `data`: datos del Excel.

Ejemplo para mostrar, de abajo hacia arriba: `atoms/Precio` → `molecules/TarjetaProducto` →
`organisms/CatalogoGas` → `templates/PlantillaPublica` → `pages/Catalogo`.

**¿Cómo compartes el estado entre componentes?** Con Context. Abre `context/CarritoContext.jsx`:
`CarritoProvider` guarda el carrito con `useState`; cada acción llama a `carritoService` (que guarda
en `localStorage`) y luego actualiza el estado. Cualquier página usa `useCarrito()`. Lo mismo
ocurre con productos, pedidos, usuarios y las dos sesiones.

**Componente funcional vs. de clase:** aquí todos son funciones que devuelven JSX y usan hooks
(`useState`, `useEffect`). Un componente de clase usaba `this.state`, `setState` y métodos de ciclo
de vida (`componentDidMount`…). Con funciones, eso se reemplaza por hooks y el código queda más corto.

**Decisiones propias que puedes defender:** el carrito acepta todo el catálogo; la contraseña nunca
se guarda; el stock crítico es 10; los destacados no inventan descuentos; los datos dañados no se
borran. Todas están explicadas en `docs/ERS_V2.md`, sección 5.

## 3. Componentes, props, estado y Bootstrap (IE2.1.4)

Abre `components/organisms/FormularioRegistro.jsx` (Guía 14):

- **Estado:** `const [datos, setDatos] = useState(datosVacios)` guarda lo escrito y
  `const [errores, setErrores] = useState({})` guarda un mensaje por campo.
- **Campo controlado:** cada `CampoFormulario` recibe `value` y `onChange`; la caja muestra lo que
  dice el estado.
- **Props:** recibe `alRegistrar` desde la página. El formulario no sabe qué pasa después: solo
  avisa con datos válidos. La página `pages/Registro.jsx` decide guardar y navegar.
- **Validación pura:** `utils/validaciones.js` no toca pantalla ni estado.
- **Errores junto al campo, sin `alert()`:** `CampoFormulario` usa `isInvalid` y `aria-describedby`.
- Si el servicio rechaza un dato (correo repetido), la página devuelve `{ correo: mensaje }` y el
  formulario lo muestra junto a ese campo.

Muestra cómo cambia el estado: escribe un correo inválido, pulsa Registrarme y corrígelo; el
mensaje desaparece mientras escribes.

**Navegación (Guía 14):** solo páginas y plantillas usan el router. Abre `atoms/EnlaceInterno.jsx`:
un `<a href>` real que en un clic simple llama a `preventDefault()` y avisa a `alNavegar`. Con
Ctrl + clic se abre en otra pestaña.

**Bootstrap responsivo:** `organisms/CatalogoGas.jsx` usa `<Col xs={12} md={6} lg={4} xl={3}>`: 1
columna en celular, 2 en tableta, 3 en notebook y 4 en escritorio. `lg={4}` significa 4 de 12
columnas, no 4 píxeles. Media query propia: `estilos/principal.css` (`@media (max-width: 767px)`).
Bootstrap se importa **antes** del CSS propio en `main.jsx`.

**Patrones que te pueden preguntar:**

- Desestructuración: `function TarjetaPedido({ pedido, alNavegar })` toma las props por nombre;
  equivale a `props.pedido`.
- `children`: lo que va entre las etiquetas de un componente; lo usan los Provider.
- `Outlet`: el lugar donde la plantilla dibuja la página de la ruta actual.
- Spread `{ ...pedido, estado }`: copia el objeto y reemplaza un campo, sin modificar el original
  (actualización inmutable).
- `??`: usa el valor de la derecha solo si el de la izquierda es `null` o `undefined`.
- `useRef` en `ConfirmarPedido.jsx`: `registrado` recuerda que el pedido ya se envió, sin volver a
  dibujar la pantalla, y evita un doble envío.
- `useCallback` y `useMemo` en los Context: mantienen la misma función y el mismo objeto entre
  renderizados, para no redibujar sin necesidad a quienes usan el Context.
- `key` en las listas: un identificador estable (`producto.codigo`, `pedido.id`), nunca la posición.

## 4. Las 10 pruebas unitarias para explicar (IE2.2.2)

Estructura de cada una: **preparar** (datos), **actuar** (llamar o hacer clic) y **verificar**
(`expect`). La suite es `describe` y cada caso es `it`.

1. `utils/precioSegunCliente.test.js`: tarifa residencial, comercial y error con un tipo desconocido.
2. `utils/resumirCarrito.test.js`: subtotal por línea y total, también con un accesorio.
3. `utils/validaciones.test.js`: informa todos los errores del registro a la vez.
4. `utils/puedeVerPedido.test.js`: el dueño o el correo correcto ven el pedido; los demás no.
5. `utils/pedidosParaOperadora.test.js`: la hora entra como parámetro, así la prueba no depende del
   reloj; un pendiente de las 23:50 sigue visible a las 00:10.
6. `utils/generarReporte.test.js`: efectivo cobrado frente a lo pendiente de cobro.
7. `organisms/FormularioRegistro.test.jsx`: **mock** con `vi.fn()` para `alRegistrar`; comprueba
   que no se llama con errores y que se llama sin la contraseña con datos válidos.
8. `atoms/EnlaceInterno.test.jsx`: `fireEvent.click` con `ctrlKey` y comprobación de que no se
   canceló la navegación del navegador.
9. `organisms/ListaEntregas.test.jsx`: todas las líneas del pedido y solo el botón del siguiente paso.
10. `hooks/useAhora.test.js`: `beforeEach` activa el reloj simulado y `afterEach` lo restaura;
    `vi.spyOn(globalThis, 'clearInterval')` comprueba la **limpieza** al desmontar.

**Mocks del proyecto:**

- `vi.fn()`: funciones falsas para callbacks de componentes.
- `vi.spyOn(Storage.prototype, 'setItem')`: simula que el almacenamiento falla
  (`services/pedidoService.test.js`, "devuelve el stock si no se puede guardar el pedido").
- `vi.useFakeTimers({ toFake: ['Date'] })`: fija la hora en pruebas de fechas.
- No hay `fetch` en EP2 (no hay API), así que no se simuló ninguno; inventar una API falsa solo para
  imitar el ejemplo de la guía no tendría sentido.

## 5. Demostración: una prueba que falla y cómo se corrige

Pedido del profesor según tus notas. Ya se ensayó; la salida real está en
`docs/evidencias/demostracion-prueba-fallida.txt`.

1. En `src/utils/precioSegunCliente.js`, cambia en el caso comercial
   `return producto.precioComercial` por `return producto.precioResidencial` y guarda.
2. Ejecuta:

   ```bash
   npx vitest run src/utils/precioSegunCliente.test.js
   ```

3. Se ve `FAIL … devuelve el precio comercial` y `AssertionError: expected 12000 to be 11000`.
   **Expected** es lo que escribiste en la prueba (11000) y **Received** es lo que devolvió el
   código (12000). La flecha `^` apunta a la línea del `expect`. Las otras dos pruebas siguen en
   verde, lo que dice exactamente dónde está el problema.
4. Corrige la línea (o ejecuta `git checkout -- src/utils/precioSegunCliente.js`) y vuelve a
   ejecutar: `3 passed`.

## 6. Proceso de testeo (IE2.3.2)

- **`vite.config.js`, bloque `test`:** `environment: 'jsdom'` simula el navegador; `setupFiles`
  apunta a `src/tests/configuracion.js`; la cobertura `v8` mide todo `src` salvo pruebas, ayudantes
  y `main.jsx`.
- **`src/tests/configuracion.js`:** carga `@testing-library/jest-dom/vitest` (aserciones como
  `toBeInTheDocument`) y en `afterEach` ejecuta `cleanup()` para desmontar lo dibujado.
- **Preparación y limpieza:** casi todos los archivos usan `beforeEach(() => localStorage.clear())`
  para que cada caso parta de cero, y `afterEach(() => vi.restoreAllMocks())` para devolver las
  funciones reales aunque una aserción falle.
- **Ejemplo con varias aserciones:** `pages/Carrito.test.jsx`, "rechaza un precio cambiado…":
  comprueba el aviso, que no se guardó el pedido, que el carrito sigue intacto y, tras reintentar,
  el precio nuevo y el pedido registrado.
- **Dónde viven las pruebas:** junto al archivo que prueban, con `.test.js` o `.test.jsx`; Vitest
  ejecuta todo archivo que termine así.
- **Comandos:** `npm run test:run` (una vez), `npm run test:watch` (vigilante) y
  `npm run test:cov` (cobertura).
- **Resultados:** 422 pruebas en 105 archivos; sentencias 96,4 %, ramas 91,92 %. El 100 % no
  significa que no haya errores: significa que cada línea se ejecutó.

## 7. Preguntas que pueden hacerte

- ¿Qué diferencia hay entre una suite y un caso? → `describe('precioSegunCliente')` agrupa;
  `it('devuelve el precio comercial')` es un caso.
- ¿Por qué no llamas a una API real en una prueba unitaria? → Sería lenta y dependería de un
  servidor. Aquí no hay API; se simula el almacenamiento cuando hace falta.
- ¿Por qué buscas por rol o texto y no por clase CSS? → Así encuentras los elementos como los vería
  una persona, y además compruebas la accesibilidad.
- ¿Qué cambiaría con Jasmine y Karma? → La sintaxis `describe`, `it` y `expect` es casi igual;
  `vi.fn()` pasa a `jasmine.createSpy()` y Karma abre un navegador real (Guía 15, §7).
- ¿Es seguro el ingreso? → No. Es una simulación de EP2: no se guardan contraseñas y las rutas se
  protegen en la interfaz. La seguridad real llega con el backend en EP3.

## 8. Lo que debes poder mostrar en GitHub

Ramas por funcionalidad y solicitudes de incorporación (#1 a #3 ya incorporadas, más las 7 nuevas).
Los commits llevan la línea `Co-Authored-By: Claude`: el uso de IA está permitido y no se oculta;
lo que se evalúa es que tú entiendas y expliques el código.
