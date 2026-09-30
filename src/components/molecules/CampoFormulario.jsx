import { Form } from 'react-bootstrap'
import CampoEntrada from '../atoms/CampoEntrada'

export default function CampoFormulario({ identificador, etiqueta, error, ...propiedades }) {
  return (
    <Form.Group className="mb-3" controlId={identificador}>
      <Form.Label>{etiqueta}</Form.Label>
      <CampoEntrada
        isInvalid={Boolean(error)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${identificador}-error` : undefined}
        {...propiedades}
      />
      <Form.Control.Feedback id={`${identificador}-error`} type="invalid">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  )
}
