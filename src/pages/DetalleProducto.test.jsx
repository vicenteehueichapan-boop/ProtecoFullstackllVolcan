import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { CarritoProvider } from '../context/CarritoContext'
import { ProductosProvider } from '../context/ProductosContext'
import { leerCarrito } from '../services/carritoService'
import { actualizarProducto } from '../services/productoService'
import RutaActual from '../tests/RutaActual'
import DetalleProducto from './DetalleProducto'

function mostrarDetalle(codigo) {
  render(
    <MemoryRouter initialEntries={[`/productos/${codigo}`]}>
      <ProductosProvider>
        <CarritoProvider>
          <RutaActual />
          <Routes>
            <Route path="/productos/:codigo" element={<DetalleProducto />} />
            <Route path="*" element={null} />
          </Routes>
        </CarritoProvider>
      </ProductosProvider>
    </MemoryRouter>,
  )
}

describe('página Detalle de producto', () => {
  beforeEach(() => localStorage.clear())

  it('agrega un accesorio al carrito y lleva a Mi carrito', async () => {
    mostrarDetalle('RG001')

    expect(screen.getByRole('heading', { name: 'Regulador doméstico estándar' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    expect(leerCarrito().lineas).toEqual([{ codigo: 'RG001', cantidad: 1 }])
    expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/carrito')
  })

  it('muestra la tarifa elegida', async () => {
    mostrarDetalle('CL002')

    expect(screen.getByText('$12.000')).toBeInTheDocument()
    await userEvent.selectOptions(screen.getByLabelText('Tipo de cliente'), 'comercial')
    expect(screen.getByText('$11.000')).toBeInTheDocument()
  })

  it('no permite agregar un producto sin stock', () => {
    actualizarProducto('AC003', { stock: 0 })
    mostrarDetalle('AC003')

    expect(screen.getByRole('button', { name: 'Sin stock disponible' })).toBeDisabled()
  })

  it('informa un código inexistente con salida al catálogo', () => {
    mostrarDetalle('ZZ999')

    expect(screen.getByRole('heading', { name: 'Producto no encontrado' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Volver al catálogo' })).toHaveAttribute('href', '/catalogo')
  })
})
