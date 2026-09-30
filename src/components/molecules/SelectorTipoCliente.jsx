import { Form } from 'react-bootstrap'

export default function SelectorTipoCliente({ valor, alCambiar }) {
  return (
    <Form.Group className="mb-4" controlId="tipo-cliente">
      <Form.Label>Tipo de cliente</Form.Label>
      <Form.Select
        id="tipo-cliente"
        value={valor}
        onChange={(evento) => alCambiar(evento.target.value)}
      >
        <option value="residencial">Residencial</option>
        <option value="comercial">Comercial</option>
      </Form.Select>
    </Form.Group>
  )
}
