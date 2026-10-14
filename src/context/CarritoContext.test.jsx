import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CarritoProvider } from './CarritoContext'
import { useCarrito } from '../hooks/useCarrito'

describe('CarritoProvider', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.restoreAllMocks())
  const wrapper = CarritoProvider

  it('comparte operaciones y recupera las líneas al volver a montar', () => {
    const { result, unmount } = renderHook(() => useCarrito(), { wrapper })
    act(() => result.current.agregar('CL001'))
    act(() => result.current.cambiarCantidad('CL001', 2))
    act(() => result.current.cambiarTarifa('comercial'))
    expect(result.current.carrito.lineas).toEqual([{ codigo: 'CL001', cantidad: 2 }])
    unmount()
    const siguiente = renderHook(() => useCarrito(), { wrapper })
    expect(siguiente.result.current.carrito.tipoCliente).toBe('comercial')
    expect(siguiente.result.current.carrito.lineas[0].cantidad).toBe(2)
    act(() => siguiente.result.current.quitar('CL001'))
    expect(siguiente.result.current.carrito.lineas).toEqual([])
  })

  it('no cambia el estado si la escritura falla', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper })
    act(() => result.current.agregar('CL001'))
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Sin espacio') })
    act(() => expect(result.current.cambiarCantidad('CL001', 2)).toBe(false))
    expect(result.current.carrito.lineas[0].cantidad).toBe(1)
    expect(result.current.error).toContain('Sin espacio')
  })

  it('informa datos dañados y los conserva hasta un vaciado explícito', () => {
    localStorage.setItem('gas-el-volcan-carrito', '{')
    const { result } = renderHook(() => useCarrito(), { wrapper })
    expect(result.current.error).not.toBe('')
    expect(localStorage.getItem('gas-el-volcan-carrito')).toBe('{')
    act(() => result.current.vaciar())
    expect(result.current.error).toBe('')
    expect(result.current.carrito.lineas).toEqual([])
  })

  it('detecta la ausencia de proveedor', () => {
    expect(() => renderHook(() => useCarrito())).toThrow('CarritoProvider')
  })
})
