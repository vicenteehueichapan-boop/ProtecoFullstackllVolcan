import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import EtiquetaEstadoPedido from '../components/atoms/EtiquetaEstadoPedido'
import { usePedidos } from '../hooks/usePedidos'
import { useSesionCliente } from '../hooks/useSesionCliente'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { formatearPrecio } from '../utils/formatearPrecio'

// Historial del cliente con sesión: solo sus pedidos, del más reciente al más antiguo.
export default function MisPedidos() {
  useTituloPagina('Mis pedidos')
  const { cliente } = useSesionCliente()
  const { pedidos } = usePedidos()

  if (!cliente) {
    return (
      <Container className="py-5">
        <h1>Mis pedidos</h1>
        <Alert variant="info">
          Ingresa con tu cuenta para ver tus pedidos.{' '}
          <Link to="/ingreso" state={{ desde: '/mis-pedidos' }}>Ingresar</Link>
        </Alert>
      </Container>
    )
  }

  const propios = pedidos
    .filter((pedido) => pedido.clienteId === cliente.id)
    .sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion))

  return (
    <Container as="section" className="py-5">
      <h1>Mis pedidos</h1>
      <p className="text-secondary">Hola, {cliente.nombre}. Aquí ves los pedidos registrados con tu cuenta.</p>
      {propios.length === 0 ? (
        <Alert variant="light" className="border">
          Todavía no tienes pedidos. <Link to="/catalogo">Ir al catálogo</Link>
        </Alert>
      ) : (
        <Row className="g-3">
          {propios.map((pedido) => (
            <Col md={6} key={pedido.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between gap-2 mb-2">
                    <Card.Title as="h2" className="h5 mb-0">Pedido {pedido.id}</Card.Title>
                    <EtiquetaEstadoPedido estado={pedido.estado} />
                  </div>
                  <p className="mb-1">{new Date(pedido.fechaCreacion).toLocaleString('es-CL')}</p>
                  <p className="mb-1">{pedido.productos.map((linea) => `${linea.nombre} × ${linea.cantidad}`).join(', ')}</p>
                  <p className="fw-bold">Total: {formatearPrecio(pedido.total)}</p>
                  <Button as={Link} to={`/seguimiento/${pedido.id}`} size="sm" variant="outline-danger">
                    Ver seguimiento de {pedido.id}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}
