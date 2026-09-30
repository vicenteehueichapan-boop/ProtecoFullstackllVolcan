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

El primer incremento incluye:

- Proyecto creado con Vite y React.
- Diseño adaptable mediante React Bootstrap.
- Navegación entre Inicio, Catálogo y página no encontrada.
- Componentes organizados con Atomic Design.
- Diez productos reales tomados del catálogo de la Forma C.
- Tarifas residenciales y comerciales.
- Estado compartido mediante Context.
- Lectura inicial de productos desde un servicio con `localStorage`.
- Pantalla de ingreso construida con dos átomos, una molécula y un organismo.
- Once pruebas unitarias aprobadas con Vitest.

El proyecto todavía no incluye el CRUD completo, pedidos, seguimiento, administración ni roles. Esas funciones se desarrollarán durante los siguientes incrementos de la Evaluación Parcial 2.

Spring Boot, microservicios, base de datos, AWS y Docker no forman parte de esta etapa. Corresponden a la Evaluación Parcial 3.

## Requisitos

- Node.js 22.12 o superior.
- npm incluido con Node.js.

## Instalación

Después de descargar o clonar el repositorio, abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

La terminal mostrará una dirección local. Ábrela en el navegador para recorrer la aplicación.

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
├── context/      Estado compartido de productos
├── data/         Datos iniciales del catálogo
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

Actualmente pasan once pruebas sobre reglas, persistencia, componentes y validaciones. La cobertura se calcula incluyendo todo el código de `src`, aunque todavía existan páginas que se probarán en los siguientes incrementos.

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

La cantidad mínima de diez pruebas relevantes ya fue alcanzada. Durante los siguientes incrementos se ampliarán para cubrir el CRUD y el flujo de pedidos.

## Evidencias de responsividad

La pantalla de ingreso fue revisada en los tres anchos solicitados por la Guía 12:

- `docs/evidencias/ingreso-375.png` — teléfono.
- `docs/evidencias/ingreso-768.png` — tableta.
- `docs/evidencias/ingreso-1280.png` — escritorio.

## Material complementario

El código vive únicamente en GitHub. El enlace público de Google Drive para la ERS V2 y los demás documentos académicos se incorporará cuando la carpeta del equipo esté disponible.

## Despliegue en AWS

La instancia EC2 del equipo se utilizará como entorno remoto y posteriormente podrá publicar la compilación estática del frontend. El despliegue todavía no está realizado. Cuando se configure, el servidor deberá devolver `index.html` para rutas como `/catalogo` e `/ingreso`, de modo que React Router también funcione al actualizar directamente esas direcciones.

El archivo `deploy/nginx-gas-volcan.conf` deja preparada esa regla de navegación. No contiene direcciones privadas, usuarios ni claves.
