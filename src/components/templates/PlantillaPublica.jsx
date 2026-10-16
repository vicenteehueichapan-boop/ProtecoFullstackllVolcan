import { Outlet } from 'react-router-dom'
import BarraNavegacion from '../organisms/BarraNavegacion'
import PiePagina from '../organisms/PiePagina'
import AvisoAlmacenamiento from '../molecules/AvisoAlmacenamiento'
import { usePedidos } from '../../hooks/usePedidos'
import { useProductos } from '../../hooks/useProductos'

export default function PlantillaPublica() {
  const { errorProductos } = useProductos()
  const { errorPedidos } = usePedidos()
  return (
    <div className="d-flex flex-column min-vh-100">
      <a href="#contenido-principal" className="saltar-contenido">Saltar al contenido</a>
      <BarraNavegacion />
      <main id="contenido-principal" className="flex-grow-1" tabIndex={-1}>
        <AvisoAlmacenamiento errores={[errorProductos, errorPedidos]} />
        <Outlet />
      </main>
      <PiePagina />
    </div>
  )
}
