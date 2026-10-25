import { validarContacto } from '../utils/validarContacto'

// Mensajes del formulario de Contacto, guardados como datos simulados de EP2.
const CLAVE_MENSAJES = 'gas-el-volcan-mensajes'

function leerTexto() {
  try {
    return localStorage.getItem(CLAVE_MENSAJES)
  } catch {
    throw new Error('No se pudo leer el almacenamiento del navegador. Revisa sus permisos y vuelve a intentarlo.')
  }
}

export function listarMensajes() {
  const texto = leerTexto()
  if (texto === null) return []

  try {
    const mensajes = JSON.parse(texto)
    if (Array.isArray(mensajes) && mensajes.every((mensaje) => /^MSG-\d{4,}$/.test(mensaje?.id))) {
      return mensajes
    }
  } catch {
    // El mensaje de abajo explica el problema; los datos dañados no se tocan.
  }
  throw new Error('Los mensajes guardados están dañados. No se modificaron.')
}

export function crearMensaje(datos) {
  // El servicio vuelve a validar: no confía en que la pantalla lo haya hecho.
  if (Object.keys(validarContacto(datos)).length > 0) {
    throw new Error('Los datos del mensaje no son válidos.')
  }
  const mensajes = listarMensajes()
  const ultimo = mensajes.reduce((mayor, mensaje) => Math.max(mayor, Number(mensaje.id.slice(4))), 0)
  const nuevo = {
    id: `MSG-${String(ultimo + 1).padStart(4, '0')}`,
    nombre: datos.nombre.trim(),
    correo: datos.correo.trim().toLowerCase(),
    motivo: datos.motivo,
    mensaje: datos.mensaje.trim(),
    fecha: new Date().toISOString(),
  }
  localStorage.setItem(CLAVE_MENSAJES, JSON.stringify([...mensajes, nuevo]))
  return nuevo
}
