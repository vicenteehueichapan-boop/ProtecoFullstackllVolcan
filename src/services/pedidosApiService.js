import { api } from './api'
import { pedidoEntrada, pedidoRespuesta } from '../dto/api.dto'

export async function listarPedidos(signal) { return (await api.get('/pedidos', { signal })).data.map(pedidoRespuesta) }
export async function obtenerPedido(id) { return pedidoRespuesta((await api.get(`/pedidos/${id}`)).data) }
export async function crearPedido(datos) { return pedidoRespuesta((await api.post('/pedidos', pedidoEntrada(datos))).data) }
export async function asignarRepartidor(id, repartidorId) {
  return pedidoRespuesta((await api.patch(`/pedidos/${id}/asignacion`, { repartidorId })).data)
}
export async function cambiarEstadoPedido(id, estado) {
  return pedidoRespuesta((await api.patch(`/pedidos/${id}/estado`, { estado })).data)
}
export async function eliminarPedido(id) { await api.delete(`/pedidos/${id}`) }
