import { useContext } from 'react'
import { UsuariosContext } from '../context/usuariosContextoBase'

export function useUsuarios() {
  const contexto = useContext(UsuariosContext)
  if (!contexto) throw new Error('useUsuarios requiere UsuariosProvider')
  return contexto
}
