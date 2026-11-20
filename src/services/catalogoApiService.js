import { api } from './api'
import { productoEntrada, productoRespuesta } from '../dto/api.dto'

export async function listarProductos(signal) { return (await api.get('/productos', { signal })).data.map(productoRespuesta) }
export async function listarCategorias(signal) { return (await api.get('/categorias', { signal })).data }
export async function listarZonas(signal) { return (await api.get('/zonas', { signal })).data }
export async function crearProducto(datos) { return productoRespuesta((await api.post('/productos', productoEntrada(datos))).data) }
export async function actualizarProducto(codigo, datos) { return productoRespuesta((await api.put(`/productos/${codigo}`, productoEntrada(datos))).data) }
export async function eliminarProducto(codigo) { await api.delete(`/productos/${codigo}`) }
