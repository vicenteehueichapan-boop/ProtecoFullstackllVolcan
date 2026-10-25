export function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
    ? ''
    : 'Ingresa un correo válido.'
}

export function validarClave(clave) {
  return clave.length >= 6 ? '' : 'La contraseña debe tener al menos 6 caracteres.'
}

export function validarIngreso(correo, clave) {
  const errores = {}
  const errorCorreo = validarCorreo(correo)
  const errorClave = validarClave(clave)
  if (errorCorreo) errores.correo = errorCorreo
  if (errorClave) errores.clave = errorClave
  return errores
}

export function validarRegistro(datos) {
  const errores = validarIngreso(datos.correo, datos.clave)
  if (datos.nombre.trim().length < 2) errores.nombre = 'Ingresa tu nombre.'
  if (datos.apellidos.trim().length < 2) errores.apellidos = 'Ingresa tus apellidos.'
  if (!/^\d{7,8}[0-9kK]$/.test(datos.run)) errores.run = 'Ingresa el RUN sin puntos ni guion.'
  if (datos.confirmarClave !== datos.clave) errores.confirmarClave = 'Las contraseñas deben coincidir.'
  return errores
}
