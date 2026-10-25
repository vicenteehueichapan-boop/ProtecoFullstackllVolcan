import { validarCorreo } from './validaciones'

export const MOTIVOS_CONTACTO = ['Consulta de productos', 'Cobertura y horarios', 'Estado de un pedido', 'Otro']
export const LARGO_MAXIMO_MENSAJE = 500

// Función pura: recibe los datos del formulario y devuelve un mensaje por campo con error.
// Un objeto vacío significa que todo está correcto.
export function validarContacto(datos) {
  const errores = {}
  if (datos.nombre.trim().length < 3) errores.nombre = 'Ingresa tu nombre.'
  const errorCorreo = validarCorreo(datos.correo.trim())
  if (errorCorreo) errores.correo = errorCorreo
  if (!MOTIVOS_CONTACTO.includes(datos.motivo)) errores.motivo = 'Selecciona el motivo de tu mensaje.'
  const largo = datos.mensaje.trim().length
  if (largo < 10) errores.mensaje = 'Escribe tu mensaje (al menos 10 caracteres).'
  else if (largo > LARGO_MAXIMO_MENSAJE) errores.mensaje = `El mensaje admite hasta ${LARGO_MAXIMO_MENSAJE} caracteres.`
  return errores
}
