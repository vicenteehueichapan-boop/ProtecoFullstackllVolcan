// Regla pura del formulario de productos (Guía 14): recibe los datos tal como los escribe la
// persona (los números llegan como texto) y devuelve un mensaje por campo con error.
function esEnteroNoNegativo(valor) {
  const texto = String(valor).trim()
  return /^\d+$/.test(texto)
}

export function validarProducto(datos, categorias) {
  const errores = {}
  if (!/^[A-Za-z0-9-]{3,10}$/.test(String(datos.codigo).trim())) {
    errores.codigo = 'Ingresa un código de 3 a 10 letras o números, sin espacios.'
  }
  if (!categorias.some((categoria) => categoria.nombre === datos.categoria)) {
    errores.categoria = 'Selecciona una categoría registrada.'
  }
  if (String(datos.nombre).trim().length < 3) errores.nombre = 'Ingresa el nombre del producto (al menos 3 caracteres).'
  if (String(datos.descripcion).trim().length < 10) errores.descripcion = 'Describe el producto (al menos 10 caracteres).'
  if (String(datos.unidad).trim().length < 2) errores.unidad = 'Indica la unidad de venta, por ejemplo Unidad o Kit.'
  for (const campo of ['precioResidencial', 'precioComercial']) {
    if (!esEnteroNoNegativo(datos[campo])) errores[campo] = 'Ingresa un precio entero en pesos, igual o mayor a 0.'
  }
  if (!esEnteroNoNegativo(datos.stock)) errores.stock = 'Ingresa un stock entero, igual o mayor a 0.'
  return errores
}
