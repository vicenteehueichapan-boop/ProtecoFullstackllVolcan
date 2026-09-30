import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useProductos } from '../hooks/useProductos'
import { ProductosProvider } from './ProductosContext'

const productoNuevo = {
  codigo: 'PR002',
  categoria: 'Accesorios',
  nombre: 'Producto desde Context',
  descripcion: 'Producto utilizado para probar la actualización del estado.',
  unidad: 'Unidad',
  precioResidencial: 15000,
  precioComercial: 13000,
  stock: 7,
  imagen: '/producto-context.svg',
}

function contenedor({ children }) {
  return <ProductosProvider>{children}</ProductosProvider>
}

describe('ProductosProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('expone el catálogo inicial', () => {
    const { result } = renderHook(() => useProductos(), { wrapper: contenedor })

    expect(result.current.productos).toHaveLength(10)
  })

  it('refresca el estado después de crear, actualizar y eliminar', () => {
    const { result } = renderHook(() => useProductos(), { wrapper: contenedor })

    act(() => result.current.crearProducto(productoNuevo))
    expect(result.current.productos).toHaveLength(11)

    act(() => result.current.actualizarProducto('PR002', { stock: 12 }))
    expect(result.current.productos.find((producto) => producto.codigo === 'PR002')?.stock).toBe(12)

    act(() => result.current.eliminarProducto('PR002'))
    expect(result.current.productos).toHaveLength(10)
  })

  it('restaura el catálogo inicial y actualiza el estado', () => {
    const { result } = renderHook(() => useProductos(), { wrapper: contenedor })

    act(() => result.current.eliminarProducto('CL001'))
    expect(result.current.productos).toHaveLength(9)

    act(() => result.current.restaurarProductos())
    expect(result.current.productos).toHaveLength(10)
    expect(result.current.productos.some((producto) => producto.codigo === 'CL001')).toBe(true)
  })
})
