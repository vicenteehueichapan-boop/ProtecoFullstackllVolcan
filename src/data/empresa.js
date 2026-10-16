// Datos de la empresa según el documento del caso (Forma C, secciones 1 y 2).
// El caso no entrega teléfono, correo ni dirección comercial: no se inventan.
const empresa = {
  nombre: 'Distribuidora de Gas El Volcán',
  fundacion: 1998,
  ubicacion: 'Chillán, Región de Ñuble',
  descripcion: 'Empresa familiar que distribuye cilindros de gas licuado a domicilio a clientes residenciales y comerciales en Chillán y comunas aledañas.',
  pedidosDiarios: 'entre 80 y 120',
  equipo: [
    { rol: 'Operadora', cantidad: 1, tarea: 'Recibe los pedidos y los asigna a un repartidor.' },
    { rol: 'Repartidores', cantidad: 3, tarea: 'Cargan los 2 camiones y realizan las entregas en el orden asignado.' },
    { rol: 'Administradora', cantidad: 1, tarea: 'Controla el stock y lleva la contabilidad.' },
  ],
}

export default empresa
