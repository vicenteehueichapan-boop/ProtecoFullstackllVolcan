import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { PedidosProvider } from '../context/PedidosContext'
import { crearPedido } from '../services/pedidoService'
import { datosPedido } from '../tests/datosPedido'
import SeguimientoPedido from './SeguimientoPedido'

function ControlesHistorial() {
  const navegar = useNavigate()
  return (
    <>
      <button onClick={() => navegar(-1)}>Atrás en historial</button>
      <button onClick={() => navegar(1)}>Adelante en historial</button>
    </>
  )
}

describe('seguimiento e historial del navegador', () => {
  beforeEach(() => {
    localStorage.clear()
    crearPedido(datosPedido)
    crearPedido(datosPedido)
  })

  it('mantiene el campo y el resultado alineados al volver y avanzar entre pedidos', async () => {
    render(
      <MemoryRouter initialEntries={['/seguimiento/PED-0001', '/seguimiento/PED-0002']} initialIndex={1}>
        <PedidosProvider>
          <ControlesHistorial />
          <Routes>
            <Route path="/seguimiento/:id" element={<SeguimientoPedido />} />
          </Routes>
        </PedidosProvider>
      </MemoryRouter>,
    )
    expect(screen.getByRole('textbox', { name: 'Número del pedido' })).toHaveValue('PED-0002')
    expect(screen.getByRole('heading', { name: 'Pedido PED-0002' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Atrás en historial' }))
    expect(screen.getByRole('textbox', { name: 'Número del pedido' })).toHaveValue('PED-0001')
    expect(screen.getByRole('heading', { name: 'Pedido PED-0001' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Adelante en historial' }))
    expect(screen.getByRole('textbox', { name: 'Número del pedido' })).toHaveValue('PED-0002')
    expect(screen.getByRole('heading', { name: 'Pedido PED-0002' })).toBeInTheDocument()
  })
})
