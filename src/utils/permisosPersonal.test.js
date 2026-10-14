import { describe, expect, it } from 'vitest'
import { identificarPersonal, puedeAccederPersonal } from './permisosPersonal'

describe('permisos simulados del personal', () => {
  it('identifica un perfil normalizando correo y entrega una copia', () => {
    const perfil = identificarPersonal(' ADMINISTRACION@EJEMPLO.CL ')
    expect(perfil.rol).toBe('administracion')
    perfil.rol = 'cliente'
    expect(identificarPersonal('administracion@ejemplo.cl').rol).toBe('administracion')
  })
  it('rechaza compradores, valores inválidos y roles alterados', () => {
    expect(identificarPersonal('comprador@ejemplo.cl')).toBeNull()
    expect(identificarPersonal(null)).toBeNull()
    expect(puedeAccederPersonal(null, ['administracion'])).toBe(false)
    expect(puedeAccederPersonal({ correo: 'operadora@ejemplo.cl', rol: 'administracion' }, ['administracion'])).toBe(false)
  })
  it('separa administración, operadora y repartidores', () => {
    const operadora = identificarPersonal('operadora@ejemplo.cl')
    expect(puedeAccederPersonal(operadora, ['operadora'])).toBe(true)
    expect(puedeAccederPersonal(operadora, ['administracion'])).toBe(false)
    expect(identificarPersonal('repartidor2@ejemplo.cl').nombre).toBe('Repartidor 2')
  })
})
