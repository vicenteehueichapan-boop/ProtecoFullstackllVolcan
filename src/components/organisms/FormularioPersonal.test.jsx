import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FormularioPersonal from './FormularioPersonal'

describe('FormularioPersonal', () => {
  it('crea un perfil válido y explica los campos con error', async () => {
    const alGuardar = vi.fn()
    render(<FormularioPersonal alGuardar={alGuardar} />)

    await userEvent.click(screen.getByRole('button', { name: 'Crear perfil' }))
    expect(screen.getByLabelText('Rol')).toHaveAccessibleDescription('Selecciona un rol del personal.')
    expect(alGuardar).not.toHaveBeenCalled()

    await userEvent.type(screen.getByLabelText('Nombre'), 'Repartidor 4')
    await userEvent.type(screen.getByLabelText('Correo'), 'repartidor4@ejemplo.cl')
    await userEvent.selectOptions(screen.getByLabelText('Rol'), 'Repartidor')
    await userEvent.click(screen.getByRole('button', { name: 'Crear perfil' }))

    expect(alGuardar).toHaveBeenCalledExactlyOnceWith({
      nombre: 'Repartidor 4', correo: 'repartidor4@ejemplo.cl', rol: 'repartidor', activo: true,
    })
  })

  it('al editar bloquea el correo y permite desactivar el perfil', async () => {
    const alGuardar = vi.fn()
    const perfil = { nombre: 'Operadora', correo: 'operadora@ejemplo.cl', rol: 'operadora', activo: true }
    render(<FormularioPersonal perfil={perfil} alGuardar={alGuardar} />)

    expect(screen.getByLabelText('Correo')).toBeDisabled()
    await userEvent.click(screen.getByLabelText('Perfil activo'))
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(alGuardar).toHaveBeenCalledWith({ ...perfil, activo: false })
  })
})
