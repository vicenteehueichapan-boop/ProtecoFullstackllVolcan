import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { ingresarPersonalEnPrueba } from '../tests/ingresarPersonal'
import App from '../App'

describe('separación entre tienda y personal', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  it.each(['/administracion/productos', '/operadora/pedidos', '/repartidor/entregas'])('impide entrar directamente sin sesión a %s', (ruta) => {
    window.history.replaceState({}, '', ruta)
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Ingreso de demostración' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/personal')
    expect(screen.queryByRole('button', { name: /Entrar a/ })).not.toBeInTheDocument()
  })

  it('no concede acceso del personal a un correo de comprador', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    await ingresarPersonalEnPrueba(usuario, 'cliente@ejemplo.cl')
    expect(screen.getByText('El correo no corresponde a un perfil de demostración del personal.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Entrar a/ })).not.toBeInTheDocument()
  })

  it('niega administración a la operadora y revoca rutas al cerrar sesión', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    await ingresarPersonalEnPrueba(usuario, 'operadora@ejemplo.cl')
    expect(screen.queryByRole('button', { name: 'Entrar a Administración' })).not.toBeInTheDocument()
    act(() => {
      window.history.pushState({}, '', '/administracion/productos')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(screen.getByRole('heading', { name: 'Acceso no permitido' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Administración de productos' })).not.toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión del personal' }))
    expect(screen.getByRole('heading', { name: 'Ingreso de demostración' })).toBeInTheDocument()
    act(() => {
      window.history.pushState({}, '', '/operadora/pedidos')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(window.location.pathname).toBe('/personal')
  })

  it('exige campos válidos y no conserva la sesión al volver a montar', async () => {
    window.history.replaceState({}, '', '/personal')
    const usuario = userEvent.setup()
    const vista = render(<App />)
    await usuario.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Entrar a/ })).not.toBeInTheDocument()
    await ingresarPersonalEnPrueba(usuario, 'administracion@ejemplo.cl')
    expect(screen.getByRole('button', { name: 'Entrar a Administración' })).toBeInTheDocument()
    vista.unmount()
    window.history.replaceState({}, '', '/administracion/productos')
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Ingreso de demostración' })).toBeInTheDocument()
  })

  it('mantiene el menú de compra sin herramientas del personal', () => {
    render(<App />)
    const tienda = within(screen.getByRole('navigation', { name: 'Navegación de la tienda' }))
    expect(tienda.getByRole('link', { name: 'Mi carrito' })).toHaveAttribute('href', '/carrito')
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
    ['Administración', 'Administración de productos', 'administracion@ejemplo.cl'],
    ['Operadora', 'Pedidos del día', 'operadora@ejemplo.cl'],
    ['Repartidor', 'Mis entregas', 'repartidor1@ejemplo.cl'],
  ])('abre el área %s con la plantilla del personal', async (area, titulo, correo) => {
    window.history.replaceState({}, '', '/personal')
    const usuario = userEvent.setup()
    render(<App />)
    await ingresarPersonalEnPrueba(usuario, correo)
    await usuario.click(screen.getByRole('button', { name: `Entrar a ${area}` }))
    expect(screen.getByRole('heading', { level: 1, name: titulo })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Navegación del personal' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Navegación de la tienda' })).not.toBeInTheDocument()
  })
})
