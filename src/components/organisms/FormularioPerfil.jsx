import { useState } from 'react'
import { Form } from 'react-bootstrap'
import BotonAccion from '../atoms/BotonAccion'
import CampoFormulario from '../molecules/CampoFormulario'

// Edita el nombre visible del perfil propio. El rol y el estado se administran desde
// Usuarios, para que nadie se quite su propio acceso por error desde esta pantalla.
export default function FormularioPerfil({ nombreInicial, alGuardar }) {
  const [nombre, setNombre] = useState(nombreInicial)
  const [error, setError] = useState('')

  function enviar(evento) {
    evento.preventDefault()
    const mensaje = nombre.trim().length < 3 ? 'Ingresa un nombre de al menos 3 caracteres.' : ''
    setError(mensaje)
    if (!mensaje) setError(alGuardar(nombre.trim()) ?? '')
  }

  return (
    <Form noValidate onSubmit={enviar}>
      <CampoFormulario identificador="perfil-nombre" etiqueta="Nombre visible" value={nombre}
        onChange={(evento) => setNombre(evento.target.value)} error={error} />
      <BotonAccion tipo="submit">Guardar nombre</BotonAccion>
    </Form>
  )
}
