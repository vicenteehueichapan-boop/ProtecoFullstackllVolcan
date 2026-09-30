import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import SelectorTipoCliente from '../components/molecules/SelectorTipoCliente'
import TarjetaProducto from '../components/molecules/TarjetaProducto'
import { useProductos } from '../hooks/useProductos'

export default function Catalogo() {
  const { productos } = useProductos()
  const [tipoCliente, setTipoCliente] = useState('residencial')

  return (
    <Container as="section" className="py-5">
      <Row className="align-items-end mb-3">
        <Col md={8}>
          <h1>Catálogo de productos</h1>
          <p className="text-secondary">
            Selecciona el tipo de cliente para consultar la tarifa correspondiente.
          </p>
        </Col>
        <Col md={4}>
          <SelectorTipoCliente valor={tipoCliente} alCambiar={setTipoCliente} />
        </Col>
      </Row>

      <Row className="g-4">
        {productos.map((producto) => (
          <Col xs={12} md={6} lg={4} xl={3} key={producto.codigo}>
            <TarjetaProducto producto={producto} tipoCliente={tipoCliente} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}
