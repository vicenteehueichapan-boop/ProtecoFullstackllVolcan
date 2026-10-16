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

// Datos de una cuenta de cliente. La usan el registro público y administración
// (que crea o edita cuentas sin fijar contraseñas).
export function validarDatosCliente(datos) {
  const errores = {}
  if (datos.nombre.trim().length < 2) errores.nombre = 'Ingresa tu nombre.'
  if (datos.apellidos.trim().length < 2) errores.apellidos = 'Ingresa tus apellidos.'
  if (!/^\d{7,8}[0-9kK]$/.test(datos.run)) errores.run = 'Ingresa el RUN sin puntos ni guion.'
  const errorCorreo = validarCorreo(datos.correo)
  if (errorCorreo) errores.correo = errorCorreo
  return errores
}

export function validarRegistro(datos) {
  const errores = { ...validarIngreso(datos.correo, datos.clave), ...validarDatosCliente(datos) }
  if (datos.confirmarClave !== datos.clave) errores.confirmarClave = 'Las contraseñas deben coincidir.'
  return errores
}

export const ROLES = [
  { valor: 'administracion', texto: 'Administración' },
  { valor: 'operadora', texto: 'Operadora' },
  { valor: 'repartidor', texto: 'Repartidor' },
]

// Datos de un perfil del personal creado o editado por administración.
export function validarPerfilPersonal(datos) {
  const errores = {}
  if (datos.nombre.trim().length < 3) errores.nombre = 'Ingresa un nombre de al menos 3 caracteres.'
  const errorCorreo = validarCorreo(datos.correo.trim())
  if (errorCorreo) errores.correo = errorCorreo
  if (!ROLES.some((rol) => rol.valor === datos.rol)) errores.rol = 'Selecciona un rol del personal.'
  return errores
}
