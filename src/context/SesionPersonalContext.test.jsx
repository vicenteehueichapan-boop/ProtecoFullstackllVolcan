import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSesionPersonal } from '../hooks/useSesionPersonal'
import { useUsuarios } from '../hooks/useUsuarios'
import { SesionPersonalProvider } from './SesionPersonalContext'
import { UsuariosProvider } from './UsuariosContext'

function Proveedores({ children }) {
  return <UsuariosProvider><SesionPersonalProvider>{children}</SesionPersonalProvider></UsuariosProvider>
}

// Hook de prueba que combina la sesión y la administración de usuarios (empieza con use: regla de los hooks).
function useSesionYUsuarios() {
  return { sesion: useSesionPersonal(), usuarios: useUsuarios() }
}

describe('SesionPersonalProvider', () => {
  beforeEach(() => localStorage.clear())

  it('ingresa con un perfil activo y sale', () => {
    const { result } = renderHook(useSesionYUsuarios, { wrapper: Proveedores })

    act(() => { result.current.sesion.ingresarPersonal('operadora@ejemplo.cl') })
    expect(result.current.sesion.personal).toMatchObject({ id: 'operadora-demo', rol: 'operadora' })

    act(() => result.current.sesion.salirPersonal())
    expect(result.current.sesion.personal).toBeNull()
  })

  it('refleja de inmediato un cambio de rol o una desactivación hecha por administración', () => {
    const { result } = renderHook(useSesionYUsuarios, { wrapper: Proveedores })
    act(() => { result.current.sesion.ingresarPersonal('repartidor1@ejemplo.cl') })

    act(() => { result.current.usuarios.actualizarPersonal('repartidor-1', { rol: 'operadora' }) })
    expect(result.current.sesion.personal.rol).toBe('operadora')

    act(() => { result.current.usuarios.actualizarPersonal('repartidor-1', { activo: false }) })
    expect(result.current.sesion.personal).toBeNull()
  })

  it('no inicia sesión con un correo de comprador', () => {
    const { result } = renderHook(useSesionYUsuarios, { wrapper: Proveedores })

    expect(() => act(() => { result.current.sesion.ingresarPersonal('cliente@ejemplo.cl') })).toThrow('no corresponde')
    expect(result.current.sesion.personal).toBeNull()
  })
})
