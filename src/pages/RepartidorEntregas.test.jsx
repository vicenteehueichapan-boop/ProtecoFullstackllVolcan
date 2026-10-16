import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'
import { asignarRepartidor, crearPedido, listarPedidos } from '../services/pedidoService'
import { irA } from '../tests/abrirAdministracion'
import { datosPedido } from '../tests/datosPedido'
import { ingresarPersonalEnPrueba } from '../tests/ingresarPersonal'

describe('página Mis entregas (repartidor)', () => {
  beforeEach(() => {
    localStorage.clear()
    crearPedido(datosPedido)
    crearPedido(datosPedido)
    asignarRepartidor('PED-0001', 'repartidor-1')
    asignarRepartidor('PED-0002', 'repartidor-2')
  })

  it('muestra solo las entregas del perfil activo y registra el cobro al entregar', async () => {
    window.history.replaceState({}, '', '/personal')
    const usuario = userEvent.setup()
    render(<App />)
    await ingresarPersonalEnPrueba(usuario, 'repartidor1@ejemplo.cl')
    irA('/repartidor/entregas')

    expect(screen.getByRole('heading', { name: 'PED-0001' })).toBeInTheDocument()
    expect(screen.queryByText('PED-0002')).not.toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Marcar en camino' }))
    await usuario.click(screen.getByRole('button', { name: 'Marcar entregado' }))

    expect(screen.getByText('Entrega completada.')).toBeInTheDocument()
    expect(listarPedidos()[0].cobro.monto).toBe(6500)
  })
})
