import { useMemo, useState } from 'react'
import { Alert, Col, Container, Row } from 'react-bootstrap'
import ListaEntregas from '../components/organisms/ListaEntregas'
import { usePedidos } from '../hooks/usePedidos'
import { useSesionPersonal } from '../hooks/useSesionPersonal'
import { esEntregaDe } from '../utils/esEntregaDe'

export default function RepartidorEntregas() {
  const { pedidos, cambiarEstado } = usePedidos()
  const { personal } = useSesionPersonal()
  const [mensaje, setMensaje] = useState(null)
  const entregas = useMemo(
    () => pedidos.filter((pedido) => esEntregaDe(pedido, personal)),
    [pedidos, personal],
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
          <p className="mb-0">Perfil activo: <strong>{personal.nombre}</strong></p>
        </Col>
      </Row>

      {mensaje && <Alert variant={mensaje.tipo}>{mensaje.texto}</Alert>}
      <ListaEntregas pedidos={entregas} alCambiarEstado={avanzarEstado} />
    </Container>
  )
}
