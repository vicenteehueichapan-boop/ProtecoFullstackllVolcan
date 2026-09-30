import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import FormularioRegistro from './FormularioRegistro'

describe('FormularioRegistro', () => {
  it('explica todos los datos que deben corregirse al enviar el formulario vacío', async () => {
    const usuario = userEvent.setup()
    render(<FormularioRegistro />)

    await usuario.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(screen.getByText('Ingresa tu nombre completo.')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre completo')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Nombre completo')).toHaveAccessibleDescription('Ingresa tu nombre completo.')
    expect(screen.getByText('Ingresa el RUN sin puntos ni guion.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument()
    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres.')).toBeInTheDocument()
    expect(screen.queryByText('Las contraseñas deben coincidir.')).not.toBeInTheDocument()
  })

  it('mantiene los mensajes correspondientes cuando los datos no cumplen las reglas', async () => {
    const usuario = userEvent.setup()
    render(<FormularioRegistro />)

    await usuario.type(screen.getByLabelText('Nombre completo'), 'Ana')
    await usuario.type(screen.getByLabelText('RUN sin puntos ni guion'), '12.345.678-K')
    await usuario.type(screen.getByLabelText('Correo'), 'ana@correo')
    await usuario.type(screen.getByLabelText('Contraseña'), '123456')
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), '654321')
    await usuario.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(screen.getByText('Ingresa el RUN sin puntos ni guion.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument()
    expect(screen.getByText('Las contraseñas deben coincidir.')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('confirma un registro válido de una persona de Chillán', async () => {
    const usuario = userEvent.setup()
    render(<FormularioRegistro />)

    await usuario.type(screen.getByLabelText('Nombre completo'), 'Camila Sepúlveda')
    await usuario.type(screen.getByLabelText('RUN sin puntos ni guion'), '12345678K')
    await usuario.type(screen.getByLabelText('Correo'), 'camila.sepulveda@correo.cl')
    await usuario.selectOptions(screen.getByLabelText('Tipo de cliente'), 'residencial')
    await usuario.type(screen.getByLabelText('Contraseña'), 'volcan2026')
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), 'volcan2026')
    await usuario.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Datos válidos. El registro real se conectará al backend en una etapa posterior.',
    )
    expect(screen.queryByText('Ingresa un correo válido.')).not.toBeInTheDocument()

    await usuario.clear(screen.getByLabelText('Correo'))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: 'Registrarme' }))
    expect(screen.getByLabelText('Correo')).toHaveAccessibleDescription('Ingresa un correo válido.')
  })
})
