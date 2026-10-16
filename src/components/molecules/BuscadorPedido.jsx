import { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import BotonAccion from '../atoms/BotonAccion'
import CampoEntrada from '../atoms/CampoEntrada'

// Pide el número y el correo del pedido. El correo puede quedar vacío si la persona
// tiene sesión: la página decide si puede mostrar el pedido.
export default function BuscadorPedido({ identificadorInicial, correoInicial = '', alBuscar }) {
  const [consulta, setConsulta] = useState(identificadorInicial)
  const [correo, setCorreo] = useState(correoInicial)

  function buscar(evento) {
    evento.preventDefault()
    const identificador = consulta.trim().toUpperCase()
    if (identificador) alBuscar({ identificador, correo: correo.trim() })
  }

  return (
    <Form className="my-4" onSubmit={buscar}>
      <Row className="g-2 align-items-end">
        <Col md={5}>
          <Form.Label htmlFor="buscar-numero">Número del pedido</Form.Label>
          <CampoEntrada
            id="buscar-numero"
            placeholder="Ejemplo: PED-0001"
            value={consulta}
            onChange={(evento) => setConsulta(evento.target.value)}
          />
        </Col>
        <Col md={5}>
          <Form.Label htmlFor="buscar-correo">Correo usado en el pedido</Form.Label>
          <CampoEntrada
            id="buscar-correo"
            tipo="email"
            autoComplete="email"
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
          />
        </Col>
        <Col md={2}>
          <BotonAccion tipo="submit" variante="danger" className="w-100">Buscar</BotonAccion>
        </Col>
      </Row>
    </Form>
  )
}
