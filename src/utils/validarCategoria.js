// Regla pura del formulario de categorías. Devuelve un mensaje por campo con error.
export function validarCategoria(datos) {
  const errores = {}
  if (datos.nombre.trim().length < 3) errores.nombre = 'El nombre debe tener al menos 3 caracteres.'
  if (datos.descripcion.trim().length > 200) errores.descripcion = 'La descripción admite hasta 200 caracteres.'
  return errores
}
