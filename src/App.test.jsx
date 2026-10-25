import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { ingresarPersonalEnPrueba } from './tests/ingresarPersonal'

function irA(ruta) {
  act(() => {
    window.history.pushState({}, '', ruta)
    window.dispatchEvent(new PopStateEvent('popstate'))
  })
}

describe('recorrido completo de un pedido', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  it('conecta cuenta, carrito, operadora, repartidor, historial y seguimiento', async () => {
    window.history.replaceState({}, '', '/registro')
    const usuario = userEvent.setup()
    render(<App />)

    await usuario.type(screen.getByLabelText('Nombre'), 'Ana')
    await usuario.type(screen.getByLabelText('Apellidos'), 'Pérez')
    await usuario.type(screen.getByLabelText('RUN sin puntos ni guion'), '12345678K')
    await usuario.type(screen.getByLabelText('Correo'), 'ana@correo.cl')
    await usuario.type(screen.getByLabelText('Contraseña'), 'volcan2026')
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), 'volcan2026')
    await usuario.click(screen.getByRole('button', { name: 'Registrarme' }))
    expect(await screen.findByRole('link', { name: 'Mis pedidos' })).toBeInTheDocument()

    irA('/productos/CL001')
    await usuario.click(await screen.findByRole('button', { name: 'Agregar al carrito' }))
    await usuario.click(screen.getByRole('button', { name: 'Aumentar cantidad de Cilindro GLP 5 kg' }))
    irA('/confirmar-pedido')

    // La entrega parte con los datos de la cuenta; solo falta la dirección del primer pedido.
    expect(screen.getByLabelText('Nombre')).toHaveValue('Ana')
    expect(screen.getByLabelText('Apellidos')).toHaveValue('Pérez')
    expect(screen.getByLabelText('Correo')).toHaveValue('ana@correo.cl')
    await usuario.type(screen.getByLabelText('Dirección de entrega'), 'Los Aromos 123')
    await usuario.selectOptions(screen.getByLabelText('Zona de despacho'), 'centro')
    await usuario.click(screen.getByRole('button', { name: 'Revisar pedido' }))
    expect(screen.getByText(/Cilindro GLP 5 kg × 2/)).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByRole('heading', { name: 'Pedido confirmado' })).toBeInTheDocument()
    expect(screen.getByText('PED-0001')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('gas-el-volcan-pedidos'))[0].clienteId).toBe('CLI-0001')
    // El stock visible ya descuenta los 2 cilindros del pedido (80 - 2).
    irA('/productos/CL001')
    expect(await screen.findByText(/Stock disponible: 78/)).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('gas-el-volcan-clientes'))[0]).toMatchObject({
      direccion: 'Los Aromos 123', zonaId: 'centro',
    })

    await ingresarPersonalEnPrueba(usuario, 'operadora@ejemplo.cl')
    irA('/operadora/pedidos')
    expect(await screen.findByRole('heading', { name: 'Pedidos del día' })).toBeInTheDocument()

    const selectorRepartidor = screen.getByLabelText('Repartidor para PED-0001')
    const filaPedido = selectorRepartidor.closest('tr')
    const botonAsignar = within(filaPedido).getByRole('button', { name: 'Asignar' })
    expect(botonAsignar).toBeDisabled()

    await usuario.selectOptions(selectorRepartidor, 'Repartidor 1')
    expect(botonAsignar).toBeEnabled()
    await usuario.click(botonAsignar)

    expect(screen.getByText('El pedido PED-0001 fue asignado correctamente.'))
      .toBeInTheDocument()

    await ingresarPersonalEnPrueba(usuario, 'repartidor2@ejemplo.cl')
    irA('/repartidor/entregas')
    expect(screen.queryByText('PED-0001')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Repartidor de demostración')).not.toBeInTheDocument()
    await ingresarPersonalEnPrueba(usuario, 'repartidor1@ejemplo.cl')
    irA('/repartidor/entregas')
    expect(await screen.findByRole('heading', { name: 'Mis entregas' })).toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: 'Marcar en camino' }))
    expect(screen.getByText('El estado de PED-0001 fue actualizado.')).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Marcar entregado' }))
    expect(screen.getByText('Entrega completada.')).toBeInTheDocument()

    irA('/mis-pedidos')
    await usuario.click(await screen.findByRole('link', { name: 'Ver seguimiento de PED-0001' }))
    expect(await screen.findByRole('heading', { name: 'Pedido PED-0001' })).toBeInTheDocument()
    expect(screen.getByText('Repartidor 1')).toBeInTheDocument()
    expect(screen.getByText('Pedido entregado')).toHaveClass('list-group-item-success')
  }, 20000)
})

describe('datos guardados dañados', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  it('muestra un aviso en la tienda en vez de dejar la página en blanco', () => {
    localStorage.setItem('gas-el-volcan-pedidos', '[{"id":"PED-0001"}]')
    localStorage.setItem('gas-el-volcan-productos', '{')
    render(<App />)

    const aviso = screen.getByText('No pudimos leer algunos datos guardados en este navegador.').closest('[role="alert"]')
    expect(aviso).toHaveTextContent('El catálogo guardado está dañado')
    expect(aviso).toHaveTextContent('Los pedidos guardados están dañados')
    expect(localStorage.getItem('gas-el-volcan-pedidos')).toBe('[{"id":"PED-0001"}]')
  })
})
