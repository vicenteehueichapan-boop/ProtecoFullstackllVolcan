import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

export default function BarraPersonal() {
  return (
    <Navbar expand="md" className="navegacion-volcan" collapseOnSelect aria-label="Navegación del personal">
      <Container>
        <Navbar.Brand as={NavLink} to="/personal" className="marca-navegacion">
          <span>Gas El Volcán</span>
          <small>Área del personal</small>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-personal" label="Abrir o cerrar menú del personal" />
        <Navbar.Collapse id="menu-personal">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/personal" eventKey="personal">Elegir área de trabajo</Nav.Link>
            <Nav.Link as={NavLink} to="/" eventKey="tienda">Volver a la tienda</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
