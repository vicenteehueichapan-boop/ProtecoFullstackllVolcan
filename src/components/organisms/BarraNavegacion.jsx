import { Container, Nav, Navbar } from 'react-bootstrap'
import { esClicSimple } from '../../utils/esClicSimple'

const ENLACES_PUBLICOS = [
  { ruta: '/', texto: 'Inicio' },
  { ruta: '/catalogo', texto: 'Catálogo' },
  { ruta: '/categorias', texto: 'Categorías' },
  { ruta: '/nosotros', texto: 'Nosotros' },
  { ruta: '/blog', texto: 'Blog' },
  { ruta: '/contacto', texto: 'Contacto' },
  { ruta: '/seguimiento', texto: 'Seguimiento' },
]

// Organismo sin router (Guía 14): la plantilla le entrega la ruta actual, la función
// alNavegar y la sesión. Cada enlace es un <a href> real que no recarga la página.
export default function BarraNavegacion({ rutaActual, alNavegar, cliente, alSalir }) {
  function seguir(evento, ruta) {
    if (!esClicSimple(evento)) return
    evento.preventDefault()
    alNavegar(ruta)
  }

  // Un enlace queda activo en su ruta exacta o en sus subrutas (por ejemplo /blog/despacho).
  function estaActivo(ruta) {
    return ruta === '/' ? rutaActual === '/' : rutaActual === ruta || rutaActual.startsWith(`${ruta}/`)
  }

  function enlace(ruta, texto, className) {
    return (
      <Nav.Link
        key={ruta}
        href={ruta}
        onClick={(evento) => seguir(evento, ruta)}
        active={estaActivo(ruta)}
        aria-current={estaActivo(ruta) ? 'page' : undefined}
        className={className}
      >
        {texto}
      </Nav.Link>
    )
  }

  return (
    <Navbar expand="xl" className="navegacion-volcan" collapseOnSelect aria-label="Navegación de la tienda">
      <Container>
        <Navbar.Brand href="/" onClick={(evento) => seguir(evento, '/')} className="marca-navegacion">
          <span>Gas El Volcán</span>
          <small>Distribuidora en Chillán</small>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navegacion-principal" label="Abrir o cerrar navegación" />
        <Navbar.Collapse id="navegacion-principal">
          <Nav className="ms-auto">
            {ENLACES_PUBLICOS.map(({ ruta, texto }) => enlace(ruta, texto))}
            {cliente ? (
              <>
                {enlace('/mis-pedidos', 'Mis pedidos')}
                <Nav.Link as="button" type="button" onClick={alSalir} className="text-start">
                  Cerrar sesión ({cliente.nombre})
                </Nav.Link>
              </>
            ) : (
              <>
                {enlace('/ingreso', 'Ingresar')}
                {enlace('/registro', 'Registrarse')}
              </>
            )}
            {enlace('/carrito', 'Mi carrito', 'accion-pedido')}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
