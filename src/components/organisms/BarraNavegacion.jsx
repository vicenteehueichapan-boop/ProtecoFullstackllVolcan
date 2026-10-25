import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

// La sesión llega por props desde la plantilla: este organismo no lee Context.
export default function BarraNavegacion({ cliente, alSalir }) {
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
            {cliente ? (
              <>
                <Nav.Link as={NavLink} to="/mis-pedidos" eventKey="mis-pedidos">Mis pedidos</Nav.Link>
                <Nav.Link as="button" type="button" eventKey="salir" onClick={alSalir} className="text-start">
                  Cerrar sesión ({cliente.nombre})
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/ingreso" eventKey="ingreso">
                  Ingresar
                </Nav.Link>
                <Nav.Link as={NavLink} to="/registro" eventKey="registro">Registrarse</Nav.Link>
              </>
            )}
            <Nav.Link as={NavLink} to="/seguimiento" eventKey="seguimiento">Seguimiento</Nav.Link>
            <Nav.Link as={NavLink} to="/carrito" eventKey="carrito" className="accion-pedido">Mi carrito</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
