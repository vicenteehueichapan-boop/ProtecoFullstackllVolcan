import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FormularioCategoria from './FormularioCategoria'

describe('FormularioCategoria', () => {
  it('crea con datos válidos y no avisa con datos inválidos', async () => {
    const alGuardar = vi.fn()
    render(<FormularioCategoria alGuardar={alGuardar} alCancelar={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'Crear categoría' }))
    expect(screen.getByLabelText('Nombre')).toHaveAccessibleDescription('El nombre debe tener al menos 3 caracteres.')
    expect(alGuardar).not.toHaveBeenCalled()

    await userEvent.type(screen.getByLabelText('Nombre'), 'Repuestos')
    await userEvent.click(screen.getByRole('button', { name: 'Crear categoría' }))
    expect(alGuardar).toHaveBeenCalledExactlyOnceWith({ nombre: 'Repuestos', descripcion: '' })
  })

  it('al editar parte con los datos recibidos y muestra el rechazo de la página', async () => {
    const alGuardar = vi.fn().mockReturnValue({ nombre: 'Ya existe una categoría con ese nombre.' })
    render(<FormularioCategoria categoria={{ nombre: 'Accesorios', descripcion: 'Tapas' }} alGuardar={alGuardar} alCancelar={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Editar «Accesorios»' })).toBeInTheDocument()
    expect(screen.getByLabelText('Descripción (opcional)')).toHaveValue('Tapas')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByLabelText('Nombre')).toHaveAccessibleDescription('Ya existe una categoría con ese nombre.')
  })
})
