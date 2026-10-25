import { describe, expect, it } from 'vitest'
import { puedeVerPedido } from './puedeVerPedido'

const pedido = { id: 'PED-0001', clienteId: 'CLI-0001', cliente: { nombre: 'Ana Pérez', correo: 'ana@correo.cl' } }

describe('puedeVerPedido', () => {
  it('permite ver el pedido a la cuenta que lo registró o a quien escribe su correo', () => {
    expect(puedeVerPedido(pedido, { cliente: { id: 'CLI-0001' } })).toBe(true)
    expect(puedeVerPedido(pedido, { correo: ' ANA@correo.cl ' })).toBe(true)
  })

  it('oculta el pedido a otra cuenta o a otro correo', () => {
    expect(puedeVerPedido(pedido, { cliente: { id: 'CLI-0002' } })).toBe(false)
    expect(puedeVerPedido(pedido, { correo: 'otra@correo.cl' })).toBe(false)
  })
})
