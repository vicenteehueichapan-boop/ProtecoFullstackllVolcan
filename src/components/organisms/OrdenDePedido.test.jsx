import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import OrdenDePedido from './OrdenDePedido'

const pedido = {
  id: 'PED-0009', estado: 'pendiente', fechaCreacion: '2026-10-20T13:00:00.000Z', tipoCliente: 'comercial',
  clienteId: 'CLI-0003', repartidor: null, total: 26990,
  cliente: { nombre: 'Ana Pérez', correo: 'ana@correo.cl', direccion: 'Los Aromos 123' },
  zona: { nombre: 'Zona Centro', tiempoEstimado: '1 a 3 horas' },
  productos: [
    { codigo: 'CL002', nombre: 'Cilindro GLP 11 kg', cantidad: 1, precioUnitario: 11000, subtotal: 11000 },
    { codigo: 'MG004', nombre: 'Kit conexión', cantidad: 1, precioUnitario: 15990, subtotal: 15990 },
  ],
}

describe('OrdenDePedido', () => {
  it('detalla cada línea, el total y que el cobro aún está pendiente', () => {
    render(<OrdenDePedido pedido={pedido} alNavegar={vi.fn()} />)

    const tabla = screen.getByRole('table', { name: 'Productos del pedido' })
    expect(tabla).toHaveTextContent('Cilindro GLP 11 kg')
    expect(tabla).toHaveTextContent('Kit conexión')
    expect(tabla).toHaveTextContent('$26.990')
    expect(screen.getByText('Repartidor: Sin asignar')).toBeInTheDocument()
    expect(screen.getByText('Cobro pendiente: se registra al marcar la entrega.')).toBeInTheDocument()
  })

  it('lleva al historial de la cuenta del cliente', async () => {
    const alNavegar = vi.fn()
    render(<OrdenDePedido pedido={pedido} alNavegar={alNavegar} />)

    await userEvent.click(screen.getByRole('link', { name: 'Ver historial de la cuenta CLI-0003' }))

    expect(alNavegar).toHaveBeenCalledWith('/administracion/usuarios/clientes/CLI-0003')
  })
})
