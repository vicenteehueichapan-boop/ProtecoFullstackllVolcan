import { Card } from 'react-bootstrap'
import EnlaceInterno from '../atoms/EnlaceInterno'
import EtiquetaEstadoPedido from '../atoms/EtiquetaEstadoPedido'
import { formatearPrecio } from '../../utils/formatearPrecio'

// Resumen de un pedido para su cliente: número, estado, fecha, productos y total.
export default function TarjetaPedido({ pedido, alNavegar }) {
  const productos = pedido.productos.map((linea) => `${linea.nombre} × ${linea.cantidad}`).join(', ')

  return (
    <Card as="article" className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between gap-2 mb-2">
          <Card.Title as="h2" className="h5 mb-0">Pedido {pedido.id}</Card.Title>
          <EtiquetaEstadoPedido estado={pedido.estado} />
        </div>
        <p className="mb-1">{new Date(pedido.fechaCreacion).toLocaleString('es-CL')}</p>
        <p className="mb-1">{productos}</p>
        <p className="fw-bold">Total: {formatearPrecio(pedido.total)}</p>
        <EnlaceInterno
          ruta={`/seguimiento/${pedido.id}`}
          alNavegar={alNavegar}
          className="btn btn-sm btn-outline-danger"
        >
          Ver seguimiento de {pedido.id}
        </EnlaceInterno>
      </Card.Body>
    </Card>
  )
}
