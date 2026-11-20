import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, expect, it, vi } from 'vitest'
import DetallePedidoApi from './DetallePedidoApi'
import { PedidosContext } from '../context/pedidosContextoBase'
import { SesionClienteContext } from '../context/sesionClienteContextoBase'
import { SesionPersonalContext } from '../context/sesionPersonalContextoBase'
import { obtenerPedido } from '../services/pedidosApiService'

vi.mock('../services/pedidosApiService', () => ({ obtenerPedido: vi.fn() }))

const cliente = { id: 'cliente-uno', nombre: 'Ana' }
const pedido = {
  id: 'pedido-uno', numero: 1, estado: 'pendiente', tipoCliente: 'residencial', total: 6500,
  cliente: { nombre: 'Ana', apellidos: 'Prueba', correo: 'ana@ejemplo.cl', direccion: 'Dirección ficticia 123' },
  zona: { nombre: 'Centro', tiempoEstimado: '1 a 3 horas' },
  productos: [{ codigo: 'CL001', nombre: 'Cilindro 5 kg', cantidad: 1, subtotal: 6500 }],
}

function Vista({ cuenta }) {
  return <MemoryRouter initialEntries={['/seguimiento/pedido-uno']}>
    <PedidosContext.Provider value={{ eliminarPedido: vi.fn() }}>
      <SesionClienteContext.Provider value={{ cliente: cuenta }}>
        <SesionPersonalContext.Provider value={{ personal: null }}>
          <Routes><Route path="/seguimiento/:id" element={<DetallePedidoApi />} /></Routes>
        </SesionPersonalContext.Provider>
      </SesionClienteContext.Provider>
    </PedidosContext.Provider>
  </MemoryRouter>
}

beforeEach(() => { vi.clearAllMocks(); obtenerPedido.mockResolvedValue(pedido) })

it('retira los datos privados del pedido al perder la sesión sin cambiar de ruta', async () => {
  const vista = render(<Vista cuenta={cliente} />)
  await screen.findByText('ana@ejemplo.cl', { exact: false })
  expect(screen.getByRole('button', { name: 'Eliminar pedido pendiente' })).toBeInTheDocument()

  vista.rerender(<Vista cuenta={null} />)

  expect(screen.queryByText('ana@ejemplo.cl', { exact: false })).not.toBeInTheDocument()
  expect(screen.queryByText('Dirección ficticia 123', { exact: false })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Eliminar pedido pendiente' })).not.toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Ingresar' })).toHaveAttribute('href', '/ingreso')
})

it('no reutiliza el detalle de la cuenta anterior cuando cambia la identidad', async () => {
  const vista = render(<Vista cuenta={cliente} />)
  await screen.findByText('ana@ejemplo.cl', { exact: false })
  obtenerPedido.mockRejectedValueOnce(new Error('No tienes permiso para acceder a ese pedido.'))

  vista.rerender(<Vista cuenta={{ id: 'cliente-dos', nombre: 'Otra persona' }} />)

  expect(screen.queryByText('ana@ejemplo.cl', { exact: false })).not.toBeInTheDocument()
  await screen.findByText('No tienes permiso para acceder a ese pedido.')
  expect(obtenerPedido).toHaveBeenCalledTimes(2)
})
