import { beforeEach, describe, expect, it } from 'vitest'
import {
  ESTADOS_PEDIDO,
  asignarRepartidor,
  cambiarEstadoPedido,
  crearPedido,
  listarPedidos,
  obtenerPedidoPorId,
  restaurarPedidos,
} from './pedidoService'

const datosPedido = {
  cliente: { nombre: 'Ana Pérez', telefono: '912345678' },
  productos: [{ codigo: 'CL001', cantidad: 1, precioUnitario: 15990 }],
  direccion: 'Los Aromos 123',
  comuna: 'Puente Alto',
  total: 15990,
}

describe('pedidoService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('inicia sin pedidos simulados', () => {
    expect(listarPedidos()).toEqual([])
  })

  it('crea un pedido pendiente con identificador correlativo', () => {
    const primerPedido = crearPedido(datosPedido)
    const segundoPedido = crearPedido(datosPedido)

    expect(primerPedido).toMatchObject({
      id: 'PED-0001',
      estado: ESTADOS_PEDIDO.PENDIENTE,
      repartidor: null,
    })
    expect(segundoPedido.id).toBe('PED-0002')
    expect(listarPedidos()).toHaveLength(2)
  })

  it('obtiene un pedido por su identificador', () => {
    crearPedido(datosPedido)

    expect(obtenerPedidoPorId('PED-0001')?.cliente.nombre).toBe('Ana Pérez')
    expect(obtenerPedidoPorId('PED-9999')).toBeNull()
  })

  it('asigna un repartidor y cambia el pedido a asignado', () => {
    const pedido = crearPedido(datosPedido)
    const actualizado = asignarRepartidor(pedido.id, 'Carlos Soto')

    expect(actualizado).toMatchObject({
      repartidor: 'Carlos Soto',
      estado: ESTADOS_PEDIDO.ASIGNADO,
    })
  })

  it('avanza respetando la secuencia completa de estados', () => {
    const pedido = crearPedido(datosPedido)
    asignarRepartidor(pedido.id, 'Carlos Soto')

    expect(cambiarEstadoPedido(pedido.id, ESTADOS_PEDIDO.EN_CAMINO).estado)
      .toBe(ESTADOS_PEDIDO.EN_CAMINO)
    expect(cambiarEstadoPedido(pedido.id, ESTADOS_PEDIDO.ENTREGADO).estado)
      .toBe(ESTADOS_PEDIDO.ENTREGADO)
  })

  it('rechaza saltos o retrocesos en la secuencia de estados', () => {
    const pedido = crearPedido(datosPedido)

    expect(() => cambiarEstadoPedido(pedido.id, ESTADOS_PEDIDO.EN_CAMINO))
      .toThrow('El cambio de estado no respeta la secuencia del pedido')
  })

  it('rechaza pedidos sin productos', () => {
    expect(() => crearPedido({ cliente: datosPedido.cliente, productos: [] }))
      .toThrow('El pedido debe incluir al menos un producto')
  })

  it('restaura los pedidos cuando el almacenamiento está dañado', () => {
    localStorage.setItem('gas-el-volcan-pedidos', '{contenido incorrecto')

    expect(listarPedidos()).toEqual([])
    expect(localStorage.getItem('gas-el-volcan-pedidos')).toBe('[]')
  })

  it('restaura manualmente el conjunto inicial', () => {
    crearPedido(datosPedido)

    expect(restaurarPedidos()).toEqual([])
    expect(listarPedidos()).toEqual([])
  })

  it('informa cuando se intenta modificar un pedido inexistente', () => {
    expect(() => asignarRepartidor('PED-9999', 'Carlos Soto'))
      .toThrow('No se encontró el pedido solicitado')
  })
})
