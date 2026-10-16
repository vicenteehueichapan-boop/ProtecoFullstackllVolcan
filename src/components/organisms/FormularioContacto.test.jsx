import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FormularioContacto from './FormularioContacto'

describe('FormularioContacto', () => {
  it('muestra los errores junto a cada campo y no avisa a la página', async () => {
    const alEnviar = vi.fn()
    render(<FormularioContacto alEnviar={alEnviar} />)

    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByLabelText('Nombre')).toHaveAccessibleDescription('Ingresa tu nombre.')
    expect(screen.getByLabelText('Motivo')).toHaveAccessibleDescription('Selecciona el motivo de tu mensaje.')
    expect(screen.getByLabelText('Mensaje')).toHaveAttribute('aria-invalid', 'true')
    expect(alEnviar).not.toHaveBeenCalled()
  })

  it('entrega los datos válidos a la página y cuenta los caracteres', async () => {
    const alEnviar = vi.fn()
    render(<FormularioContacto alEnviar={alEnviar} />)

    await userEvent.type(screen.getByLabelText('Nombre'), 'Ana Pérez')
    await userEvent.type(screen.getByLabelText('Correo para responderte'), 'ana@correo.cl')
    await userEvent.selectOptions(screen.getByLabelText('Motivo'), 'Cobertura y horarios')
    await userEvent.type(screen.getByLabelText('Mensaje'), '¿Llegan a Pinto?')
    expect(screen.getByText('16 de 500 caracteres')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(alEnviar).toHaveBeenCalledExactlyOnceWith({
      nombre: 'Ana Pérez', correo: 'ana@correo.cl', motivo: 'Cobertura y horarios', mensaje: '¿Llegan a Pinto?',
    })
  })

  it('parte con el nombre y correo recibidos por props', () => {
    render(<FormularioContacto alEnviar={vi.fn()} datosIniciales={{ nombre: 'Ana', correo: 'ana@correo.cl' }} />)

    expect(screen.getByLabelText('Nombre')).toHaveValue('Ana')
    expect(screen.getByLabelText('Correo para responderte')).toHaveValue('ana@correo.cl')
  })
})
