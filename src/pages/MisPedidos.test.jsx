import { screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { iniciarSesionCliente, registrarCliente } from '../services/clienteService'
import { crearPedido } from '../services/pedidoService'
import { datosPedido } from '../tests/datosPedido'
import { renderizarConSesion } from '../tests/renderizarConSesion'
import MisPedidos from './MisPedidos'

describe('página Mis pedidos', () => {
  beforeEach(() => localStorage.clear())
  // Se restaura en afterEach: así el reloj vuelve a ser real aunque una aserción falle.
  afterEach(() => vi.useRealTimers())

  it('pide ingresar cuando no hay sesión', () => {
    renderizarConSesion(<MisPedidos />, { ruta: '/mis-pedidos' })

    expect(screen.getByRole('link', { name: 'Ingresar' })).toHaveAttribute('href', '/ingreso')
  })

  it('muestra solo los pedidos de la cuenta, del más reciente al más antiguo', () => {
    const ana = registrarCliente({ nombre: 'Ana', apellidos: 'Pérez', run: '12345678K', correo: 'ana@correo.cl', tipoCliente: 'residencial' })
    const otro = registrarCliente({ nombre: 'Luis', apellidos: 'Soto', run: '11111111K', correo: 'luis@correo.cl', tipoCliente: 'residencial' })
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-20T10:00:00'))
    crearPedido({ ...datosPedido, clienteId: ana.id })
    crearPedido({ ...datosPedido, clienteId: otro.id })
    vi.setSystemTime(new Date('2026-10-21T10:00:00'))
    crearPedido({ ...datosPedido, clienteId: ana.id })
    iniciarSesionCliente('ana@correo.cl')

    renderizarConSesion(<MisPedidos />, { ruta: '/mis-pedidos' })

    const titulos = screen.getAllByRole('heading', { level: 2 }).map((titulo) => titulo.textContent)
    expect(titulos).toEqual(['Pedido PED-0003', 'Pedido PED-0001'])
    expect(screen.queryByText('Pedido PED-0002')).not.toBeInTheDocument()
  })

  it('invita al catálogo cuando la cuenta todavía no tiene pedidos', () => {
    registrarCliente({ nombre: 'Ana', apellidos: 'Pérez', run: '12345678K', correo: 'ana@correo.cl', tipoCliente: 'residencial' })
    iniciarSesionCliente('ana@correo.cl')
    renderizarConSesion(<MisPedidos />, { ruta: '/mis-pedidos' })

    expect(screen.getByText(/Todavía no tienes pedidos/)).toBeInTheDocument()
  })
})
