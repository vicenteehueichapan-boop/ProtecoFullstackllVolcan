import { useCallback, useMemo, useState } from 'react'
import { SesionPersonalContext } from './sesionPersonalContextoBase'
import { identificarPersonal } from '../utils/permisosPersonal'

export function SesionPersonalProvider({ children }) {
  const [personal, setPersonal] = useState(null)
  const ingresarPersonal = useCallback((correo) => {
    const perfil = identificarPersonal(correo)
    if (!perfil) throw new Error('El correo no corresponde a un perfil de demostración del personal.')
    setPersonal(perfil)
    return perfil
  }, [])
  const salirPersonal = useCallback(() => setPersonal(null), [])
  const valor = useMemo(() => ({ personal, ingresarPersonal, salirPersonal }), [personal, ingresarPersonal, salirPersonal])
  return <SesionPersonalContext.Provider value={valor}>{children}</SesionPersonalContext.Provider>
}
