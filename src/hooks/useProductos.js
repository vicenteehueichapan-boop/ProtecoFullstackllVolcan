import { useContext } from 'react'
import { ProductosContext } from '../context/productosContextoBase'

export function useProductos() {
  const contexto = useContext(ProductosContext)

  if (contexto === null) {
    throw new Error('useProductos debe utilizarse dentro de ProductosProvider')
  }

  return contexto
}
