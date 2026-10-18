import { useState } from 'react'
import { Alert, Badge, Button, Col, Modal, Row, Table } from 'react-bootstrap'
import FormularioProducto from '../components/organisms/FormularioProducto'
import { useProductos } from '../hooks/useProductos'
import productosIniciales from '../data/productosIniciales'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { imagenSegunCategoria } from '../utils/imagenSegunCategoria'

export default function AdministrarProductos() {
  useTituloPagina('Administración de productos')
  const {
    productos,
    categorias,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    restaurarProductos,
    incorporarProductosDelCaso,
  } = useProductos()
  // Producto que se está editando (null = crear uno nuevo).
  const [editando, setEditando] = useState(null)
  // Cada guardado cambia la clave del formulario para que vuelva a quedar vacío.
  const [guardados, setGuardados] = useState(0)
  const [mensaje, setMensaje] = useState(null)
  const [confirmacion, setConfirmacion] = useState(null)

  const faltantes = productosIniciales.filter((original) => !productos.some((producto) => producto.codigo === original.codigo))

  function limpiarFormulario() {
    setEditando(null)
    setGuardados((cantidad) => cantidad + 1)
  }

  // El formulario ya validó el formato. Aquí se decide qué guardar: la imagen la elige la
  // página según la categoría (al crear, o si al editar cambió la categoría).
  // Devuelve { campo: mensaje } si el servicio rechaza un dato, para mostrarlo junto al campo.
  function guardar(datos) {
    try {
      if (editando) {
        const imagen = datos.categoria === editando.categoria ? editando.imagen : imagenSegunCategoria(datos.categoria)
        actualizarProducto(editando.codigo, { ...datos, imagen })
        setMensaje({ tipo: 'success', texto: 'Producto actualizado correctamente.' })
      } else {
        crearProducto({ ...datos, imagen: imagenSegunCategoria(datos.categoria) })
        setMensaje({ tipo: 'success', texto: 'Producto agregado correctamente.' })
      }
      limpiarFormulario()
      return {}
    } catch (error) {
      if (error.campo) return { [error.campo]: error.message }
      setMensaje({ tipo: 'danger', texto: error.message })
      return {}
    }
  }

  function editar(producto) {
    setEditando(producto)
    setMensaje(null)
    // Lleva a la persona al formulario, que en pantallas chicas queda arriba de la tabla.
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function confirmarAccion() {
    try {
      if (confirmacion.tipo === 'eliminar') {
        eliminarProducto(confirmacion.codigo)
        if (editando?.codigo === confirmacion.codigo) limpiarFormulario()
        setMensaje({ tipo: 'success', texto: 'Producto eliminado correctamente.' })
      } else if (confirmacion.tipo === 'completar') {
        incorporarProductosDelCaso()
        setMensaje({ tipo: 'success', texto: 'Productos faltantes del Excel incorporados. Se conservaron los productos existentes.' })
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
    <section>
      {mensaje && <Alert variant={mensaje.tipo}>{mensaje.texto}</Alert>}
      <Row className="g-4">
        <Col xl={4}>
          <FormularioProducto
            key={editando?.codigo ?? `nuevo-${guardados}`}
            producto={editando}
            categorias={categorias}
            alGuardar={guardar}
            alCancelar={limpiarFormulario}
          />
        </Col>
        <Col xl={8}>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h1 className="h3 mb-1">Administración de productos</h1>
              <span className="text-secondary">{productos.length} productos registrados</span>
            </div>
            <Button variant="outline-secondary" onClick={() => setConfirmacion({ tipo: 'restaurar' })}>Restaurar catálogo</Button>
            {faltantes.length > 0 && <Button variant="outline-primary" onClick={() => setConfirmacion({ tipo: 'completar' })}>Incorporar {faltantes.length} faltantes del Excel</Button>}
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
                    <td><strong>{producto.nombre}</strong>{producto.destacado && <Badge bg="warning" text="dark" className="ms-2">Destacado</Badge>}<br /><small className="text-secondary">{producto.categoria}</small></td>
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
            {confirmacion?.tipo === 'eliminar' ? 'Eliminar producto' : confirmacion?.tipo === 'completar' ? 'Completar catálogo del Excel' : 'Restaurar catálogo'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmacion?.tipo === 'eliminar'
            ? `¿Eliminar el producto ${confirmacion.codigo}? Dejará de aparecer en el catálogo.`
            : confirmacion?.tipo === 'completar'
              ? `¿Incorporar ${faltantes.length} productos del Excel que no están en el catálogo? Los productos existentes conservarán sus cambios. También se reincorporarán los que hayas eliminado del caso.`
              : '¿Restaurar el catálogo original del caso? Se reemplazarán los cambios guardados en este navegador.'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setConfirmacion(null)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmarAccion}>Confirmar</Button>
        </Modal.Footer>
      </Modal>
    </section>
  )
}
