import { useCallback, useMemo, useState } from 'react'
import {
  asignarRepartidor as asignarRepartidorService,
  cambiarEstadoPedido as cambiarEstadoPedidoService,
  crearPedido as crearPedidoService,
  listarPedidos,
  obtenerPedidoPorId,
  restaurarPedidos as restaurarPedidosService,
} from '../services/pedidoService'
import { PedidosContext } from './pedidosContextoBase'

export function PedidosProvider({ children }) {
  const [pedidos, setPedidos] = useState(() => listarPedidos())

  const sincronizarPedidos = useCallback(() => {
    const pedidosActualizados = listarPedidos()
    setPedidos(pedidosActualizados)
    return pedidosActualizados
  }, [])

  const crearPedido = useCallback((datosPedido) => {
    const pedidoCreado = crearPedidoService(datosPedido)
    sincronizarPedidos()
    return pedidoCreado
  }, [sincronizarPedidos])

  const asignarRepartidor = useCallback((id, repartidor) => {
    const pedidoActualizado = asignarRepartidorService(id, repartidor)
    sincronizarPedidos()
    return pedidoActualizado
  }, [sincronizarPedidos])

  const cambiarEstado = useCallback((id, nuevoEstado) => {
    const pedidoActualizado = cambiarEstadoPedidoService(id, nuevoEstado)
    sincronizarPedidos()
    return pedidoActualizado
  }, [sincronizarPedidos])

  const buscarPedido = useCallback((id) => obtenerPedidoPorId(id), [])

  const restaurarPedidos = useCallback(() => {
    const pedidosRestaurados = restaurarPedidosService()
    setPedidos(pedidosRestaurados)
    return pedidosRestaurados
  }, [])

  const valor = useMemo(() => ({
    pedidos,
    crearPedido,
    buscarPedido,
    asignarRepartidor,
    cambiarEstado,
    restaurarPedidos,
  }), [
    pedidos,
    crearPedido,
    buscarPedido,
    asignarRepartidor,
    cambiarEstado,
    restaurarPedidos,
  ])

  return (
    <PedidosContext.Provider value={valor}>
      {children}
    </PedidosContext.Provider>
  )
}
