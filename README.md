# Distribuidora de Gas El Volcán

Proyecto frontend de la Evaluación Parcial 2 de **DSY1104 Desarrollo Fullstack II**. La aplicación reconstruye en React el caso trabajado durante la Evaluación Parcial 1 y utiliza datos simulados dentro del navegador.

## Alcance actual

El primer incremento incluye:

- Proyecto creado con Vite y React.
- Diseño adaptable mediante Bootstrap.
- Navegación entre Inicio, Catálogo y página no encontrada.
- Componentes organizados con Atomic Design.
- Diez productos reales tomados del catálogo de la Forma C.
- Tarifas residenciales y comerciales.
- Estado compartido mediante Context.
- Lectura inicial de productos desde un servicio con `localStorage`.
- Cinco pruebas unitarias aprobadas con Vitest.

El proyecto todavía no incluye el CRUD completo, pedidos, seguimiento, administración ni roles. Esas funciones se desarrollarán durante los siguientes incrementos de la Evaluación Parcial 2.

Spring Boot, microservicios, base de datos, AWS y Docker no forman parte de esta etapa. Corresponden a la Evaluación Parcial 3.

## Requisitos

- Node.js 20 o superior.
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

## Datos del caso

Los productos provienen del catálogo entregado para la Forma C. El primer incremento utiliza diez registros de las cuatro categorías principales. Los precios se guardan como números y la función `precioSegunCliente` decide qué tarifa corresponde mostrar.

## Estado de las pruebas

Actualmente pasan cinco pruebas:

- Precio residencial.
- Precio comercial.
- Rechazo de un tipo de cliente desconocido.
- Inicialización de diez productos.
- Recuperación de los productos almacenados.

La meta final de EP2 es tener al menos diez pruebas unitarias relevantes y documentar su cobertura.
