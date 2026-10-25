import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FormularioPerfil from './FormularioPerfil'

describe('FormularioPerfil', () => {
  it('entrega el nombre limpio a la página', async () => {
    const alGuardar = vi.fn()
    render(<FormularioPerfil nombreInicial="Administración" alGuardar={alGuardar} />)

    await userEvent.clear(screen.getByLabelText('Nombre visible'))
    await userEvent.type(screen.getByLabelText('Nombre visible'), '  Marta Fuentes ')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar nombre' }))

    expect(alGuardar).toHaveBeenCalledExactlyOnceWith('Marta Fuentes')
  })

  it('muestra junto al campo el error con que responde la página', async () => {
    render(<FormularioPerfil nombreInicial="Administración" alGuardar={vi.fn().mockReturnValue('No se pudo guardar.')} />)

    await userEvent.click(screen.getByRole('button', { name: 'Guardar nombre' }))

    expect(screen.getByLabelText('Nombre visible')).toHaveAccessibleDescription('No se pudo guardar.')
  })
})
