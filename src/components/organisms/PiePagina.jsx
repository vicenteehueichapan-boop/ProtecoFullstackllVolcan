import { Col, Container, Row } from 'react-bootstrap'
import EnlaceInterno from '../atoms/EnlaceInterno'

const ENLACES_PIE = [
  { ruta: '/catalogo', texto: 'Nuestro catálogo' },
  { ruta: '/carrito', texto: 'Solicitar gas' },
  { ruta: '/seguimiento', texto: 'Consultar pedido' },
  { ruta: '/personal', texto: 'Acceso del personal' },
]

// Organismo sin router: recibe alNavegar desde la plantilla (Guía 14).
export default function PiePagina({ alNavegar }) {
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
              {ENLACES_PIE.map(({ ruta, texto }) => (
                <EnlaceInterno key={ruta} ruta={ruta} alNavegar={alNavegar}>{texto}</EnlaceInterno>
              ))}
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
