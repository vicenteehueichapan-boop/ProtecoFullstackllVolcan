import { Col, Form, Row } from 'react-bootstrap'

export default function FiltrosCatalogo({ busqueda, categoria, categorias, alBuscar, alCambiarCategoria }) {
  return (
    <Row className="g-3 mb-4">
      <Col md={7}>
        <Form.Group controlId="buscar-producto">
          <Form.Label>Buscar producto</Form.Label>
          <Form.Control type="search" value={busqueda} placeholder="Nombre, código o descripción" onChange={(evento) => alBuscar(evento.target.value)} />
        </Form.Group>
      </Col>
      <Col md={5}>
        <Form.Group controlId="filtrar-categoria">
          <Form.Label>Categoría</Form.Label>
          <Form.Select value={categoria} onChange={(evento) => alCambiarCategoria(evento.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map((nombre) => <option key={nombre} value={nombre}>{nombre}</option>)}
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  )
}
