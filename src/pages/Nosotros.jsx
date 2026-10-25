import { Card, Col, Container, Row } from 'react-bootstrap'
import empresa from '../data/empresa'
import { useTituloPagina } from '../hooks/useTituloPagina'

export default function Nosotros() {
  useTituloPagina('Nosotros')

  return (
    <Container as="section" className="py-5">
      <p className="sobretitulo">Familia, servicio y territorio</p>
      <h1>Nosotros</h1>
      <p className="lead">
        {empresa.nombre} fue fundada en {empresa.fundacion} en {empresa.ubicacion}. {empresa.descripcion}
      </p>

      <Row className="g-4 my-2">
        <Col lg={6}>
          <h2 className="h4">El desafío que resolvemos</h2>
          <p>
            Hoy recibimos {empresa.pedidosDiarios} pedidos diarios por teléfono y se anotan en cuadernos.
            Eso provoca llamadas repetidas para preguntar por el pedido, duplicados, pedidos no atendidos
            y poca visibilidad del stock.
          </p>
        </Col>
        <Col lg={6}>
          <h2 className="h4">Qué cambia con esta aplicación</h2>
          <p>
            Puedes pedir sin llamar y revisar el estado de tu entrega. La operadora asigna cada pedido
            a un repartidor, el repartidor actualiza su avance y administración mantiene el catálogo.
            En esta etapa los datos se guardan en tu navegador; la conexión con un servidor llega en la
            siguiente etapa del proyecto.
          </p>
        </Col>
      </Row>

      <h2 className="h4 mt-4">Nuestro equipo</h2>
      <Row className="g-3">
        {empresa.equipo.map((integrante) => (
          <Col md={4} key={integrante.rol}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title as="h3" className="h5">{integrante.rol} ({integrante.cantidad})</Card.Title>
                <Card.Text>{integrante.tarea}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <p className="text-secondary small mt-4 mb-0">
        Proyecto académico individual de Vicente Hueichapan para DSY1104 Desarrollo Fullstack II.
      </p>
    </Container>
  )
}
