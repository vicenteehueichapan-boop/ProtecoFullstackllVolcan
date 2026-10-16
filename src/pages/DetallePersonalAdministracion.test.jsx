import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { asignarRepartidor, crearPedido } from '../services/pedidoService'
import { listarPersonal } from '../services/personalService'
import { abrirAdministracion } from '../tests/abrirAdministracion'
import { datosPedido } from '../tests/datosPedido'

describe('página Ficha del personal', () => {
  beforeEach(() => localStorage.clear())

  it('muestra las entregas asignadas a un repartidor', async () => {
    crearPedido(datosPedido)
    crearPedido(datosPedido)
    asignarRepartidor('PED-0002', 'repartidor-3')

    await abrirAdministracion('/administracion/usuarios/personal/repartidor-3')

    expect(screen.getByRole('heading', { name: 'Entregas asignadas' })).toBeInTheDocument()
    expect(screen.getByText('PED-0002')).toBeInTheDocument()
    expect(screen.queryByText('PED-0001')).not.toBeInTheDocument()
  })

  it('cambia el rol y lo guarda', async () => {
    const usuario = await abrirAdministracion('/administracion/usuarios/personal/repartidor-3')

    await usuario.selectOptions(screen.getByLabelText('Rol'), 'Operadora')
    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(listarPersonal().find((perfil) => perfil.id === 'repartidor-3').rol).toBe('operadora')
    expect(screen.queryByRole('heading', { name: 'Entregas asignadas' })).not.toBeInTheDocument()
  })

  it('no permite dejar el sistema sin administración activa', async () => {
    const usuario = await abrirAdministracion('/administracion/usuarios/personal/admin-demo')

    await usuario.click(screen.getByLabelText('Perfil activo'))
    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByLabelText('Rol')).toHaveAccessibleDescription('Debe quedar al menos un perfil de administración activo.')
    expect(listarPersonal().find((perfil) => perfil.id === 'admin-demo').activo).toBe(true)
  })
})
