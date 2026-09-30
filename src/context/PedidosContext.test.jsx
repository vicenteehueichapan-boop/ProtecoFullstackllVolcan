import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePedidos } from '../hooks/usePedidos'
import { ESTADOS_PEDIDO } from '../services/pedidoService'
import { PedidosProvider } from './PedidosContext'

const datosPedido = {
  cliente: { nombre: 'Ana Pérez' },
  productos: [{ codigo: 'CL001', cantidad: 1, precioUnitario: 15990 }],
  total: 15990,
}

function envolverConProvider({ children }) {
  return <PedidosProvider>{children}</PedidosProvider>
}

describe('PedidosProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('mantiene sincronizado el estado al crear un pedido', () => {
    const { result } = renderHook(() => usePedidos(), { wrapper: envolverConProvider })

    act(() => {
      result.current.crearPedido(datosPedido)
    })

    expect(result.current.pedidos).toHaveLength(1)
    expect(result.current.pedidos[0]).toMatchObject({
      id: 'PED-0001',
      estado: ESTADOS_PEDIDO.PENDIENTE,
    })
  })

  it('expone las operaciones de asignación y cambio de estado', () => {
    const { result } = renderHook(() => usePedidos(), { wrapper: envolverConProvider })

    act(() => {
      result.current.crearPedido(datosPedido)
    })
    act(() => {
      result.current.asignarRepartidor('PED-0001', 'Carlos Soto')
    })
    act(() => {
      result.current.cambiarEstado('PED-0001', ESTADOS_PEDIDO.EN_CAMINO)
    })

    expect(result.current.pedidos[0]).toMatchObject({
      repartidor: 'Carlos Soto',
      estado: ESTADOS_PEDIDO.EN_CAMINO,
    })
  })

  it('exige utilizar el hook dentro de su proveedor', () => {
    expect(() => renderHook(() => usePedidos())).toThrow(
      'usePedidos debe utilizarse dentro de PedidosProvider',
    )
  })
})
