import { describe, expect, it } from 'vitest'
import { formatearPrecio } from './formatearPrecio'

describe('formatearPrecio', () => {
  it('muestra pesos chilenos con separador de miles y sin decimales', () => {
    expect(formatearPrecio(12000)).toBe('$12.000')
    expect(formatearPrecio(990)).toBe('$990')
  })

  it('formatea el cero', () => {
    expect(formatearPrecio(0)).toBe('$0')
  })
})
