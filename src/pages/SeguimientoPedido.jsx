import { Alert, Card, Col, Container, ListGroup, Row } from 'react-bootstrap'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import EtiquetaEstadoPedido from '../components/atoms/EtiquetaEstadoPedido'
import BuscadorPedido from '../components/molecules/BuscadorPedido'
import { usePedidos } from '../hooks/usePedidos'
import { useSesionCliente } from '../hooks/useSesionCliente'
import { puedeVerPedido } from '../utils/puedeVerPedido'

const PASOS = [
  { valor: 'pendiente', texto: 'Pedido recibido' },
  { valor: 'asignado', texto: 'Repartidor asignado' },
  { valor: 'en_camino', texto: 'Pedido en camino' },
  { valor: 'entregado', texto: 'Pedido entregado' },
]

export default function SeguimientoPedido() {
  const { id } = useParams()
  const { state } = useLocation()
  const navegar = useNavigate()
  const { pedidos } = usePedidos()
  const { cliente } = useSesionCliente()
  // El correo viaja en el estado del historial, nunca en la dirección (URL).
  const correo = state?.correo ?? ''
  const encontrado = id ? pedidos.find((item) => item.id === id) : null
  const pedido = puedeVerPedido(encontrado, { cliente, correo }) ? encontrado : null
  const indiceActual = pedido ? PASOS.findIndex((paso) => paso.valor === pedido.estado) : -1

  function buscar({ identificador, correo: correoBuscado }) {
    navegar(`/seguimiento/${encodeURIComponent(identificador)}`, { state: { correo: correoBuscado } })
  }

  return (
    <Container as="section" className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <h1>Seguimiento del pedido</h1>
          <p className="text-secondary mb-0">
            Escribe el número y el correo que usaste al pedir. Si ingresaste con tu cuenta, basta el número.
          </p>
          {/* La clave reinicia el buscador cuando cambia el pedido de la ruta. */}
          <BuscadorPedido
            key={`${id ?? ''}|${correo}`}
            identificadorInicial={id ?? ''}
            correoInicial={correo || cliente?.correo || ''}
            alBuscar={buscar}
          />

          {/* El mismo aviso para "no existe" y "correo distinto": no revela qué pedidos existen. */}
          {id && !pedido && (
            <Alert variant="warning">
              No encontramos un pedido {id} asociado a ese correo o a tu cuenta.
            </Alert>
          )}

          {pedido && (
            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
                  <Card.Title as="h2" className="h4 mb-0">Pedido {pedido.id}</Card.Title>
                  <EtiquetaEstadoPedido estado={pedido.estado} />
                </div>
                <p><strong>Dirección:</strong> {pedido.cliente.direccion}</p>
                <p><strong>Tiempo estimado:</strong> {pedido.zona.tiempoEstimado}</p>
                {pedido.repartidor && <p><strong>Repartidor:</strong> {pedido.repartidor}</p>}
                <ListGroup numbered>
                  {PASOS.map((paso, indice) => (
                    <ListGroup.Item
                      key={paso.valor}
                      variant={indice <= indiceActual ? 'success' : undefined}
                    >
                      {paso.texto}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  )
}
