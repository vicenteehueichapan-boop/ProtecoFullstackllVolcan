import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'
import { crearPedido } from '../services/pedidoService'
import { abrirAdministracion, irA } from '../tests/abrirAdministracion'
import { datosPedido } from '../tests/datosPedido'
import { ingresarPersonalEnPrueba } from '../tests/ingresarPersonal'

function indicador(titulo) {
  return screen.getByRole('heading', { name: titulo }).closest('.card')
}

describe('página Panel de administración', () => {
  beforeEach(() => localStorage.clear())

  it('resume pedidos, catálogo y usuarios con datos guardados', async () => {
    crearPedido(datosPedido)
    await abrirAdministracion('/administracion')

    expect(screen.getByRole('heading', { level: 1, name: 'Panel de administración' })).toBeInTheDocument()
    expect(within(indicador('Pedidos pendientes')).getByText('1')).toBeInTheDocument()
    expect(within(indicador('Productos en el catálogo')).getByText('14')).toBeInTheDocument()
    // AC003 (8 unidades) es el único producto con 10 o menos al iniciar.
    expect(within(indicador('Productos críticos')).getByText('1')).toBeInTheDocument()
    expect(within(indicador('Personal activo')).getByText('5')).toBeInTheDocument()
  })

  it('lleva a cada módulo desde su indicador', async () => {
    const usuario = await abrirAdministracion('/administracion')

    await usuario.click(screen.getByRole('link', { name: 'Revisar y reponer' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Productos críticos' })).toBeInTheDocument()
  })

  it('no deja entrar a la operadora aunque escriba la dirección', async () => {
    window.history.replaceState({}, '', '/personal')
    const usuario = userEvent.setup()
    render(<App />)
    await ingresarPersonalEnPrueba(usuario, 'operadora@ejemplo.cl')

    irA('/administracion')

    expect(screen.getByRole('heading', { name: 'Acceso no permitido' })).toBeInTheDocument()
  })
})
