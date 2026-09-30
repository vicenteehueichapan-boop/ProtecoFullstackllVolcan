import { Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useProductos } from '../hooks/useProductos'

export default function Categorias() {
  const { productos } = useProductos()
  const categorias = [...new Set(productos.map((producto) => producto.categoria))]

  return (
    <Container className="py-5">
      <h1>Categorías</h1>
      <p className="text-secondary">Explora el catálogo según el tipo de producto que necesitas.</p>
      <Row className="g-4">
        {categorias.map((categoria) => {
          const cantidad = productos.filter((producto) => producto.categoria === categoria).length
          return (
            <Col md={6} lg={4} key={categoria}>
              <Card className="h-100"><Card.Body><Card.Title>{categoria}</Card.Title><Card.Text>{cantidad} productos disponibles.</Card.Text><Link to={`/catalogo?categoria=${encodeURIComponent(categoria)}`}>Ver productos</Link></Card.Body></Card>
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}
