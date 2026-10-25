import { useState } from 'react'
import { Alert, Col, Container, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import SelectorTipoCliente from '../components/molecules/SelectorTipoCliente'
import CatalogoGas from '../components/organisms/CatalogoGas'
import { useProductos } from '../hooks/useProductos'
import { useTituloPagina } from '../hooks/useTituloPagina'

// Vista "Ofertas" de la Guía 16, adaptada al caso: el caso no define descuentos, así que se
// muestran los productos que administración marcó como destacados, con su precio normal.
export default function Destacados() {
  useTituloPagina('Destacados')
  const { productos } = useProductos()
  const navegar = useNavigate()
  const [tipoCliente, setTipoCliente] = useState('residencial')
  const destacados = productos.filter((producto) => producto.destacado)

  return (
    <Container as="section" className="py-5">
      <Row className="align-items-end g-3 mb-4">
        <Col md={8}>
          <p className="sobretitulo">Recomendados por nuestro equipo</p>
          <h1>Productos destacados</h1>
          <p className="text-secondary mb-0">
            Selección de productos que recomendamos para tu hogar o negocio. Se muestran con su precio habitual.
          </p>
        </Col>
        <Col md={4}>
          <SelectorTipoCliente valor={tipoCliente} alCambiar={setTipoCliente} />
        </Col>
      </Row>
      {destacados.length === 0 ? (
        <Alert variant="light" className="border">
          Por ahora no hay productos destacados. <Link to="/catalogo">Revisa el catálogo completo</Link>.
        </Alert>
      ) : (
        <CatalogoGas productos={destacados} tipoCliente={tipoCliente} alNavegar={navegar} />
      )}
    </Container>
  )
}
