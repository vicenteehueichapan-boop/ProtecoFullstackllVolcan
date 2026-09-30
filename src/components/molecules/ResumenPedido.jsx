import { Card, ListGroup } from 'react-bootstrap'
import { formatearPrecio } from '../../utils/formatearPrecio'

export default function ResumenPedido({ pedido }) {
  const producto = pedido.productos[0]

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title as="h2" className="h4">Resumen del pedido</Card.Title>
        <ListGroup variant="flush">
          <ListGroup.Item><strong>Cliente:</strong> {pedido.cliente.nombre}</ListGroup.Item>
          <ListGroup.Item><strong>Dirección:</strong> {pedido.cliente.direccion}</ListGroup.Item>
          <ListGroup.Item>
            <strong>Zona:</strong> {pedido.zona.nombre} ({pedido.zona.tiempoEstimado})
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Producto:</strong> {producto.nombre} × {producto.cantidad}
          </ListGroup.Item>
          <ListGroup.Item><strong>Tarifa:</strong> {pedido.tipoCliente}</ListGroup.Item>
          <ListGroup.Item><strong>Pago:</strong> Efectivo al entregar</ListGroup.Item>
          <ListGroup.Item className="fs-5">
            <strong>Total:</strong> {formatearPrecio(pedido.total)}
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  )
}
