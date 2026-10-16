import { Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import TarjetaArticulo from '../components/molecules/TarjetaArticulo'
import articulosBlog from '../data/articulosBlog'
import { useTituloPagina } from '../hooks/useTituloPagina'

export default function Blog() {
  useTituloPagina('Blog')
  const navegar = useNavigate()

  return (
    <Container as="section" className="py-5">
      <p className="sobretitulo">Información para el hogar</p>
      <h1>Blog</h1>
      <p className="text-secondary">Lecturas breves para recibir tu pedido de forma informada y segura.</p>
      <Row className="g-4">
        {articulosBlog.map((articulo) => (
          <Col md={6} key={articulo.slug}>
            <TarjetaArticulo articulo={articulo} alNavegar={navegar} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}
