import { useMemo, useState } from 'react'
import { Alert, Col, Container, Form, Row } from 'react-bootstrap'
import ListaEntregas from '../components/organisms/ListaEntregas'
import repartidores from '../data/repartidores'
import { usePedidos } from '../hooks/usePedidos'

export default function RepartidorEntregas() {
  const { pedidos, cambiarEstado } = usePedidos()
  const [repartidorActivo, setRepartidorActivo] = useState(repartidores[0].nombre)
  const [mensaje, setMensaje] = useState(null)
  const entregas = useMemo(
    () => pedidos.filter((pedido) => pedido.repartidor === repartidorActivo),
    [pedidos, repartidorActivo],
  )

  function avanzarEstado(id, nuevoEstado) {
    try {
      cambiarEstado(id, nuevoEstado)
      setMensaje({ tipo: 'success', texto: `El estado de ${id} fue actualizado.` })
    } catch (excepcion) {
      setMensaje({
        tipo: 'danger',
        texto: excepcion instanceof Error ? excepcion.message : 'No fue posible actualizar el pedido.',
      })
    }
  }

  return (
    <Container as="section" className="py-5">
      <Row className="align-items-end mb-4">
        <Col md={8}>
          <h1>Mis entregas</h1>
          <p className="text-secondary mb-md-0">
            Cada repartidor visualiza solamente los pedidos que le fueron asignados.
          </p>
        </Col>
        <Col md={4}>
          <Form.Group controlId="repartidor-activo">
            <Form.Label>Repartidor de demostración</Form.Label>
            <Form.Select
              value={repartidorActivo}
              onChange={(evento) => {
                setRepartidorActivo(evento.target.value)
                setMensaje(null)
              }}
            >
              {repartidores.map((repartidor) => (
                <option key={repartidor.id} value={repartidor.nombre}>{repartidor.nombre}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {mensaje && <Alert variant={mensaje.tipo}>{mensaje.texto}</Alert>}
      <ListaEntregas pedidos={entregas} alCambiarEstado={avanzarEstado} />
    </Container>
  )
}
