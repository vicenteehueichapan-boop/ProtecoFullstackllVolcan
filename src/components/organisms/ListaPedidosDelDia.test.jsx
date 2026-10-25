import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ListaPedidosDelDia from './ListaPedidosDelDia'

const pedido = {
  id: 'PED-0004',
  estado: 'pendiente',
  fechaCreacion: '2026-10-20T13:00:00.000Z',
  cliente: { nombre: 'Ana Pérez', direccion: 'Los Aromos 123' },
  productos: [
    { codigo: 'CL001', nombre: 'Cilindro GLP 5 kg', cantidad: 1 },
    { codigo: 'MG001', nombre: 'Manguera gas 1.5 m', cantidad: 1 },
  ],
}
const repartidores = [{ id: 'repartidor-1', nombre: 'Repartidor 1' }]

describe('ListaPedidosDelDia', () => {
  it('muestra todas las líneas de cada pedido', () => {
    render(<ListaPedidosDelDia pedidos={[pedido]} repartidores={repartidores} selecciones={{}} alSeleccionar={vi.fn()} alAsignar={vi.fn()} />)

    expect(screen.getByText('Cilindro GLP 5 kg × 1')).toBeInTheDocument()
    expect(screen.getByText('Manguera gas 1.5 m × 1')).toBeInTheDocument()
  })

  it('entrega al padre el identificador del repartidor elegido', async () => {
    const alSeleccionar = vi.fn()
    render(<ListaPedidosDelDia pedidos={[pedido]} repartidores={repartidores} selecciones={{}} alSeleccionar={alSeleccionar} alAsignar={vi.fn()} />)

    await userEvent.selectOptions(screen.getByLabelText('Repartidor para PED-0004'), 'Repartidor 1')

    expect(alSeleccionar).toHaveBeenCalledWith('PED-0004', 'repartidor-1')
    expect(screen.getByRole('button', { name: 'Asignar' })).toBeDisabled()
  })
})
