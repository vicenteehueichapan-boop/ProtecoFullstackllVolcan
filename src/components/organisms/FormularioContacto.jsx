import { useState } from 'react'
import { Form } from 'react-bootstrap'
import BotonAccion from '../atoms/BotonAccion'
import CampoFormulario from '../molecules/CampoFormulario'
import { LARGO_MAXIMO_MENSAJE, MOTIVOS_CONTACTO, validarContacto } from '../../utils/validarContacto'

const VACIO = { nombre: '', correo: '', motivo: '', mensaje: '' }

// El formulario es dueño de sus campos y errores; avisa a la página solo con datos válidos.
export default function FormularioContacto({ alEnviar, datosIniciales }) {
  const [datos, setDatos] = useState(() => ({ ...VACIO, ...datosIniciales }))
  const [errores, setErrores] = useState({})

  function cambiar(campo, valor) {
    const siguientes = { ...datos, [campo]: valor }
    setDatos(siguientes)
    if (Object.keys(errores).length > 0) setErrores(validarContacto(siguientes))
  }

  function enviar(evento) {
    evento.preventDefault()
    const nuevosErrores = validarContacto(datos)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length === 0) setErrores(alEnviar(datos) ?? {})
  }

  return (
    <Form noValidate onSubmit={enviar}>
      <CampoFormulario identificador="contacto-nombre" etiqueta="Nombre" autoComplete="name"
        value={datos.nombre} onChange={(evento) => cambiar('nombre', evento.target.value)} error={errores.nombre} />
      <CampoFormulario identificador="contacto-correo" etiqueta="Correo para responderte" tipo="email" autoComplete="email"
        value={datos.correo} onChange={(evento) => cambiar('correo', evento.target.value)} error={errores.correo} />
      <Form.Group className="mb-3" controlId="contacto-motivo">
        <Form.Label>Motivo</Form.Label>
        <Form.Select value={datos.motivo} onChange={(evento) => cambiar('motivo', evento.target.value)}
          isInvalid={Boolean(errores.motivo)} aria-invalid={Boolean(errores.motivo)}
          aria-describedby={errores.motivo ? 'contacto-motivo-error' : undefined}>
          <option value="">Selecciona un motivo</option>
          {MOTIVOS_CONTACTO.map((motivo) => <option key={motivo} value={motivo}>{motivo}</option>)}
        </Form.Select>
        <Form.Control.Feedback id="contacto-motivo-error" type="invalid">{errores.motivo}</Form.Control.Feedback>
      </Form.Group>
      <CampoFormulario identificador="contacto-mensaje" etiqueta="Mensaje" as="textarea" rows={4}
        maxLength={LARGO_MAXIMO_MENSAJE}
        value={datos.mensaje} onChange={(evento) => cambiar('mensaje', evento.target.value)} error={errores.mensaje} />
      <p className="small text-secondary mt-n2">{datos.mensaje.length} de {LARGO_MAXIMO_MENSAJE} caracteres</p>
      <BotonAccion tipo="submit" variante="danger">Enviar mensaje</BotonAccion>
    </Form>
  )
}
