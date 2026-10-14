import { useCallback, useMemo, useState } from 'react'
import { CarritoContext } from './carritoContextoBase'
import {
  leerCarrito, carritoVacio, agregarAlCarrito, cambiarCantidadCarrito,
  quitarDelCarrito, cambiarTarifaCarrito, vaciarCarrito,
} from '../services/carritoService'

function estadoInicial() {
  try {
    return { carrito: leerCarrito(), error: '' }
  } catch (excepcion) {
    return { carrito: carritoVacio(), error: `No pudimos recuperar el carrito: ${excepcion.message}` }
  }
}

export function CarritoProvider({ children }) {
  const [estado, setEstado] = useState(estadoInicial)
  const ejecutar = useCallback((operacion, ...argumentos) => {
    try {
      const carrito = operacion(...argumentos)
      setEstado({ carrito, error: '' })
      return true
    } catch (excepcion) {
      setEstado((actual) => ({
        ...actual,
        error: `No pudimos guardar el cambio: ${excepcion instanceof Error ? excepcion.message : 'Revisa el almacenamiento del navegador.'}`,
      }))
      return false
    }
  }, [])
  const agregar = useCallback((codigo) => ejecutar(agregarAlCarrito, codigo), [ejecutar])
  const cambiarCantidad = useCallback((codigo, cantidad) => ejecutar(cambiarCantidadCarrito, codigo, cantidad), [ejecutar])
  const quitar = useCallback((codigo) => ejecutar(quitarDelCarrito, codigo), [ejecutar])
  const cambiarTarifa = useCallback((tipo) => ejecutar(cambiarTarifaCarrito, tipo), [ejecutar])
  const vaciar = useCallback(() => ejecutar(vaciarCarrito), [ejecutar])
  const valor = useMemo(() => ({
    ...estado, agregar, cambiarCantidad, quitar, cambiarTarifa, vaciar,
  }), [estado, agregar, cambiarCantidad, quitar, cambiarTarifa, vaciar])

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
}
