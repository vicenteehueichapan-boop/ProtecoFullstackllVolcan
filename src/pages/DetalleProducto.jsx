import { useState } from 'react'
import { Alert, Badge, Button, Col, Container, Row } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SelectorTipoCliente from '../components/molecules/SelectorTipoCliente'
import { useCarrito } from '../hooks/useCarrito'
import { useProductos } from '../hooks/useProductos'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { formatearPrecio } from '../utils/formatearPrecio'
import { precioSegunCliente } from '../utils/precioSegunCliente'

// Ficha de cualquier ítem del catálogo, con el botón para agregarlo a la solicitud (Guía 16).
export default function DetalleProducto() {
  const { codigo } = useParams()
  const { productos } = useProductos()
  const { agregar, error } = useCarrito()
  const navegar = useNavigate()
  const [tipoCliente, setTipoCliente] = useState('residencial')
  const producto = productos.find((item) => item.codigo === codigo)
  useTituloPagina(producto ? producto.nombre : 'Producto no encontrado')

  function agregarAlCarrito() {
    if (agregar(producto.codigo)) navegar('/carrito')
  }

  if (!producto) {
    return (
      <Container className="py-5">
        <h1>Producto no encontrado</h1>
        <p>No existe un producto con el código «{codigo}».</p>
        <Button as={Link} variant="danger" to="/catalogo">Volver al catálogo</Button>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <Row className="gx-4 gy-5 align-items-center">
        <Col md={5} className="text-center">
          <img className="img-fluid imagen-detalle" src={producto.imagen} alt={producto.nombre} />
        </Col>
        <Col md={7}>
          <Badge bg="secondary">{producto.categoria}</Badge>
          <h1 className="mt-2">{producto.nombre}</h1>
          <p className="text-secondary">Código {producto.codigo}</p>
          <p>{producto.descripcion}</p>
          <SelectorTipoCliente valor={tipoCliente} alCambiar={setTipoCliente} />
          <p className="h3 marca-volcan">{formatearPrecio(precioSegunCliente(producto, tipoCliente))}</p>
          <p>Stock disponible: {producto.stock} ({producto.unidad.toLocaleLowerCase('es-CL')})</p>
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="d-flex flex-wrap gap-2 mb-2">
            <Button variant="danger" disabled={producto.stock < 1} onClick={agregarAlCarrito}>
              {producto.stock < 1 ? 'Sin stock disponible' : 'Agregar al carrito'}
            </Button>
            {/* navigate(-1) vuelve a la página anterior del historial (Guía 14). */}
            <Button variant="outline-secondary" onClick={() => navegar(-1)}>Volver</Button>
          </div>
          <p className="small text-secondary">La tarifa de todo el pedido se elige en Mi carrito.</p>
        </Col>
      </Row>
    </Container>
  )
}
