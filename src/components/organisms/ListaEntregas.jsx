import { Button, Card, Col, Row } from 'react-bootstrap'
import EtiquetaEstadoPedido from '../atoms/EtiquetaEstadoPedido'

export default function ListaEntregas({ pedidos, alCambiarEstado }) {
  if (pedidos.length === 0) {
    return <Card body>No hay entregas asignadas a este repartidor.</Card>
  }

  return (
    <Row className="g-3">
      {pedidos.map((pedido) => (
        <Col xs={12} key={pedido.id}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
                <Card.Title as="h2" className="h5 mb-0">{pedido.id}</Card.Title>
                <EtiquetaEstadoPedido estado={pedido.estado} />
              </div>
              <p className="mb-1"><strong>Cliente:</strong> {pedido.cliente.nombre}</p>
              <p className="mb-1"><strong>Dirección:</strong> {pedido.cliente.direccion}</p>
              <p><strong>Entrega:</strong> {pedido.productos[0]?.nombre} × {pedido.productos[0]?.cantidad}</p>

              {pedido.estado === 'asignado' && (
                <Button variant="primary" onClick={() => alCambiarEstado(pedido.id, 'en_camino')}>
                  Marcar en camino
                </Button>
              )}
              {pedido.estado === 'en_camino' && (
                <Button variant="success" onClick={() => alCambiarEstado(pedido.id, 'entregado')}>
                  Marcar entregado
                </Button>
              )}
              {pedido.estado === 'entregado' && (
                <p className="text-success fw-semibold mb-0">Entrega completada.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  )
}
