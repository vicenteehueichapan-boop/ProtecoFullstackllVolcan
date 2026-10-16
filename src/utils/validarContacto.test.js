import { describe, expect, it } from 'vitest'
import { validarContacto } from './validarContacto'

const valido = {
  nombre: 'Ana Pérez',
  correo: 'ana@correo.cl',
  motivo: 'Cobertura y horarios',
  mensaje: '¿Despachan a Pinto los jueves?',
}

describe('validarContacto', () => {
  it('acepta un mensaje completo', () => {
    expect(validarContacto(valido)).toEqual({})
  })

  it('informa todos los campos con error a la vez', () => {
    expect(validarContacto({ nombre: ' ', correo: 'ana', motivo: '', mensaje: 'hola' })).toEqual({
      nombre: 'Ingresa tu nombre.',
      correo: 'Ingresa un correo válido.',
      motivo: 'Selecciona el motivo de tu mensaje.',
      mensaje: 'Escribe tu mensaje (al menos 10 caracteres).',
    })
  })

  it('rechaza un mensaje de más de 500 caracteres', () => {
    expect(validarContacto({ ...valido, mensaje: 'a'.repeat(501) }).mensaje)
      .toBe('El mensaje admite hasta 500 caracteres.')
  })
})
