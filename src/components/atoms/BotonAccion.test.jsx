import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Link } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import BotonAccion from './BotonAccion'

describe('BotonAccion', () => {
  it('presenta los hijos y ejecuta la acción sin enviar un formulario', async () => {
    const alPulsar = vi.fn()
    render(<BotonAccion onClick={alPulsar}>Consultar</BotonAccion>)
    const boton = screen.getByRole('button', { name: 'Consultar' })
    expect(boton).toHaveAttribute('type', 'button')
    await userEvent.click(boton)
    expect(alPulsar).toHaveBeenCalledOnce()
  })

  it('respeta la deshabilitación y el tipo de envío explícito', async () => {
    const alPulsar = vi.fn()
    render(<BotonAccion tipo="submit" disabled onClick={alPulsar}>Guardar</BotonAccion>)
    const boton = screen.getByRole('button', { name: 'Guardar' })
    expect(boton).toHaveAttribute('type', 'submit')
    expect(boton).toBeDisabled()
    await userEvent.click(boton)
    expect(alPulsar).not.toHaveBeenCalled()
  })

  it('reenvía la ruta, el estilo y el nombre accesible al enlace', () => {
    render(
      <MemoryRouter>
        <BotonAccion as={Link} to="/catalogo" variante="outline-danger" aria-label="Abrir catálogo">
          Ver productos
        </BotonAccion>
      </MemoryRouter>,
    )
    const enlace = screen.getByRole('button', { name: 'Abrir catálogo' })
    expect(enlace).toHaveAttribute('href', '/catalogo')
    expect(enlace).toHaveClass('btn-outline-danger')
  })
})
