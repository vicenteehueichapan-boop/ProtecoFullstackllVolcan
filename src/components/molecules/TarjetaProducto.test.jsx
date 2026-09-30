import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TarjetaProducto from './TarjetaProducto'

const producto = {
  codigo: 'CL002',
  nombre: 'Cilindro GLP 11 kg',
  descripcion: 'Cilindro doméstico.',
  precioResidencial: 12000,
  precioComercial: 11000,
  stock: 200,
  imagen: '/cilindro.svg',
}

describe('TarjetaProducto', () => {
  it('muestra los datos recibidos por props', () => {
    render(<TarjetaProducto producto={producto} tipoCliente="residencial" />)

    expect(screen.getByRole('heading', { name: producto.nombre })).toBeInTheDocument()
    expect(screen.getByText('$12.000')).toBeInTheDocument()
  })

  it('muestra el precio comercial seleccionado', () => {
    render(<TarjetaProducto producto={producto} tipoCliente="comercial" />)

    expect(screen.getByText('$11.000')).toBeInTheDocument()
  })
})
