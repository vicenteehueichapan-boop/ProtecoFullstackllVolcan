import { Alert, Col, Row } from 'react-bootstrap'
import TarjetaProducto from '../molecules/TarjetaProducto'

export default function CatalogoGas({ productos, tipoCliente, alNavegar }) {
  if (productos.length === 0) {
    return <Alert variant="info">No encontramos productos con los filtros seleccionados.</Alert>
  }

  return (
    <Row className="g-4">
      {productos.map((producto) => (
        <Col xs={12} md={6} lg={4} xl={3} key={producto.codigo}>
          <TarjetaProducto
            producto={producto}
            tipoCliente={tipoCliente}
            enlaceDetalle={`/productos/${producto.codigo}`}
            alNavegar={alNavegar}
          />
        </Col>
      ))}
    </Row>
  )
}
