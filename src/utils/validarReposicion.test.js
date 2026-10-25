import { describe, expect, it } from 'vitest'
import { validarReposicion } from './validarReposicion'

describe('validarReposicion', () => {
  it.each(['1', '25', '1000'])('acepta %s', (texto) => {
    expect(validarReposicion(texto)).toBe('')
  })

  it.each(['', '0', '-3', '2.5', 'diez', '1001'])('rechaza %j', (texto) => {
    expect(validarReposicion(texto)).toBe('Ingresa una cantidad entera entre 1 y 1000.')
  })
})
