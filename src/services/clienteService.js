import personalDemostracion from '../data/personalDemostracion'
import zonasDespacho from '../data/zonasDespacho'
import { validarCorreo } from '../utils/validaciones'

// Cuentas de clientes simuladas para EP2. La contraseña NO se guarda ni se compara:
// el correo identifica la cuenta, igual que en el acceso del personal. No es seguridad real;
// la autenticación con servidor corresponde a la Evaluación Parcial 3.
const CLAVE_CLIENTES = 'gas-el-volcan-clientes'
const CLAVE_SESION = 'gas-el-volcan-sesion-cliente'
const CAMPOS_EDITABLES = ['nombre', 'apellidos', 'tipoCliente', 'direccion', 'zonaId']

function normalizarCorreo(correo) {
  return String(correo ?? '').trim().toLowerCase()
}

function leerTexto(clave) {
  try {
    return localStorage.getItem(clave)
  } catch {
    throw new Error('No se pudo leer el almacenamiento del navegador. Revisa sus permisos y vuelve a intentarlo.')
  }
}

function validarCliente(cliente) {
  if (!cliente || typeof cliente !== 'object') throw new Error('Los datos de la cuenta no son válidos.')
  if (typeof cliente.nombre !== 'string' || cliente.nombre.trim().length < 2) throw new Error('Ingresa tu nombre.')
  if (typeof cliente.apellidos !== 'string' || cliente.apellidos.trim().length < 2) throw new Error('Ingresa tus apellidos.')
  if (!/^\d{7,8}[0-9K]$/.test(cliente.run)) throw new Error('Ingresa el RUN sin puntos ni guion.')
  if (validarCorreo(cliente.correo)) throw new Error('Ingresa un correo válido.')
  if (!['residencial', 'comercial'].includes(cliente.tipoCliente)) throw new Error('El tipo de cliente no es válido.')
  if (typeof cliente.direccion !== 'string') throw new Error('La dirección no es válida.')
  if (cliente.zonaId !== '' && !zonasDespacho.some((zona) => zona.id === cliente.zonaId)) {
    throw new Error('La zona de despacho no es válida.')
  }
}

function guardarClientes(clientes) {
  localStorage.setItem(CLAVE_CLIENTES, JSON.stringify(clientes))
}

export function listarClientes() {
  const texto = leerTexto(CLAVE_CLIENTES)
  if (texto === null) return []

  try {
    const clientes = JSON.parse(texto)
    if (Array.isArray(clientes)) {
      clientes.forEach((cliente) => {
        validarCliente(cliente)
        if (!/^CLI-\d{4,}$/.test(cliente.id)) throw new Error('Identificador inválido')
      })
      const ids = new Set(clientes.map((cliente) => cliente.id))
      const correos = new Set(clientes.map((cliente) => cliente.correo))
      if (ids.size === clientes.length && correos.size === clientes.length) return clientes
    }
  } catch {
    // El mensaje de abajo explica el problema; los datos dañados no se tocan.
  }

  throw new Error('Las cuentas guardadas están dañadas. No se modificaron; administración debe revisarlas.')
}

export function obtenerCliente(id) {
  return listarClientes().find((cliente) => cliente.id === id) ?? null
}

export function registrarCliente(datos) {
  const cliente = {
    nombre: String(datos?.nombre ?? '').trim(),
    apellidos: String(datos?.apellidos ?? '').trim(),
    run: String(datos?.run ?? '').trim().toUpperCase(),
    correo: normalizarCorreo(datos?.correo),
    tipoCliente: datos?.tipoCliente,
    direccion: '',
    zonaId: '',
  }
  validarCliente(cliente)

  if (personalDemostracion.some((perfil) => perfil.correo === cliente.correo)) {
    throw new Error('Ese correo está reservado para el personal. Usa tu correo personal.')
  }
  const clientes = listarClientes()
  if (clientes.some((item) => item.correo === cliente.correo)) throw new Error('Ya existe una cuenta con ese correo.')
  if (clientes.some((item) => item.run === cliente.run)) throw new Error('Ya existe una cuenta con ese RUN.')

  const ultimo = clientes.reduce((mayor, item) => Math.max(mayor, Number(item.id.slice(4))), 0)
  const nuevo = { id: `CLI-${String(ultimo + 1).padStart(4, '0')}`, ...cliente, fechaRegistro: new Date().toISOString() }
  guardarClientes([...clientes, nuevo])
  return { ...nuevo }
}

export function actualizarCliente(id, cambios) {
  const clientes = listarClientes()
  const indice = clientes.findIndex((cliente) => cliente.id === id)
  if (indice === -1) throw new Error('No existe la cuenta indicada.')

  // Solo se copian los campos editables: el id, el RUN y el correo no cambian aquí.
  const permitidos = Object.fromEntries(
    Object.entries(cambios ?? {})
      .filter(([campo]) => CAMPOS_EDITABLES.includes(campo))
      .map(([campo, valor]) => [campo, typeof valor === 'string' ? valor.trim() : valor]),
  )
  const actualizado = { ...clientes[indice], ...permitidos }
  validarCliente(actualizado)

  const copia = [...clientes]
  copia[indice] = actualizado
  guardarClientes(copia)
  return { ...actualizado }
}

export function iniciarSesionCliente(correo) {
  const cliente = listarClientes().find((item) => item.correo === normalizarCorreo(correo))
  if (!cliente) throw new Error('No existe una cuenta con ese correo. Revisa el dato o regístrate.')
  localStorage.setItem(CLAVE_SESION, cliente.id)
  return { ...cliente }
}

// Solo se guarda el identificador de la cuenta, nunca una contraseña ni un token.
export function leerSesionCliente() {
  const id = leerTexto(CLAVE_SESION)
  return id === null ? null : obtenerCliente(id)
}

export function cerrarSesionCliente() {
  localStorage.removeItem(CLAVE_SESION)
}
