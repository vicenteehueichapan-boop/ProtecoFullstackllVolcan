import { Outlet } from 'react-router-dom'
import BarraNavegacion from '../organisms/BarraNavegacion'
import PiePagina from '../organisms/PiePagina'

export default function PlantillaPublica() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <BarraNavegacion />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <PiePagina />
    </div>
  )
}
