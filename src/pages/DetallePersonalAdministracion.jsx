import { useState } from 'react'
import { Alert, Card, Col, Row } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FormularioPersonal from '../components/organisms/FormularioPersonal'
import TablaPedidos from '../components/organisms/TablaPedidos'
import { usePedidos } from '../hooks/usePedidos'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useUsuarios } from '../hooks/useUsuarios'
import { esEntregaDe } from '../utils/esEntregaDe'
import { filtrarPedidos } from '../utils/filtrarPedidos'

// Ficha de un perfil del personal: mostrar, editar rol o estado y, si reparte, sus entregas.
export default function DetallePersonalAdministracion() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { personal, actualizarPersonal } = useUsuarios()
  const { pedidos } = usePedidos()
  const [mensaje, setMensaje] = useState('')
  const perfil = personal.find((item) => item.id === id)
  useTituloPagina(perfil ? perfil.nombre : 'Perfil no encontrado')

  if (!perfil) {
    return <Alert variant="warning">No existe un perfil con el identificador {id}. <Link to="/administracion/usuarios">Volver a usuarios</Link></Alert>
  }

  const entregas = filtrarPedidos(pedidos.filter((pedido) => esEntregaDe(pedido, perfil)))

  function guardar({ nombre, rol, activo }) {
    try {
      actualizarPersonal(perfil.id, { nombre, rol, activo })
      setMensaje('Cambios guardados. Si el perfil tiene una sesión abierta, sus permisos ya cambiaron.')
      return {}
    } catch (excepcion) {
      return { [excepcion.campo ?? 'nombre']: excepcion.message }
    }
  }

  return (
    <section>
      <Link to="/administracion/usuarios" className="d-inline-block mb-3">← Volver a usuarios</Link>
      <h1>{perfil.nombre}</h1>
      <p className="text-secondary">Perfil {perfil.id} · {perfil.correo}</p>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      <Row className="g-4">
        <Col xl={4}>
          <Card><Card.Body>
            <h2 className="h5">Datos del perfil</h2>
            <FormularioPersonal key={perfil.id} perfil={perfil} alGuardar={guardar} />
          </Card.Body></Card>
        </Col>
        {perfil.rol === 'repartidor' && (
          <Col xl={8}>
            <h2 className="h5">Entregas asignadas</h2>
            <TablaPedidos pedidos={entregas} alNavegar={navegar} />
          </Col>
        )}
      </Row>
    </section>
  )
}
