import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FormularioIngreso from './FormularioIngreso'

describe('FormularioIngreso', () => {
  it('muestra mensajes cuando se envía vacío', async () => {
    render(<FormularioIngreso alIngresar={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument()
    expect(screen.getByText('La contraseña debe tener al menos 4 caracteres.')).toBeInTheDocument()
  })

  it('mantiene el mensaje para un correo inválido', async () => {
    render(<FormularioIngreso alIngresar={vi.fn()} />)

    await userEvent.type(screen.getByLabelText('Correo institucional'), 'correo-invalido')
    await userEvent.type(screen.getByLabelText('Contraseña'), '1234')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument()
  })

  it('entrega los datos cuando el formulario es válido', async () => {
    const alIngresar = vi.fn()
    render(<FormularioIngreso alIngresar={alIngresar} />)

    await userEvent.type(screen.getByLabelText('Correo institucional'), 'estudiante@duocuc.cl')
    await userEvent.type(screen.getByLabelText('Contraseña'), '1234')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(alIngresar).toHaveBeenCalledWith({
      correo: 'estudiante@duocuc.cl',
      clave: '1234',
    })
  })
})
