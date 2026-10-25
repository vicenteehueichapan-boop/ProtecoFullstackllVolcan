import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { obtenerProductoPorCodigo } from '../services/productoService'
import { abrirAdministracion } from '../tests/abrirAdministracion'

function fila(nombre) {
  return screen.getByText(nombre, { selector: 'strong' }).closest('tr')
}

describe('página Categorías', () => {
  beforeEach(() => localStorage.clear())

  it('crea una categoría y rechaza un nombre repetido junto al campo', async () => {
    const usuario = await abrirAdministracion('/administracion/categorias')

    await usuario.type(screen.getByLabelText('Nombre'), 'Repuestos')
    await usuario.click(screen.getByRole('button', { name: 'Crear categoría' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Categoría «Repuestos» creada')
    expect(within(fila('Repuestos')).getByText('0')).toBeInTheDocument()

    await usuario.type(screen.getByLabelText('Nombre'), 'reguladores')
    await usuario.click(screen.getByRole('button', { name: 'Crear categoría' }))
    expect(screen.getByLabelText('Nombre')).toHaveAccessibleDescription('Ya existe una categoría con ese nombre.')
  })

  it('renombra una categoría y sus productos la siguen', async () => {
    const usuario = await abrirAdministracion('/administracion/categorias')

    await usuario.click(screen.getByRole('button', { name: 'Editar Accesorios' }))
    await usuario.clear(screen.getByLabelText('Nombre'))
    await usuario.type(screen.getByLabelText('Nombre'), 'Accesorios del hogar')
    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(within(fila('Accesorios del hogar')).getByText('3')).toBeInTheDocument()
    expect(obtenerProductoPorCodigo('AC002').categoria).toBe('Accesorios del hogar')
  })
})
