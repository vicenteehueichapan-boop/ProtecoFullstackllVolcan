import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import CampoEntrada from './CampoEntrada'

describe('CampoEntrada', () => {
  it('es un campo controlado: muestra value y avisa cada cambio', async () => {
    const alCambiar = vi.fn()
    render(<CampoEntrada aria-label="Código" value="CL" onChange={alCambiar} />)

    await userEvent.type(screen.getByRole('textbox', { name: 'Código' }), '0')

    // El valor no cambia solo: lo decide quien es dueño del estado.
    expect(screen.getByRole('textbox', { name: 'Código' })).toHaveValue('CL')
    expect(alCambiar).toHaveBeenCalledOnce()
  })

  it('usa el tipo recibido en la prop tipo', () => {
    render(<CampoEntrada aria-label="Correo" tipo="email" value="" onChange={vi.fn()} />)

    expect(screen.getByRole('textbox', { name: 'Correo' })).toHaveAttribute('type', 'email')
  })
})
