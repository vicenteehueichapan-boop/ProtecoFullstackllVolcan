import { useState } from 'react'
import { Alert, Form } from 'react-bootstrap'
import BotonAccion from '../atoms/BotonAccion'
import CampoFormulario from '../molecules/CampoFormulario'

const datosVacios = {
  nombre: '',
  run: '',
  correo: '',
  clave: '',
  confirmarClave: '',
  tipoCliente: 'residencial',
}

function validar(datos) {
  const errores = {}
  if (datos.nombre.trim().length < 3) errores.nombre = 'Ingresa tu nombre completo.'
  if (!/^\d{7,8}[0-9kK]$/.test(datos.run)) errores.run = 'Ingresa el RUN sin puntos ni guion.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) errores.correo = 'Ingresa un correo válido.'
  if (datos.clave.length < 6) errores.clave = 'La contraseña debe tener al menos 6 caracteres.'
  if (datos.confirmarClave !== datos.clave) errores.confirmarClave = 'Las contraseñas deben coincidir.'
  return errores
}

export default function FormularioRegistro() {
  const [datos, setDatos] = useState(datosVacios)
  const [errores, setErrores] = useState({})
  const [registrado, setRegistrado] = useState(false)

  function cambiar(campo, valor) {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }))
    setRegistrado(false)
    // Si ya se intentó enviar, actualiza las indicaciones mientras se corrige.
    if (Object.keys(errores).length > 0) {
      setErrores(validar({ ...datos, [campo]: valor }))
    }
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    const nuevosErrores = validar(datos)
    setErrores(nuevosErrores)
    setRegistrado(Object.keys(nuevosErrores).length === 0)
  }

  return (
    <Form noValidate onSubmit={manejarEnvio}>
      {registrado && (
        <Alert variant="success">
          Datos válidos. El registro real se conectará al backend en una etapa posterior.
        </Alert>
      )}
      <CampoFormulario
        identificador="nombre-registro"
        etiqueta="Nombre completo"
        value={datos.nombre}
        onChange={(evento) => cambiar('nombre', evento.target.value)}
        error={errores.nombre}
        autoComplete="name"
      />
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
