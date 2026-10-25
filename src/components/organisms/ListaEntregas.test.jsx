import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ListaEntregas from './ListaEntregas'

const pedido = {
  id: 'PED-0003',
  estado: 'asignado',
  cliente: { nombre: 'Ana Pérez', direccion: 'Los Aromos 123' },
  productos: [
    { codigo: 'CL002', nombre: 'Cilindro GLP 11 kg', cantidad: 2 },
    { codigo: 'RG001', nombre: 'Regulador doméstico estándar', cantidad: 1 },
  ],
  total: 32990,
}

describe('ListaEntregas', () => {
  it('muestra todas las líneas del pedido y el monto a cobrar', () => {
    render(<ListaEntregas pedidos={[pedido]} alCambiarEstado={vi.fn()} />)

    expect(screen.getByText('Cilindro GLP 11 kg × 2')).toBeInTheDocument()
    expect(screen.getByText('Regulador doméstico estándar × 1')).toBeInTheDocument()
    expect(screen.getByText('$32.990')).toBeInTheDocument()
  })

  it('ofrece solo el siguiente paso y lo avisa al padre', async () => {
    const alCambiarEstado = vi.fn()
    render(<ListaEntregas pedidos={[pedido]} alCambiarEstado={alCambiarEstado} />)

    expect(screen.queryByRole('button', { name: 'Marcar entregado' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Marcar en camino' }))

    expect(alCambiarEstado).toHaveBeenCalledExactlyOnceWith('PED-0003', 'en_camino')
  })

  it('avisa cuando no hay entregas asignadas', () => {
    render(<ListaEntregas pedidos={[]} alCambiarEstado={vi.fn()} />)

    expect(screen.getByText('No hay entregas asignadas a este repartidor.')).toBeInTheDocument()
  })
})
