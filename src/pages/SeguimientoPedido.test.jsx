import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { PedidosProvider } from '../context/PedidosContext'
import { SesionClienteProvider } from '../context/SesionClienteContext'
import { UsuariosProvider } from '../context/UsuariosContext'
import { iniciarSesionCliente, registrarCliente } from '../services/clienteService'
import { crearPedido } from '../services/pedidoService'
import { datosPedido } from '../tests/datosPedido'
import SeguimientoPedido from './SeguimientoPedido'

const pedidoAna = { ...datosPedido, cliente: { ...datosPedido.cliente, correo: 'ana@correo.cl' } }

function ControlesHistorial() {
  const navegar = useNavigate()
  return (
    <>
      <button onClick={() => navegar(-1)}>Atrás en historial</button>
      <button onClick={() => navegar(1)}>Adelante en historial</button>
    </>
  )
}

function mostrarSeguimiento(entradas, indice = 0) {
  return render(
    <MemoryRouter initialEntries={entradas} initialIndex={indice}>
      <UsuariosProvider>
      <SesionClienteProvider>
        <PedidosProvider>
          <ControlesHistorial />
          <Routes>
            <Route path="/seguimiento" element={<SeguimientoPedido />} />
            <Route path="/seguimiento/:id" element={<SeguimientoPedido />} />
          </Routes>
        </PedidosProvider>
      </SesionClienteProvider>
      </UsuariosProvider>
    </MemoryRouter>,
  )
}

describe('seguimiento del pedido', () => {
  beforeEach(() => {
    localStorage.clear()
    crearPedido(pedidoAna)
    crearPedido(pedidoAna)
  })

  it('mantiene el campo y el resultado alineados al volver y avanzar entre pedidos', async () => {
    const correo = { correo: 'ana@correo.cl' }
    mostrarSeguimiento([
      { pathname: '/seguimiento/PED-0001', state: correo },
      { pathname: '/seguimiento/PED-0002', state: correo },
    ], 1)
    const numero = () => screen.getByRole('textbox', { name: 'Número del pedido' })

    expect(numero()).toHaveValue('PED-0002')
    expect(screen.getByRole('heading', { name: 'Pedido PED-0002' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Atrás en historial' }))
    expect(numero()).toHaveValue('PED-0001')
    expect(screen.getByRole('heading', { name: 'Pedido PED-0001' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Adelante en historial' }))
    expect(numero()).toHaveValue('PED-0002')
    expect(screen.getByRole('heading', { name: 'Pedido PED-0002' })).toBeInTheDocument()
  })

  it('no muestra la dirección a quien solo conoce el número del pedido', () => {
    mostrarSeguimiento(['/seguimiento/PED-0001'])

    expect(screen.getByRole('alert')).toHaveTextContent('No encontramos un pedido PED-0001 asociado a ese correo')
    expect(screen.queryByText(/Los Aromos 123/)).not.toBeInTheDocument()
  })

  it('busca con número y correo sin poner el correo en la dirección', async () => {
    mostrarSeguimiento(['/seguimiento'])
    await userEvent.type(screen.getByRole('textbox', { name: 'Número del pedido' }), 'ped-0002')
    await userEvent.type(screen.getByRole('textbox', { name: 'Correo usado en el pedido' }), 'otra@correo.cl')
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('PED-0002')

    await userEvent.clear(screen.getByRole('textbox', { name: 'Correo usado en el pedido' }))
    await userEvent.type(screen.getByRole('textbox', { name: 'Correo usado en el pedido' }), 'ANA@correo.cl')
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }))
    expect(screen.getByRole('heading', { name: 'Pedido PED-0002' })).toBeInTheDocument()
    expect(screen.getByText('Pedido recibido')).toHaveClass('list-group-item-success')
  })

  it('muestra el pedido a la cuenta que lo registró sin pedir el correo', () => {
    const { id } = registrarCliente({
      nombre: 'Ana', apellidos: 'Pérez', run: '12345678K', correo: 'cuenta@correo.cl', tipoCliente: 'residencial',
    })
    iniciarSesionCliente('cuenta@correo.cl')
    crearPedido({ ...datosPedido, clienteId: id })

    mostrarSeguimiento(['/seguimiento/PED-0003'])

    expect(screen.getByRole('heading', { name: 'Pedido PED-0003' })).toBeInTheDocument()
  })
})
