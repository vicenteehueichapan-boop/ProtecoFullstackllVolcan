import { Button, Card, Form, Table } from 'react-bootstrap'
import EtiquetaEstadoPedido from '../atoms/EtiquetaEstadoPedido'

export default function ListaPedidosDelDia({
  pedidos,
  repartidores,
  selecciones,
  alSeleccionar,
  alAsignar,
}) {
  if (pedidos.length === 0) {
    return <Card body>No hay pedidos registrados durante el día.</Card>
  }

  return (
    <div className="table-responsive">
      <Table bordered hover className="align-middle bg-white">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente y entrega</th>
            <th>Producto</th>
            <th>Estado</th>
            <th>Asignación</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>
                <strong>{pedido.id}</strong>
                <div className="small text-secondary">
                  {new Date(pedido.fechaCreacion).toLocaleTimeString('es-CL', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </td>
              <td>
                {pedido.cliente.nombre}
                <div className="small text-secondary">{pedido.cliente.direccion}</div>
              </td>
              <td>{pedido.productos[0]?.nombre} × {pedido.productos[0]?.cantidad}</td>
              <td><EtiquetaEstadoPedido estado={pedido.estado} /></td>
              <td style={{ minWidth: '220px' }}>
                {pedido.estado === 'pendiente' ? (
                  <div className="d-flex gap-2">
                    <Form.Select
                      aria-label={`Repartidor para ${pedido.id}`}
                      value={selecciones[pedido.id] ?? ''}
                      onChange={(evento) => alSeleccionar(pedido.id, evento.target.value)}
                    >
                      <option value="">Seleccionar</option>
                      {repartidores.map((repartidor) => (
                        <option key={repartidor.id} value={repartidor.nombre}>
                          {repartidor.nombre}
                        </option>
                      ))}
                    </Form.Select>
                    <Button
                      variant="danger"
                      onClick={() => alAsignar(pedido.id)}
                      disabled={!selecciones[pedido.id]}
                    >
                      Asignar
                    </Button>
                  </div>
                ) : (
                  pedido.repartidor ?? 'Sin repartidor'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
