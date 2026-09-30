import { Form } from 'react-bootstrap'
import CampoEntrada from '../atoms/CampoEntrada'

export default function CampoFormulario({ identificador, etiqueta, error, ...propiedades }) {
  return (
    <Form.Group className="mb-3" controlId={identificador}>
      <Form.Label>{etiqueta}</Form.Label>
      <CampoEntrada isInvalid={Boolean(error)} {...propiedades} />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  )
}
