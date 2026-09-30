import { useMemo, useState } from 'react'
import { Alert, Container } from 'react-bootstrap'
import ListaPedidosDelDia from '../components/organisms/ListaPedidosDelDia'
import repartidores from '../data/repartidores'
import { usePedidos } from '../hooks/usePedidos'

function correspondeAHoy(fecha) {
  const fechaPedido = new Date(fecha)
  const hoy = new Date()
  return fechaPedido.toDateString() === hoy.toDateString()
}

export default function OperadoraPedidos() {
  const { pedidos, asignarRepartidor } = usePedidos()
  const [selecciones, setSelecciones] = useState({})
  const [mensaje, setMensaje] = useState(null)
  const pedidosDelDia = useMemo(
    () => pedidos.filter((pedido) => correspondeAHoy(pedido.fechaCreacion)),
    [pedidos],
  )

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
        La operadora revisa los pedidos pendientes y los asigna a un repartidor.
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
