import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FormularioNuevoPedido from './FormularioNuevoPedido'

const productos = [
  {
    codigo: 'CL001',
    categoria: 'Cilindros de Gas',
    nombre: 'Cilindro GLP 5 kg',
    precioResidencial: 6500,
    precioComercial: 6000,
    stock: 2,
  },
  {
    codigo: 'RG001',
    categoria: 'Reguladores',
    nombre: 'Regulador doméstico',
    precioResidencial: 8990,
    precioComercial: 8200,
    stock: 10,
  },
]

const zonas = [
  { id: 'centro', nombre: 'Zona Centro', tiempoEstimado: '1 a 3 horas' },
]

describe('FormularioNuevoPedido', () => {
  it('muestra los errores de los campos obligatorios', async () => {
    const usuario = userEvent.setup()
    render(
      <FormularioNuevoPedido
        productos={productos}
        zonas={zonas}
        alPrepararPedido={vi.fn()}
      />,
    )

    await usuario.click(screen.getByRole('button', { name: 'Revisar pedido' }))

    expect(screen.getByText('Ingresa el nombre del cliente.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa una dirección de entrega válida.')).toBeInTheDocument()
    expect(screen.getByText('Selecciona una zona de despacho.')).toBeInTheDocument()
    expect(screen.getByText('Selecciona el cilindro solicitado.')).toBeInTheDocument()
  })

  it('impide solicitar una cantidad superior al stock', async () => {
    const usuario = userEvent.setup()
    const alPrepararPedido = vi.fn()
    render(
      <FormularioNuevoPedido
        productos={productos}
        zonas={zonas}
        alPrepararPedido={alPrepararPedido}
      />,
    )

    await usuario.type(screen.getByLabelText('Nombre del cliente'), 'Ana Pérez')
    await usuario.type(screen.getByLabelText('Dirección de entrega'), 'Los Aromos 123')
    await usuario.selectOptions(screen.getByLabelText('Zona de despacho'), 'centro')
    await usuario.selectOptions(screen.getByLabelText('Cilindro'), 'CL001')
    await usuario.clear(screen.getByLabelText('Cantidad'))
    await usuario.type(screen.getByLabelText('Cantidad'), '3')
    await usuario.click(screen.getByRole('button', { name: 'Revisar pedido' }))

    expect(screen.getByText('La cantidad debe estar entre 1 y 2.')).toBeInTheDocument()
    expect(alPrepararPedido).not.toHaveBeenCalled()
  })

  it('prepara un pedido comercial con su precio, zona y total correctos', async () => {
    const usuario = userEvent.setup()
    const alPrepararPedido = vi.fn()
    render(
      <FormularioNuevoPedido
        productos={productos}
        zonas={zonas}
        alPrepararPedido={alPrepararPedido}
        codigoInicial="CL001"
      />,
    )

    await usuario.type(screen.getByLabelText('Nombre del cliente'), ' Ana Pérez ')
    await usuario.type(screen.getByLabelText('Dirección de entrega'), ' Los Aromos 123 ')
    await usuario.selectOptions(screen.getByLabelText('Zona de despacho'), 'centro')
    await usuario.selectOptions(screen.getByLabelText('Tipo de cliente'), 'comercial')
    await usuario.clear(screen.getByLabelText('Cantidad'))
    await usuario.type(screen.getByLabelText('Cantidad'), '2')
    await usuario.click(screen.getByRole('button', { name: 'Revisar pedido' }))

    expect(alPrepararPedido).toHaveBeenCalledWith(expect.objectContaining({
      cliente: { nombre: 'Ana Pérez', direccion: 'Los Aromos 123' },
      zona: { id: 'centro', nombre: 'Zona Centro', tiempoEstimado: '1 a 3 horas' },
      tipoCliente: 'comercial',
      total: 12000,
      productos: [expect.objectContaining({
        codigo: 'CL001',
        cantidad: 2,
        precioUnitario: 6000,
        subtotal: 12000,
      })],
    }))
  })

  it('informa cuando no hay cilindros disponibles', () => {
    render(
      <FormularioNuevoPedido
        productos={productos.filter((producto) => producto.categoria !== 'Cilindros de Gas')}
        zonas={zonas}
        alPrepararPedido={vi.fn()}
      />,
    )

    expect(screen.getByText('No hay cilindros disponibles para crear un pedido.'))
      .toBeInTheDocument()
  })
})
