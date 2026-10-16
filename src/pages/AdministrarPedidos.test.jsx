import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { asignarRepartidor, crearPedido } from '../services/pedidoService'
import { abrirAdministracion } from '../tests/abrirAdministracion'
import { datosPedido } from '../tests/datosPedido'

describe('página Pedidos recibidos', () => {
  beforeEach(() => {
    localStorage.clear()
    crearPedido({ ...datosPedido, cliente: { ...datosPedido.cliente, nombre: 'Ana Pérez' } })
    crearPedido({ ...datosPedido, cliente: { ...datosPedido.cliente, nombre: 'Luis Soto' } })
    asignarRepartidor('PED-0002', 'repartidor-1')
  })

  it('filtra por estado y por texto, y guarda los filtros en la dirección', async () => {
    const usuario = await abrirAdministracion('/administracion/pedidos')
    expect(screen.getByText('2 de 2 pedidos')).toBeInTheDocument()

    await usuario.selectOptions(screen.getByLabelText('Estado'), 'Asignados')
    expect(screen.getByText('1 de 2 pedidos')).toBeInTheDocument()
    expect(window.location.search).toBe('?estado=asignado')

    await usuario.selectOptions(screen.getByLabelText('Estado'), 'Todos los estados')
    await usuario.type(screen.getByLabelText('Buscar'), 'ana')
    expect(screen.getByText('1 de 2 pedidos')).toBeInTheDocument()
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument()
  })

  it('abre la orden de un pedido con todas sus líneas y su estado de cobro', async () => {
    const usuario = await abrirAdministracion('/administracion/pedidos')

    await usuario.click(screen.getByRole('link', { name: 'Ver la orden de PED-0002' }))

    expect(screen.getByRole('heading', { level: 1, name: 'PED-0002' })).toBeInTheDocument()
    expect(screen.getByText('Repartidor: Repartidor 1')).toBeInTheDocument()
    expect(screen.getByText('Cobro pendiente: se registra al marcar la entrega.')).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Productos del pedido' })).toHaveTextContent('Cilindro GLP 5 kg')
  })
})
