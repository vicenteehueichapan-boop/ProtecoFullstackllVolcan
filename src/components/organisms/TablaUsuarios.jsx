import { Badge, Table } from 'react-bootstrap'
import EnlaceInterno from '../atoms/EnlaceInterno'

// Tabla de usuarios para administración. Recibe filas ya preparadas por la página
// ({ id, nombre, detalle, activo }) y la ruta base de su ficha, así sirve para el personal
// y para los clientes.
export default function TablaUsuarios({ titulo, filas, rutaBase, alNavegar }) {
  if (filas.length === 0) return <p className="border rounded p-3 bg-white">Todavía no hay registros.</p>

  return (
    <div className="table-responsive bg-white shadow-sm rounded">
      <Table className="mb-0 align-middle">
        <caption className="visually-hidden">{titulo}</caption>
        <thead>
          <tr><th>Nombre</th><th>Detalle</th><th>Estado</th><th><span className="visually-hidden">Acciones</span></th></tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.id}>
              <td><strong>{fila.nombre}</strong><div className="small text-secondary">{fila.id}</div></td>
              <td>{fila.detalle}</td>
              <td>{fila.activo ? <Badge bg="success">Activo</Badge> : <Badge bg="secondary">Desactivado</Badge>}</td>
              <td className="text-end">
                <EnlaceInterno ruta={`${rutaBase}/${fila.id}`} alNavegar={alNavegar}
                  className="btn btn-sm btn-outline-primary" aria-label={`Ver y editar a ${fila.nombre}`}>
                  Ver y editar
                </EnlaceInterno>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
