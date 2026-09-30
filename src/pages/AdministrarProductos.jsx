import { useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap'
import { useProductos } from '../hooks/useProductos'
import imagenAccesorio from '../assets/productos/accesorio.svg'

const PRODUCTO_VACIO = {
  codigo: '',
  categoria: '',
  nombre: '',
  descripcion: '',
  unidad: 'Unidad',
  precioResidencial: 0,
  precioComercial: 0,
  stock: 0,
  imagen: imagenAccesorio,
}

function prepararNumeros(producto) {
  return {
    ...producto,
    precioResidencial: Number(producto.precioResidencial),
    precioComercial: Number(producto.precioComercial),
    stock: Number(producto.stock),
  }
}

export default function AdministrarProductos() {
  const {
    productos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    restaurarProductos,
  } = useProductos()
  const [formulario, setFormulario] = useState(PRODUCTO_VACIO)
  const [codigoOriginal, setCodigoOriginal] = useState(null)
  const [mensaje, setMensaje] = useState(null)

  const estaEditando = codigoOriginal !== null

  function cambiarCampo(evento) {
    const { name, value } = evento.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
  }

  function limpiarFormulario() {
    setFormulario(PRODUCTO_VACIO)
    setCodigoOriginal(null)
  }

  function guardar(evento) {
    evento.preventDefault()

    try {
      const datos = prepararNumeros(formulario)
      if (estaEditando) {
        actualizarProducto(codigoOriginal, datos)
        setMensaje({ tipo: 'success', texto: 'Producto actualizado correctamente.' })
      } else {
        crearProducto(datos)
        setMensaje({ tipo: 'success', texto: 'Producto agregado correctamente.' })
      }
      limpiarFormulario()
    } catch (error) {
      setMensaje({ tipo: 'danger', texto: error.message })
    }
  }

  function editar(producto) {
    setFormulario({ ...producto, imagen: producto.imagen ?? '' })
    setCodigoOriginal(producto.codigo)
    setMensaje(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function eliminar(codigo) {
    if (!window.confirm(`¿Eliminar el producto ${codigo}?`)) return

    eliminarProducto(codigo)
    setMensaje({ tipo: 'success', texto: 'Producto eliminado correctamente.' })
    if (codigoOriginal === codigo) limpiarFormulario()
  }

  function restaurar() {
    if (!window.confirm('¿Restaurar el catálogo original del caso?')) return

    restaurarProductos()
    limpiarFormulario()
    setMensaje({ tipo: 'success', texto: 'Catálogo original restaurado.' })
  }

  return (
    <Container className="py-5">
      <Row className="g-4">
        <Col lg={4}>
          <Card className="shadow-sm position-sticky formulario-administracion">
            <Card.Body>
              <h1 className="h4">{estaEditando ? 'Editar producto' : 'Nuevo producto'}</h1>
              <p className="text-secondary small">
                Los cambios se guardan localmente en este navegador para la demostración de EP2.
              </p>
              {mensaje && <Alert variant={mensaje.tipo}>{mensaje.texto}</Alert>}
              <Form onSubmit={guardar}>
                <Form.Group className="mb-3" controlId="codigo">
                  <Form.Label>Código</Form.Label>
                  <Form.Control name="codigo" value={formulario.codigo} onChange={cambiarCampo} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="categoria">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Control name="categoria" value={formulario.categoria} onChange={cambiarCampo} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="nombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control name="nombre" value={formulario.nombre} onChange={cambiarCampo} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="descripcion">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control as="textarea" rows={3} name="descripcion" value={formulario.descripcion} onChange={cambiarCampo} required />
                </Form.Group>
                <Row>
                  <Col xs={6}>
                    <Form.Group className="mb-3" controlId="unidad">
                      <Form.Label>Unidad</Form.Label>
                      <Form.Control name="unidad" value={formulario.unidad} onChange={cambiarCampo} required />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group className="mb-3" controlId="stock">
                      <Form.Label>Stock</Form.Label>
                      <Form.Control type="number" min="0" name="stock" value={formulario.stock} onChange={cambiarCampo} required />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <Form.Group className="mb-3" controlId="precioResidencial">
                      <Form.Label>Precio residencial</Form.Label>
                      <Form.Control type="number" min="0" name="precioResidencial" value={formulario.precioResidencial} onChange={cambiarCampo} required />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group className="mb-3" controlId="precioComercial">
                      <Form.Label>Precio comercial</Form.Label>
                      <Form.Control type="number" min="0" name="precioComercial" value={formulario.precioComercial} onChange={cambiarCampo} required />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex gap-2">
                  <Button type="submit">{estaEditando ? 'Guardar cambios' : 'Agregar'}</Button>
                  {estaEditando && <Button variant="outline-secondary" onClick={limpiarFormulario}>Cancelar</Button>}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h2 className="h3 mb-1">Administración de productos</h2>
              <span className="text-secondary">{productos.length} productos registrados</span>
            </div>
            <Button variant="outline-secondary" onClick={restaurar}>Restaurar catálogo</Button>
          </div>
          <div className="table-responsive bg-white shadow-sm rounded">
            <Table hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.codigo}>
                    <td>{producto.codigo}</td>
                    <td><strong>{producto.nombre}</strong><br /><small className="text-secondary">{producto.categoria}</small></td>
                    <td>{producto.stock}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button size="sm" variant="outline-primary" onClick={() => editar(producto)}>Editar</Button>
                        <Button size="sm" variant="outline-danger" onClick={() => eliminar(producto.codigo)}>Eliminar</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
