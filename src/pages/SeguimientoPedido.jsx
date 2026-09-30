import { useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, ListGroup, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import EtiquetaEstadoPedido from '../components/atoms/EtiquetaEstadoPedido'
import { usePedidos } from '../hooks/usePedidos'

const PASOS = [
  { valor: 'pendiente', texto: 'Pedido recibido' },
  { valor: 'asignado', texto: 'Repartidor asignado' },
  { valor: 'en_camino', texto: 'Pedido en camino' },
  { valor: 'entregado', texto: 'Pedido entregado' },
]

export default function SeguimientoPedido() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { pedidos } = usePedidos()
  const [consulta, setConsulta] = useState(id ?? '')
  const pedido = id ? pedidos.find((item) => item.id === id) : null
  const indiceActual = pedido ? PASOS.findIndex((paso) => paso.valor === pedido.estado) : -1

  function buscar(evento) {
    evento.preventDefault()
    const identificador = consulta.trim().toUpperCase()
    if (identificador) navegar(`/seguimiento/${identificador}`)
  }

  return (
    <Container as="section" className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <h1>Seguimiento del pedido</h1>
          <Form className="d-flex gap-2 my-4" onSubmit={buscar}>
            <Form.Control
              aria-label="Número del pedido"
              placeholder="Ejemplo: PED-0001"
              value={consulta}
              onChange={(evento) => setConsulta(evento.target.value)}
            />
            <Button type="submit" variant="danger">Buscar</Button>
          </Form>

          {id && !pedido && (
            <Alert variant="warning">No encontramos un pedido con el número {id}.</Alert>
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
