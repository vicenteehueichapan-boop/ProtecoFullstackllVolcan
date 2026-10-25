import { Nav } from 'react-bootstrap'
import { esClicSimple } from '../../utils/esClicSimple'

const SECCIONES_ADMINISTRACION = [
  { ruta: '/administracion', texto: 'Panel' },
  { ruta: '/administracion/pedidos', texto: 'Pedidos' },
  { ruta: '/administracion/productos', texto: 'Catálogo' },
  { ruta: '/administracion/criticos', texto: 'Productos críticos' },
  { ruta: '/administracion/categorias', texto: 'Categorías' },
  { ruta: '/administracion/usuarios', texto: 'Usuarios' },
  { ruta: '/administracion/reportes', texto: 'Reportes' },
  { ruta: '/administracion/perfil', texto: 'Mi perfil' },
]

// Menú del panel. Sin router: la plantilla le entrega la ruta actual y alNavegar.
// En pantallas chicas los enlaces se ordenan en filas; desde lg forman una columna lateral.
export default function MenuAdministracion({ rutaActual, alNavegar }) {
  function seguir(evento, ruta) {
    if (!esClicSimple(evento)) return
    evento.preventDefault()
    alNavegar(ruta)
  }

  // El panel solo está activo en su ruta exacta; las demás secciones también en sus subrutas.
  function estaActivo(ruta) {
    return ruta === '/administracion' ? rutaActual === ruta : rutaActual === ruta || rutaActual.startsWith(`${ruta}/`)
  }

  return (
    <Nav as="nav" variant="pills" className="menu-administracion flex-row flex-lg-column gap-1" aria-label="Secciones de administración">
      {SECCIONES_ADMINISTRACION.map(({ ruta, texto }) => (
        <Nav.Link
          key={ruta}
          href={ruta}
          onClick={(evento) => seguir(evento, ruta)}
          active={estaActivo(ruta)}
          aria-current={estaActivo(ruta) ? 'page' : undefined}
        >
          {texto}
        </Nav.Link>
      ))}
    </Nav>
  )
}
