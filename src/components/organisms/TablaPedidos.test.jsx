import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TablaPedidos from './TablaPedidos'

const pedido = {
  id: 'PED-0005', estado: 'asignado', fechaCreacion: '2026-10-20T13:00:00.000Z', total: 12000,
  cliente: { nombre: 'Ana Pérez' }, zona: { nombre: 'Zona Centro' },
}

describe('TablaPedidos', () => {
  it('muestra cada pedido y abre su orden mediante alNavegar', async () => {
    const alNavegar = vi.fn()
    render(<TablaPedidos pedidos={[pedido]} alNavegar={alNavegar} />)

    expect(screen.getByRole('table', { name: 'Pedidos recibidos' })).toHaveTextContent('Ana Pérez')
    expect(screen.getByText('$12.000')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('link', { name: 'Ver la orden de PED-0005' }))

    expect(alNavegar).toHaveBeenCalledExactlyOnceWith('/administracion/pedidos/PED-0005')
  })

  it('avisa cuando ningún pedido coincide', () => {
    render(<TablaPedidos pedidos={[]} alNavegar={vi.fn()} />)

    expect(screen.getByText('No hay pedidos que coincidan con los filtros.')).toBeInTheDocument()
  })
})
