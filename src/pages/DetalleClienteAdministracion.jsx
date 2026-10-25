import { useState } from 'react'
import { Alert, Card, Col, Row } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FormularioCliente from '../components/organisms/FormularioCliente'
import TablaPedidos from '../components/organisms/TablaPedidos'
import { usePedidos } from '../hooks/usePedidos'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useUsuarios } from '../hooks/useUsuarios'
import { filtrarPedidos } from '../utils/filtrarPedidos'
import { formatearPrecio } from '../utils/formatearPrecio'

// Ficha de un cliente: mostrar, editar e historial de sus pedidos (Guía 16).
export default function DetalleClienteAdministracion() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { clientes, actualizarCliente } = useUsuarios()
  const { pedidos } = usePedidos()
  const [mensaje, setMensaje] = useState('')
  const cliente = clientes.find((cuenta) => cuenta.id === id)
  useTituloPagina(cliente ? `${cliente.nombre} ${cliente.apellidos}` : 'Cuenta no encontrada')

  if (!cliente) {
    return <Alert variant="warning">No existe una cuenta con el identificador {id}. <Link to="/administracion/usuarios?vista=clientes">Volver a usuarios</Link></Alert>
  }

  const historial = filtrarPedidos(pedidos.filter((pedido) => pedido.clienteId === cliente.id))
  const totalPedido = historial.reduce((suma, pedido) => suma + pedido.total, 0)

  function guardar({ nombre, apellidos, tipoCliente, activo }) {
    try {
      actualizarCliente(cliente.id, { nombre, apellidos, tipoCliente, activo })
      setMensaje('Cambios guardados.')
      return {}
    } catch (excepcion) {
      return { [excepcion.campo ?? 'nombre']: excepcion.message }
    }
  }

  return (
    <section>
      <Link to="/administracion/usuarios?vista=clientes" className="d-inline-block mb-3">← Volver a usuarios</Link>
      <h1>{cliente.nombre} {cliente.apellidos}</h1>
      <p className="text-secondary">
        Cuenta {cliente.id} · registrada el {new Date(cliente.fechaRegistro).toLocaleDateString('es-CL')}
        {cliente.direccion && ` · última dirección: ${cliente.direccion}`}
      </p>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      <Row className="g-4">
        <Col xl={4}>
          <Card><Card.Body>
            <h2 className="h5">Datos de la cuenta</h2>
            <FormularioCliente key={cliente.id} cliente={cliente} alGuardar={guardar} />
          </Card.Body></Card>
        </Col>
        <Col xl={8}>
          <h2 className="h5">Historial de pedidos</h2>
          <p className="text-secondary small">{historial.length} pedidos · {formatearPrecio(totalPedido)} en total.</p>
          <TablaPedidos pedidos={historial} alNavegar={navegar} />
        </Col>
      </Row>
    </section>
  )
}
