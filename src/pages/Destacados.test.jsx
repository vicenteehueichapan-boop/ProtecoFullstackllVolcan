import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { ProductosProvider } from '../context/ProductosContext'
import { actualizarProducto, listarProductos } from '../services/productoService'
import Destacados from './Destacados'

function mostrarDestacados() {
  render(
    <MemoryRouter>
      <ProductosProvider>
        <Destacados />
      </ProductosProvider>
    </MemoryRouter>,
  )
}

describe('página Destacados', () => {
  beforeEach(() => localStorage.clear())

  it('muestra solo los productos marcados como destacados', () => {
    mostrarDestacados()

    expect(screen.getAllByRole('heading', { level: 2 }).map((titulo) => titulo.textContent)).toEqual([
      'Cilindro GLP 11 kg',
      'Kit conexión completo (regulador + manguera 1.5m + abrazaderas)',
      'Detector de gas a batería',
    ])
  })

  it('ofrece volver al catálogo cuando no hay destacados', () => {
    listarProductos().forEach((producto) => actualizarProducto(producto.codigo, { destacado: false }))
    mostrarDestacados()

    expect(screen.getByText(/no hay productos destacados/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Revisa el catálogo completo' })).toHaveAttribute('href', '/catalogo')
  })
})
