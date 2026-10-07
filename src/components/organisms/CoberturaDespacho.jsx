import { Col, Container, Row } from 'react-bootstrap'
import TarjetaZona from '../molecules/TarjetaZona'

export default function CoberturaDespacho({ zonas }) {
  return (
    <section className="seccion-inicio seccion-despacho" aria-labelledby="titulo-zonas">
      <Container>
        <div className="cabecera-seccion">
          <div>
            <p className="sobretitulo">Planifica tu entrega</p>
            <h2 id="titulo-zonas">Llegamos a tu sector</h2>
            <p className="text-secondary mb-0">Los tiempos son estimados y dependen de tu zona de despacho.</p>
          </div>
        </div>
        <Row className="g-3">
          {zonas.map((zona) => (
            <Col key={zona.id} md={6} lg={4}>
              <TarjetaZona zona={zona} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}
