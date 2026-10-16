import { describe, expect, it } from 'vitest'
import { esEntregaDe } from './esEntregaDe'

const repartidor1 = { id: 'repartidor-1', nombre: 'Repartidor 1' }

describe('esEntregaDe', () => {
  it('reconoce el pedido por el identificador del repartidor', () => {
    expect(esEntregaDe({ repartidorId: 'repartidor-1', repartidor: 'Otro nombre' }, repartidor1)).toBe(true)
    expect(esEntregaDe({ repartidorId: 'repartidor-2', repartidor: 'Repartidor 1' }, repartidor1)).toBe(false)
  })

  it('reconoce por nombre los pedidos asignados antes de guardar el identificador', () => {
    expect(esEntregaDe({ repartidor: 'Repartidor 1' }, repartidor1)).toBe(true)
    expect(esEntregaDe({ repartidor: null }, repartidor1)).toBe(false)
  })

  it('no asigna pedidos cuando no hay repartidor', () => {
    expect(esEntregaDe({ repartidorId: 'repartidor-1' }, null)).toBe(false)
  })
})
