import { useEffect } from 'react'

export function useTituloPagina(titulo) {
  useEffect(() => {
    const tituloAnterior = document.title
    document.title = `${titulo} | Gas El Volcán`
    return () => {
      document.title = tituloAnterior
    }
  }, [titulo])
}
