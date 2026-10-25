import { describe, expect, it } from 'vitest'
import { filtrarPedidos } from './filtrarPedidos'

const pedidos = [
  { id: 'PED-0001', estado: 'entregado', fechaCreacion: '2026-10-19T10:00:00Z', cliente: { nombre: 'Ana Pérez', correo: 'ana@correo.cl' } },
  { id: 'PED-0002', estado: 'pendiente', fechaCreacion: '2026-10-21T10:00:00Z', cliente: { nombre: 'Luis Soto' } },
  { id: 'PED-0003', estado: 'pendiente', fechaCreacion: '2026-10-20T10:00:00Z', cliente: { nombre: 'Ana Rojas', correo: 'rojas@correo.cl' } },
]

describe('filtrarPedidos', () => {
  it('sin filtros devuelve todos, del más reciente al más antiguo', () => {
    expect(filtrarPedidos(pedidos).map((pedido) => pedido.id)).toEqual(['PED-0002', 'PED-0003', 'PED-0001'])
  })

  it('filtra por estado', () => {
    expect(filtrarPedidos(pedidos, { estado: 'pendiente' }).map((pedido) => pedido.id)).toEqual(['PED-0002', 'PED-0003'])
  })

  it('busca por número, nombre o correo sin distinguir mayúsculas', () => {
    expect(filtrarPedidos(pedidos, { texto: 'ana' }).map((pedido) => pedido.id)).toEqual(['PED-0003', 'PED-0001'])
    expect(filtrarPedidos(pedidos, { texto: 'ped-0002' })).toHaveLength(1)
    expect(filtrarPedidos(pedidos, { texto: 'ROJAS@' })).toHaveLength(1)
  })

  it('no modifica la lista recibida', () => {
    const copia = structuredClone(pedidos)
    filtrarPedidos(pedidos, { texto: 'ana' })
    expect(pedidos).toEqual(copia)
  })
})
