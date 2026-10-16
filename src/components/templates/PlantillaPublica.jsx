import { Outlet, useNavigate } from 'react-router-dom'
import BarraNavegacion from '../organisms/BarraNavegacion'
import PiePagina from '../organisms/PiePagina'
import AvisoAlmacenamiento from '../molecules/AvisoAlmacenamiento'
import { usePedidos } from '../../hooks/usePedidos'
import { useProductos } from '../../hooks/useProductos'
import { useSesionCliente } from '../../hooks/useSesionCliente'

export default function PlantillaPublica() {
  const { errorProductos } = useProductos()
  const { errorPedidos } = usePedidos()
  const { cliente, errorClientes, salir } = useSesionCliente()
  const navegar = useNavigate()

  function cerrarSesion() {
    salir()
    navegar('/', { replace: true })
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <a href="#contenido-principal" className="saltar-contenido">Saltar al contenido</a>
      <BarraNavegacion cliente={cliente} alSalir={cerrarSesion} />
      <main id="contenido-principal" className="flex-grow-1" tabIndex={-1}>
        <AvisoAlmacenamiento errores={[errorProductos, errorPedidos, errorClientes]} />
        <Outlet />
      </main>
      <PiePagina />
    </div>
  )
}
