import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  actualizarPersonal,
  buscarPersonalActivoPorCorreo,
  crearPersonal,
  listarPersonal,
} from './personalService'

const nuevoRepartidor = { nombre: 'Repartidor 4', correo: ' Repartidor4@Ejemplo.cl ', rol: 'repartidor' }

describe('personalService', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.restoreAllMocks())

  it('inicia con los cinco perfiles ficticios de demostración, todos activos', () => {
    const personal = listarPersonal()

    expect(personal.map((perfil) => perfil.rol)).toEqual(['administracion', 'operadora', 'repartidor', 'repartidor', 'repartidor'])
    expect(personal.every((perfil) => perfil.activo)).toBe(true)
  })

  it('crea un perfil con correo normalizado e identificador propio', () => {
    const creado = crearPersonal(nuevoRepartidor)

    expect(creado).toMatchObject({ id: 'PER-0001', nombre: 'Repartidor 4', correo: 'repartidor4@ejemplo.cl', activo: true })
    expect(listarPersonal()).toHaveLength(6)
  })

  it.each([
    [{ correo: 'operadora@ejemplo.cl' }, 'correo', 'Ya existe un perfil con ese correo'],
    [{ correo: 'sin-arroba' }, 'correo', 'correo válido'],
    [{ nombre: 'A' }, 'nombre', 'nombre'],
    [{ rol: 'cliente' }, 'rol', 'rol'],
  ])('rechaza datos inválidos %j indicando el campo', (cambios, campo, mensaje) => {
    expect(() => crearPersonal({ ...nuevoRepartidor, ...cambios })).toThrow(expect.objectContaining({ campo }))
    expect(() => crearPersonal({ ...nuevoRepartidor, ...cambios })).toThrow(mensaje)
    expect(listarPersonal()).toHaveLength(5)
  })

  it('edita nombre, rol y estado, pero no el correo que identifica al perfil', () => {
    const editado = actualizarPersonal('repartidor-3', { nombre: 'Repartidor Tres', activo: false, correo: 'otro@ejemplo.cl' })

    expect(editado).toMatchObject({ nombre: 'Repartidor Tres', activo: false, correo: 'repartidor3@ejemplo.cl' })
  })

  it('no deja el sistema sin una administración activa', () => {
    expect(() => actualizarPersonal('admin-demo', { activo: false })).toThrow('al menos un perfil de administración activo')
    expect(() => actualizarPersonal('admin-demo', { rol: 'operadora' })).toThrow('al menos un perfil de administración activo')

    crearPersonal({ nombre: 'Segunda administradora', correo: 'admin2@ejemplo.cl', rol: 'administracion' })
    expect(actualizarPersonal('admin-demo', { activo: false }).activo).toBe(false)
  })

  it('solo identifica perfiles activos al ingresar', () => {
    expect(buscarPersonalActivoPorCorreo(' OPERADORA@ejemplo.cl ').id).toBe('operadora-demo')

    actualizarPersonal('operadora-demo', { activo: false })

    expect(() => buscarPersonalActivoPorCorreo('operadora@ejemplo.cl')).toThrow('desactivado')
    expect(() => buscarPersonalActivoPorCorreo('cliente@ejemplo.cl')).toThrow('no corresponde a un perfil del personal')
  })

  it('informa perfiles guardados dañados sin borrarlos', () => {
    localStorage.setItem('gas-el-volcan-personal', '[{"id":"x"}]')

    expect(() => listarPersonal()).toThrow('Los perfiles del personal guardados están dañados')
    expect(localStorage.getItem('gas-el-volcan-personal')).toBe('[{"id":"x"}]')
  })
})
