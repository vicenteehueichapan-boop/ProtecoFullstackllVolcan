import { useState } from 'react'
import { Alert, Badge, Button, Col, Container, Row } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SelectorTipoCliente from '../components/molecules/SelectorTipoCliente'
import { useProductos } from '../hooks/useProductos'
import { formatearPrecio } from '../utils/formatearPrecio'
import { precioSegunCliente } from '../utils/precioSegunCliente'
import { useCarrito } from '../hooks/useCarrito'

export default function DetalleProducto() {
  const { codigo } = useParams()
  const { productos } = useProductos()
  const [tipoCliente, setTipoCliente] = useState('residencial')
  const { agregar, error } = useCarrito()
  const navegar = useNavigate()
  const producto = productos.find((item) => item.codigo === codigo)

  function agregarCilindro() {
    if (agregar(producto.codigo)) navegar('/carrito')
  }

  if (!producto) return <Container className="py-5"><h1>Producto no encontrado</h1><Button as={Link} variant="danger" to="/catalogo">Volver al catálogo</Button></Container>

  return (
    <Container className="py-5">
      <Row className="gx-4 gy-5 align-items-center">
        <Col md={5} className="text-center"><img className="img-fluid imagen-detalle" src={producto.imagen} alt={producto.nombre} /></Col>
        <Col md={7}>
          <Badge bg="secondary">{producto.categoria}</Badge>
          <h1 className="mt-2">{producto.nombre}</h1>
          <p className="text-secondary">Código {producto.codigo}</p>
          <p>{producto.descripcion}</p>
          <SelectorTipoCliente valor={tipoCliente} alCambiar={setTipoCliente} />
          <p className="h3 marca-volcan">{formatearPrecio(precioSegunCliente(producto, tipoCliente))}</p>
          <p>Stock disponible: {producto.stock} {producto.unidad.toLocaleLowerCase('es-CL')}</p>
          {error && <Alert variant="danger">{error}</Alert>}
          {producto.categoria === 'Cilindros de Gas' && (
            <div className="mb-3">
              <Button variant="danger" disabled={producto.stock < 1} onClick={agregarCilindro}>Agregar al carrito</Button>
              <p className="small text-secondary mt-2">Selecciona la tarifa de todo el pedido en Mi carrito.</p>
            </div>
          )}
          {producto.categoria !== 'Cilindros de Gas' && (
            <Button as={Link} variant="outline-secondary" to="/catalogo">Volver al catálogo</Button>
          )}
        </Col>
      </Row>
    </Container>
  )
}
