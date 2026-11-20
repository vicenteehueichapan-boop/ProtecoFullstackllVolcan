# Distribuidora de Gas El Volcán · React

DSY1104 Desarrollo Fullstack II · Duoc UC · sección 006D · 2026. Caso Forma C. Vicente Hueichapan Poblete, trabajo individual.

Continuidad del frontend de EP2: conserva React, Atomic Design y diseño del caso; EP3 integra cuentas, catálogo y pedidos con persistencia real y JWT.

**Backend:** [BackendStackll](https://github.com/vicenteehueichapan-boop/BackendStackll). Su README explica datos, diagramas, decisiones, contratos, permisos y ejecución EC2/RDS.

## Alcance

- Público: catálogo/detalle, búsqueda/categorías, tarifas residencial/comercial, registro, ingreso y carrito local.
- Cliente: confirmar, consultar pedidos propios y eliminar pendiente sin asignar.
- Operadora: pedidos y asignación a repartidor activo.
- Repartidor: sus asignaciones, en camino y entregado; servidor registra cobro en efectivo.
- Administración: CRUD productos/cuentas, roles, baja lógica y operación de pedidos.

Reportes, mantenimiento de categorías, críticos, perfil editable, historial administrativo por usuario, comprobantes y mapa quedan para el examen. Categorías/zonas se consultan como referencias. Las vistas informativas heredadas se conservan; Contacto sigue como simulación local EP2, fuera del backend evaluado.

## Desarrollo

Requiere **Node.js 24** y API según su README.

```bash
npm ci
```

Copiar .env.example a .env.local:

```text
VITE_API_URL=http://localhost:3000/api/v1
```

```bash
npm run dev
```

Abrir **http://localhost:5173**. CORS del backend debe permitir ese origen. Variables VITE_ son públicas: nunca contraseñas ni clave JWT.

## Demostración en EC2

React compilado, API y nginx en lab-springboot; PostgreSQL 18 en RDS. Desde el equipo autorizado:

```bash
ssh -i RUTA_A_LA_LLAVE -N -L 127.0.0.1:8080:127.0.0.1:8080 ubuntu@18.209.18.21
```

Mantener túnel abierto y visitar **http://localhost:8080**, [Swagger](http://localhost:8080/api/v1/docs/). IP comprobada el 20-nov; puede cambiar al reiniciar AWS Academy. Llave fuera del repositorio.

La compilación usa VITE_API_URL=/api/v1. Nginx sirve /var/www/gas-volcan-ep3 y envía /api/v1 a Node en loopback:3001. [Configuración](deploy/nginx-gas-volcan.conf) escucha solo en loopback:8080. SSH cifra el tramo entre equipos. HTTPS público con dominio está pendiente; esta dirección no es una publicación pública. Para regenerar: definir VITE_API_URL=/api/v1 en el entorno y ejecutar npm run build.

## Organización e integración

```text
src/
  components/    atoms, molecules, organisms y templates existentes
  pages/         rutas y coordinación del recorrido
  context/       datos API, restauración de sesión y carrito
  services/      Axios y operaciones por recurso
  dto/           adaptación formularios/API/componentes
  routes/        restricciones por rol
  hooks/         contextos y comportamiento reutilizable
  utils/         validación y cálculos de presentación
```

services/api.js configura URL, timeout, Bearer y mensajes de error. sesionApi, catalogoApi, usuariosApi y pedidosApi realizan HTTP; dto/api.dto.js adapta campos/tipos. DatosApiProvider mantiene los contratos de contexto de los componentes EP2. Stock, precio final, propiedad y roles los decide el servidor.

| Pantalla | API bajo /api/v1 |
|---|---|
| Registro/ingreso/personal | /auth/register, /auth/login, /auth/me, /auth/logout |
| Catálogo/detalle/carrito | GET /productos, /productos/{codigo}, /categorias |
| Confirmación | GET /zonas, POST /pedidos |
| Mis pedidos/detalle | GET /pedidos, /pedidos/{id}, DELETE pendiente |
| Operadora | GET /repartidores, PATCH /pedidos/{id}/asignacion |
| Repartidor | GET /pedidos, PATCH /pedidos/{id}/estado |
| Administración | CRUD /usuarios y /productos, gestión de /pedidos |

Cliente envía contacto, dirección, zona, códigos, cantidades y precio mostrado; API obtiene tarifa/propietario de la cuenta y calcula total. Cambio de precio o stock: 409 sin pedido parcial. React muestra el error y permite revisar.

## Sesión y estados

Token en **sessionStorage** para conservar sesión al recargar como exige EP3. Se consulta /auth/me antes de recuperar permisos. Temporizador limpia al vencer (15 min); 401 limpia y solicita ingreso. Cierre llama al backend para revocar y limpia localmente. Sin refresh token. El token no está en localStorage: allí queda el carrito. sessionStorage tiene riesgo ante XSS y no equivale a una cookie HttpOnly; decisión documentada en backend.

Se muestran carga, conexión fallida con reintento, listas vacías, éxito, validación por campo y acceso denegado. Se bloquea envío mientras espera respuesta. Menús/rutas acompañan el rol; API vuelve a comprobar permisos/propiedad. La contraseña de demostración se configura al sembrar, no en el bundle.

## Verificación real · 20-nov-2026

```bash
npm test -- --run
npm run lint
npm run build
npm run test:cov
```

**27 pruebas aprobadas en 12 archivos**, lint sin errores y compilación correcta. Cobertura: 25,52 % instrucciones, 23,28 % ramas, 22,63 % funciones y 24,89 % líneas; no representa cobertura completa. Las pruebas manuales se registran aparte.

Navegador con API real: registro, login/recarga, carrito/confirmación, asignación, en camino/entrega, bloqueo por rol, alta/edición/baja de personal y CRUD de producto. Persistencia del pedido tras reinicio del backend local. Catálogo a 360, 768 y 1280 px sin desbordamiento de página. Backend: 43 pruebas local y EC2/RDS.

Requiere laboratorio/EC2/RDS/túnel activos. Manual por rol, documento de integración, ERS V3 y ZIP se entregan separados del código. Carga en AVA y ensayo individual no se acreditan desde el repositorio.
