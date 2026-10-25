import { validarCorreo } from './validaciones'

export function validarEntrega(datos, zonas) {
  const errores = {}
  // Mismo mínimo que el registro: lo que la cuenta acepta, la entrega autocompletada también.
  if (datos.nombre.trim().length < 2) errores.nombre = 'Ingresa tu nombre.'
  if (datos.apellidos.trim().length < 2) errores.apellidos = 'Ingresa tus apellidos.'
  const errorCorreo = validarCorreo(datos.correo)
  if (errorCorreo) errores.correo = errorCorreo
  if (datos.direccion.trim().length < 5) errores.direccion = 'Ingresa una dirección de entrega válida.'
  if (!zonas.some((zona) => zona.id === datos.zonaId)) errores.zonaId = 'Selecciona una zona de despacho.'
  return errores
}
