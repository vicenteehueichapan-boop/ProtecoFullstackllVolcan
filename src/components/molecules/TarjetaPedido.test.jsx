import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TarjetaPedido from './TarjetaPedido'

const pedido = {
  id: 'PED-0007',
  estado: 'en_camino',
  fechaCreacion: '2026-10-20T13:00:00.000Z',
  productos: [
    { codigo: 'CL002', nombre: 'Cilindro GLP 11 kg', cantidad: 2 },
    { codigo: 'RG001', nombre: 'Regulador doméstico estándar', cantidad: 1 },
  ],
  total: 32990,
}

describe('TarjetaPedido', () => {
  it('muestra número, estado, productos y total recibidos por props', () => {
    render(<TarjetaPedido pedido={pedido} alNavegar={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Pedido PED-0007' })).toBeInTheDocument()
    expect(screen.getByText('En camino')).toBeInTheDocument()
    expect(screen.getByText('Cilindro GLP 11 kg × 2, Regulador doméstico estándar × 1')).toBeInTheDocument()
    expect(screen.getByText('Total: $32.990')).toBeInTheDocument()
  })

  it('lleva al seguimiento del pedido mediante la función recibida', async () => {
    const alNavegar = vi.fn()
    render(<TarjetaPedido pedido={pedido} alNavegar={alNavegar} />)

    await userEvent.click(screen.getByRole('link', { name: 'Ver seguimiento de PED-0007' }))

    expect(alNavegar).toHaveBeenCalledExactlyOnceWith('/seguimiento/PED-0007')
  })
})
