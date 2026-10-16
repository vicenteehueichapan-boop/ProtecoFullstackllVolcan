import { useState } from 'react'
import { Alert, Container } from 'react-bootstrap'
import ListaPedidosDelDia from '../components/organisms/ListaPedidosDelDia'
import { useAhora } from '../hooks/useAhora'
import { usePedidos } from '../hooks/usePedidos'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useUsuarios } from '../hooks/useUsuarios'
import { pedidosParaOperadora } from '../utils/pedidosParaOperadora'

export default function OperadoraPedidos() {
  useTituloPagina('Pedidos del día')
  const { pedidos, asignarRepartidor } = usePedidos()
  const { personal } = useUsuarios()
  // Solo los repartidores activos pueden recibir pedidos.
  const repartidores = personal.filter((perfil) => perfil.rol === 'repartidor' && perfil.activo)
  const [selecciones, setSelecciones] = useState({})
  const [mensaje, setMensaje] = useState(null)
  // useAhora renueva la hora cada minuto: al pasar la medianoche, la lista se actualiza sola.
  const ahora = useAhora()
  // Se calcula durante el renderizado: los del día y los que siguen sin entregar.
  const pedidosDelDia = pedidosParaOperadora(pedidos, ahora)

  function seleccionarRepartidor(id, repartidor) {
    setSelecciones((actuales) => ({ ...actuales, [id]: repartidor }))
  }

  function asignar(id) {
    try {
      asignarRepartidor(id, selecciones[id])
      setMensaje({ tipo: 'success', texto: `El pedido ${id} fue asignado correctamente.` })
      setSelecciones((actuales) => ({ ...actuales, [id]: '' }))
    } catch (excepcion) {
      setMensaje({
        tipo: 'danger',
        texto: excepcion instanceof Error ? excepcion.message : 'No fue posible asignar el pedido.',
      })
    }
  }

  return (
    <Container as="section" className="py-5">
      <h1>Pedidos del día</h1>
      <p className="text-secondary">
        Pedidos de hoy y los de días anteriores que aún no se entregan. Asigna cada pendiente a un repartidor activo.
      </p>
      {mensaje && <Alert variant={mensaje.tipo}>{mensaje.texto}</Alert>}
      <ListaPedidosDelDia
        pedidos={pedidosDelDia}
        repartidores={repartidores}
        selecciones={selecciones}
        alSeleccionar={seleccionarRepartidor}
        alAsignar={asignar}
      />
    </Container>
  )
}
