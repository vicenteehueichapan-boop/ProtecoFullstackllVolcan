import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSesionCliente } from '../hooks/useSesionCliente'
import { SesionClienteProvider } from './SesionClienteContext'
import { UsuariosProvider } from './UsuariosContext'

// La sesión toma las cuentas desde UsuariosContext, por eso se monta dentro de él.
function Proveedores({ children }) {
  return <UsuariosProvider><SesionClienteProvider>{children}</SesionClienteProvider></UsuariosProvider>
}

const datosCamila = {
  nombre: 'Camila', apellidos: 'Sepúlveda', run: '12345678K',
  correo: 'camila@correo.cl', tipoCliente: 'comercial',
}

describe('SesionClienteProvider', () => {
  beforeEach(() => localStorage.clear())

  it('registra, deja la sesión iniciada y la recupera al volver a montar', () => {
    const { result, unmount } = renderHook(() => useSesionCliente(), { wrapper: Proveedores })
    expect(result.current.cliente).toBeNull()

    act(() => { result.current.registrar(datosCamila) })
    expect(result.current.cliente).toMatchObject({ id: 'CLI-0001', tipoCliente: 'comercial' })

    unmount()
    const recargado = renderHook(() => useSesionCliente(), { wrapper: Proveedores })
    expect(recargado.result.current.cliente?.correo).toBe('camila@correo.cl')
  })

  it('cierra la sesión, vuelve a ingresar y guarda los datos de entrega', () => {
    const { result } = renderHook(() => useSesionCliente(), { wrapper: Proveedores })
    act(() => { result.current.registrar(datosCamila) })
    act(() => result.current.salir())
    expect(result.current.cliente).toBeNull()

    act(() => { result.current.ingresar('camila@correo.cl') })
    act(() => { result.current.actualizarDatos({ direccion: 'Los Aromos 123', zonaId: 'centro' }) })
    expect(result.current.cliente).toMatchObject({ direccion: 'Los Aromos 123', zonaId: 'centro' })
  })

  it('no cambia la sesión cuando el ingreso falla', () => {
    const { result } = renderHook(() => useSesionCliente(), { wrapper: Proveedores })

    expect(() => act(() => { result.current.ingresar('nadie@correo.cl') })).toThrow('No existe una cuenta')
    expect(result.current.cliente).toBeNull()
  })

  it('informa cuentas dañadas sin cerrar la aplicación', () => {
    localStorage.setItem('gas-el-volcan-clientes', '{')
    localStorage.setItem('gas-el-volcan-sesion-cliente', 'CLI-0001')
    const { result } = renderHook(() => useSesionCliente(), { wrapper: Proveedores })

    expect(result.current.cliente).toBeNull()
    expect(result.current.errorClientes).toContain('Las cuentas guardadas están dañadas')
  })

  it('exige utilizar el hook dentro de su proveedor', () => {
    expect(() => renderHook(() => useSesionCliente())).toThrow('SesionClienteProvider')
  })
})
