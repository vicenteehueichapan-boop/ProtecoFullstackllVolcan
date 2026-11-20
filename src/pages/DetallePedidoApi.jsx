import { useEffect, useState } from 'react'
import { Alert, Button, Container, Modal } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import EtiquetaEstadoPedido from '../components/atoms/EtiquetaEstadoPedido'
import ResumenPedido from '../components/molecules/ResumenPedido'
import { usePedidos } from '../hooks/usePedidos'
import { useSesionCliente } from '../hooks/useSesionCliente'
import { useSesionPersonal } from '../hooks/useSesionPersonal'
import { obtenerPedido } from '../services/pedidosApiService'
import { useTituloPagina } from '../hooks/useTituloPagina'

export default function DetallePedidoApi() {
  useTituloPagina('Detalle del pedido')
  const { id } = useParams()
  const { personal } = useSesionPersonal()
  const { cliente } = useSesionCliente()
  const usuarioId = cliente?.id ?? personal?.id
  if (!usuarioId) return <Container className="py-5">
    <h1>Detalle del pedido</h1>
    <Alert variant="info">Inicia sesión para consultar el pedido. <Link to="/ingreso" state={{ desde: `/seguimiento/${id}` }}>Ingresar</Link></Alert>
  </Container>
  // La identidad y la ruta delimitan la consulta: al cambiar se descarta todo el estado anterior.
  return <ContenidoPedido key={`${usuarioId}:${id}`} id={id} cliente={cliente} personal={personal} />
}

function ContenidoPedido({ id, cliente, personal }) {
  const { eliminarPedido } = usePedidos()
  const [pedido, setPedido] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [confirmacion, setConfirmacion] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const navegar = useNavigate()
  useEffect(() => {
    let activo = true
    obtenerPedido(id).then((datos) => { if (activo) { setPedido(datos); setError('') } })
      .catch((excepcion) => { if (activo) setError(excepcion.message) })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [id])
  async function eliminar() {
    setEnviando(true)
    try { await eliminarPedido(id); navegar(cliente ? '/mis-pedidos' : '/administracion/pedidos', { replace: true }) }
    catch (excepcion) { setError(excepcion.message); setConfirmacion(false) }
    finally { setEnviando(false) }
  }
  return <Container className="py-5">
    <h1>Detalle del pedido {pedido?.numero ?? ''}</h1>
    {cargando && <p role="status">Cargando pedido…</p>}
    {error && <Alert variant="danger">{error}</Alert>}
    {pedido && <><p>Estado: <EtiquetaEstadoPedido estado={pedido.estado} /></p><ResumenPedido pedido={pedido} />
      {pedido.repartidor && <p>Repartidor: {pedido.repartidor}</p>}
      {pedido.estado === 'pendiente' && (cliente || personal?.rol === 'administracion') && <Button className="my-3" variant="outline-danger" onClick={() => setConfirmacion(true)}>Eliminar pedido pendiente</Button>}
    </>}
    <div><Link to={cliente ? '/mis-pedidos' : personal?.rol === 'operadora' ? '/operadora/pedidos' : personal?.rol === 'repartidor' ? '/repartidor/entregas' : '/administracion/pedidos'}>Volver a pedidos</Link></div>
    <Modal show={confirmacion} onHide={() => !enviando && setConfirmacion(false)} aria-labelledby="titulo-eliminar-pedido">
      <Modal.Header><Modal.Title id="titulo-eliminar-pedido">Eliminar pedido pendiente</Modal.Title></Modal.Header>
      <Modal.Body>¿Eliminar este pedido sin asignar? Se devolverán sus unidades al stock.</Modal.Body>
      <Modal.Footer><Button disabled={enviando} variant="outline-secondary" onClick={() => setConfirmacion(false)}>Conservar</Button><Button disabled={enviando} variant="danger" onClick={eliminar}>Confirmar eliminación</Button></Modal.Footer>
    </Modal>
  </Container>
}
