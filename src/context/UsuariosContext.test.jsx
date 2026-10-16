import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useUsuarios } from '../hooks/useUsuarios'
import { UsuariosProvider } from './UsuariosContext'

describe('UsuariosProvider', () => {
  beforeEach(() => localStorage.clear())

  it('comparte personal y clientes, y refresca el estado después de cada cambio', () => {
    const { result } = renderHook(() => useUsuarios(), { wrapper: UsuariosProvider })
    expect(result.current.personal).toHaveLength(5)
    expect(result.current.clientes).toEqual([])

    act(() => { result.current.crearPersonal({ nombre: 'Repartidor 4', correo: 'r4@ejemplo.cl', rol: 'repartidor' }) })
    act(() => { result.current.actualizarPersonal('repartidor-1', { activo: false }) })
    act(() => { result.current.crearCliente({ nombre: 'Ana', apellidos: 'Pérez', run: '12345678K', correo: 'ana@correo.cl', tipoCliente: 'residencial' }) })
    act(() => { result.current.actualizarCliente('CLI-0001', { tipoCliente: 'comercial' }) })

    expect(result.current.personal).toHaveLength(6)
    expect(result.current.personal.find((perfil) => perfil.id === 'repartidor-1').activo).toBe(false)
    expect(result.current.clientes[0].tipoCliente).toBe('comercial')
  })

  it('no cambia el estado si el servicio rechaza el cambio', () => {
    const { result } = renderHook(() => useUsuarios(), { wrapper: UsuariosProvider })

    expect(() => act(() => { result.current.crearPersonal({ nombre: 'X', correo: 'x', rol: 'otro' }) })).toThrow()
    expect(result.current.personal).toHaveLength(5)
  })

  it('informa perfiles dañados sin cerrar la aplicación', () => {
    localStorage.setItem('gas-el-volcan-personal', '{')
    const { result } = renderHook(() => useUsuarios(), { wrapper: UsuariosProvider })

    expect(result.current.personal).toEqual([])
    expect(result.current.errorPersonal).toContain('dañados')
  })

  it('exige utilizar el hook dentro de su proveedor', () => {
    expect(() => renderHook(() => useUsuarios())).toThrow('UsuariosProvider')
  })
})
