import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link, useLocation, useParams } from 'react-router-dom'
import EtiquetaEstadoPedido from '../components/atoms/EtiquetaEstadoPedido'
import ResumenPedido from '../components/molecules/ResumenPedido'
import { usePedidos } from '../hooks/usePedidos'
import { useSesionCliente } from '../hooks/useSesionCliente'
import { puedeVerPedido } from '../utils/puedeVerPedido'
import { useTituloPagina } from '../hooks/useTituloPagina'

export default function PedidoExitoso() {
  useTituloPagina('Pedido confirmado')
  const { id } = useParams()
  const { state } = useLocation()
  const { pedidos } = usePedidos()
  const { cliente } = useSesionCliente()
  const encontrado = pedidos.find((item) => item.id === id)
  // Se muestra a quien acaba de confirmarlo o a la cuenta dueña; escribir la URL no basta.
  const pedido = encontrado && (state?.recienCreado || puedeVerPedido(encontrado, { cliente })) ? encontrado : null

  if (!pedido) {
    return (
      <Container className="py-5 text-center">
        <h1>Pedido no disponible</h1>
        <p>No podemos mostrar este comprobante. Consulta tu pedido con su número y tu correo.</p>
        <div className="d-flex flex-wrap justify-content-center gap-2">
          <Button as={Link} to="/seguimiento" variant="danger">Ir al seguimiento</Button>
          <Button as={Link} to="/carrito" variant="outline-secondary">Crear un pedido</Button>
        </div>
      </Container>
    )
  }

  return (
    <Container as="section" className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          {state?.aviso && <Alert variant="warning">{state.aviso}</Alert>}
          <Card border="success" className="mb-4">
            <Card.Body>
              <Card.Title as="h1" className="h3">Pedido confirmado</Card.Title>
              <p className="mb-2">Tu número de seguimiento es <strong>{pedido.id}</strong>.</p>
              <p className="mb-0">Estado actual: <EtiquetaEstadoPedido estado={pedido.estado} /></p>
            </Card.Body>
          </Card>
          <ResumenPedido pedido={pedido} />
          <div className="d-flex flex-wrap gap-2 mt-4">
            <Button as={Link} to={`/seguimiento/${pedido.id}`} state={{ correo: pedido.cliente.correo ?? '' }} variant="danger">
              Ver seguimiento
            </Button>
            <Button as={Link} to="/catalogo" variant="outline-secondary">Volver al catálogo</Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
