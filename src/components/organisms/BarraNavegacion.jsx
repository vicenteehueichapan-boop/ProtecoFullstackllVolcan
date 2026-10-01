import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

export default function BarraNavegacion() {
  return (
    <Navbar expand="xl" className="navegacion-volcan" collapseOnSelect aria-label="Navegación de la tienda">
      <Container>
        <Navbar.Brand as={NavLink} className="marca-navegacion" to="/">
          <span>Gas El Volcán</span>
          <small>Distribuidora en Chillán</small>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navegacion-principal" label="Abrir o cerrar navegación" />
        <Navbar.Collapse id="navegacion-principal">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" eventKey="inicio" end>
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/catalogo" eventKey="catalogo">
              Catálogo
            </Nav.Link>
            <Nav.Link as={NavLink} to="/categorias" eventKey="categorias">Categorías</Nav.Link>
            <Nav.Link as={NavLink} to="/ingreso" eventKey="ingreso">
              Ingresar
            </Nav.Link>
            <Nav.Link as={NavLink} to="/registro" eventKey="registro">Registrarse</Nav.Link>
            <Nav.Link as={NavLink} to="/nuevo-pedido" eventKey="pedido" className="accion-pedido">Pedir gas</Nav.Link>
            <Nav.Link as={NavLink} to="/seguimiento" eventKey="seguimiento">Seguimiento</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
