import { useContext } from 'react'
import { SesionClienteContext } from '../context/sesionClienteContextoBase'

export function useSesionCliente() {
  const contexto = useContext(SesionClienteContext)
  if (!contexto) throw new Error('useSesionCliente requiere SesionClienteProvider')
  return contexto
}
