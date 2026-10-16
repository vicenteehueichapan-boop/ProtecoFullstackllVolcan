import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FormularioRegistro from './FormularioRegistro'

describe('FormularioRegistro', () => {
  it('explica todos los datos que deben corregirse y no avisa a la página', async () => {
    const usuario = userEvent.setup()
    const alRegistrar = vi.fn()
    render(<FormularioRegistro alRegistrar={alRegistrar} />)

    await usuario.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(screen.getByLabelText('Nombre')).toHaveAccessibleDescription('Ingresa tu nombre.')
    expect(screen.getByLabelText('Apellidos')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Ingresa el RUN sin puntos ni guion.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument()
    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres.')).toBeInTheDocument()
    expect(screen.queryByText('Las contraseñas deben coincidir.')).not.toBeInTheDocument()
    expect(alRegistrar).not.toHaveBeenCalled()
  })

  it('mantiene los mensajes correspondientes cuando los datos no cumplen las reglas', async () => {
    const usuario = userEvent.setup()
    const alRegistrar = vi.fn()
    render(<FormularioRegistro alRegistrar={alRegistrar} />)

    await usuario.type(screen.getByLabelText('Nombre'), 'Ana')
    await usuario.type(screen.getByLabelText('Apellidos'), 'Pérez')
    await usuario.type(screen.getByLabelText('RUN sin puntos ni guion'), '12.345.678-K')
    await usuario.type(screen.getByLabelText('Correo'), 'ana@correo')
    await usuario.type(screen.getByLabelText('Contraseña'), '123456')
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), '654321')
    await usuario.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(screen.getByText('Ingresa el RUN sin puntos ni guion.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument()
    expect(screen.getByText('Las contraseñas deben coincidir.')).toBeInTheDocument()
    expect(alRegistrar).not.toHaveBeenCalled()
  })

  it('entrega a la página los datos válidos sin la contraseña', async () => {
    const usuario = userEvent.setup()
    const alRegistrar = vi.fn()
    render(<FormularioRegistro alRegistrar={alRegistrar} />)

    await usuario.type(screen.getByLabelText('Nombre'), 'Camila')
    await usuario.type(screen.getByLabelText('Apellidos'), 'Sepúlveda')
    await usuario.type(screen.getByLabelText('RUN sin puntos ni guion'), '12345678K')
    await usuario.type(screen.getByLabelText('Correo'), 'camila.sepulveda@correo.cl')
    await usuario.selectOptions(screen.getByLabelText('Tipo de cliente'), 'comercial')
    await usuario.type(screen.getByLabelText('Contraseña'), 'volcan2026')
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), 'volcan2026')
    await usuario.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(alRegistrar).toHaveBeenCalledExactlyOnceWith({
      nombre: 'Camila', apellidos: 'Sepúlveda', run: '12345678K',
      correo: 'camila.sepulveda@correo.cl', tipoCliente: 'comercial',
    })
  })
})
