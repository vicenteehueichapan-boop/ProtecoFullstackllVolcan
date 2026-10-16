import { Card } from 'react-bootstrap'
import EnlaceInterno from '../atoms/EnlaceInterno'

// Un número importante con su explicación y, si corresponde, un acceso a su módulo.
export default function TarjetaIndicador({ titulo, valor, detalle, ruta, textoEnlace, alNavegar }) {
  return (
    <Card className="h-100 tarjeta-indicador">
      <Card.Body className="d-flex flex-column">
        <Card.Title as="h2" className="h6 text-secondary mb-1">{titulo}</Card.Title>
        <p className="valor-indicador mb-1">{valor}</p>
        {detalle && <p className="small text-secondary flex-grow-1">{detalle}</p>}
        {ruta && (
          <EnlaceInterno ruta={ruta} alNavegar={alNavegar} className="small fw-semibold">
            {textoEnlace}
          </EnlaceInterno>
        )}
      </Card.Body>
    </Card>
  )
}
