import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import LineaCarrito from './LineaCarrito'

const linea = { codigo: 'CL001', nombre: 'Gas 5 kg', cantidad: 1, stock: 2, precioUnitario: 6500, subtotal: 6500, error: '' }

describe('LineaCarrito', () => {
  it('muestra importes y comunica cambios de cantidad y eliminación por props', async () => {
    const alCambiarCantidad = vi.fn()
    const alQuitar = vi.fn()
    render(<LineaCarrito linea={linea} alCambiarCantidad={alCambiarCantidad} alQuitar={alQuitar} />)
    expect(screen.getByText('Subtotal: $6.500')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reducir cantidad de Gas 5 kg' })).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: 'Aumentar cantidad de Gas 5 kg' }))
    expect(alCambiarCantidad).toHaveBeenCalledWith('CL001', 2)
    await userEvent.click(screen.getByRole('button', { name: 'Quitar Gas 5 kg' }))
    expect(alQuitar).toHaveBeenCalledWith('CL001')
  })

  it('impide aumentar más allá del stock y muestra el error de la línea', () => {
    render(<LineaCarrito linea={{ ...linea, cantidad: 2, error: 'Revisa el stock' }} alCambiarCantidad={vi.fn()} alQuitar={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Aumentar cantidad de Gas 5 kg' })).toBeDisabled()
    expect(screen.getByRole('alert')).toHaveTextContent('Revisa el stock')
  })
})
