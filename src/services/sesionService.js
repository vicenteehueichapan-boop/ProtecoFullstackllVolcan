import { api, guardarToken } from './api'
import { registroEntrada, usuarioRespuesta } from '../dto/api.dto'

export async function obtenerSesion() { return usuarioRespuesta((await api.get('/auth/me')).data) }
export async function ingresar({ correo, clave }) {
  const { data } = await api.post('/auth/login', { correo: correo.trim().toLowerCase(), contrasena: clave })
  guardarToken(data.accessToken)
  try { return await obtenerSesion() } catch (error) { guardarToken(null); throw error }
}
export async function registrar(datos) {
  await api.post('/auth/register', registroEntrada(datos))
  return ingresar(datos)
}
export async function salir() {
  try { await api.post('/auth/logout') } finally { guardarToken(null) }
}
