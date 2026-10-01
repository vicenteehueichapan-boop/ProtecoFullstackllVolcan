import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const areasPersonal = [
  { nombre: 'Administración', descripcion: 'Mantener los productos, sus tarifas y disponibilidad.', ruta: '/administracion/productos' },
  { nombre: 'Operadora', descripcion: 'Revisar los pedidos del día y asignar un repartidor.', ruta: '/operadora/pedidos' },
  { nombre: 'Repartidor', descripcion: 'Consultar entregas asignadas y actualizar su avance.', ruta: '/repartidor/entregas' },
]

export default function AccesoPersonal() {
  return (
    <Container as="section" className="py-5">
      <p className="sobretitulo">Gestión de la sucursal</p>
      <h1>Área del personal</h1>
      <p className="text-secondary mb-4">Elige el área de trabajo que quieres demostrar. Estas herramientas no forman parte del recorrido de compra.</p>
      <Row className="g-4">
        {areasPersonal.map((area) => (
          <Col md={4} key={area.ruta}>
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title as="h2" className="h4">{area.nombre}</Card.Title>
                <Card.Text>{area.descripcion}</Card.Text>
                <Button as={Link} to={area.ruta} className="mt-auto align-self-start">
                  Entrar a {area.nombre}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
