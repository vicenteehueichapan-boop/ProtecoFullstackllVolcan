import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { ProductosProvider } from '../context/ProductosContext'
import Categorias from './Categorias'

describe('página Categorías', () => {
  beforeEach(() => localStorage.clear())

  it('muestra cada categoría con su cantidad y un enlace a sus productos', () => {
    render(<MemoryRouter><ProductosProvider><Categorias /></ProductosProvider></MemoryRouter>)

    expect(screen.getAllByRole('heading', { level: 2 }).map((titulo) => titulo.textContent))
      .toEqual(['Cilindros de Gas', 'Reguladores', 'Mangueras y Conexiones', 'Accesorios'])
    expect(screen.getAllByText('4 productos disponibles.')).toHaveLength(2)
    expect(screen.getByRole('link', { name: 'Ver productos de Mangueras y Conexiones' }))
      .toHaveAttribute('href', '/catalogo?categoria=Mangueras%20y%20Conexiones')
    expect(document.title).toBe('Categorías | Gas El Volcán')
  })
})
