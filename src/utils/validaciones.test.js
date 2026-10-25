import { describe, expect, it } from 'vitest'
import { validarClave, validarCorreo, validarIngreso } from './validaciones'

describe('validaciones puras de formularios', () => {
  it('acepta un correo válido y rechaza uno incompleto', () => {
    expect(validarCorreo('cliente@ejemplo.cl')).toBe('')
    expect(validarCorreo('cliente@ejemplo')).toBe('Ingresa un correo válido.')
  })

  it('rechaza cinco caracteres y acepta el límite de seis', () => {
    expect(validarClave('12345')).toBe('La contraseña debe tener al menos 6 caracteres.')
    expect(validarClave('123456')).toBe('')
  })

  it('devuelve juntos los errores de ingreso', () => {
    expect(validarIngreso('', '')).toEqual({
      correo: 'Ingresa un correo válido.',
      clave: 'La contraseña debe tener al menos 6 caracteres.',
    })
    expect(validarIngreso('cliente@ejemplo.cl', '123456')).toEqual({})
  })
})
