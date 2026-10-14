import { useState } from 'react'
import { Alert, Col, Container, Modal, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import BotonAccion from '../components/atoms/BotonAccion'
import SelectorTipoCliente from '../components/molecules/SelectorTipoCliente'
import ListaCarrito from '../components/organisms/ListaCarrito'
import { useCarrito } from '../hooks/useCarrito'
import { useProductos } from '../hooks/useProductos'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { resumirCarrito } from '../utils/resumirCarrito'
import { formatearPrecio } from '../utils/formatearPrecio'

export default function Carrito() {
  useTituloPagina('Mi carrito')
  const { carrito, error, cambiarCantidad, quitar, cambiarTarifa, vaciar } = useCarrito()
  const { productos } = useProductos()
  const [confirmacion, setConfirmacion] = useState(false)
  const resumen = resumirCarrito(carrito, productos)

  function confirmarVaciado() {
    if (vaciar()) setConfirmacion(false)
  }

  return (
    <Container as="section" className="py-5">
      <h1>Mi carrito</h1>
      <p>Revisa los cilindros y cantidades. El pago es en efectivo al entregar.</p>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-4">
        <Col lg={8}>
          <ListaCarrito lineas={resumen.lineas} alCambiarCantidad={cambiarCantidad} alQuitar={quitar} />
        </Col>
        <Col lg={4}>
          <SelectorTipoCliente valor={carrito.tipoCliente} alCambiar={cambiarTarifa} />
          <p>La tarifa se aplica a todos los cilindros del pedido. Los importes se calculan con el catálogo vigente.</p>
          <p className="h4" aria-live="polite">Total: {formatearPrecio(resumen.total)}</p>
          <div className="d-flex flex-column gap-3 mt-3">
            {resumen.puedeConfirmar && !error && (
              <Link className="btn btn-danger" to="/confirmar-pedido">Continuar con la entrega</Link>
            )}
            <Link to="/catalogo">Seguir eligiendo cilindros</Link>
            {(carrito.lineas.length > 0 || error) && (
              <BotonAccion variante="outline-danger" onClick={() => setConfirmacion(true)}>Vaciar carrito</BotonAccion>
            )}
          </div>
        </Col>
      </Row>
      <Modal show={confirmacion} onHide={() => setConfirmacion(false)} centered aria-labelledby="titulo-vaciar-carrito">
        <Modal.Header closeButton closeLabel="Cerrar">
          <Modal.Title id="titulo-vaciar-carrito">Vaciar carrito</Modal.Title>
        </Modal.Header>
        <Modal.Body>Se quitarán todos los cilindros del carrito guardado en este navegador. Los pedidos confirmados no se eliminarán.</Modal.Body>
        <Modal.Footer>
          <BotonAccion variante="outline-secondary" onClick={() => setConfirmacion(false)}>Conservar carrito</BotonAccion>
          <BotonAccion variante="danger" onClick={confirmarVaciado}>Sí, vaciar carrito</BotonAccion>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
