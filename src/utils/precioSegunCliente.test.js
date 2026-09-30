import { describe, expect, it } from 'vitest'
import { precioSegunCliente } from './precioSegunCliente'

const producto = {
  precioResidencial: 12000,
  precioComercial: 11000,
}

describe('precioSegunCliente', () => {
  it('devuelve el precio residencial', () => {
    expect(precioSegunCliente(producto, 'residencial')).toBe(12000)
  })

  it('devuelve el precio comercial', () => {
    expect(precioSegunCliente(producto, 'comercial')).toBe(11000)
  })

  it('rechaza un tipo de cliente desconocido', () => {
    expect(() => precioSegunCliente(producto, 'otro')).toThrow(
      'El tipo de cliente debe ser residencial o comercial',
    )
  })
})
