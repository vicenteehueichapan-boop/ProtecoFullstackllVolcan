import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TarjetaArticulo from './TarjetaArticulo'

const articulo = {
  slug: 'mi-entrada',
  categoria: 'Despacho',
  titulo: 'Mi entrada',
  resumen: 'Resumen breve.',
  imagen: '/imagen.svg',
}

describe('TarjetaArticulo', () => {
  it('muestra categoría, título y resumen y lleva al detalle de la entrada', async () => {
    const alNavegar = vi.fn()
    render(<TarjetaArticulo articulo={articulo} alNavegar={alNavegar} />)

    expect(screen.getByRole('heading', { name: 'Mi entrada' })).toBeInTheDocument()
    expect(screen.getByText('Resumen breve.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('link', { name: 'Leer «Mi entrada»' }))

    expect(alNavegar).toHaveBeenCalledExactlyOnceWith('/blog/mi-entrada')
  })
})
