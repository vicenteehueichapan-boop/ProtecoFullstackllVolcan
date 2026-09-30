import { Badge, Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { formatearPrecio } from '../../utils/formatearPrecio'
import { precioSegunCliente } from '../../utils/precioSegunCliente'
import Precio from '../atoms/Precio'

export default function TarjetaProducto({ producto, tipoCliente, enlaceDetalle }) {
  const precio = precioSegunCliente(producto, tipoCliente)
  const stockBajo = producto.stock <= 10

  return (
    <Card as="article" className="h-100 tarjeta-producto">
      <Card.Img
        className="imagen-producto"
        src={producto.imagen}
        alt={producto.nombre}
      />
      <Card.Body className="d-flex flex-column">
        <p className="text-secondary small mb-1">{producto.codigo}</p>
        {producto.categoria && <p className="categoria-producto">{producto.categoria}</p>}
        <Card.Title as="h2" className="h5">{producto.nombre}</Card.Title>
        <Card.Text className="flex-grow-1">{producto.descripcion}</Card.Text>
        <Precio valor={formatearPrecio(precio)} />
        <Badge bg={stockBajo ? 'warning' : 'success'} text={stockBajo ? 'dark' : undefined} className="align-self-start">
          {producto.stock === 0 ? 'Sin stock disponible' : stockBajo ? `Últimas ${producto.stock} unidades` : `Stock: ${producto.stock}`}
        </Badge>
        {enlaceDetalle && (
          <Button as={Link} className="mt-3" variant="outline-danger" to={enlaceDetalle} aria-label={`Ver detalle de ${producto.nombre}`}>
            Ver detalle
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}
