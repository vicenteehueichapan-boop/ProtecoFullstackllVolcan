import { useState } from 'react'
import { Badge, Button, Col, Container, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import SelectorTipoCliente from '../components/molecules/SelectorTipoCliente'
import { useProductos } from '../hooks/useProductos'
import { formatearPrecio } from '../utils/formatearPrecio'
import { precioSegunCliente } from '../utils/precioSegunCliente'

export default function DetalleProducto() {
  const { codigo } = useParams()
  const { productos } = useProductos()
  const [tipoCliente, setTipoCliente] = useState('residencial')
  const producto = productos.find((item) => item.codigo === codigo)

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
          {producto.categoria === 'Cilindros de Gas' ? (
            <Button as={Link} variant="danger" to={`/nuevo-pedido?producto=${producto.codigo}`}>Solicitar cilindro</Button>
          ) : (
            <Button as={Link} variant="outline-secondary" to="/catalogo">Volver al catálogo</Button>
          )}
        </Col>
      </Row>
    </Container>
  )
}
