import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { crearPedido } from '../services/pedidoService'
import { datosPedido } from '../tests/datosPedido'
import { renderizarConSesion } from '../tests/renderizarConSesion'
import PedidoExitoso from './PedidoExitoso'

describe('página Pedido confirmado', () => {
  beforeEach(() => {
    localStorage.clear()
    crearPedido({ ...datosPedido, cliente: { ...datosPedido.cliente, correo: 'ana@correo.cl' } })
  })

  it('muestra el comprobante a quien acaba de confirmar el pedido', () => {
    renderizarConSesion(<PedidoExitoso />, {
      ruta: '/pedido-confirmado/:id',
      entrada: { pathname: '/pedido-confirmado/PED-0001', state: { recienCreado: true } },
    })

    expect(screen.getByRole('heading', { name: 'Pedido confirmado' })).toBeInTheDocument()
    expect(screen.getByText('Total: $6.500', { exact: false })).toBeInTheDocument()
  })

  it('no muestra datos del pedido a quien solo escribe la dirección', () => {
    renderizarConSesion(<PedidoExitoso />, { ruta: '/pedido-confirmado/:id', entrada: '/pedido-confirmado/PED-0001' })

    expect(screen.getByRole('heading', { name: 'Pedido no disponible' })).toBeInTheDocument()
    expect(screen.queryByText(/Los Aromos 123/)).not.toBeInTheDocument()
  })
})
