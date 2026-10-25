import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { asignarRepartidor, cambiarEstadoPedido, crearPedido } from '../services/pedidoService'
import { abrirAdministracion } from '../tests/abrirAdministracion'
import { datosPedido } from '../tests/datosPedido'

describe('página Orden de pedido', () => {
  beforeEach(() => localStorage.clear())

  it('muestra el cobro registrado de un pedido entregado y aclara que no es boleta', async () => {
    crearPedido(datosPedido)
    asignarRepartidor('PED-0001', 'repartidor-2')
    cambiarEstadoPedido('PED-0001', 'en_camino')
    cambiarEstadoPedido('PED-0001', 'entregado')

    await abrirAdministracion('/administracion/pedidos/PED-0001')

    expect(screen.getByText(/Cobro registrado: \$6\.500/)).toBeInTheDocument()
    expect(screen.getByText(/No reemplaza una boleta tributaria/)).toBeInTheDocument()
    expect(screen.getByText('Pedido sin cuenta de cliente.')).toBeInTheDocument()
  })

  it('informa un número de pedido inexistente', async () => {
    await abrirAdministracion('/administracion/pedidos/PED-9999')

    expect(screen.getByText('No existe un pedido con el número PED-9999.')).toBeInTheDocument()
  })
})
