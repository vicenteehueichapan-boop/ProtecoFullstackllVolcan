import { Form } from 'react-bootstrap'

export default function CampoEntrada({ tipo = 'text', ...propiedades }) {
  return <Form.Control type={tipo} {...propiedades} />
}
