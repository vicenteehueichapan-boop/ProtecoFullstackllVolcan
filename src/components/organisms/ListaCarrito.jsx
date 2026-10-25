import { Alert } from 'react-bootstrap'
import LineaCarrito from '../molecules/LineaCarrito'

export default function ListaCarrito({ lineas, alCambiarCantidad, alQuitar }) {
  if (lineas.length === 0) return <Alert variant="info">Tu carrito está vacío. Agrega productos desde su ficha en el catálogo.</Alert>
  return (
    <div>
      {lineas.map((linea) => (
        <LineaCarrito key={linea.codigo} linea={linea}
          alCambiarCantidad={alCambiarCantidad} alQuitar={alQuitar} />
      ))}
    </div>
  )
}
