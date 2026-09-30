import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'

describe('navegación y filtros del catálogo', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/catalogo')
  })

  it('busca por código y conserva la búsqueda en la dirección', async () => {
    const usuario = userEvent.setup()
    render(<App />)

    await usuario.type(screen.getByLabelText('Buscar producto'), 'CL002')

    expect(screen.getByRole('heading', { name: 'Cilindro GLP 11 kg' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Cilindro GLP 5 kg' })).not.toBeInTheDocument()
    expect(new URLSearchParams(window.location.search).get('buscar')).toBe('CL002')
    expect(screen.getByText('1 producto encontrado')).toBeInTheDocument()
  })

  it('filtra por categoría y cambia la tarifa de los productos visibles', async () => {
    const usuario = userEvent.setup()
    render(<App />)

    await usuario.selectOptions(screen.getByLabelText('Categoría'), 'Reguladores')
    await usuario.selectOptions(screen.getByLabelText('Tipo de cliente'), 'comercial')

    expect(screen.getByText('2 productos encontrados')).toBeInTheDocument()
    expect(screen.getByText('$8.200')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Cilindro GLP 5 kg' })).not.toBeInTheDocument()
  })

  it('explica un resultado vacío y recupera los productos al limpiar', async () => {
    const usuario = userEvent.setup()
    render(<App />)

    const buscador = screen.getByLabelText('Buscar producto')
    await usuario.type(buscador, 'no existe este producto')
    expect(screen.getByText('No encontramos productos con los filtros seleccionados.')).toBeInTheDocument()

    await usuario.clear(buscador)
    expect(screen.getByText('10 productos encontrados')).toBeInTheDocument()
  })

  it('conecta detalle y formulario con el cilindro preseleccionado', async () => {
    const usuario = userEvent.setup()
    render(<App />)

    await usuario.click(screen.getByRole('button', { name: 'Ver detalle de Cilindro GLP 11 kg' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Cilindro GLP 11 kg' })).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Solicitar cilindro' }))
    expect(screen.getByLabelText('Cilindro')).toHaveValue('CL002')
  })

  it('muestra una salida útil cuando el código del detalle no existe', () => {
    window.history.replaceState({}, '', '/productos/NOEXISTE')
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Producto no encontrado' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Volver al catálogo' })).toHaveAttribute('href', '/catalogo')
  })
})
