import { useCallback, useMemo, useState } from 'react'
import { SesionPersonalContext } from './sesionPersonalContextoBase'
import { useUsuarios } from '../hooks/useUsuarios'
import { buscarPersonalActivoPorCorreo } from '../services/personalService'

// Sesión de demostración del personal, en memoria: se pierde al recargar o cerrar sesión.
// Solo se guarda el identificador; el perfil (con su rol y si está activo) se toma de la
// lista actual, así un cambio hecho por administración se aplica de inmediato.
export function SesionPersonalProvider({ children }) {
  const { personal: perfiles } = useUsuarios()
  const [idPersonal, setIdPersonal] = useState(null)
  const personal = perfiles.find((perfil) => perfil.id === idPersonal && perfil.activo) ?? null

  const ingresarPersonal = useCallback((correo) => {
    const perfil = buscarPersonalActivoPorCorreo(correo)
    setIdPersonal(perfil.id)
    return perfil
  }, [])

  const salirPersonal = useCallback(() => setIdPersonal(null), [])

  const valor = useMemo(() => ({ personal, ingresarPersonal, salirPersonal }), [personal, ingresarPersonal, salirPersonal])
  return <SesionPersonalContext.Provider value={valor}>{children}</SesionPersonalContext.Provider>
}
