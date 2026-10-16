import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  actualizarProducto,
  crearProducto,
  descontarStock,
  devolverStock,
  eliminarProducto,
  listarProductos,
  incorporarProductosDelCaso,
  obtenerProductoPorCodigo,
  restaurarProductos,
} from './productoService'

const productoNuevo = {
  codigo: 'PR001',
  categoria: 'Accesorios',
  nombre: 'Producto de prueba',
  descripcion: 'Producto utilizado para comprobar el servicio.',
  unidad: 'Unidad',
  precioResidencial: 10000,
  precioComercial: 9000,
  stock: 5,
  imagen: '/producto-prueba.svg',
}

describe('productoService', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  afterEach(() => vi.restoreAllMocks())

  it('inicializa el catálogo con catorce productos', () => {
    expect(listarProductos()).toHaveLength(14)
  })

  it('completa registros faltantes sin reemplazar ediciones ni productos propios', () => {
    actualizarProducto('CL001', { stock: 7, precioResidencial: 7200 })
    eliminarProducto('RG003')
    eliminarProducto('MG002')
    eliminarProducto('MG003')
    eliminarProducto('AC002')
    crearProducto(productoNuevo)
    expect(listarProductos()).toHaveLength(11)
    expect(incorporarProductosDelCaso()).toHaveLength(15)
    expect(obtenerProductoPorCodigo('CL001')).toMatchObject({ stock: 7, precioResidencial: 7200 })
    expect(obtenerProductoPorCodigo('PR001')).toMatchObject(productoNuevo)
    expect(obtenerProductoPorCodigo('AC002')).toMatchObject({ precioResidencial: 1490, precioComercial: 1200, stock: 60 })
    expect(incorporarProductosDelCaso()).toHaveLength(15)
  })

  it('inicia con los tres productos destacados por el equipo', () => {
    const destacados = listarProductos().filter((producto) => producto.destacado).map((producto) => producto.codigo)

    expect(destacados).toEqual(['CL002', 'MG004', 'AC003'])
  })

  it('migra un catálogo guardado antes del campo destacado sin tocar sus cambios', () => {
    const anterior = listarProductos().map(({ destacado: _destacado, ...producto }) => producto)
    anterior[1] = { ...anterior[1], precioResidencial: 12500 }
    localStorage.setItem('gas-el-volcan-productos', JSON.stringify(anterior.filter((p) => p.codigo !== 'AC003')))

    const migrados = listarProductos()

    expect(migrados.filter((producto) => producto.destacado).map((producto) => producto.codigo)).toEqual(['CL002', 'MG004'])
    expect(obtenerProductoPorCodigo('CL002').precioResidencial).toBe(12500)
    expect(migrados).toHaveLength(13)
  })

  it('permite marcar y desmarcar un destacado y rechaza valores no booleanos', () => {
    actualizarProducto('CL001', { destacado: true })
    actualizarProducto('CL002', { destacado: false })

    expect(obtenerProductoPorCodigo('CL001').destacado).toBe(true)
    expect(obtenerProductoPorCodigo('CL002').destacado).toBe(false)
    expect(() => actualizarProducto('CL001', { destacado: 'sí' })).toThrow('destacado')
  })

  it('descuenta y devuelve stock de varias líneas a la vez', () => {
    descontarStock([{ codigo: 'CL001', cantidad: 5 }, { codigo: 'RG001', cantidad: 2 }])
    expect(obtenerProductoPorCodigo('CL001').stock).toBe(75)
    expect(obtenerProductoPorCodigo('RG001').stock).toBe(43)

    devolverStock([{ codigo: 'CL001', cantidad: 5 }, { codigo: 'RG001', cantidad: 2 }])
    expect(obtenerProductoPorCodigo('CL001').stock).toBe(80)
    expect(obtenerProductoPorCodigo('RG001').stock).toBe(45)
  })

  it('no cambia ningún stock si una línea no alcanza o no existe', () => {
    expect(() => descontarStock([{ codigo: 'CL001', cantidad: 1 }, { codigo: 'AC003', cantidad: 9 }]))
      .toThrow('No hay stock suficiente de Detector de gas a batería')
    expect(() => descontarStock([{ codigo: 'CL001', cantidad: 1 }, { codigo: 'ZZ999', cantidad: 1 }]))
      .toThrow('ZZ999')
    expect(obtenerProductoPorCodigo('CL001').stock).toBe(80)
  })

  it('recupera los productos guardados', () => {
    listarProductos()
    expect(listarProductos()[0].codigo).toBe('CL001')
  })

  it.each([
    ['un texto que no es JSON', '{'],
    ['un objeto en vez de una lista', JSON.stringify({ codigo: 'incorrecto' })],
    ['un producto incompleto', JSON.stringify([null])],
    ['códigos repetidos', JSON.stringify([productoNuevo, productoNuevo])],
  ])('informa el catálogo dañado (%s) sin reemplazarlo', (_caso, guardado) => {
    localStorage.setItem('gas-el-volcan-productos', guardado)

    expect(() => listarProductos()).toThrow('El catálogo guardado está dañado')
    expect(localStorage.getItem('gas-el-volcan-productos')).toBe(guardado)
  })

  it('no aplica cambios sobre un catálogo dañado', () => {
    const guardado = JSON.stringify([productoNuevo, productoNuevo])
    localStorage.setItem('gas-el-volcan-productos', guardado)

    expect(() => crearProducto({ ...productoNuevo, codigo: 'PR009' })).toThrow('El catálogo guardado está dañado')
    expect(() => incorporarProductosDelCaso()).toThrow('El catálogo guardado está dañado')
    expect(localStorage.getItem('gas-el-volcan-productos')).toBe(guardado)
  })

  it('informa cuando el navegador no permite leer el catálogo', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Bloqueado') })

    expect(() => listarProductos()).toThrow('No se pudo leer el almacenamiento')
  })

  it('repara un catálogo dañado solo con una restauración explícita', () => {
    localStorage.setItem('gas-el-volcan-productos', '{')

    expect(restaurarProductos()).toHaveLength(14)
    expect(listarProductos()).toHaveLength(14)
  })

  it('obtiene un producto mediante su código', () => {
    expect(obtenerProductoPorCodigo('cl001')?.nombre).toBe('Cilindro GLP 5 kg')
    expect(obtenerProductoPorCodigo('NO-EXISTE')).toBeNull()
  })

  it('crea y persiste un producto válido', () => {
    const productoCreado = crearProducto({ ...productoNuevo, codigo: ' pr001 ' })

    expect(productoCreado.codigo).toBe('PR001')
    expect(listarProductos()).toHaveLength(15)
    expect(obtenerProductoPorCodigo('PR001')).toEqual(productoCreado)
  })

  it('impide crear productos con códigos repetidos', () => {
    expect(() => crearProducto({ ...productoNuevo, codigo: 'CL001' })).toThrow(
      'Ya existe un producto con el código CL001',
    )
  })

  it('valida los datos obligatorios antes de guardar', () => {
    expect(() => crearProducto(null)).toThrow('Los datos del producto no son válidos')
    expect(() => crearProducto({ ...productoNuevo, nombre: ' ' })).toThrow(
      'El nombre es obligatorio',
    )
    expect(() => crearProducto({ ...productoNuevo, stock: -1 })).toThrow(
      'El stock debe ser un número mayor o igual a cero',
    )
  })

  it('actualiza un producto existente', () => {
    const productoActualizado = actualizarProducto('CL001', {
      nombre: 'Cilindro actualizado',
      stock: 25,
    })

    expect(productoActualizado.nombre).toBe('Cilindro actualizado')
    expect(obtenerProductoPorCodigo('CL001')?.stock).toBe(25)
  })

  it('elimina un producto existente', () => {
    const productoEliminado = eliminarProducto('CL001')

    expect(productoEliminado.codigo).toBe('CL001')
    expect(obtenerProductoPorCodigo('CL001')).toBeNull()
    expect(listarProductos()).toHaveLength(13)
  })

  it('informa cuando se intenta modificar un producto inexistente', () => {
    expect(() => actualizarProducto('NO-EXISTE', { nombre: 'Otro nombre' })).toThrow(
      'No existe un producto con el código NO-EXISTE',
    )
    expect(() => eliminarProducto('NO-EXISTE')).toThrow(
      'No existe un producto con el código NO-EXISTE',
    )
  })

  it('restaura los productos iniciales después de realizar cambios', () => {
    eliminarProducto('CL001')
    crearProducto(productoNuevo)

    const productosRestaurados = restaurarProductos()

    expect(productosRestaurados).toHaveLength(14)
    expect(obtenerProductoPorCodigo('CL001')).not.toBeNull()
    expect(obtenerProductoPorCodigo('PR001')).toBeNull()
  })
})
