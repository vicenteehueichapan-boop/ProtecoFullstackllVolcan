import { useCallback, useMemo, useState } from 'react'
import {
  actualizarCliente as actualizarClienteEnServicio,
  listarClientes,
  registrarCliente,
} from '../services/clienteService'
import {
  actualizarPersonal as actualizarPersonalEnServicio,
  crearPersonal as crearPersonalEnServicio,
  listarPersonal,
} from '../services/personalService'
import { UsuariosContext } from './usuariosContextoBase'

// Lee una lista con su servicio. Si los datos guardados están dañados, se informa el
// problema y la aplicación sigue abierta (los datos no se borran).
function leer(listar) {
  try {
    return { lista: listar(), error: '' }
  } catch (excepcion) {
    return { lista: [], error: excepcion.message }
  }
}

// Puente entre los servicios de usuarios (personal y clientes) y las pantallas.
// Cada operación pide el cambio al servicio y luego vuelve a leer la lista.
export function UsuariosProvider({ children }) {
  const [personal, setPersonal] = useState(() => leer(listarPersonal))
  const [clientes, setClientes] = useState(() => leer(listarClientes))

  const crearPersonal = useCallback((datos) => {
    const creado = crearPersonalEnServicio(datos)
    setPersonal(leer(listarPersonal))
    return creado
  }, [])

  const actualizarPersonal = useCallback((id, cambios) => {
    const actualizado = actualizarPersonalEnServicio(id, cambios)
    setPersonal(leer(listarPersonal))
    return actualizado
  }, [])

  const crearCliente = useCallback((datos) => {
    const creado = registrarCliente(datos)
    setClientes(leer(listarClientes))
    return creado
  }, [])

  const actualizarCliente = useCallback((id, cambios) => {
    const actualizado = actualizarClienteEnServicio(id, cambios)
    setClientes(leer(listarClientes))
    return actualizado
  }, [])

  const valor = useMemo(() => ({
    personal: personal.lista,
    clientes: clientes.lista,
    errorPersonal: personal.error,
    errorClientes: clientes.error,
    crearPersonal,
    actualizarPersonal,
    crearCliente,
    actualizarCliente,
  }), [personal, clientes, crearPersonal, actualizarPersonal, crearCliente, actualizarCliente])

  return <UsuariosContext.Provider value={valor}>{children}</UsuariosContext.Provider>
}
