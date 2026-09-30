import { useContext } from 'react'
import { PedidosContext } from '../context/pedidosContextoBase'

export function usePedidos() {
  const contexto = useContext(PedidosContext)

  if (contexto === null) {
    throw new Error('usePedidos debe utilizarse dentro de PedidosProvider')
  }

  return contexto
}
