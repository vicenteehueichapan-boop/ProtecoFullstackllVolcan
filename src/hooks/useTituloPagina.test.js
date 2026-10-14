import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useTituloPagina } from './useTituloPagina'

describe('useTituloPagina', () => {
  beforeEach(() => {
    document.title = 'Título inicial'
  })

  it('coloca el título de la página con el nombre del negocio', () => {
    renderHook(() => useTituloPagina('Inicio'))
    expect(document.title).toBe('Inicio | Gas El Volcán')
  })

  it('actualiza el título cuando cambia la propiedad', () => {
    const { rerender } = renderHook(({ titulo }) => useTituloPagina(titulo), {
      initialProps: { titulo: 'Inicio' },
    })
    rerender({ titulo: 'Catálogo' })
    expect(document.title).toBe('Catálogo | Gas El Volcán')
  })

  it('restaura el título previo al desmontar', () => {
    const { unmount } = renderHook(() => useTituloPagina('Catálogo'))
    unmount()
    expect(document.title).toBe('Título inicial')
  })
})
