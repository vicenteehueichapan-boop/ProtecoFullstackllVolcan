import { Button, Col, Container, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import articulosBlog from '../data/articulosBlog'
import { useTituloPagina } from '../hooks/useTituloPagina'

// Detalle de una entrada. Ruta: /blog/:slug (el slug identifica la entrada en la URL).
export default function DetalleBlog() {
  const { slug } = useParams()
  const articulo = articulosBlog.find((item) => item.slug === slug)
  useTituloPagina(articulo ? articulo.titulo : 'Entrada no encontrada')

  if (!articulo) {
    return (
      <Container className="py-5">
        <h1>Entrada no encontrada</h1>
        <p>No existe una entrada del blog con esa dirección.</p>
        <Button as={Link} to="/blog" variant="danger">Ver todas las entradas</Button>
      </Container>
    )
  }

  return (
    <Container as="article" className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <p className="sobretitulo">{articulo.categoria}</p>
          <h1>{articulo.titulo}</h1>
          <p className="lead">{articulo.resumen}</p>
          <img className="img-fluid imagen-detalle my-3" src={articulo.imagen} alt="" />
          {articulo.secciones.map((seccion) => (
            <section key={seccion.titulo} className="mb-4">
              <h2 className="h4">{seccion.titulo}</h2>
              <p>{seccion.texto}</p>
            </section>
          ))}
          {articulo.fuentes.length > 0 && (
            <aside className="border-top pt-3">
              <h2 className="h6">Fuentes oficiales</h2>
              <ul>
                {articulo.fuentes.map((fuente) => (
                  <li key={fuente.url}>
                    <a href={fuente.url} target="_blank" rel="noreferrer">{fuente.texto}</a>
                  </li>
                ))}
              </ul>
            </aside>
          )}
          <Link to="/blog">Volver al blog</Link>
        </Col>
      </Row>
    </Container>
  )
}
