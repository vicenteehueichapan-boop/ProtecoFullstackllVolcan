// Perfiles ficticios para demostrar permisos. No contienen credenciales reales.
const personalDemostracion = [
  { id: 'admin-demo', correo: 'administracion@ejemplo.cl', nombre: 'Administración', rol: 'administracion' },
  { id: 'operadora-demo', correo: 'operadora@ejemplo.cl', nombre: 'Operadora', rol: 'operadora' },
  ...[1, 2, 3].map((numero) => ({
    id: `repartidor-${numero}`, correo: `repartidor${numero}@ejemplo.cl`,
    nombre: `Repartidor ${numero}`, rol: 'repartidor',
  })),
]

export default personalDemostracion
