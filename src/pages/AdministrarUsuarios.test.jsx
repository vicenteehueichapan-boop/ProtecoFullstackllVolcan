import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { crearPedido } from '../services/pedidoService'
import { abrirAdministracion, irA } from '../tests/abrirAdministracion'
import { datosPedido } from '../tests/datosPedido'
import { ingresarPersonalEnPrueba } from '../tests/ingresarPersonal'

// Pegar el texto reproduce lo que escribe la persona sin simular cada tecla, para que las
// pruebas no dependan de la velocidad del equipo al medir cobertura.
async function escribir(usuario, etiqueta, valor) {
  await usuario.click(screen.getByLabelText(etiqueta))
  await usuario.paste(valor)
}

describe('página Usuarios', () => {
  beforeEach(() => localStorage.clear())

  it('crea un repartidor que la operadora puede elegir al asignar', async () => {
    crearPedido(datosPedido)
    const usuario = await abrirAdministracion('/administracion/usuarios')

    await escribir(usuario, 'Nombre', 'Repartidor 4')
    await escribir(usuario, 'Correo', 'repartidor4@ejemplo.cl')
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

    await escribir(usuario, 'Nombre', 'Otra operadora')
    await escribir(usuario, 'Correo', 'operadora@ejemplo.cl')
    await usuario.selectOptions(screen.getByLabelText('Rol'), 'Operadora')
    await usuario.click(screen.getByRole('button', { name: 'Crear perfil' }))

    expect(screen.getByLabelText('Correo')).toHaveAccessibleDescription('Ya existe un perfil con ese correo.')
  })

  it('crea una cuenta de cliente desde la pestaña Clientes', async () => {
    const usuario = await abrirAdministracion('/administracion/usuarios?vista=clientes')

    await escribir(usuario, 'Nombre', 'Luis')
    await escribir(usuario, 'Apellidos', 'Soto')
    await escribir(usuario, 'RUN sin puntos ni guion', '11111111K')
    await escribir(usuario, 'Correo', 'luis@correo.cl')
    await usuario.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Cliente CLI-0001 creado.')
    expect(screen.getByRole('link', { name: 'Ver y editar a Luis Soto' })).toHaveAttribute('href', '/administracion/usuarios/clientes/CLI-0001')
  })
})
