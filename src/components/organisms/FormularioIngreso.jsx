import { useState } from 'react'
import { Form } from 'react-bootstrap'
import BotonAccion from '../atoms/BotonAccion'
import CampoFormulario from '../molecules/CampoFormulario'

function validar(correo, clave) {
  const errores = {}

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    errores.correo = 'Ingresa un correo válido.'
  }

  if (clave.length < 4) {
    errores.clave = 'La contraseña debe tener al menos 4 caracteres.'
  }

  return errores
}

export default function FormularioIngreso({ alIngresar }) {
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [errores, setErrores] = useState({})

  function manejarEnvio(evento) {
    evento.preventDefault()
    const nuevosErrores = validar(correo, clave)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length === 0) {
      alIngresar({ correo, clave })
    }
  }

  return (
    <Form noValidate onSubmit={manejarEnvio}>
      <CampoFormulario
        identificador="correo"
        etiqueta="Correo institucional"
        tipo="email"
        value={correo}
        onChange={(evento) => setCorreo(evento.target.value)}
        error={errores.correo}
        autoComplete="email"
      />
      <CampoFormulario
        identificador="clave"
        etiqueta="Contraseña"
        tipo="password"
        value={clave}
        onChange={(evento) => setClave(evento.target.value)}
        error={errores.clave}
        autoComplete="current-password"
      />
      <BotonAccion tipo="submit" variante="primary" className="w-100">
        Ingresar
      </BotonAccion>
    </Form>
  )
}
