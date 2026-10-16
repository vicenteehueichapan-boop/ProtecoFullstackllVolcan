import { useCallback, useMemo, useState } from 'react'
import { SesionClienteContext } from './sesionClienteContextoBase'
import {
  actualizarCliente, cerrarSesionCliente, iniciarSesionCliente, leerSesionCliente, registrarCliente,
} from '../services/clienteService'

// Lee la sesión guardada; si las cuentas están dañadas, se informa sin borrarlas.
function estadoInicial() {
  try {
    return { cliente: leerSesionCliente(), error: '' }
  } catch (excepcion) {
    return { cliente: null, error: excepcion.message }
  }
}

export function SesionClienteProvider({ children }) {
  const [estado, setEstado] = useState(estadoInicial)

  // Cada operación llama al servicio (que guarda) y después actualiza el estado.
  // Si el servicio lanza un error, el estado no cambia y la página muestra el mensaje.
  const registrar = useCallback((datos) => {
    const cliente = registrarCliente(datos)
    iniciarSesionCliente(cliente.correo)
    setEstado({ cliente, error: '' })
    return cliente
  }, [])

  const ingresar = useCallback((correo) => {
    const cliente = iniciarSesionCliente(correo)
    setEstado({ cliente, error: '' })
    return cliente
  }, [])

  const salir = useCallback(() => {
    cerrarSesionCliente()
    setEstado({ cliente: null, error: '' })
  }, [])

  const actualizarDatos = useCallback((cambios) => {
    const cliente = actualizarCliente(estado.cliente?.id, cambios)
    setEstado({ cliente, error: '' })
    return cliente
  }, [estado.cliente?.id])

  const valor = useMemo(() => ({
    cliente: estado.cliente, errorClientes: estado.error, registrar, ingresar, salir, actualizarDatos,
  }), [estado, registrar, ingresar, salir, actualizarDatos])

  return <SesionClienteContext.Provider value={valor}>{children}</SesionClienteContext.Provider>
}
