import { useState } from 'react'
import { Button, Col, Container, Modal, Row, Table } from 'react-bootstrap'
import FormularioProducto from '../components/organisms/FormularioProducto'
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
  const [confirmacion, setConfirmacion] = useState(null)

  const estaEditando = codigoOriginal !== null

  function cambiarCampo(evento) {
    const { name, value } = evento.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
    setMensaje(null)
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

  function confirmarAccion() {
    try {
      if (confirmacion.tipo === 'eliminar') {
        eliminarProducto(confirmacion.codigo)
        if (codigoOriginal === confirmacion.codigo) limpiarFormulario()
        setMensaje({ tipo: 'success', texto: 'Producto eliminado correctamente.' })
      } else {
        restaurarProductos()
        limpiarFormulario()
        setMensaje({ tipo: 'success', texto: 'Catálogo original restaurado.' })
      }
    } catch (error) {
      setMensaje({ tipo: 'danger', texto: error.message })
    }
    setConfirmacion(null)
  }

  return (
    <Container className="py-5">
      <Row className="g-4">
        <Col lg={4}>
          <FormularioProducto
            datos={formulario}
            estaEditando={estaEditando}
            mensaje={mensaje}
            onChange={cambiarCampo}
            onSubmit={guardar}
            onCancelar={limpiarFormulario}
          />
        </Col>
        <Col lg={8}>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h1 className="h3 mb-1">Administración de productos</h1>
              <span className="text-secondary">{productos.length} productos registrados</span>
            </div>
            <Button variant="outline-secondary" onClick={() => setConfirmacion({ tipo: 'restaurar' })}>Restaurar catálogo</Button>
          </div>
          <div className="table-responsive bg-white shadow-sm rounded">
            <Table hover className="mb-0 align-middle">
              <caption className="visually-hidden">Productos registrados y acciones de administración</caption>
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
                        <Button size="sm" variant="outline-danger" onClick={() => setConfirmacion({ tipo: 'eliminar', codigo: producto.codigo })}>Eliminar</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <Modal show={confirmacion !== null} onHide={() => setConfirmacion(null)} centered aria-labelledby="titulo-confirmacion-productos">
        <Modal.Header closeButton closeLabel="Cerrar">
          <Modal.Title id="titulo-confirmacion-productos">
            {confirmacion?.tipo === 'eliminar' ? 'Eliminar producto' : 'Restaurar catálogo'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmacion?.tipo === 'eliminar'
            ? `¿Eliminar el producto ${confirmacion.codigo}? Dejará de aparecer en el catálogo.`
            : '¿Restaurar el catálogo original del caso? Se reemplazarán los cambios guardados en este navegador.'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setConfirmacion(null)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmarAccion}>Confirmar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
