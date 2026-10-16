import { useState } from 'react'
import { Alert, Button, Card, Col, Row, Table } from 'react-bootstrap'
import FormularioCategoria from '../components/organisms/FormularioCategoria'
import { useProductos } from '../hooks/useProductos'
import { useTituloPagina } from '../hooks/useTituloPagina'

// Categorías: nueva y editar (Guía 16). Renombrar actualiza los productos de esa categoría.
export default function AdministrarCategorias() {
  useTituloPagina('Categorías')
  const { productos, categorias, crearCategoria, renombrarCategoria } = useProductos()
  const [editando, setEditando] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  // Cada creación cambia la clave del formulario para que vuelva a quedar vacío.
  const [creadas, setCreadas] = useState(0)

  // Devuelve { campo: mensaje } si el servicio rechaza el dato, para mostrarlo en el formulario.
  function guardar(datos) {
    try {
      if (editando) {
        const editada = renombrarCategoria(editando.nombre, datos)
        setMensaje(`Categoría «${editada.nombre}» actualizada en la lista y en sus productos.`)
        setEditando(null)
      } else {
        const creada = crearCategoria(datos)
        setMensaje(`Categoría «${creada.nombre}» creada. Ya puedes asignarla a productos.`)
        setCreadas((cantidad) => cantidad + 1)
      }
      return {}
    } catch (excepcion) {
      return { [excepcion.campo ?? 'nombre']: excepcion.message }
    }
  }

  return (
    <section>
      <h1>Categorías</h1>
      <p className="text-secondary">Ordenan el catálogo. Cada producto pertenece a una categoría registrada.</p>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      <Row className="g-4">
        <Col xl={5}>
          <Card>
            <Card.Body>
              {/* La clave reinicia el formulario al crear, o al cambiar entre crear y editar. */}
              <FormularioCategoria
                key={editando?.nombre ?? `nueva-${creadas}`}
                categoria={editando}
                alGuardar={guardar}
                alCancelar={() => setEditando(null)}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={7}>
          <div className="table-responsive bg-white shadow-sm rounded">
            <Table className="mb-0 align-middle">
              <caption className="visually-hidden">Categorías registradas</caption>
              <thead>
                <tr><th>Categoría</th><th className="text-end">Productos</th><th><span className="visually-hidden">Acciones</span></th></tr>
              </thead>
              <tbody>
                {categorias.map((categoria) => (
                  <tr key={categoria.nombre}>
                    <td>
                      <strong>{categoria.nombre}</strong>
                      {categoria.descripcion && <div className="small text-secondary">{categoria.descripcion}</div>}
                    </td>
                    <td className="text-end">{productos.filter((producto) => producto.categoria === categoria.nombre).length}</td>
                    <td className="text-end">
                      <Button size="sm" variant="outline-primary" onClick={() => { setEditando(categoria); setMensaje(null) }}
                        aria-label={`Editar ${categoria.nombre}`}>
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </section>
  )
}
