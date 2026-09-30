import { useCallback, useMemo, useState } from 'react'
import {
  actualizarProducto as actualizarProductoEnServicio,
  crearProducto as crearProductoEnServicio,
  eliminarProducto as eliminarProductoEnServicio,
  listarProductos,
  restaurarProductos as restaurarProductosEnServicio,
} from '../services/productoService'
import { ProductosContext } from './productosContextoBase'

export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState(() => listarProductos())

  const recargarProductos = useCallback(() => {
    const productosGuardados = listarProductos()
    setProductos(productosGuardados)
    return productosGuardados
  }, [])

  const crearProducto = useCallback(
    (producto) => {
      const productoCreado = crearProductoEnServicio(producto)
      recargarProductos()
      return productoCreado
    },
    [recargarProductos],
  )

  const actualizarProducto = useCallback(
    (codigo, cambios) => {
      const productoActualizado = actualizarProductoEnServicio(codigo, cambios)
      recargarProductos()
      return productoActualizado
    },
    [recargarProductos],
  )

  const eliminarProducto = useCallback(
    (codigo) => {
      const productoEliminado = eliminarProductoEnServicio(codigo)
      recargarProductos()
      return productoEliminado
    },
    [recargarProductos],
  )

  const restaurarProductos = useCallback(() => {
    const productosRestaurados = restaurarProductosEnServicio()
    setProductos(productosRestaurados)
    return productosRestaurados
  }, [])

  const valorContexto = useMemo(
    () => ({
      productos,
      crearProducto,
      actualizarProducto,
      eliminarProducto,
      restaurarProductos,
      recargarProductos,
    }),
    [
      productos,
      crearProducto,
      actualizarProducto,
      eliminarProducto,
      restaurarProductos,
      recargarProductos,
    ],
  )

  return (
    <ProductosContext.Provider value={valorContexto}>
      {children}
    </ProductosContext.Provider>
  )
}
