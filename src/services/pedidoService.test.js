import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { datosPedido } from '../tests/datosPedido'
import { actualizarProducto, eliminarProducto } from './productoService'
import {
  ESTADOS_PEDIDO,
  asignarRepartidor,
  cambiarEstadoPedido,
  crearPedido,
  listarPedidos,
  obtenerPedidoPorId,
  restaurarPedidos,
} from './pedidoService'

describe('pedidoService', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  afterEach(() => vi.restoreAllMocks())

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

  it('asocia el pedido a la cuenta del cliente cuando hay sesión', () => {
    const pedido = crearPedido({ ...datosPedido, clienteId: 'CLI-0001' })

    expect(pedido.clienteId).toBe('CLI-0001')
    expect(listarPedidos()[0].clienteId).toBe('CLI-0001')
  })

  it.each(['cliente-1', 7, ''])('rechaza un identificador de cliente inválido %j', (clienteId) => {
    expect(() => crearPedido({ ...datosPedido, clienteId })).toThrow('La cuenta del cliente no es válida')
    expect(listarPedidos()).toEqual([])
  })

  it('sigue leyendo pedidos anteriores que no tienen cuenta asociada', () => {
    const anterior = crearPedido(datosPedido)
    delete anterior.clienteId
    localStorage.setItem('gas-el-volcan-pedidos', JSON.stringify([anterior]))

    expect(listarPedidos()).toHaveLength(1)
  })

  it('obtiene un pedido por su identificador', () => {
    crearPedido(datosPedido)

    expect(obtenerPedidoPorId('PED-0001')?.cliente.nombre).toBe('Ana Pérez')
    expect(obtenerPedidoPorId('PED-9999')).toBeNull()
  })

  it('asigna un repartidor y cambia el pedido a asignado', () => {
    const pedido = crearPedido(datosPedido)
    const actualizado = asignarRepartidor(pedido.id, 'Repartidor 1')

    expect(actualizado).toMatchObject({
      repartidor: 'Repartidor 1',
      estado: ESTADOS_PEDIDO.ASIGNADO,
    })
  })

  it('avanza respetando la secuencia completa de estados', () => {
    const pedido = crearPedido(datosPedido)
    asignarRepartidor(pedido.id, 'Repartidor 1')

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

  it.each(['Repartidor 1', 'Repartidor 2', 'Repartidor 3'])('permite asignar a %s y conserva la asignación', (nombre) => {
    const pedido = crearPedido(datosPedido)

    asignarRepartidor(pedido.id, nombre)

    expect(obtenerPedidoPorId(pedido.id)).toMatchObject({
      repartidor: nombre,
      estado: ESTADOS_PEDIDO.ASIGNADO,
    })
  })

  it.each([
    ['', 'Se debe indicar un repartidor'],
    ['   ', 'Se debe indicar un repartidor'],
    [null, 'Se debe indicar un repartidor'],
    ['Carlos Soto', 'El repartidor seleccionado no está disponible'],
    ['Repartidor 99', 'El repartidor seleccionado no está disponible'],
  ])('rechaza repartidor inválido %j sin modificar el pedido', (nombre, mensaje) => {
    const pedido = crearPedido(datosPedido)
    const almacenamientoAnterior = localStorage.getItem('gas-el-volcan-pedidos')

    expect(() => asignarRepartidor(pedido.id, nombre)).toThrow(mensaje)
    expect(localStorage.getItem('gas-el-volcan-pedidos')).toBe(almacenamientoAnterior)
    expect(obtenerPedidoPorId(pedido.id)).toEqual(pedido)
  })

  it('rechaza pedidos sin productos', () => {
    expect(() => crearPedido({ cliente: datosPedido.cliente, productos: [] }))
      .toThrow('El pedido debe incluir al menos un producto')
  })

  it('informa el almacenamiento dañado sin borrar su contenido', () => {
    localStorage.setItem('gas-el-volcan-pedidos', '{contenido incorrecto')

    expect(() => listarPedidos()).toThrow('Los pedidos guardados están dañados')
    expect(localStorage.getItem('gas-el-volcan-pedidos')).toBe('{contenido incorrecto')
  })

  it('no registra un pedido nuevo encima de pedidos dañados', () => {
    const guardados = JSON.stringify([crearPedido(datosPedido), { id: 'PED-0002' }])
    localStorage.setItem('gas-el-volcan-pedidos', guardados)

    expect(() => crearPedido(datosPedido)).toThrow('Los pedidos guardados están dañados')
    expect(localStorage.getItem('gas-el-volcan-pedidos')).toBe(guardados)
  })

  it('informa cuando el navegador no permite leer el almacenamiento', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Bloqueado') })

    expect(() => listarPedidos()).toThrow('No se pudo leer el almacenamiento')
  })

  it.each([
    { cliente: { nombre: 'Ana' } },
    { zona: { id: 'inexistente' } },
    { tipoCliente: 'inexistente' },
    { formaPago: 'tarjeta' },
    { total: 1 },
    { productos: [{ ...datosPedido.productos[0], cantidad: -1 }] },
    { productos: [{ ...datosPedido.productos[0], precioUnitario: NaN }] },
  ])('rechaza datos incoherentes antes de persistir: %j', (cambios) => {
    expect(() => crearPedido({ ...datosPedido, ...cambios })).toThrow()
    expect(listarPedidos()).toEqual([])
  })

  it('revalida stock vigente al confirmar un resumen anterior', () => {
    actualizarProducto('CL001', { stock: 0 })
    expect(() => crearPedido(datosPedido)).toThrow('El stock de Cilindro GLP 5 kg cambió')
    expect(listarPedidos()).toEqual([])
  })

  it('exige revisar otra vez el resumen si el precio cambió', () => {
    actualizarProducto('CL001', { precioResidencial: 7000 })
    expect(() => crearPedido(datosPedido)).toThrow('Los datos o precios del catálogo cambiaron')
  })

  it('rechaza un cilindro eliminado antes de confirmar', () => {
    eliminarProducto('CL001')
    expect(() => crearPedido(datosPedido)).toThrow('Un cilindro del pedido ya no está disponible')
  })

  it('conserva una lista cuyo JSON es válido pero contiene pedidos incompletos', () => {
    const guardados = JSON.stringify([{ id: 'PED-0001' }])
    localStorage.setItem('gas-el-volcan-pedidos', guardados)

    expect(() => listarPedidos()).toThrow('Los pedidos guardados están dañados')
    expect(localStorage.getItem('gas-el-volcan-pedidos')).toBe(guardados)
  })

  it('repara los pedidos dañados solo con una restauración explícita', () => {
    localStorage.setItem('gas-el-volcan-pedidos', '{')

    expect(restaurarPedidos()).toEqual([])
    expect(listarPedidos()).toEqual([])
  })

  it('restaura manualmente el conjunto inicial', () => {
    crearPedido(datosPedido)

    expect(restaurarPedidos()).toEqual([])
    expect(listarPedidos()).toEqual([])
  })

  it('informa cuando se intenta modificar un pedido inexistente', () => {
    expect(() => asignarRepartidor('PED-9999', 'Repartidor 1'))
      .toThrow('No se encontró el pedido solicitado')
  })
})
