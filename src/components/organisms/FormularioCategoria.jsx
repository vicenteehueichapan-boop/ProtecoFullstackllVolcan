import { useState } from 'react'
import { Form } from 'react-bootstrap'
import BotonAccion from '../atoms/BotonAccion'
import CampoFormulario from '../molecules/CampoFormulario'
import { validarCategoria } from '../../utils/validarCategoria'

// Crea o edita una categoría. Es dueño de sus campos y errores; la página decide qué guardar.
// Si la página responde con errores del servicio (nombre repetido), se muestran junto al campo.
export default function FormularioCategoria({ categoria, alGuardar, alCancelar }) {
  const editando = Boolean(categoria)
  const [datos, setDatos] = useState({ nombre: categoria?.nombre ?? '', descripcion: categoria?.descripcion ?? '' })
  const [errores, setErrores] = useState({})

  function cambiar(campo, valor) {
    const siguientes = { ...datos, [campo]: valor }
    setDatos(siguientes)
    if (Object.keys(errores).length > 0) setErrores(validarCategoria(siguientes))
  }

  function enviar(evento) {
    evento.preventDefault()
    const nuevosErrores = validarCategoria(datos)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length === 0) setErrores(alGuardar(datos) ?? {})
  }

  return (
    <Form noValidate onSubmit={enviar}>
      <h2 className="h5">{editando ? `Editar «${categoria.nombre}»` : 'Nueva categoría'}</h2>
      <CampoFormulario identificador="categoria-nombre" etiqueta="Nombre" value={datos.nombre}
        onChange={(evento) => cambiar('nombre', evento.target.value)} error={errores.nombre} />
      <CampoFormulario identificador="categoria-descripcion" etiqueta="Descripción (opcional)" as="textarea" rows={2}
        value={datos.descripcion} onChange={(evento) => cambiar('descripcion', evento.target.value)} error={errores.descripcion} />
      <div className="d-flex flex-wrap gap-2">
        <BotonAccion tipo="submit">{editando ? 'Guardar cambios' : 'Crear categoría'}</BotonAccion>
        {editando && <BotonAccion variante="outline-secondary" onClick={alCancelar}>Cancelar</BotonAccion>}
      </div>
    </Form>
  )
}
