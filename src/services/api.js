import axios from 'axios'

const CLAVE = 'gas-el-volcan-token'
let tokenEnMemoria = null
const avisarSesion = () => window.dispatchEvent(new Event('sesion-actualizada'))

export function leerToken() {
  try { return sessionStorage.getItem(CLAVE) ?? tokenEnMemoria } catch { return tokenEnMemoria }
}

export function guardarToken(token) {
  try {
    if (token) sessionStorage.setItem(CLAVE, token)
    else sessionStorage.removeItem(CLAVE)
    tokenEnMemoria = null
  } catch {
    if (token) throw new Error('El navegador no permite conservar la sesión. Habilita el almacenamiento de esta pestaña.')
    tokenEnMemoria = null
  }
  avisarSesion()
}

export function vencimientoToken(token) {
  try { return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp * 1000 } catch { return 0 }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = leerToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use((respuesta) => respuesta, (error) => {
  if (error.response?.status === 401 && error.config?.headers?.Authorization) guardarToken(null)
  const cuerpo = error.response?.data?.error
  error.message = cuerpo?.mensaje || (error.code === 'ECONNABORTED'
    ? 'La API tardó demasiado. Vuelve a intentarlo.'
    : error.response ? 'No se pudo completar la operación.' : 'No fue posible contactar la API. Revisa la conexión.')
  error.detalles = cuerpo?.detalles
  return Promise.reject(error)
})
