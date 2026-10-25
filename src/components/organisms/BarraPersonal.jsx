import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { esClicSimple } from '../../utils/esClicSimple'

export default function BarraPersonal({ personal, alSalir, alNavegar }) {
  function seguir(evento, ruta) {
    if (!esClicSimple(evento)) return
    evento.preventDefault()
    alNavegar(ruta)
  }
  return (
    <Navbar expand="md" className="navegacion-volcan" collapseOnSelect aria-label="Navegación del personal">
      <Container>
        <Navbar.Brand href="/personal" onClick={(evento) => seguir(evento, '/personal')} className="marca-navegacion">
          <span>Gas El Volcán</span><small>Área del personal</small>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-personal" label="Abrir o cerrar menú del personal" />
        <Navbar.Collapse id="menu-personal">
          <Nav className="ms-auto">
            <Nav.Link href="/personal" onClick={(evento) => seguir(evento, '/personal')} eventKey="personal">Mi área de trabajo</Nav.Link>
            <Nav.Link href="/" onClick={(evento) => seguir(evento, '/')} eventKey="tienda">Volver a la tienda</Nav.Link>
          </Nav>
          {personal && <Button variant="outline-secondary" onClick={alSalir}>Cerrar sesión del personal</Button>}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
