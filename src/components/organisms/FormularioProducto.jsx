import { useState } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import BotonAccion from '../atoms/BotonAccion'
import CampoFormulario from '../molecules/CampoFormulario'
import { validarProducto } from '../../utils/validarProducto'

const VACIO = {
  codigo: '', categoria: '', nombre: '', descripcion: '', unidad: 'Unidad',
  precioResidencial: '', precioComercial: '', stock: '', destacado: false,
}

const CAMPOS_NUMERICOS = [
  { campo: 'precioResidencial', etiqueta: 'Precio residencial' },
  { campo: 'precioComercial', etiqueta: 'Precio comercial' },
  { campo: 'stock', etiqueta: 'Stock' },
]

// Crea o edita un producto (Guía 14): el formulario es dueño de sus campos y errores, valida
// con una regla pura y solo avisa a la página con datos válidos. Si la página responde con
// errores del servicio (por ejemplo, un código repetido), los muestra junto a su campo.
export default function FormularioProducto({ producto, categorias, alGuardar, alCancelar }) {
  const editando = Boolean(producto)
  const [datos, setDatos] = useState(() => ({ ...VACIO, ...producto }))
  const [errores, setErrores] = useState({})

  function cambiar(campo, valor) {
    const siguientes = { ...datos, [campo]: valor }
    setDatos(siguientes)
    if (Object.keys(errores).length > 0) setErrores(validarProducto(siguientes, categorias))
  }

  function enviar(evento) {
    evento.preventDefault()
    const nuevosErrores = validarProducto(datos, categorias)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return
    setErrores(alGuardar({
      ...datos,
      precioResidencial: Number(datos.precioResidencial),
      precioComercial: Number(datos.precioComercial),
      stock: Number(datos.stock),
    }) ?? {})
  }

  return (
    <Card className="shadow-sm position-sticky formulario-administracion">
      <Card.Body>
        <h2 className="h4">{editando ? 'Editar producto' : 'Nuevo producto'}</h2>
        <p className="text-secondary small">Los cambios se guardan en este navegador (datos simulados de EP2).</p>
        <Form noValidate onSubmit={enviar}>
          <CampoFormulario identificador="producto-codigo" etiqueta="Código" value={datos.codigo}
            onChange={(evento) => cambiar('codigo', evento.target.value)} error={errores.codigo} />
          <Form.Group className="mb-3" controlId="producto-categoria">
            <Form.Label>Categoría</Form.Label>
            <Form.Select value={datos.categoria} onChange={(evento) => cambiar('categoria', evento.target.value)}
              isInvalid={Boolean(errores.categoria)} aria-invalid={Boolean(errores.categoria)}
              aria-describedby={errores.categoria ? 'producto-categoria-error' : undefined}>
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.nombre} value={categoria.nombre}>{categoria.nombre}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback id="producto-categoria-error" type="invalid">{errores.categoria}</Form.Control.Feedback>
          </Form.Group>
          <CampoFormulario identificador="producto-nombre" etiqueta="Nombre" value={datos.nombre}
            onChange={(evento) => cambiar('nombre', evento.target.value)} error={errores.nombre} />
          <CampoFormulario identificador="producto-descripcion" etiqueta="Descripción" as="textarea" rows={3}
            value={datos.descripcion} onChange={(evento) => cambiar('descripcion', evento.target.value)} error={errores.descripcion} />
          <CampoFormulario identificador="producto-unidad" etiqueta="Unidad" value={datos.unidad}
            onChange={(evento) => cambiar('unidad', evento.target.value)} error={errores.unidad} />
          <Row className="gx-2">
            {CAMPOS_NUMERICOS.map(({ campo, etiqueta }) => (
              <Col xs={12} sm={campo === 'stock' ? 12 : 6} key={campo}>
                <CampoFormulario identificador={`producto-${campo}`} etiqueta={etiqueta} tipo="number" min="0" step="1"
                  inputMode="numeric" value={datos[campo]} onChange={(evento) => cambiar(campo, evento.target.value)}
                  error={errores[campo]} />
              </Col>
            ))}
          </Row>
          <Form.Check className="mb-3" type="switch" id="producto-destacado" label="Destacar en la tienda"
            checked={datos.destacado} onChange={(evento) => cambiar('destacado', evento.target.checked)} />
          <div className="d-flex flex-wrap gap-2">
            <BotonAccion tipo="submit">{editando ? 'Guardar cambios' : 'Agregar'}</BotonAccion>
            {editando && <BotonAccion variante="outline-secondary" onClick={alCancelar}>Cancelar</BotonAccion>}
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}
