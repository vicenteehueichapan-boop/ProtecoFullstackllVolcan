import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import BarraNavegacion from './BarraNavegacion'

describe('BarraNavegacion', () => {
  it('marca como actual el enlace de la ruta recibida y sus subrutas', () => {
    render(<BarraNavegacion rutaActual="/catalogo" alNavegar={vi.fn()} cliente={null} alSalir={vi.fn()} />)

    expect(screen.getByRole('link', { name: 'Catálogo' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current')
  })

  it('sin sesión ofrece ingresar y registrarse', () => {
    render(<BarraNavegacion rutaActual="/" alNavegar={vi.fn()} cliente={null} alSalir={vi.fn()} />)

    expect(screen.getByRole('link', { name: 'Ingresar' })).toHaveAttribute('href', '/ingreso')
    expect(screen.queryByRole('link', { name: 'Mis pedidos' })).not.toBeInTheDocument()
  })

  it('con sesión ofrece Mis pedidos y cierra la sesión mediante el callback', async () => {
    const alSalir = vi.fn()
    render(<BarraNavegacion rutaActual="/" alNavegar={vi.fn()} cliente={{ nombre: 'Ana' }} alSalir={alSalir} />)

    expect(screen.queryByRole('link', { name: 'Ingresar' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión (Ana)' }))

    expect(alSalir).toHaveBeenCalledOnce()
  })

  it('agrupa Nosotros, Blog y Contacto en el menú Información', async () => {
    const alNavegar = vi.fn()
    render(<BarraNavegacion rutaActual="/blog/una-entrada" alNavegar={alNavegar} cliente={null} alSalir={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'Información' }))
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('aria-current', 'page')
    await userEvent.click(screen.getByRole('link', { name: 'Contacto' }))

    expect(alNavegar).toHaveBeenCalledExactlyOnceWith('/contacto')
  })

  it('avisa la ruta elegida sin recargar la página', async () => {
    const alNavegar = vi.fn()
    render(<BarraNavegacion rutaActual="/" alNavegar={alNavegar} cliente={null} alSalir={vi.fn()} />)

    await userEvent.click(screen.getByRole('link', { name: 'Mi carrito' }))

    expect(alNavegar).toHaveBeenCalledExactlyOnceWith('/carrito')
  })
})
