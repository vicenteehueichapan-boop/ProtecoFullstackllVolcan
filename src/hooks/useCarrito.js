import { useContext } from 'react'
import { CarritoContext } from '../context/carritoContextoBase'

export function useCarrito() {
  const contexto = useContext(CarritoContext)
  if (contexto === null) throw new Error('useCarrito debe utilizarse dentro de CarritoProvider')
  return contexto
}
