import { Button, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import heroDespacho from '../assets/hero-despacho.svg'

export default function Inicio() {
  return (
    <section className="hero-inicio py-5">
      <Container>
        <Row className="align-items-center gx-4 gy-5">
          <Col lg={6}>
            <p className="text-uppercase fw-semibold marca-volcan">Despacho de gas en Chillán</p>
            <h1 className="display-5 fw-bold">Tu energía llega a casa</h1>
            <p className="lead">
              Consulta cilindros, reguladores y accesorios con precios residenciales y comerciales.
            </p>
            <Button as={Link} variant="danger" size="lg" to="/catalogo">
              Ver catálogo
            </Button>
          </Col>
          <Col lg={6} className="text-center">
            <img
              className="img-fluid"
              src={heroDespacho}
              alt="Camión de reparto de Gas El Volcán"
            />
          </Col>
        </Row>
      </Container>
    </section>
  )
}
