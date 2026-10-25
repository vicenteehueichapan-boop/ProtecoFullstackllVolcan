import { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import BotonAccion from '../atoms/BotonAccion'
import CampoFormulario from '../molecules/CampoFormulario'
import { validarDatosCliente } from '../../utils/validaciones'

// Crea o edita una cuenta de cliente desde administración (sin contraseña: en EP2 no se
// guardan). Al editar, RUN y correo quedan fijos porque identifican la cuenta.
export default function FormularioCliente({ cliente, alGuardar }) {
  const editando = Boolean(cliente)
  const [datos, setDatos] = useState({
    nombre: cliente?.nombre ?? '',
    apellidos: cliente?.apellidos ?? '',
    run: cliente?.run ?? '',
    correo: cliente?.correo ?? '',
    tipoCliente: cliente?.tipoCliente ?? 'residencial',
    activo: cliente?.activo ?? true,
  })
  const [errores, setErrores] = useState({})

  function cambiar(campo, valor) {
    const siguientes = { ...datos, [campo]: valor }
    setDatos(siguientes)
    if (Object.keys(errores).length > 0) setErrores(validarDatosCliente(siguientes))
  }

  function enviar(evento) {
    evento.preventDefault()
    const nuevosErrores = validarDatosCliente(datos)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length === 0) setErrores(alGuardar(datos) ?? {})
  }

  return (
    <Form noValidate onSubmit={enviar}>
      <Row className="gx-md-3">
        <Col md={6}>
          <CampoFormulario identificador="cliente-nombre" etiqueta="Nombre" value={datos.nombre}
            onChange={(evento) => cambiar('nombre', evento.target.value)} error={errores.nombre} />
        </Col>
        <Col md={6}>
          <CampoFormulario identificador="cliente-apellidos" etiqueta="Apellidos" value={datos.apellidos}
            onChange={(evento) => cambiar('apellidos', evento.target.value)} error={errores.apellidos} />
        </Col>
      </Row>
      <CampoFormulario identificador="cliente-run" etiqueta="RUN sin puntos ni guion" value={datos.run}
        onChange={(evento) => cambiar('run', evento.target.value)} error={errores.run} disabled={editando} />
      <CampoFormulario identificador="cliente-correo" etiqueta="Correo" tipo="email" value={datos.correo}
        onChange={(evento) => cambiar('correo', evento.target.value)} error={errores.correo} disabled={editando} />
      <Form.Group className="mb-3" controlId="cliente-tipo">
        <Form.Label>Tipo de cliente</Form.Label>
        <Form.Select value={datos.tipoCliente} onChange={(evento) => cambiar('tipoCliente', evento.target.value)}>
          <option value="residencial">Residencial</option>
          <option value="comercial">Comercial</option>
        </Form.Select>
      </Form.Group>
      {editando && (
        <Form.Check className="mb-3" type="switch" id="cliente-activo" label="Cuenta activa"
          checked={datos.activo} onChange={(evento) => cambiar('activo', evento.target.checked)} />
      )}
      <BotonAccion tipo="submit">{editando ? 'Guardar cambios' : 'Crear cuenta'}</BotonAccion>
    </Form>
  )
}
