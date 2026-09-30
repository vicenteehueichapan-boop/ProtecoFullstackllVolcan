import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import EtiquetaEstadoPedido from '../components/atoms/EtiquetaEstadoPedido'
import ResumenPedido from '../components/molecules/ResumenPedido'
import { usePedidos } from '../hooks/usePedidos'

export default function PedidoExitoso() {
  const { id } = useParams()
  const { pedidos } = usePedidos()
  const pedido = pedidos.find((item) => item.id === id)

  if (!pedido) {
    return (
      <Container className="py-5 text-center">
        <h1>Pedido no encontrado</h1>
        <p>No fue posible recuperar el pedido solicitado.</p>
        <Button as={Link} to="/nuevo-pedido" variant="danger">Crear un pedido</Button>
      </Container>
    )
  }

  return (
    <Container as="section" className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card border="success" className="mb-4">
            <Card.Body>
              <Card.Title as="h1" className="h3">Pedido confirmado</Card.Title>
              <p className="mb-2">Tu número de seguimiento es <strong>{pedido.id}</strong>.</p>
              <p className="mb-0">Estado actual: <EtiquetaEstadoPedido estado={pedido.estado} /></p>
            </Card.Body>
          </Card>
          <ResumenPedido pedido={pedido} />
          <div className="d-flex flex-wrap gap-2 mt-4">
            <Button as={Link} to={`/seguimiento/${pedido.id}`} variant="danger">
              Ver seguimiento
            </Button>
            <Button as={Link} to="/catalogo" variant="outline-secondary">Volver al catálogo</Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
