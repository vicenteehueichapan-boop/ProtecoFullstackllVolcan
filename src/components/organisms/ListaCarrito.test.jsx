import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ListaCarrito from './ListaCarrito'

describe('ListaCarrito', () => {
  it('muestra una línea por producto', () => {
    const lineas = [
      { codigo: 'CL001', nombre: 'Cilindro GLP 5 kg', cantidad: 1, stock: 80, precioUnitario: 6500, subtotal: 6500, error: '' },
      { codigo: 'RG001', nombre: 'Regulador', cantidad: 2, stock: 45, precioUnitario: 8990, subtotal: 17980, error: '' },
    ]
    render(<ListaCarrito lineas={lineas} alCambiarCantidad={vi.fn()} alQuitar={vi.fn()} />)

    expect(screen.getByText('Subtotal: $6.500')).toBeInTheDocument()
    expect(screen.getByText('Subtotal: $17.980')).toBeInTheDocument()
  })

  it('orienta a la persona cuando el carrito está vacío', () => {
    render(<ListaCarrito lineas={[]} alCambiarCantidad={vi.fn()} alQuitar={vi.fn()} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Tu carrito está vacío')
  })
})
