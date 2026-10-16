import { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import BotonAccion from '../atoms/BotonAccion'
import CampoFormulario from '../molecules/CampoFormulario'
import { validarRegistro } from '../../utils/validaciones'

const datosVacios = {
  nombre: '',
  apellidos: '',
  run: '',
  correo: '',
  clave: '',
  confirmarClave: '',
  tipoCliente: 'residencial',
}

// El formulario es dueño de los campos y de sus errores. Solo avisa a la página
// (alRegistrar) cuando todo es válido; la página decide qué pasa después.
export default function FormularioRegistro({ alRegistrar }) {
  const [datos, setDatos] = useState(datosVacios)
  const [errores, setErrores] = useState({})

  function cambiar(campo, valor) {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }))
    // Si ya se intentó enviar, actualiza las indicaciones mientras se corrige.
    if (Object.keys(errores).length > 0) {
      setErrores(validarRegistro({ ...datos, [campo]: valor }))
    }
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    const nuevosErrores = validarRegistro(datos)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length === 0) {
      // La contraseña no se entrega: en EP2 solo se valida su formato.
      const { nombre, apellidos, run, correo, tipoCliente } = datos
      alRegistrar({ nombre, apellidos, run, correo, tipoCliente })
    }
  }

  return (
    <Form noValidate onSubmit={manejarEnvio}>
      <Row className="gx-md-3">
        <Col md={6}>
          <CampoFormulario
            identificador="nombre-registro"
            etiqueta="Nombre"
            value={datos.nombre}
            onChange={(evento) => cambiar('nombre', evento.target.value)}
            error={errores.nombre}
            autoComplete="given-name"
          />
        </Col>
        <Col md={6}>
          <CampoFormulario
            identificador="apellidos-registro"
            etiqueta="Apellidos"
            value={datos.apellidos}
            onChange={(evento) => cambiar('apellidos', evento.target.value)}
            error={errores.apellidos}
            autoComplete="family-name"
          />
        </Col>
      </Row>
      <CampoFormulario
        identificador="run-registro"
        etiqueta="RUN sin puntos ni guion"
        value={datos.run}
        onChange={(evento) => cambiar('run', evento.target.value)}
        error={errores.run}
      />
      <CampoFormulario
        identificador="correo-registro"
        etiqueta="Correo"
        tipo="email"
        value={datos.correo}
        onChange={(evento) => cambiar('correo', evento.target.value)}
        error={errores.correo}
        autoComplete="email"
      />
      <Form.Group className="mb-3" controlId="tipo-cliente-registro">
        <Form.Label>Tipo de cliente</Form.Label>
        <Form.Select value={datos.tipoCliente} onChange={(evento) => cambiar('tipoCliente', evento.target.value)}>
          <option value="residencial">Residencial</option>
          <option value="comercial">Comercial</option>
        </Form.Select>
      </Form.Group>
      <CampoFormulario
        identificador="clave-registro"
        etiqueta="Contraseña"
        tipo="password"
        value={datos.clave}
        onChange={(evento) => cambiar('clave', evento.target.value)}
        error={errores.clave}
        autoComplete="new-password"
      />
      <CampoFormulario
        identificador="confirmar-clave"
        etiqueta="Confirmar contraseña"
        tipo="password"
        value={datos.confirmarClave}
        onChange={(evento) => cambiar('confirmarClave', evento.target.value)}
        error={errores.confirmarClave}
        autoComplete="new-password"
      />
      <BotonAccion tipo="submit" className="w-100">Registrarme</BotonAccion>
    </Form>
  )
}
