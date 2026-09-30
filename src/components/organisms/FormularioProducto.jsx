import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'

const CAMPOS_TEXTO = [
  { nombre: 'codigo', etiqueta: 'Código' },
  { nombre: 'categoria', etiqueta: 'Categoría' },
  { nombre: 'nombre', etiqueta: 'Nombre' },
]

const CAMPOS_NUMERICOS = [
  { nombre: 'stock', etiqueta: 'Stock' },
  { nombre: 'precioResidencial', etiqueta: 'Precio residencial' },
  { nombre: 'precioComercial', etiqueta: 'Precio comercial' },
]

export default function FormularioProducto({
  datos,
  estaEditando,
  mensaje,
  onChange,
  onSubmit,
  onCancelar,
}) {
  return (
    <Card className="shadow-sm position-sticky formulario-administracion">
      <Card.Body>
        <h2 className="h4">{estaEditando ? 'Editar producto' : 'Nuevo producto'}</h2>
        <p className="text-secondary small">
          Los cambios se guardan localmente en este navegador para la demostración de EP2.
        </p>
        {mensaje && <Alert variant={mensaje.tipo}>{mensaje.texto}</Alert>}
        <Form onSubmit={onSubmit}>
          {CAMPOS_TEXTO.map((campo) => (
            <Form.Group className="mb-3" controlId={campo.nombre} key={campo.nombre}>
              <Form.Label>{campo.etiqueta}</Form.Label>
              <Form.Control name={campo.nombre} value={datos[campo.nombre]} onChange={onChange} required />
            </Form.Group>
          ))}
          <Form.Group className="mb-3" controlId="descripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={datos.descripcion}
              onChange={onChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="unidad">
            <Form.Label>Unidad</Form.Label>
            <Form.Control name="unidad" value={datos.unidad} onChange={onChange} required />
          </Form.Group>
          <Row>
            {CAMPOS_NUMERICOS.map((campo) => (
              <Col xs={12} sm={campo.nombre === 'stock' ? 12 : 6} key={campo.nombre}>
                <Form.Group className="mb-3" controlId={campo.nombre}>
                  <Form.Label>{campo.etiqueta}</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="1"
                    name={campo.nombre}
                    value={datos[campo.nombre]}
                    onChange={onChange}
                    required
                  />
                </Form.Group>
              </Col>
            ))}
          </Row>
          <div className="d-flex flex-wrap gap-2">
            <Button type="submit">{estaEditando ? 'Guardar cambios' : 'Agregar'}</Button>
            {estaEditando && (
              <Button variant="outline-secondary" onClick={onCancelar}>Cancelar</Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}
