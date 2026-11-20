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
    apellidos: perfil?.apellidos ?? '',
    contrasena: '',
    correo: perfil?.correo ?? '',
    rol: perfil?.rol ?? '',
    activo: perfil?.activo ?? true,
  })
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)

  function cambiar(campo, valor) {
    const siguientes = { ...datos, [campo]: valor }
    setDatos(siguientes)
    if (Object.keys(errores).length > 0) setErrores(validarPerfilPersonal(siguientes))
  }

  async function enviar(evento) {
    evento.preventDefault()
    if (enviando) return
    const nuevosErrores = validarPerfilPersonal(datos)
    if (datos.apellidos.trim().length < 2) nuevosErrores.apellidos = "Ingresa los apellidos."
    if (!editando && datos.contrasena.length < 8) nuevosErrores.contrasena = "Usa al menos 8 caracteres."
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length === 0) {
      setEnviando(true)
      try { setErrores(await alGuardar(datos) ?? {}) } finally { setEnviando(false) }
    }
  }

  return (
    <Form aria-busy={enviando} noValidate onSubmit={enviar}>
      <CampoFormulario identificador="personal-nombre" etiqueta="Nombre" value={datos.nombre}
        onChange={(evento) => cambiar('nombre', evento.target.value)} error={errores.nombre} />
      <CampoFormulario identificador="personal-correo" etiqueta="Correo" tipo="email" value={datos.correo}
        onChange={(evento) => cambiar('correo', evento.target.value)} error={errores.correo} disabled={editando} />
      <CampoFormulario identificador="personal-apellidos" etiqueta="Apellidos" value={datos.apellidos}
        onChange={(evento) => cambiar('apellidos', evento.target.value)} error={errores.apellidos} />
      {!editando && <CampoFormulario identificador="personal-contrasena" etiqueta="Contraseña inicial" tipo="password" value={datos.contrasena}
        onChange={(evento) => cambiar('contrasena', evento.target.value)} error={errores.contrasena} autoComplete="new-password" />}
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
      <BotonAccion disabled={enviando} tipo="submit">{editando ? 'Guardar cambios' : 'Crear perfil'}</BotonAccion>
    </Form>
  )
}
