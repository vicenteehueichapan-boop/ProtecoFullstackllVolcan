import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAhora } from './useAhora'

describe('useAhora', () => {
  // Preparación: se controla el reloj para que la prueba no dependa de la hora real.
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 20, 23, 59))
  })

  // Limpieza: se devuelve el reloj real aunque una aserción falle.
  afterEach(() => vi.useRealTimers())

  it('entrega la hora actual y la renueva en cada intervalo', () => {
    const { result } = renderHook(() => useAhora(60_000))
    expect(result.current.getDate()).toBe(20)

    act(() => vi.advanceTimersByTime(60_000))

    expect(result.current.getDate()).toBe(21)
    expect(result.current.getHours()).toBe(0)
  })

  it('limpia el temporizador al desmontar', () => {
    const limpiar = vi.spyOn(globalThis, 'clearInterval')
    const { unmount } = renderHook(() => useAhora(60_000))

    unmount()

    expect(limpiar).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(0)
  })
})
