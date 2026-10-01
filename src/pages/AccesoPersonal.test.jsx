import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'

describe('separación entre tienda y personal', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  it('mantiene el menú de compra sin herramientas del personal', () => {
    render(<App />)
    const tienda = within(screen.getByRole('navigation', { name: 'Navegación de la tienda' }))
    expect(tienda.getByRole('link', { name: 'Pedir gas' })).toHaveAttribute('href', '/nuevo-pedido')
    expect(tienda.queryByText('Área de trabajo')).not.toBeInTheDocument()
    expect(tienda.queryByRole('link', { name: 'Operadora' })).not.toBeInTheDocument()
    expect(tienda.queryByRole('link', { name: 'Repartidor' })).not.toBeInTheDocument()
    expect(tienda.queryByRole('link', { name: 'Productos' })).not.toBeInTheDocument()
  })

  it('permite entrar al área del personal desde el pie y volver a la tienda', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    await usuario.click(screen.getByRole('link', { name: 'Acceso del personal' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Área del personal' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Navegación de la tienda' })).not.toBeInTheDocument()
    expect(screen.getByText(/sin autenticación real/)).toBeInTheDocument()
    await usuario.click(screen.getByRole('link', { name: 'Volver a la tienda' }))
    expect(screen.getByRole('navigation', { name: 'Navegación de la tienda' })).toBeInTheDocument()
  })

  it.each([
    ['Administración', 'Administración de productos'],
    ['Operadora', 'Pedidos del día'],
    ['Repartidor', 'Mis entregas'],
  ])('abre el área %s con la plantilla del personal', async (area, titulo) => {
    window.history.replaceState({}, '', '/personal')
    const usuario = userEvent.setup()
    render(<App />)
    await usuario.click(screen.getByRole('button', { name: `Entrar a ${area}` }))
    expect(screen.getByRole('heading', { level: 1, name: titulo })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Navegación del personal' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Navegación de la tienda' })).not.toBeInTheDocument()
  })
})
