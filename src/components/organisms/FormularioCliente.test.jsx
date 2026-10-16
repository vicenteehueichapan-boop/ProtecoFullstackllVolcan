import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FormularioCliente from './FormularioCliente'

describe('FormularioCliente', () => {
  it('crea una cuenta sin pedir contraseña y muestra el rechazo de la página junto al campo', async () => {
    const alGuardar = vi.fn().mockReturnValue({ correo: 'Ya existe una cuenta con ese correo.' })
    render(<FormularioCliente alGuardar={alGuardar} />)

    expect(screen.queryByLabelText('Contraseña')).not.toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Nombre'), 'Luis')
    await userEvent.type(screen.getByLabelText('Apellidos'), 'Soto')
    await userEvent.type(screen.getByLabelText('RUN sin puntos ni guion'), '11111111K')
    await userEvent.type(screen.getByLabelText('Correo'), 'luis@correo.cl')
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(alGuardar).toHaveBeenCalledWith(expect.objectContaining({ correo: 'luis@correo.cl', tipoCliente: 'residencial' }))
    expect(screen.getByLabelText('Correo')).toHaveAccessibleDescription('Ya existe una cuenta con ese correo.')
  })

  it('al editar bloquea RUN y correo', () => {
    const cliente = { nombre: 'Luis', apellidos: 'Soto', run: '11111111K', correo: 'luis@correo.cl', tipoCliente: 'comercial', activo: true }
    render(<FormularioCliente cliente={cliente} alGuardar={vi.fn()} />)

    expect(screen.getByLabelText('RUN sin puntos ni guion')).toBeDisabled()
    expect(screen.getByLabelText('Correo')).toBeDisabled()
    expect(screen.getByLabelText('Cuenta activa')).toBeChecked()
  })
})
