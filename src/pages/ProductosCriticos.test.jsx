import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { actualizarProducto, obtenerProductoPorCodigo } from '../services/productoService'
import { abrirAdministracion } from '../tests/abrirAdministracion'

describe('página Productos críticos', () => {
  beforeEach(() => localStorage.clear())

  it('lista los productos con poco stock, del menor al mayor', async () => {
    actualizarProducto('RG002', { stock: 3 })
    await abrirAdministracion('/administracion/criticos')

    const filas = screen.getAllByRole('row').slice(1).map((fila) => fila.querySelector('strong').textContent)
    expect(filas).toEqual(['Regulador de alta presión', 'Detector de gas a batería'])
  })

  it('repone stock y el producto deja de ser crítico', async () => {
    const usuario = await abrirAdministracion('/administracion/criticos')

    await usuario.type(screen.getByLabelText('Unidades a reponer de Detector de gas a batería'), '12')
    await usuario.click(screen.getByRole('button', { name: 'Reponer' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Se sumaron 12 unidades a Detector de gas a batería.')
    expect(obtenerProductoPorCodigo('AC003').stock).toBe(20)
    expect(screen.getByText('No hay productos con stock crítico.')).toBeInTheDocument()
  })
})
