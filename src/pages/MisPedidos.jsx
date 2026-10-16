import { Alert, Col, Container, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import TarjetaPedido from '../components/molecules/TarjetaPedido'
import { usePedidos } from '../hooks/usePedidos'
import { useSesionCliente } from '../hooks/useSesionCliente'
import { useTituloPagina } from '../hooks/useTituloPagina'

// Historial del cliente con sesión: solo sus pedidos, del más reciente al más antiguo.
export default function MisPedidos() {
  useTituloPagina('Mis pedidos')
  const { cliente } = useSesionCliente()
  const { pedidos } = usePedidos()
  const navegar = useNavigate()

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

  // Se calcula durante el renderizado (sin useEffect): es un dato derivado de pedidos.
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
              <TarjetaPedido pedido={pedido} alNavegar={navegar} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}
