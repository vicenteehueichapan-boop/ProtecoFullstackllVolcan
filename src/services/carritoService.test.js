import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import {
  leerCarrito, agregarAlCarrito, cambiarCantidadCarrito,
  quitarDelCarrito, cambiarTarifaCarrito, vaciarCarrito,
} from './carritoService'
import { actualizarProducto } from './productoService'

describe('carritoService con persistencia local', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.restoreAllMocks())

  it('inicia vacío sin escribir durante la lectura', () => {
    expect(leerCarrito()).toEqual({ tipoCliente: 'residencial', lineas: [] })
    expect(localStorage.getItem('gas-el-volcan-carrito')).toBeNull()
  })

  it('agrega cilindros distintos, acumula cantidades y conserva las lecturas', () => {
    agregarAlCarrito(' cl001 ')
    agregarAlCarrito('CL001')
    agregarAlCarrito('CL002')
    expect(leerCarrito().lineas).toEqual([{ codigo: 'CL001', cantidad: 2 }, { codigo: 'CL002', cantidad: 1 }])
    expect(leerCarrito()).toEqual(leerCarrito())
  })

  it('modifica cantidades, quita líneas y vacía explícitamente', () => {
    agregarAlCarrito('CL001')
    agregarAlCarrito('CL002')
    cambiarCantidadCarrito('CL001', 3)
    expect(leerCarrito().lineas[0].cantidad).toBe(3)
    quitarDelCarrito('CL002')
    expect(leerCarrito().lineas).toHaveLength(1)
    vaciarCarrito()
    expect(leerCarrito().lineas).toEqual([])
  })

  it('conserva la tarifa y rechaza una tarifa desconocida sin escribirla', () => {
    cambiarTarifaCarrito('comercial')
    expect(leerCarrito().tipoCliente).toBe('comercial')
    expect(() => cambiarTarifaCarrito('otra')).toThrow()
    expect(leerCarrito().tipoCliente).toBe('comercial')
  })

  it.each([0, -1, 1.5, NaN, Infinity, '2'])('rechaza cantidad inválida %s sin alterar el carrito', (cantidad) => {
    agregarAlCarrito('CL001')
    const antes = leerCarrito()
    expect(() => cambiarCantidadCarrito('CL001', cantidad)).toThrow()
    expect(leerCarrito()).toEqual(antes)
  })

  it('agrega cualquier producto del catálogo, no solo cilindros', () => {
    agregarAlCarrito('CL002')
    agregarAlCarrito('RG001')
    agregarAlCarrito('AC003')

    expect(leerCarrito().lineas.map((linea) => linea.codigo)).toEqual(['CL002', 'RG001', 'AC003'])
  })

  it('rechaza códigos inexistentes y stock excedido', () => {
    expect(() => agregarAlCarrito('NOEXISTE')).toThrow()
    actualizarProducto('CL001', { stock: 1 })
    agregarAlCarrito('CL001')
    expect(() => agregarAlCarrito('CL001')).toThrow()
    expect(leerCarrito().lineas[0].cantidad).toBe(1)
    expect(() => cambiarCantidadCarrito('CL002', 1)).toThrow()
  })

  it.each(['{', '{}', '{"tipoCliente":"residencial","lineas":[{"codigo":"CL001","cantidad":0}]}',
    '{"tipoCliente":"residencial","lineas":[{"codigo":"CL001","cantidad":1},{"codigo":"CL001","cantidad":1}]}'])(
    'preserva el contenido dañado hasta que la persona decida vaciarlo: %s', (texto) => {
      localStorage.setItem('gas-el-volcan-carrito', texto)
      expect(() => leerCarrito()).toThrow()
      expect(localStorage.getItem('gas-el-volcan-carrito')).toBe(texto)
      vaciarCarrito()
      expect(leerCarrito().lineas).toEqual([])
    },
  )

  it('propaga fallos de escritura y conserva el carrito anterior', () => {
    agregarAlCarrito('CL001')
    const antes = leerCarrito()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Almacenamiento lleno') })
    expect(() => agregarAlCarrito('CL002')).toThrow('Almacenamiento lleno')
    expect(leerCarrito()).toEqual(antes)
  })
})
