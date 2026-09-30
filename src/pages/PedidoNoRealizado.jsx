import { Alert, Button, Container } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'

export default function PedidoNoRealizado() {
  const { state } = useLocation()

  return (
    <Container className="py-5">
      <h1>Pedido no realizado</h1>
      <Alert variant="danger">
        {state?.mensaje ?? 'No se pudo guardar el pedido. Revisa los datos e intenta nuevamente.'}
      </Alert>
      <Button as={Link} to="/nuevo-pedido" variant="danger">Volver al formulario</Button>
    </Container>
  )
}
