import { useCallback, useMemo, useState } from 'react'
import {
  actualizarProducto as actualizarProductoEnServicio,
  crearProducto as crearProductoEnServicio,
  eliminarProducto as eliminarProductoEnServicio,
  listarProductos,
  incorporarProductosDelCaso as incorporarEnServicio,
  restaurarProductos as restaurarProductosEnServicio,
} from '../services/productoService'
import { ProductosContext } from './productosContextoBase'

// Si el catálogo guardado está dañado, la tienda sigue abierta con un aviso
// y los datos quedan intactos hasta que administración los restaure.
function leerCatalogo() {
  try {
    return { productos: listarProductos(), error: '' }
  } catch (excepcion) {
    return { productos: [], error: excepcion.message }
  }
}

export function ProductosProvider({ children }) {
  const [catalogo, setCatalogo] = useState(leerCatalogo)
  const { productos, error: errorProductos } = catalogo

  const recargarProductos = useCallback(() => {
    const lectura = leerCatalogo()
    setCatalogo(lectura)
    return lectura.productos
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
    setCatalogo({ productos: productosRestaurados, error: '' })
    return productosRestaurados
  }, [])

  const incorporarProductosDelCaso = useCallback(() => {
    const completos = incorporarEnServicio()
    setCatalogo({ productos: completos, error: '' })
    return completos
  }, [])

  const valorContexto = useMemo(
    () => ({
      productos,
      errorProductos,
      crearProducto,
      actualizarProducto,
      eliminarProducto,
      restaurarProductos,
      recargarProductos,
      incorporarProductosDelCaso,
    }),
    [
      productos,
      errorProductos,
      crearProducto,
      actualizarProducto,
      eliminarProducto,
      restaurarProductos,
      recargarProductos,
      incorporarProductosDelCaso,
    ],
  )

  return (
    <ProductosContext.Provider value={valorContexto}>
      {children}
    </ProductosContext.Provider>
  )
}
