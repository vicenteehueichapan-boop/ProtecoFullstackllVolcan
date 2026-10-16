import { Alert } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import OrdenDePedido from '../components/organisms/OrdenDePedido'
import { usePedidos } from '../hooks/usePedidos'
import { useTituloPagina } from '../hooks/useTituloPagina'

export default function OrdenPedidoAdministracion() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { pedidos } = usePedidos()
  const pedido = pedidos.find((item) => item.id === id)
  useTituloPagina(pedido ? `Orden ${pedido.id}` : 'Pedido no encontrado')

  return (
    <section>
      <Link to="/administracion/pedidos" className="d-inline-block mb-3">← Volver a pedidos</Link>
      {pedido ? (
        <OrdenDePedido pedido={pedido} alNavegar={navegar} />
      ) : (
        <Alert variant="warning">No existe un pedido con el número {id}.</Alert>
      )}
    </section>
  )
}
