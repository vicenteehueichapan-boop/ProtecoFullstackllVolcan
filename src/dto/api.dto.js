import { imagenSegunCategoria } from '../utils/imagenSegunCategoria'

export function productoRespuesta(producto) {
  return { ...producto, imagen: imagenSegunCategoria(producto.categoria) }
}
export function productoEntrada(datos) {
  return {
    codigo: datos.codigo.trim().toUpperCase(), nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim(),
    unidad: datos.unidad.trim(), categoria: datos.categoria,
    precioResidencial: Number(datos.precioResidencial), precioComercial: Number(datos.precioComercial),
    stock: Number(datos.stock), destacado: Boolean(datos.destacado),
  }
}
export function registroEntrada(datos) {
  return {
    nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim(), correo: datos.correo.trim().toLowerCase(),
    run: datos.run.trim().toUpperCase(), contrasena: datos.clave, tipoCliente: datos.tipoCliente,
  }
}
export function usuarioRespuesta(usuario) {
  return { ...usuario, ...usuario.perfil, activo: usuario.estado !== 'deshabilitado' }
}
export function pedidoEntrada(datos) {
  return {
    ...datos.cliente, zonaId: datos.zona.id, tipoCliente: datos.tipoCliente,
    lineas: datos.productos.map((linea) => ({ codigo: linea.codigo, cantidad: linea.cantidad, precioEsperado: linea.precioUnitario })),
  }
}
export function pedidoRespuesta(pedido) {
  return {
    ...pedido,
    cliente: { nombre: pedido.nombre, apellidos: pedido.apellidos, correo: pedido.correo, direccion: pedido.direccion },
    zona: { id: pedido.zonaId, nombre: pedido.zonaNombre, tiempoEstimado: pedido.tiempoEstimado },
    productos: pedido.lineas, formaPago: 'efectivo_al_entregar',
    ...(pedido.cobradoEn && { cobro: { monto: pedido.total, fecha: pedido.cobradoEn } }),
  }
}
