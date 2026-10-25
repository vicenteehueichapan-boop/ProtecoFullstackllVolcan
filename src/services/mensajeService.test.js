import { beforeEach, describe, expect, it } from 'vitest'
import { crearMensaje, listarMensajes } from './mensajeService'

const datos = {
  nombre: ' Ana Pérez ',
  correo: 'ANA@correo.cl',
  motivo: 'Consulta de productos',
  mensaje: '¿El regulador sirve para 15 kg?',
}

describe('mensajeService', () => {
  beforeEach(() => localStorage.clear())

  it('guarda el mensaje con número correlativo y datos limpios', () => {
    const primero = crearMensaje(datos)
    const segundo = crearMensaje(datos)

    expect(primero).toMatchObject({ id: 'MSG-0001', nombre: 'Ana Pérez', correo: 'ana@correo.cl' })
    expect(segundo.id).toBe('MSG-0002')
    expect(listarMensajes()).toHaveLength(2)
  })

  it('no guarda un mensaje inválido aunque llegue sin pasar por el formulario', () => {
    expect(() => crearMensaje({ ...datos, mensaje: 'corto' })).toThrow('no son válidos')
    expect(listarMensajes()).toEqual([])
  })

  it('informa mensajes dañados sin borrarlos', () => {
    localStorage.setItem('gas-el-volcan-mensajes', '[{"id":"x"}]')

    expect(() => crearMensaje(datos)).toThrow('Los mensajes guardados están dañados')
    expect(localStorage.getItem('gas-el-volcan-mensajes')).toBe('[{"id":"x"}]')
  })
})
