import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

export default function BarraNavegacion() {
  return (
    <Navbar expand="xl" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={NavLink} className="fw-bold" to="/">
          Gas El Volcán
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navegacion-principal" />
        <Navbar.Collapse id="navegacion-principal">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/catalogo">
              Catálogo
            </Nav.Link>
            <Nav.Link as={NavLink} to="/ingreso">
              Ingresar
            </Nav.Link>
            <Nav.Link as={NavLink} to="/registro">Registrarse</Nav.Link>
            <Nav.Link as={NavLink} to="/nuevo-pedido">Pedir gas</Nav.Link>
            <Nav.Link as={NavLink} to="/seguimiento">Seguimiento</Nav.Link>
            <NavDropdown title="Área de trabajo" id="navegacion-personal">
              <NavDropdown.Item as={NavLink} to="/administracion/productos">Productos</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/operadora/pedidos">Operadora</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/repartidor/entregas">Repartidor</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
