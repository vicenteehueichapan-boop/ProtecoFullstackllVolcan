import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import EnlaceInterno from './EnlaceInterno'

describe('EnlaceInterno', () => {
  it('es un enlace real con su dirección, sin necesitar router', () => {
    render(<EnlaceInterno ruta="/catalogo" alNavegar={vi.fn()}>Catálogo</EnlaceInterno>)

    expect(screen.getByRole('link', { name: 'Catálogo' })).toHaveAttribute('href', '/catalogo')
  })

  it('avisa la ruta al padre en un clic simple', async () => {
    const alNavegar = vi.fn()
    render(<EnlaceInterno ruta="/catalogo" alNavegar={alNavegar}>Catálogo</EnlaceInterno>)

    await userEvent.click(screen.getByRole('link', { name: 'Catálogo' }))

    expect(alNavegar).toHaveBeenCalledExactlyOnceWith('/catalogo')
  })

  it('no intercepta Ctrl + clic, para poder abrir otra pestaña', () => {
    const alNavegar = vi.fn()
    render(<EnlaceInterno ruta="/catalogo" alNavegar={alNavegar}>Catálogo</EnlaceInterno>)

    const sinCancelar = fireEvent.click(screen.getByRole('link', { name: 'Catálogo' }), { ctrlKey: true })

    expect(sinCancelar).toBe(true)
    expect(alNavegar).not.toHaveBeenCalled()
  })

  it('entrega al <a> las demás props, como la clase de Bootstrap', () => {
    render(<EnlaceInterno ruta="/" alNavegar={vi.fn()} className="btn btn-danger">Inicio</EnlaceInterno>)

    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveClass('btn', 'btn-danger')
  })
})
