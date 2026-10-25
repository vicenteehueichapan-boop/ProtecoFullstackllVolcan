// Regla pura para la cantidad a reponer: un entero entre 1 y 1000. Devuelve el mensaje
// de error o texto vacío si es válida (mismo formato que las demás validaciones).
export function validarReposicion(texto) {
  const cantidad = Number(texto)
  if (texto.trim() === '' || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > 1000) {
    return 'Ingresa una cantidad entera entre 1 y 1000.'
  }
  return ''
}
