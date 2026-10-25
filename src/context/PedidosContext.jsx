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

// Si los pedidos guardados están dañados, se muestra el problema sin borrarlos.
function leerPedidos() {
  try {
    return { pedidos: listarPedidos(), error: '' }
  } catch (excepcion) {
    return { pedidos: [], error: excepcion.message }
  }
}

export function PedidosProvider({ children }) {
  const [registro, setRegistro] = useState(leerPedidos)
  const { pedidos, error: errorPedidos } = registro

  const sincronizarPedidos = useCallback(() => {
    const lectura = leerPedidos()
    setRegistro(lectura)
    return lectura.pedidos
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
    setRegistro({ pedidos: pedidosRestaurados, error: '' })
    return pedidosRestaurados
  }, [])

  const valor = useMemo(() => ({
    pedidos,
    errorPedidos,
    crearPedido,
    buscarPedido,
    asignarRepartidor,
    cambiarEstado,
    restaurarPedidos,
  }), [
    pedidos,
    errorPedidos,
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
