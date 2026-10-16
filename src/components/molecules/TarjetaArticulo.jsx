import { Card } from 'react-bootstrap'
import EnlaceInterno from '../atoms/EnlaceInterno'

// Vista previa de una entrada del blog con el enlace a su detalle.
export default function TarjetaArticulo({ articulo, alNavegar }) {
  return (
    <Card as="article" className="h-100 tarjeta-producto">
      <Card.Img className="imagen-producto" src={articulo.imagen} alt="" />
      <Card.Body className="d-flex flex-column">
        <p className="categoria-producto">{articulo.categoria}</p>
        <Card.Title as="h2" className="h5">{articulo.titulo}</Card.Title>
        <Card.Text className="flex-grow-1">{articulo.resumen}</Card.Text>
        <EnlaceInterno
          ruta={`/blog/${articulo.slug}`}
          alNavegar={alNavegar}
          className="btn btn-outline-danger align-self-start"
          aria-label={`Leer «${articulo.titulo}»`}
        >
          Leer artículo
        </EnlaceInterno>
      </Card.Body>
    </Card>
  )
}
