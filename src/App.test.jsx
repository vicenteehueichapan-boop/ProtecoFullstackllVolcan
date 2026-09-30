import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

function irA(ruta) {
  act(() => {
    window.history.pushState({}, '', ruta)
    window.dispatchEvent(new PopStateEvent('popstate'))
  })
}

describe('recorrido completo de un pedido', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/nuevo-pedido')
  })

  it('conecta confirmación, operadora, repartidor y seguimiento', async () => {
    const usuario = userEvent.setup()
    render(<App />)

    await usuario.type(screen.getByLabelText('Nombre del cliente'), 'Ana Pérez')
    await usuario.type(screen.getByLabelText('Dirección de entrega'), 'Los Aromos 123')
    await usuario.selectOptions(screen.getByLabelText('Zona de despacho'), 'centro')
    await usuario.selectOptions(screen.getByLabelText('Cilindro'), 'CL001')
    await usuario.clear(screen.getByLabelText('Cantidad'))
    await usuario.type(screen.getByLabelText('Cantidad'), '2')
    await usuario.click(screen.getByRole('button', { name: 'Revisar pedido' }))

    expect(screen.getByRole('heading', { name: 'Resumen del pedido' })).toBeInTheDocument()
    expect(screen.getByText(/Cilindro GLP 5 kg × 2/)).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByRole('heading', { name: 'Pedido confirmado' })).toBeInTheDocument()
    expect(screen.getByText('PED-0001')).toBeInTheDocument()

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

    irA('/repartidor/entregas')
    expect(await screen.findByRole('heading', { name: 'Mis entregas' })).toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: 'Marcar en camino' }))
    expect(screen.getByText('El estado de PED-0001 fue actualizado.')).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Marcar entregado' }))
    expect(screen.getByText('Entrega completada.')).toBeInTheDocument()

    irA('/seguimiento/PED-0001')
    expect(await screen.findByRole('heading', { name: 'Pedido PED-0001' })).toBeInTheDocument()
    expect(screen.getByText('Repartidor 1')).toBeInTheDocument()
    expect(screen.getByText('Pedido entregado')).toHaveClass('list-group-item-success')
  })
})
