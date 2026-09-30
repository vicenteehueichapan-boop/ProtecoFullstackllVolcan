export function precioSegunCliente(producto, tipoCliente) {
  if (tipoCliente === 'residencial') {
    return producto.precioResidencial
  }

  if (tipoCliente === 'comercial') {
    return producto.precioComercial
  }

  throw new Error('El tipo de cliente debe ser residencial o comercial')
}
