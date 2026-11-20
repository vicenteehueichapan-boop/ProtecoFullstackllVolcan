import { api } from './api'
import { usuarioRespuesta } from '../dto/api.dto'

export async function listarUsuarios(signal) { return (await api.get('/usuarios', { signal })).data.map(usuarioRespuesta) }
export async function listarRepartidores(signal) {
  return (await api.get('/repartidores', { signal })).data.map((usuario) => ({ ...usuario, rol: 'repartidor', activo: true }))
}
export async function crearPersonal(datos) {
  return usuarioRespuesta((await api.post('/usuarios', {
    nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim(), correo: datos.correo.trim().toLowerCase(),
    contrasena: datos.contrasena, rol: datos.rol,
  })).data)
}
export async function actualizarUsuario(id, cambios) {
  const dto = { nombre: cambios.nombre, apellidos: cambios.apellidos, correo: cambios.correo, rol: cambios.rol,
    ...(cambios.activo !== undefined && { estado: cambios.activo ? 'activo' : 'deshabilitado' }) }
  return usuarioRespuesta((await api.patch(`/usuarios/${id}`, dto)).data)
}
export async function desactivarUsuario(id) { await api.delete(`/usuarios/${id}`) }
