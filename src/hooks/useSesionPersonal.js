import { useContext } from 'react'
import { SesionPersonalContext } from '../context/sesionPersonalContextoBase'

export function useSesionPersonal() {
  const contexto = useContext(SesionPersonalContext)
  if (!contexto) throw new Error('useSesionPersonal requiere SesionPersonalProvider')
  return contexto
}
