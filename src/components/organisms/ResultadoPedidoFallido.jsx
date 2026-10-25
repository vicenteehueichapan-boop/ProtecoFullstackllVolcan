import { Alert } from 'react-bootstrap'
import BotonAccion from '../atoms/BotonAccion'

// Resultado "solicitud con error" (Guía 16, sección 3.2): aviso claro y forma de reintentar.
// No decide qué pasa al reintentar; la página lo resuelve con las funciones recibidas.
export default function ResultadoPedidoFallido({ mensaje, alReintentar, alRevisarCarrito }) {
  return (
    <Alert variant="danger" className="my-4">
      <Alert.Heading as="h2" className="h4">Pedido no realizado</Alert.Heading>
      <p className="mb-1">{mensaje}</p>
      <p>No se registró ningún pedido. Tus datos de entrega y tu carrito siguen guardados.</p>
      <div className="d-flex flex-wrap gap-2">
        <BotonAccion variante="danger" onClick={alReintentar}>Volver a intentarlo</BotonAccion>
        <BotonAccion variante="outline-secondary" onClick={alRevisarCarrito}>Revisar mi carrito</BotonAccion>
      </div>
    </Alert>
  )
}
