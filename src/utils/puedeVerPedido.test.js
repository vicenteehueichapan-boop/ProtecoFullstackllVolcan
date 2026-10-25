import { describe, expect, it } from 'vitest'
import { puedeVerPedido } from './puedeVerPedido'

const pedido = { id: 'PED-0001', clienteId: 'CLI-0001', cliente: { nombre: 'Ana Pérez', correo: 'ana@correo.cl' } }

describe('puedeVerPedido', () => {
  it('permite ver el pedido a la cuenta que lo registró', () => {
    expect(puedeVerPedido(pedido, { cliente: { id: 'CLI-0001' } })).toBe(true)
  })

  it('permite ver el pedido a quien escribe el mismo correo, sin importar mayúsculas ni espacios', () => {
    expect(puedeVerPedido(pedido, { correo: ' ANA@correo.cl ' })).toBe(true)
  })

  it.each([
    ['otra cuenta', { cliente: { id: 'CLI-0002' } }],
    ['otro correo', { correo: 'otra@correo.cl' }],
    ['sin datos', {}],
  ])('oculta el pedido con %s', (_caso, quienConsulta) => {
    expect(puedeVerPedido(pedido, quienConsulta)).toBe(false)
  })

  it('no confunde un correo vacío con un pedido que no tiene correo', () => {
    expect(puedeVerPedido({ ...pedido, clienteId: undefined, cliente: { nombre: 'Ana' } }, { correo: '' })).toBe(false)
    expect(puedeVerPedido(null, { correo: 'ana@correo.cl' })).toBe(false)
  })
})
