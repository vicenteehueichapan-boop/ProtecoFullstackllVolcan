import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { agregarAlCarrito, leerCarrito } from '../services/carritoService'
import { actualizarProducto } from '../services/productoService'
import { listarPedidos } from '../services/pedidoService'

async function completarEntrega() {
  await userEvent.type(screen.getByLabelText('Nombre'), 'Ana')
  await userEvent.type(screen.getByLabelText('Apellidos'), 'Pérez')
  await userEvent.type(screen.getByLabelText('Correo'), 'ana@ejemplo.cl')
  await userEvent.type(screen.getByLabelText('Dirección de entrega'), 'Los Aromos 123')
  await userEvent.selectOptions(screen.getByLabelText('Zona de despacho'), 'centro')
  await userEvent.click(screen.getByRole('button', { name: 'Revisar pedido' }))
}

describe('recorrido del carrito persistente', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/carrito')
  })
  afterEach(() => vi.restoreAllMocks())

  it('agrega desde detalle y recupera cantidades y tarifa tras volver a montar', async () => {
    window.history.replaceState({}, '', '/productos/CL001')
    const vista = render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }))
    await userEvent.click(screen.getByRole('button', { name: 'Aumentar cantidad de Cilindro GLP 5 kg' }))
    await userEvent.selectOptions(screen.getByLabelText('Tipo de cliente'), 'comercial')
    expect(screen.getByText('Total: $12.000')).toBeInTheDocument()
    vista.unmount()
    render(<App />)
    expect(screen.getByText('Cantidad: 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Tipo de cliente')).toHaveValue('comercial')
    expect(screen.getByText('Total: $12.000')).toBeInTheDocument()
  })

  it('permite cancelar el vaciado, quitar una línea y vaciar con confirmación', async () => {
    agregarAlCarrito('CL001')
    agregarAlCarrito('CL002')
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Vaciar carrito', exact: true }))
    await userEvent.click(screen.getByRole('button', { name: 'Conservar carrito' }))
    expect(leerCarrito().lineas).toHaveLength(2)
    await userEvent.click(screen.getByRole('button', { name: 'Quitar Cilindro GLP 11 kg' }))
    expect(leerCarrito().lineas).toHaveLength(1)
    await userEvent.click(screen.getByRole('button', { name: 'Vaciar carrito', exact: true }))
    await userEvent.click(screen.getByRole('button', { name: 'Sí, vaciar carrito' }))
    expect(leerCarrito().lineas).toEqual([])
    expect(screen.getByText(/Tu carrito está vacío/)).toBeInTheDocument()
  })

  it('confirma varios cilindros, muestra todos los subtotales y vacía solo tras guardar', async () => {
    agregarAlCarrito('CL001')
    agregarAlCarrito('CL002')
    render(<App />)
    await userEvent.click(screen.getByRole('link', { name: 'Continuar con la entrega' }))
    await completarEntrega()
    expect(screen.getByText(/Cilindro GLP 5 kg × 1/)).toBeInTheDocument()
    expect(screen.getByText(/Cilindro GLP 11 kg × 1/)).toBeInTheDocument()
    expect(listarPedidos()).toHaveLength(0)
    await userEvent.click(screen.getByRole('button', { name: 'Corregir datos' }))
    expect(screen.getByLabelText('Correo')).toHaveValue('ana@ejemplo.cl')
    await userEvent.click(screen.getByRole('button', { name: 'Revisar pedido' }))
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
    expect(screen.getByRole('heading', { name: 'Pedido confirmado' })).toBeInTheDocument()
    expect(screen.getByText('Subtotal: $6.500')).toBeInTheDocument()
    expect(screen.getByText('Subtotal: $12.000')).toBeInTheDocument()
    expect(listarPedidos()[0]).toMatchObject({ total: 18500, cliente: { correo: 'ana@ejemplo.cl' } })
    expect(listarPedidos()[0].productos).toHaveLength(2)
    expect(leerCarrito().lineas).toEqual([])
  })

  it('impide continuar con stock agotado sin quitar la línea silenciosamente', () => {
    agregarAlCarrito('CL001')
    actualizarProducto('CL001', { stock: 0 })
    render(<App />)
    expect(screen.getByText(/Solo quedan 0 unidades/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Continuar con la entrega' })).not.toBeInTheDocument()
    expect(leerCarrito().lineas).toHaveLength(1)
  })

  it('rechaza un precio cambiado antes de confirmar y conserva selección y formulario', async () => {
    agregarAlCarrito('CL001')
    window.history.replaceState({}, '', '/confirmar-pedido')
    render(<App />)
    await completarEntrega()
    act(() => actualizarProducto('CL001', { precioResidencial: 7000 }))
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
    expect(screen.getByRole('alert')).toHaveTextContent('precios del catálogo cambiaron')
    expect(listarPedidos()).toHaveLength(0)
    expect(leerCarrito().lineas).toHaveLength(1)
    expect(screen.getByLabelText('Nombre')).toHaveValue('Ana')
  })

  it('no borra el carrito ni pierde el formulario si falla el registro del pedido', async () => {
    agregarAlCarrito('CL001')
    window.history.replaceState({}, '', '/confirmar-pedido')
    render(<App />)
    await completarEntrega()
    const original = Storage.prototype.setItem
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (clave, valor) {
      if (clave === 'gas-el-volcan-pedidos') throw new Error('No hay espacio para el pedido')
      return original.call(this, clave, valor)
    })
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
    expect(screen.getByRole('alert')).toHaveTextContent('No hay espacio para el pedido')
    expect(leerCarrito().lineas).toHaveLength(1)
    expect(screen.getByLabelText('Nombre')).toHaveValue('Ana')
  })

  it('informa éxito sin permitir reenvío si falla el vaciado posterior al registro', async () => {
    agregarAlCarrito('CL001')
    window.history.replaceState({}, '', '/confirmar-pedido')
    render(<App />)
    await completarEntrega()
    const original = Storage.prototype.setItem
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (clave, valor) {
      if (clave === 'gas-el-volcan-carrito') throw new Error('No se puede limpiar')
      return original.call(this, clave, valor)
    })
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
    expect(screen.getByRole('heading', { name: 'Pedido confirmado' })).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('no pudimos vaciar el carrito')
    expect(screen.queryByRole('button', { name: 'Confirmar pedido' })).not.toBeInTheDocument()
    expect(listarPedidos()).toHaveLength(1)
    expect(leerCarrito().lineas).toHaveLength(1)
  })

  it('bloquea el acceso directo a confirmación sin una selección', () => {
    window.history.replaceState({}, '', '/confirmar-pedido')
    render(<App />)
    expect(screen.getByRole('alert')).toHaveTextContent('El carrito está vacío')
    expect(screen.queryByRole('button', { name: 'Revisar pedido' })).not.toBeInTheDocument()
    expect(listarPedidos()).toHaveLength(0)
  })
})
