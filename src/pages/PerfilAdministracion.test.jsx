import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { abrirAdministracion } from '../tests/abrirAdministracion'

describe('página Mi perfil', () => {
  beforeEach(() => localStorage.clear())

  it('muestra los datos de la sesión y actualiza el nombre en todo el panel', async () => {
    const usuario = await abrirAdministracion('/administracion/perfil')

    expect(screen.getByText('administracion@ejemplo.cl')).toBeInTheDocument()
    await usuario.clear(screen.getByLabelText('Nombre visible'))
    await usuario.type(screen.getByLabelText('Nombre visible'), 'Marta Fuentes')
    await usuario.click(screen.getByRole('button', { name: 'Guardar nombre' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Nombre actualizado.')
    expect(screen.getByText('Marta Fuentes', { selector: '.list-group-item', exact: false })).toBeInTheDocument()
  })

  it('pide un nombre de al menos 3 caracteres', async () => {
    const usuario = await abrirAdministracion('/administracion/perfil')

    await usuario.clear(screen.getByLabelText('Nombre visible'))
    await usuario.click(screen.getByRole('button', { name: 'Guardar nombre' }))

    expect(screen.getByLabelText('Nombre visible')).toHaveAccessibleDescription('Ingresa un nombre de al menos 3 caracteres.')
  })
})
