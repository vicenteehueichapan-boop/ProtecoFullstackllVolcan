import { useCallback, useMemo, useState } from 'react'
import { crearCategoria as crearCategoriaEnServicio, listarCategorias } from '../services/categoriaService'
import {
  actualizarProducto as actualizarProductoEnServicio,
  crearProducto as crearProductoEnServicio,
  eliminarProducto as eliminarProductoEnServicio,
  listarProductos,
  incorporarProductosDelCaso as incorporarEnServicio,
  renombrarCategoria as renombrarCategoriaEnServicio,
  restaurarProductos as restaurarProductosEnServicio,
} from '../services/productoService'
import { ProductosContext } from './productosContextoBase'

// Lee productos y categorías juntos: renombrar una categoría cambia ambos.
// Si los datos guardados están dañados, la tienda sigue abierta con un aviso
// y los datos quedan intactos hasta que administración los restaure.
function leerCatalogo() {
  try {
    return { productos: listarProductos(), categorias: listarCategorias(), error: '' }
  } catch (excepcion) {
    return { productos: [], categorias: [], error: excepcion.message }
  }
}

export function ProductosProvider({ children }) {
  const [catalogo, setCatalogo] = useState(leerCatalogo)
  const { productos, categorias, error: errorProductos } = catalogo

  const recargarProductos = useCallback(() => {
    const lectura = leerCatalogo()
    setCatalogo(lectura)
    return lectura.productos
  }, [])

  // Cada operación pide el cambio al servicio (que guarda) y después vuelve a leer.
  // Si el servicio lanza un error, el estado no cambia y la página muestra el mensaje.
  const ejecutar = useCallback((operacion, ...argumentos) => {
    const resultado = operacion(...argumentos)
    recargarProductos()
    return resultado
  }, [recargarProductos])

  const crearProducto = useCallback((producto) => ejecutar(crearProductoEnServicio, producto), [ejecutar])
  const actualizarProducto = useCallback((codigo, cambios) => ejecutar(actualizarProductoEnServicio, codigo, cambios), [ejecutar])
  const eliminarProducto = useCallback((codigo) => ejecutar(eliminarProductoEnServicio, codigo), [ejecutar])
  const restaurarProductos = useCallback(() => ejecutar(restaurarProductosEnServicio), [ejecutar])
  const incorporarProductosDelCaso = useCallback(() => ejecutar(incorporarEnServicio), [ejecutar])
  const crearCategoria = useCallback((datos) => ejecutar(crearCategoriaEnServicio, datos), [ejecutar])
  const renombrarCategoria = useCallback((nombre, datos) => ejecutar(renombrarCategoriaEnServicio, nombre, datos), [ejecutar])

  const valorContexto = useMemo(
    () => ({
      productos,
      categorias,
      errorProductos,
      crearProducto,
      actualizarProducto,
      eliminarProducto,
      restaurarProductos,
      recargarProductos,
      incorporarProductosDelCaso,
      crearCategoria,
      renombrarCategoria,
    }),
    [
      productos,
      categorias,
      errorProductos,
      crearProducto,
      actualizarProducto,
      eliminarProducto,
      restaurarProductos,
      recargarProductos,
      incorporarProductosDelCaso,
      crearCategoria,
      renombrarCategoria,
    ],
  )

  return (
    <ProductosContext.Provider value={valorContexto}>
      {children}
    </ProductosContext.Provider>
  )
}
