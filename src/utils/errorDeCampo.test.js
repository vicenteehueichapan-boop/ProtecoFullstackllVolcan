import { describe, expect, it } from 'vitest'
import { errorDeCampo } from './errorDeCampo'

describe('errorDeCampo', () => {
  it('crea un Error con su mensaje y el campo al que corresponde', () => {
    const error = errorDeCampo('correo', 'Ya existe una cuenta con ese correo.')

    expect(error).toBeInstanceOf(Error)
    expect(error).toMatchObject({ campo: 'correo', message: 'Ya existe una cuenta con ese correo.' })
  })
})
