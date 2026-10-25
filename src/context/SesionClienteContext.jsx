import { useCallback, useMemo, useState } from 'react'
import { SesionClienteContext } from './sesionClienteContextoBase'
import { useUsuarios } from '../hooks/useUsuarios'
import { cerrarSesionCliente, iniciarSesionCliente, leerSesionCliente } from '../services/clienteService'

function idInicial() {
  try {
    return leerSesionCliente()?.id ?? null
  } catch {
    // Si las cuentas guardadas están dañadas, UsuariosContext ya informa el problema.
    return null
  }
}

export function SesionClienteProvider({ children }) {
  const { clientes, errorClientes, crearCliente, actualizarCliente } = useUsuarios()
  // Se guarda solo el identificador. La cuenta se busca en la lista en cada renderizado:
  // si administración la desactiva o la edita, la sesión lo refleja de inmediato.
  const [idSesion, setIdSesion] = useState(idInicial)
  const cliente = clientes.find((cuenta) => cuenta.id === idSesion && cuenta.activo) ?? null

  // Si el servicio lanza un error, el estado no cambia y la página muestra el mensaje.
  const registrar = useCallback((datos) => {
    const creado = crearCliente(datos)
    iniciarSesionCliente(creado.correo)
    setIdSesion(creado.id)
    return creado
  }, [crearCliente])

  const ingresar = useCallback((correo) => {
    const cuenta = iniciarSesionCliente(correo)
    setIdSesion(cuenta.id)
    return cuenta
  }, [])

  const salir = useCallback(() => {
    cerrarSesionCliente()
    setIdSesion(null)
  }, [])

  const actualizarDatos = useCallback((cambios) => actualizarCliente(idSesion, cambios), [actualizarCliente, idSesion])

  const valor = useMemo(() => ({
    cliente, errorClientes, registrar, ingresar, salir, actualizarDatos,
  }), [cliente, errorClientes, registrar, ingresar, salir, actualizarDatos])

  return <SesionClienteContext.Provider value={valor}>{children}</SesionClienteContext.Provider>
}
