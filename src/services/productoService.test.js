import { beforeEach, describe, expect, it } from 'vitest'
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarProductos,
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

  it('inicializa el catálogo con diez productos', () => {
    expect(listarProductos()).toHaveLength(10)
  })

  it('recupera los productos guardados', () => {
    listarProductos()
    expect(listarProductos()[0].codigo).toBe('CL001')
  })

  it('restaura el catálogo cuando el almacenamiento no contiene una lista', () => {
    localStorage.setItem('gas-el-volcan-productos', JSON.stringify({ codigo: 'incorrecto' }))

    expect(listarProductos()).toHaveLength(10)
  })

  it('obtiene un producto mediante su código', () => {
    expect(obtenerProductoPorCodigo('cl001')?.nombre).toBe('Cilindro GLP 5 kg')
    expect(obtenerProductoPorCodigo('NO-EXISTE')).toBeNull()
  })

  it('crea y persiste un producto válido', () => {
    const productoCreado = crearProducto({ ...productoNuevo, codigo: ' pr001 ' })

    expect(productoCreado.codigo).toBe('PR001')
    expect(listarProductos()).toHaveLength(11)
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
    expect(listarProductos()).toHaveLength(9)
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

    expect(productosRestaurados).toHaveLength(10)
    expect(obtenerProductoPorCodigo('CL001')).not.toBeNull()
    expect(obtenerProductoPorCodigo('PR001')).toBeNull()
  })
})
