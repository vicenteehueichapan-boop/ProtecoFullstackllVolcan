import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('reenvía la variante de Bootstrap y las demás props al botón', () => {
    render(<BotonAccion variante="outline-danger" aria-label="Vaciar el carrito" className="w-100">Vaciar</BotonAccion>)
    const boton = screen.getByRole('button', { name: 'Vaciar el carrito' })
    expect(boton).toHaveClass('btn-outline-danger', 'w-100')
  })
})
