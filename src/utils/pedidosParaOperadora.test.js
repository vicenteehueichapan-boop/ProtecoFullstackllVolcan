import { describe, expect, it } from 'vitest'
import { pedidosParaOperadora } from './pedidosParaOperadora'

// La hora "actual" se entrega como parámetro: la prueba no depende del reloj del equipo.
const ahora = new Date(2026, 9, 21, 0, 10) // 21 de octubre, 00:10 (recién pasada la medianoche)

function pedido(id, estado, fecha) {
  return { id, estado, fechaCreacion: fecha.toISOString() }
}

describe('pedidosParaOperadora', () => {
  it('mantiene un pedido pendiente de ayer después de la medianoche', () => {
    const deAnoche = pedido('PED-0001', 'pendiente', new Date(2026, 9, 20, 23, 50))

    expect(pedidosParaOperadora([deAnoche], ahora).map((item) => item.id)).toEqual(['PED-0001'])
  })

  it('incluye todo lo de hoy y lo no entregado de días anteriores, sin los entregados antiguos', () => {
    const pedidos = [
      pedido('PED-0001', 'entregado', new Date(2026, 9, 20, 10, 0)),
      pedido('PED-0002', 'en_camino', new Date(2026, 9, 19, 18, 0)),
      pedido('PED-0003', 'entregado', new Date(2026, 9, 21, 0, 5)),
      pedido('PED-0004', 'pendiente', new Date(2026, 9, 21, 0, 8)),
    ]

    expect(pedidosParaOperadora(pedidos, ahora).map((item) => item.id)).toEqual(['PED-0002', 'PED-0003', 'PED-0004'])
  })
})
