import { useLocation } from 'react-router-dom'

// Muestra en pantalla la ruta actual, para comprobar adónde navegó una página.
export default function RutaActual() {
  const { pathname } = useLocation()
  return <output aria-label="Ruta actual">{pathname}</output>
}
