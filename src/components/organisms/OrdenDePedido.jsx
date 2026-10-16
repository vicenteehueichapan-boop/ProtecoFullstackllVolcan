import { Card, Col, Row, Table } from 'react-bootstrap'
import EnlaceInterno from '../atoms/EnlaceInterno'
import EtiquetaEstadoPedido from '../atoms/EtiquetaEstadoPedido'
import { formatearPrecio } from '../../utils/formatearPrecio'

function fecha(valor) {
  return new Date(valor).toLocaleString('es-CL')
}

// Comprobante interno de un pedido (Guía 16: "solicitudes y su comprobante"). El caso cobra
// en efectivo al entregar, así que es una orden de pedido, no una boleta tributaria.
export default function OrdenDePedido({ pedido, alNavegar }) {
  return (
    <Card as="article" className="shadow-sm">
      <Card.Body>
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
          <div>
            <p className="sobretitulo mb-1">Orden de pedido</p>
            <h1 className="h3 mb-0">{pedido.id}</h1>
            <p className="small text-secondary mb-0">Registrado el {fecha(pedido.fechaCreacion)}</p>
          </div>
          <EtiquetaEstadoPedido estado={pedido.estado} />
        </div>

        <Row className="g-3 mb-3">
          <Col md={6}>
            <h2 className="h6">Cliente y entrega</h2>
            <p className="mb-1">{pedido.cliente.nombre}</p>
            {pedido.cliente.correo && <p className="mb-1">{pedido.cliente.correo}</p>}
            <p className="mb-1">{pedido.cliente.direccion}</p>
            <p className="mb-1">{pedido.zona.nombre} · estimado {pedido.zona.tiempoEstimado}</p>
            {pedido.clienteId ? (
              <EnlaceInterno ruta={`/administracion/usuarios/clientes/${pedido.clienteId}`} alNavegar={alNavegar}>
                Ver historial de la cuenta {pedido.clienteId}
              </EnlaceInterno>
            ) : (
              <p className="small text-secondary mb-0">Pedido sin cuenta de cliente.</p>
            )}
          </Col>
          <Col md={6}>
            <h2 className="h6">Despacho y pago</h2>
            <p className="mb-1">Repartidor: {pedido.repartidor ?? 'Sin asignar'}</p>
            <p className="mb-1">Tarifa: {pedido.tipoCliente}</p>
            <p className="mb-1">Forma de pago: efectivo al entregar</p>
            <p className="mb-0">
              {pedido.cobro
                ? `Cobro registrado: ${formatearPrecio(pedido.cobro.monto)} el ${fecha(pedido.cobro.fecha)}`
                : 'Cobro pendiente: se registra al marcar la entrega.'}
            </p>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table size="sm" className="align-middle">
            <caption>Productos del pedido</caption>
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th className="text-end">Cantidad</th>
                <th className="text-end">Precio unitario</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.productos.map((linea) => (
                <tr key={linea.codigo}>
                  <td>{linea.codigo}</td>
                  <td>{linea.nombre}</td>
                  <td className="text-end">{linea.cantidad}</td>
                  <td className="text-end">{formatearPrecio(linea.precioUnitario)}</td>
                  <td className="text-end">{formatearPrecio(linea.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={4} className="text-end">Total</th>
                <th className="text-end">{formatearPrecio(pedido.total)}</th>
              </tr>
            </tfoot>
          </Table>
        </div>
        <p className="small text-secondary mb-0">
          Documento interno de la distribuidora. No reemplaza una boleta tributaria.
        </p>
      </Card.Body>
    </Card>
  )
}
