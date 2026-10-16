import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { asignarRepartidor, cambiarEstadoPedido, crearPedido, listarPedidos } from '../services/pedidoService'
import { irA } from '../tests/abrirAdministracion'
import { datosPedido } from '../tests/datosPedido'
import { ingresarPersonalEnPrueba } from '../tests/ingresarPersonal'

async function abrirComoOperadora() {
  window.history.replaceState({}, '', '/personal')
  const usuario = userEvent.setup()
  render(<App />)
  await ingresarPersonalEnPrueba(usuario, 'operadora@ejemplo.cl')
  irA('/operadora/pedidos')
  return usuario
}

describe('página Pedidos del día (operadora)', () => {
  beforeEach(() => {
    localStorage.clear()
    // Solo se simula Date: los temporizadores reales siguen funcionando para la interfaz.
    vi.useFakeTimers({ toFake: ['Date'] })
  })
  afterEach(() => vi.useRealTimers())

  it('sigue mostrando un pedido pendiente de anoche después de la medianoche', async () => {
    vi.setSystemTime(new Date(2026, 9, 20, 23, 50))
    crearPedido(datosPedido)
    crearPedido(datosPedido)
    asignarRepartidor('PED-0002', 'repartidor-1')
    cambiarEstadoPedido('PED-0002', 'en_camino')
    cambiarEstadoPedido('PED-0002', 'entregado')
    vi.setSystemTime(new Date(2026, 9, 21, 0, 10))

    await abrirComoOperadora()

    expect(screen.getByText('PED-0001')).toBeInTheDocument()
    expect(screen.queryByText('PED-0002')).not.toBeInTheDocument()
  })

  it('asigna un pendiente a un repartidor activo', async () => {
    vi.setSystemTime(new Date(2026, 9, 21, 10, 0))
    crearPedido(datosPedido)
    const usuario = await abrirComoOperadora()

    await usuario.selectOptions(screen.getByLabelText('Repartidor para PED-0001'), 'Repartidor 3')
    await usuario.click(screen.getByRole('button', { name: 'Asignar' }))

    expect(screen.getByRole('alert')).toHaveTextContent('El pedido PED-0001 fue asignado correctamente.')
    expect(listarPedidos()[0]).toMatchObject({ repartidorId: 'repartidor-3', estado: 'asignado' })
  })
})
