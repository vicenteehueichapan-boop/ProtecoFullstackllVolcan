import { useState } from 'react'
import { Form } from 'react-bootstrap'
import BotonAccion from '../atoms/BotonAccion'
import CampoFormulario from '../molecules/CampoFormulario'
import { ROLES, validarPerfilPersonal } from '../../utils/validaciones'

// Crea o edita un perfil del personal. Al editar, el correo queda fijo porque identifica
// el perfil, y aparece el interruptor para activarlo o desactivarlo.
export default function FormularioPersonal({ perfil, alGuardar }) {
  const editando = Boolean(perfil)
  const [datos, setDatos] = useState({
    nombre: perfil?.nombre ?? '',
    correo: perfil?.correo ?? '',
    rol: perfil?.rol ?? '',
    activo: perfil?.activo ?? true,
  })
  const [errores, setErrores] = useState({})

  function cambiar(campo, valor) {
    const siguientes = { ...datos, [campo]: valor }
    setDatos(siguientes)
    if (Object.keys(errores).length > 0) setErrores(validarPerfilPersonal(siguientes))
  }

  function enviar(evento) {
    evento.preventDefault()
    const nuevosErrores = validarPerfilPersonal(datos)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length === 0) setErrores(alGuardar(datos) ?? {})
  }

  return (
    <Form noValidate onSubmit={enviar}>
      <CampoFormulario identificador="personal-nombre" etiqueta="Nombre" value={datos.nombre}
        onChange={(evento) => cambiar('nombre', evento.target.value)} error={errores.nombre} />
      <CampoFormulario identificador="personal-correo" etiqueta="Correo" tipo="email" value={datos.correo}
        onChange={(evento) => cambiar('correo', evento.target.value)} error={errores.correo} disabled={editando} />
      <Form.Group className="mb-3" controlId="personal-rol">
        <Form.Label>Rol</Form.Label>
        <Form.Select value={datos.rol} onChange={(evento) => cambiar('rol', evento.target.value)}
          isInvalid={Boolean(errores.rol)} aria-invalid={Boolean(errores.rol)}
          aria-describedby={errores.rol ? 'personal-rol-error' : undefined}>
          <option value="">Selecciona un rol</option>
          {ROLES.map((rol) => <option key={rol.valor} value={rol.valor}>{rol.texto}</option>)}
        </Form.Select>
        <Form.Control.Feedback id="personal-rol-error" type="invalid">{errores.rol}</Form.Control.Feedback>
      </Form.Group>
      {editando && (
        <Form.Check className="mb-3" type="switch" id="personal-activo" label="Perfil activo"
          checked={datos.activo} onChange={(evento) => cambiar('activo', evento.target.checked)} />
      )}
      <BotonAccion tipo="submit">{editando ? 'Guardar cambios' : 'Crear perfil'}</BotonAccion>
    </Form>
  )
}
