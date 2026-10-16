import { describe, expect, it } from 'vitest'
import { validarCategoria } from './validarCategoria'

describe('validarCategoria', () => {
  it('acepta un nombre con descripción opcional', () => {
    expect(validarCategoria({ nombre: 'Repuestos', descripcion: '' })).toEqual({})
  })

  it('informa nombre corto y descripción demasiado larga', () => {
    expect(validarCategoria({ nombre: ' ab ', descripcion: 'x'.repeat(201) })).toEqual({
      nombre: 'El nombre debe tener al menos 3 caracteres.',
      descripcion: 'La descripción admite hasta 200 caracteres.',
    })
  })
})
