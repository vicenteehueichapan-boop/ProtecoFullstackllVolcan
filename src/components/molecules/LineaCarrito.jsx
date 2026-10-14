import { Alert } from 'react-bootstrap'
import BotonAccion from '../atoms/BotonAccion'
import { formatearPrecio } from '../../utils/formatearPrecio'

export default function LineaCarrito({ linea, alCambiarCantidad, alQuitar }) {
  return (
    <article className="border rounded p-3 mb-3">
      <h2 className="h5">{linea.nombre}</h2>
      <p>Precio unitario: {formatearPrecio(linea.precioUnitario)}</p>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <BotonAccion variante="outline-secondary" disabled={linea.cantidad <= 1}
          aria-label={`Reducir cantidad de ${linea.nombre}`}
          onClick={() => alCambiarCantidad(linea.codigo, linea.cantidad - 1)}>−</BotonAccion>
        <span aria-live="polite">Cantidad: {linea.cantidad}</span>
        <BotonAccion variante="outline-secondary" disabled={linea.cantidad >= linea.stock}
          aria-label={`Aumentar cantidad de ${linea.nombre}`}
          onClick={() => alCambiarCantidad(linea.codigo, linea.cantidad + 1)}>+</BotonAccion>
        <BotonAccion variante="outline-danger" aria-label={`Quitar ${linea.nombre}`}
          onClick={() => alQuitar(linea.codigo)}>Quitar</BotonAccion>
      </div>
      <p className="mb-0"><strong>Subtotal: {formatearPrecio(linea.subtotal)}</strong></p>
      {linea.error && <Alert variant="warning" className="mt-3 mb-0">{linea.error}</Alert>}
    </article>
  )
}
