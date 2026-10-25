import { Container } from 'react-bootstrap'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
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
  // Solo la plantilla usa el router; a la barra y al pie les entrega funciones y datos.
  const navegar = useNavigate()
  const { pathname } = useLocation()

  function cerrarSesion() {
    salir()
    navegar('/', { replace: true })
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <a href="#contenido-principal" className="saltar-contenido">Saltar al contenido</a>
      <BarraNavegacion rutaActual={pathname} alNavegar={navegar} cliente={cliente} alSalir={cerrarSesion} />
      <main id="contenido-principal" className="flex-grow-1" tabIndex={-1}>
        <Container>
          <AvisoAlmacenamiento errores={[errorProductos, errorPedidos, errorClientes]} />
        </Container>
        <Outlet />
      </main>
      <PiePagina alNavegar={navegar} />
    </div>
  )
}
