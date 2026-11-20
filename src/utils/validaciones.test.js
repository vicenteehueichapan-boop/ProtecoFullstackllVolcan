import { describe, expect, it } from 'vitest'
import { validarClave, validarCorreo, validarIngreso } from './validaciones'

describe('validaciones puras de formularios', () => {
  it('acepta un correo válido y rechaza uno incompleto', () => {
    expect(validarCorreo('cliente@ejemplo.cl')).toBe('')
    expect(validarCorreo('cliente@ejemplo')).toBe('Ingresa un correo válido.')
  })

  it('rechaza siete caracteres y acepta el límite de ocho', () => {
    expect(validarClave('1234567')).toBe('La contraseña debe tener entre 8 y 128 caracteres.')
    expect(validarClave('12345678')).toBe('')
  })

  it('devuelve juntos los errores de ingreso', () => {
    expect(validarIngreso('', '')).toEqual({
      correo: 'Ingresa un correo válido.',
      clave: 'La contraseña debe tener entre 8 y 128 caracteres.',
    })
    expect(validarIngreso('cliente@ejemplo.cl', '12345678')).toEqual({})
  })
})
