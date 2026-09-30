import { Outlet } from 'react-router-dom'
import BarraNavegacion from '../organisms/BarraNavegacion'
import PiePagina from '../organisms/PiePagina'

export default function PlantillaPublica() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <a href="#contenido-principal" className="saltar-contenido">Saltar al contenido</a>
      <BarraNavegacion />
      <main id="contenido-principal" className="flex-grow-1" tabIndex={-1}>
        <Outlet />
      </main>
      <PiePagina />
    </div>
  )
}
