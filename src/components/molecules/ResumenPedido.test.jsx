import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ResumenPedido from './ResumenPedido'

const pedido = {
  cliente: { nombre: 'Ana Pérez', correo: 'ana@correo.cl', direccion: 'Los Aromos 123' },
  zona: { nombre: 'Zona Centro', tiempoEstimado: '1 a 3 horas' },
  productos: [
    { codigo: 'CL002', nombre: 'Cilindro GLP 11 kg', cantidad: 2, subtotal: 24000 },
    { codigo: 'RG001', nombre: 'Regulador', cantidad: 1, subtotal: 8990 },
  ],
  tipoCliente: 'residencial',
  total: 32990,
}

describe('ResumenPedido', () => {
  it('muestra cliente, entrega, cada línea con su subtotal y el total', () => {
    render(<ResumenPedido pedido={pedido} />)

    expect(screen.getByText(/Zona Centro \(1 a 3 horas\)/)).toBeInTheDocument()
    expect(screen.getByText('Subtotal: $24.000')).toBeInTheDocument()
    expect(screen.getByText('Subtotal: $8.990')).toBeInTheDocument()
    expect(screen.getByText('Total:').parentElement).toHaveTextContent('$32.990')
    expect(screen.getByText('Pago:').parentElement).toHaveTextContent('Efectivo al entregar')
  })
})
