import personalDemostracion from '../data/personalDemostracion'
import { errorDeCampo } from '../utils/errorDeCampo'
import { validarCorreo } from '../utils/validaciones'

// Perfiles del personal (administración, operadora y repartidores) como datos simulados.
// Administración los crea, edita y desactiva. No se guardan contraseñas: el correo
// identifica el perfil en esta demostración; la autenticación real llega en EP3.
const CLAVE_PERSONAL = 'gas-el-volcan-personal'
export const ROLES_PERSONAL = ['administracion', 'operadora', 'repartidor']

function normalizarCorreo(correo) {
  return String(correo ?? '').trim().toLowerCase()
}

function validarPerfil(perfil) {
  if (typeof perfil.nombre !== 'string' || perfil.nombre.trim().length < 3) {
    throw errorDeCampo('nombre', 'Ingresa un nombre de al menos 3 caracteres.')
  }
  if (validarCorreo(perfil.correo)) throw errorDeCampo('correo', 'Ingresa un correo válido.')
  if (!ROLES_PERSONAL.includes(perfil.rol)) throw errorDeCampo('rol', 'Selecciona un rol del personal.')
  if (typeof perfil.activo !== 'boolean') throw new Error('El estado del perfil no es válido.')
}

function guardarPersonal(personal) {
  localStorage.setItem(CLAVE_PERSONAL, JSON.stringify(personal))
}

function leerTexto() {
  try {
    return localStorage.getItem(CLAVE_PERSONAL)
  } catch {
    throw new Error('No se pudo leer el almacenamiento del navegador. Revisa sus permisos y vuelve a intentarlo.')
  }
}

export function listarPersonal() {
  const texto = leerTexto()
  if (texto === null) {
    const iniciales = personalDemostracion.map((perfil) => ({ ...perfil, activo: true }))
    guardarPersonal(iniciales)
    return iniciales
  }

  try {
    const personal = JSON.parse(texto)
    if (Array.isArray(personal)) {
      personal.forEach((perfil) => {
        validarPerfil(perfil)
        if (typeof perfil.id !== 'string' || perfil.id === '') throw new Error('Identificador inválido')
      })
      const correos = new Set(personal.map((perfil) => perfil.correo))
      const ids = new Set(personal.map((perfil) => perfil.id))
      if (correos.size === personal.length && ids.size === personal.length) return personal
    }
  } catch {
    // El mensaje de abajo explica el problema; los datos dañados no se tocan.
  }
  throw new Error('Los perfiles del personal guardados están dañados. No se modificaron.')
}

// Regla del caso: el sistema siempre necesita alguien que pueda administrarlo.
function comprobarAdministracionActiva(personal) {
  if (!personal.some((perfil) => perfil.rol === 'administracion' && perfil.activo)) {
    throw errorDeCampo('rol', 'Debe quedar al menos un perfil de administración activo.')
  }
}

export function crearPersonal(datos) {
  const personal = listarPersonal()
  const perfil = {
    nombre: String(datos?.nombre ?? '').trim(),
    correo: normalizarCorreo(datos?.correo),
    rol: datos?.rol,
    activo: true,
  }
  validarPerfil(perfil)
  if (personal.some((item) => item.correo === perfil.correo)) {
    throw errorDeCampo('correo', 'Ya existe un perfil con ese correo.')
  }

  const ultimo = personal
    .filter((item) => /^PER-\d+$/.test(item.id))
    .reduce((mayor, item) => Math.max(mayor, Number(item.id.slice(4))), 0)
  const nuevo = { id: `PER-${String(ultimo + 1).padStart(4, '0')}`, ...perfil }
  guardarPersonal([...personal, nuevo])
  return { ...nuevo }
}

// Se puede cambiar nombre, rol y si está activo. El correo identifica al perfil y no cambia.
export function actualizarPersonal(id, cambios) {
  const personal = listarPersonal()
  const indice = personal.findIndex((perfil) => perfil.id === id)
  if (indice === -1) throw new Error('No existe el perfil indicado.')

  const actualizado = { ...personal[indice] }
  if (cambios?.nombre !== undefined) actualizado.nombre = String(cambios.nombre).trim()
  if (cambios?.rol !== undefined) actualizado.rol = cambios.rol
  if (cambios?.activo !== undefined) actualizado.activo = cambios.activo
  validarPerfil(actualizado)

  const copia = [...personal]
  copia[indice] = actualizado
  comprobarAdministracionActiva(copia)
  guardarPersonal(copia)
  return { ...actualizado }
}

export function buscarPersonalActivoPorCorreo(correo) {
  const perfil = listarPersonal().find((item) => item.correo === normalizarCorreo(correo))
  if (!perfil) throw errorDeCampo('correo', 'El correo no corresponde a un perfil del personal.')
  if (!perfil.activo) throw errorDeCampo('correo', 'Este perfil del personal está desactivado.')
  return { ...perfil }
}
