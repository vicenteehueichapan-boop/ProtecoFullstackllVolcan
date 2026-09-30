import { useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ResumenPedido from '../components/molecules/ResumenPedido'
import FormularioNuevoPedido from '../components/organisms/FormularioNuevoPedido'
import zonasDespacho from '../data/zonasDespacho'
import { usePedidos } from '../hooks/usePedidos'
import { useProductos } from '../hooks/useProductos'

export default function NuevoPedido() {
  const { productos } = useProductos()
  const { crearPedido } = usePedidos()
  const navegar = useNavigate()
  const [parametros] = useSearchParams()
  const [borrador, setBorrador] = useState(null)

  function confirmarPedido() {
    try {
      const pedidoCreado = crearPedido(borrador)
      navegar(`/pedido-confirmado/${pedidoCreado.id}`)
    } catch (excepcion) {
      navegar('/pedido-no-realizado', {
        state: { mensaje: excepcion instanceof Error ? excepcion.message : 'No fue posible crear el pedido.' },
      })
    }
  }

  return (
    <Container as="section" className="py-5">
      <Row className="justify-content-center">
        <Col xl={9}>
          <h1>Nuevo pedido</h1>
          <p className="text-secondary">
            Registra los datos de entrega y revisa el resumen antes de confirmar.
          </p>

          {borrador ? (
            <Row className="g-4">
              <Col lg={8}><ResumenPedido pedido={borrador} /></Col>
              <Col lg={4}>
                <Card className="h-100">
                  <Card.Body className="d-flex flex-column justify-content-center gap-3">
                    <Button variant="danger" onClick={confirmarPedido}>Confirmar pedido</Button>
                    <Button variant="outline-secondary" onClick={() => setBorrador(null)}>
                      Corregir datos
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <FormularioNuevoPedido
                  productos={productos}
                  zonas={zonasDespacho}
                  alPrepararPedido={setBorrador}
                  codigoInicial={parametros.get('producto') ?? ''}
                />
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  )
}
