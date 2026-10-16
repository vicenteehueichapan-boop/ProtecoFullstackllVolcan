import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { crearPedido } from '../services/pedidoService'
import { abrirAdministracion, irA } from '../tests/abrirAdministracion'
import { datosPedido } from '../tests/datosPedido'
import { ingresarPersonalEnPrueba } from '../tests/ingresarPersonal'

describe('página Usuarios', () => {
  beforeEach(() => localStorage.clear())

  it('crea un repartidor que la operadora puede elegir al asignar', async () => {
    crearPedido(datosPedido)
    const usuario = await abrirAdministracion('/administracion/usuarios')

    await usuario.type(screen.getByLabelText('Nombre'), 'Repartidor 4')
    await usuario.type(screen.getByLabelText('Correo'), 'repartidor4@ejemplo.cl')
    await usuario.selectOptions(screen.getByLabelText('Rol'), 'Repartidor')
    await usuario.click(screen.getByRole('button', { name: 'Crear perfil' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Perfil PER-0001 creado.')
    expect(screen.getByLabelText('Nombre')).toHaveValue('')

    await ingresarPersonalEnPrueba(usuario, 'operadora@ejemplo.cl')
    irA('/operadora/pedidos')
    const selector = screen.getByLabelText('Repartidor para PED-0001')
    expect(within(selector).getByRole('option', { name: 'Repartidor 4' })).toBeInTheDocument()
  })

  it('muestra un correo repetido junto al campo', async () => {
    const usuario = await abrirAdministracion('/administracion/usuarios')

    await usuario.type(screen.getByLabelText('Nombre'), 'Otra operadora')
    await usuario.type(screen.getByLabelText('Correo'), 'operadora@ejemplo.cl')
    await usuario.selectOptions(screen.getByLabelText('Rol'), 'Operadora')
    await usuario.click(screen.getByRole('button', { name: 'Crear perfil' }))

    expect(screen.getByLabelText('Correo')).toHaveAccessibleDescription('Ya existe un perfil con ese correo.')
  })

  it('crea una cuenta de cliente desde la pestaña Clientes', async () => {
    const usuario = await abrirAdministracion('/administracion/usuarios?vista=clientes')

    await usuario.type(screen.getByLabelText('Nombre'), 'Luis')
    await usuario.type(screen.getByLabelText('Apellidos'), 'Soto')
    await usuario.type(screen.getByLabelText('RUN sin puntos ni guion'), '11111111K')
    await usuario.type(screen.getByLabelText('Correo'), 'luis@correo.cl')
    await usuario.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Cliente CLI-0001 creado.')
    expect(screen.getByRole('link', { name: 'Ver y editar a Luis Soto' })).toHaveAttribute('href', '/administracion/usuarios/clientes/CLI-0001')
  })
})
