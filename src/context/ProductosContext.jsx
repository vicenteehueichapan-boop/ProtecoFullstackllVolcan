import { useState } from 'react'
import { listarProductos } from '../services/productoService'
import { ProductosContext } from './productosContextoBase'

export function ProductosProvider({ children }) {
  const [productos] = useState(() => listarProductos())

  return (
    <ProductosContext.Provider value={{ productos }}>
      {children}
    </ProductosContext.Provider>
  )
}
