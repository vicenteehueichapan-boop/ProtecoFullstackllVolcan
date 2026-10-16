import { describe, expect, it } from 'vitest'
import { validarEntrega } from './validarEntrega'

const zonas = [{ id: 'centro' }]
const datos = { nombre: 'Ana', apellidos: 'Li', correo: 'ana@correo.cl', direccion: 'Los Aromos 123', zonaId: 'centro' }

describe('validarEntrega', () => {
  it('acepta los mismos nombres y apellidos cortos que acepta el registro', () => {
    expect(validarEntrega(datos, zonas)).toEqual({})
  })

  it('informa cada campo con error a la vez', () => {
    expect(validarEntrega({ nombre: 'A', apellidos: ' ', correo: 'x', direccion: 'Ca', zonaId: 'marte' }, zonas)).toEqual({
      nombre: 'Ingresa tu nombre.',
      apellidos: 'Ingresa tus apellidos.',
      correo: 'Ingresa un correo válido.',
      direccion: 'Ingresa una dirección de entrega válida.',
      zonaId: 'Selecciona una zona de despacho.',
    })
  })
})
