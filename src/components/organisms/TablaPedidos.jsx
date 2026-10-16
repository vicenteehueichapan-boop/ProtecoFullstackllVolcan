import { Table } from 'react-bootstrap'
import EnlaceInterno from '../atoms/EnlaceInterno'
import EtiquetaEstadoPedido from '../atoms/EtiquetaEstadoPedido'
import { formatearPrecio } from '../../utils/formatearPrecio'

// Tabla de pedidos para administración, con acceso a la orden de cada uno.
export default function TablaPedidos({ pedidos, alNavegar }) {
  if (pedidos.length === 0) {
    return <p className="border rounded p-3 bg-white mb-0">No hay pedidos que coincidan con los filtros.</p>
  }

  return (
    <div className="table-responsive bg-white shadow-sm rounded">
      <Table hover className="mb-0 align-middle">
        <caption className="visually-hidden">Pedidos recibidos</caption>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Zona</th>
            <th>Total</th>
            <th>Estado</th>
            <th><span className="visually-hidden">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>
                <strong>{pedido.id}</strong>
                <div className="small text-secondary">{new Date(pedido.fechaCreacion).toLocaleString('es-CL')}</div>
              </td>
              <td>{pedido.cliente.nombre}</td>
              <td>{pedido.zona.nombre}</td>
              <td>{formatearPrecio(pedido.total)}</td>
              <td><EtiquetaEstadoPedido estado={pedido.estado} /></td>
              <td>
                <EnlaceInterno
                  ruta={`/administracion/pedidos/${pedido.id}`}
                  alNavegar={alNavegar}
                  className="btn btn-sm btn-outline-danger"
                  aria-label={`Ver la orden de ${pedido.id}`}
                >
                  Ver orden
                </EnlaceInterno>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
