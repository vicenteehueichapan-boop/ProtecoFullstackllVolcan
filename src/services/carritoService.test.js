import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { leerCarrito, agregarAlCarrito } from './carritoService'

describe('carritoService con persistencia local', () => {
  // Preparación: cada caso parte con el almacenamiento vacío.
  beforeEach(() => localStorage.clear())
  // Limpieza: devuelve las funciones reales aunque una aserción falle.
  afterEach(() => vi.restoreAllMocks())

  it('inicia vacío sin escribir durante la lectura', () => {
    expect(leerCarrito()).toEqual({ tipoCliente: 'residencial', lineas: [] })
    expect(localStorage.getItem('gas-el-volcan-carrito')).toBeNull()
  })

  it('agrega cilindros distintos, acumula cantidades y lo deja guardado', () => {
    agregarAlCarrito(' cl001 ')
    agregarAlCarrito('CL001')
    agregarAlCarrito('CL002')
    expect(leerCarrito().lineas).toEqual([{ codigo: 'CL001', cantidad: 2 }, { codigo: 'CL002', cantidad: 1 }])
    expect(localStorage.getItem('gas-el-volcan-carrito')).not.toBeNull()
  })

  it('propaga fallos de escritura y conserva el carrito anterior', () => {
    agregarAlCarrito('CL001')
    const antes = leerCarrito()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Almacenamiento lleno') })
    expect(() => agregarAlCarrito('CL002')).toThrow('Almacenamiento lleno')
    expect(leerCarrito()).toEqual(antes)
  })
})
