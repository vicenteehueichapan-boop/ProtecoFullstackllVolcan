import { Col, Form, Row } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import TablaPedidos from '../components/organisms/TablaPedidos'
import { usePedidos } from '../hooks/usePedidos'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { filtrarPedidos } from '../utils/filtrarPedidos'

const ESTADOS = [
  { valor: '', texto: 'Todos los estados' },
  { valor: 'pendiente', texto: 'Pendientes' },
  { valor: 'asignado', texto: 'Asignados' },
  { valor: 'en_camino', texto: 'En camino' },
  { valor: 'entregado', texto: 'Entregados' },
]

export default function AdministrarPedidos() {
  useTituloPagina('Pedidos recibidos')
  const { pedidos } = usePedidos()
  const navegar = useNavigate()
  // Los filtros viven en la URL: se pueden compartir y respetan atrás y adelante.
  const [parametros, setParametros] = useSearchParams()
  const texto = parametros.get('buscar') ?? ''
  const estado = parametros.get('estado') ?? ''
  const visibles = filtrarPedidos(pedidos, { texto, estado })

  function cambiarFiltro(nombre, valor) {
    const nuevos = new URLSearchParams(parametros)
    if (valor) nuevos.set(nombre, valor)
    else nuevos.delete(nombre)
    setParametros(nuevos, { replace: nombre === 'buscar' })
  }

  return (
    <section>
      <h1>Pedidos recibidos</h1>
      <p className="text-secondary">Todos los pedidos registrados, con su orden de pedido.</p>
      <Row className="g-3 mb-3">
        <Col md={7}>
          <Form.Group controlId="buscar-pedido">
            <Form.Label>Buscar</Form.Label>
            <Form.Control type="search" placeholder="Número, nombre o correo" value={texto}
              onChange={(evento) => cambiarFiltro('buscar', evento.target.value)} />
          </Form.Group>
        </Col>
        <Col md={5}>
          <Form.Group controlId="filtrar-estado">
            <Form.Label>Estado</Form.Label>
            <Form.Select value={estado} onChange={(evento) => cambiarFiltro('estado', evento.target.value)}>
              {ESTADOS.map((opcion) => <option key={opcion.valor} value={opcion.valor}>{opcion.texto}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <p className="resultado-catalogo" aria-live="polite">{visibles.length} de {pedidos.length} pedidos</p>
      <TablaPedidos pedidos={visibles} alNavegar={navegar} />
    </section>
  )
}
