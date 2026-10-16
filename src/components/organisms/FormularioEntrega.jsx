import { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import BotonAccion from '../atoms/BotonAccion'
import CampoFormulario from '../molecules/CampoFormulario'
import { validarEntrega } from '../../utils/validarEntrega'

const ENTREGA_VACIA = { nombre: '', apellidos: '', correo: '', direccion: '', zonaId: '' }

// datosIniciales (opcional) llega desde la página cuando hay una cuenta con sesión.
export default function FormularioEntrega({ zonas, alPreparar, datosIniciales }) {
  const [datos, setDatos] = useState(() => ({ ...ENTREGA_VACIA, ...datosIniciales }))
  const [errores, setErrores] = useState({})

  function cambiar(campo, valor) {
    const siguientes = { ...datos, [campo]: valor }
    setDatos(siguientes)
    if (Object.keys(errores).length > 0) setErrores(validarEntrega(siguientes, zonas))
  }

  function enviar(evento) {
    evento.preventDefault()
    const nuevosErrores = validarEntrega(datos, zonas)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return
    alPreparar({
      cliente: {
        nombre: `${datos.nombre.trim()} ${datos.apellidos.trim()}`,
        apellidos: datos.apellidos.trim(), correo: datos.correo.trim(),
        direccion: datos.direccion.trim(),
      },
      zona: zonas.find((zona) => zona.id === datos.zonaId),
    })
  }

  return (
    <Form noValidate onSubmit={enviar}>
      <Row className="g-3">
        <Col md={6}>
          <CampoFormulario identificador="entrega-nombre" etiqueta="Nombre" autoComplete="given-name"
            value={datos.nombre} onChange={(evento) => cambiar('nombre', evento.target.value)} error={errores.nombre} />
        </Col>
        <Col md={6}>
          <CampoFormulario identificador="entrega-apellidos" etiqueta="Apellidos" autoComplete="family-name"
            value={datos.apellidos} onChange={(evento) => cambiar('apellidos', evento.target.value)} error={errores.apellidos} />
        </Col>
      </Row>
      <CampoFormulario identificador="entrega-correo" etiqueta="Correo" tipo="email" autoComplete="email"
        value={datos.correo} onChange={(evento) => cambiar('correo', evento.target.value)} error={errores.correo} />
      <CampoFormulario identificador="entrega-direccion" etiqueta="Dirección de entrega" autoComplete="street-address"
        value={datos.direccion} onChange={(evento) => cambiar('direccion', evento.target.value)} error={errores.direccion} />
      <Form.Group className="mb-3" controlId="entrega-zona">
        <Form.Label>Zona de despacho</Form.Label>
        <Form.Select value={datos.zonaId} onChange={(evento) => cambiar('zonaId', evento.target.value)}
          isInvalid={Boolean(errores.zonaId)} aria-invalid={Boolean(errores.zonaId)}
          aria-describedby={errores.zonaId ? 'entrega-zona-error' : undefined}>
          <option value="">Selecciona una zona</option>
          {zonas.map((zona) => <option key={zona.id} value={zona.id}>{zona.nombre} · {zona.tiempoEstimado}</option>)}
        </Form.Select>
        <Form.Control.Feedback id="entrega-zona-error" type="invalid">{errores.zonaId}</Form.Control.Feedback>
      </Form.Group>
      <BotonAccion tipo="submit" variante="danger">Revisar pedido</BotonAccion>
    </Form>
  )
}
