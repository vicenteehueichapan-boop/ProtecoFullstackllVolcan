import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { asignarRepartidor, cambiarEstadoPedido, crearPedido } from '../services/pedidoService'
import { abrirAdministracion } from '../tests/abrirAdministracion'
import { datosPedido } from '../tests/datosPedido'

function indicador(titulo) {
  return screen.getByRole('heading', { name: titulo }).closest('.card')
}

describe('página Reportes', () => {
  beforeEach(() => localStorage.clear())

  it('calcula efectivo, pendiente y productos desde los pedidos guardados', async () => {
    crearPedido(datosPedido)
    crearPedido(datosPedido)
    asignarRepartidor('PED-0001', 'repartidor-1')
    cambiarEstadoPedido('PED-0001', 'en_camino')
    cambiarEstadoPedido('PED-0001', 'entregado')

    await abrirAdministracion('/administracion/reportes')

    expect(within(indicador('Efectivo registrado')).getByText('$6.500')).toBeInTheDocument()
    expect(within(indicador('Por cobrar')).getByText('$6.500')).toBeInTheDocument()
    expect(screen.getByText('Cilindro GLP 5 kg')).toBeInTheDocument()
    expect(screen.getByText('Zona Centro').nextSibling).toHaveTextContent('2')
  })

  it('explica cuando todavía no hay pedidos', async () => {
    await abrirAdministracion('/administracion/reportes')

    expect(screen.getAllByText('Sin pedidos todavía.')).toHaveLength(2)
  })
})
