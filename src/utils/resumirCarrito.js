import { precioSegunCliente } from './precioSegunCliente'

export function resumirCarrito(carrito, productos) {
  const lineas = carrito.lineas.map((linea) => {
    const producto = productos.find((item) => item.codigo === linea.codigo)
    const precioUnitario = producto ? precioSegunCliente(producto, carrito.tipoCliente) : 0
    const subtotal = precioUnitario * linea.cantidad
    let error = ''
    if (!producto || producto.categoria !== 'Cilindros de Gas') error = 'Este cilindro ya no está disponible. Quítalo del carrito.'
    else if (linea.cantidad > producto.stock) error = `Solo quedan ${producto.stock} unidades. Reduce la cantidad o quita el cilindro.`
    else if (!Number.isFinite(subtotal)) error = 'No se pudo calcular el importe de este cilindro.'
    return {
      ...linea, nombre: producto?.nombre ?? linea.codigo,
      stock: producto?.stock ?? 0, precioUnitario, subtotal, error,
    }
  })
  const total = lineas.reduce((suma, linea) => suma + linea.subtotal, 0)
  return { lineas, total, puedeConfirmar: lineas.length > 0 && lineas.every((linea) => !linea.error) && Number.isFinite(total) }
}
