import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function PiePagina() {
  return (
    <footer className="pie-volcan mt-auto">
      <Container>
        <Row className="g-4 align-items-start">
          <Col md={6}>
            <p className="h4 mb-2">Gas El Volcán</p>
            <p className="mb-0">Energía para tu hogar y tu negocio en Chillán y comunas cercanas.</p>
          </Col>
          <Col md={6}>
            <nav aria-label="Enlaces del pie de página" className="enlaces-pie">
              <Link to="/catalogo">Nuestro catálogo</Link>
              <Link to="/nuevo-pedido">Solicitar gas</Link>
              <Link to="/seguimiento">Consultar pedido</Link>
              <Link to="/personal">Acceso del personal</Link>
            </nav>
          </Col>
        </Row>
        <div className="nota-pie">
          <small>Proyecto académico DSY1104 · Demostración con datos locales</small>
        </div>
      </Container>
    </footer>
  )
}
