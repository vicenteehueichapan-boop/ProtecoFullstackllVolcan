import { Col, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import TarjetaIndicador from '../components/molecules/TarjetaIndicador'
import { usePedidos } from '../hooks/usePedidos'
import { useProductos } from '../hooks/useProductos'
import { useSesionPersonal } from '../hooks/useSesionPersonal'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useUsuarios } from '../hooks/useUsuarios'
import { formatearPrecio } from '../utils/formatearPrecio'
import { generarReporte } from '../utils/generarReporte'
import { esStockCritico } from '../utils/stockCritico'

// Panel de inicio de administración (Guía 16): resumen de pedidos, catálogo y usuarios
// con acceso a cada módulo. Todos los números se calculan desde los datos guardados.
export default function PanelAdministracion() {
  useTituloPagina('Panel de administración')
  const navegar = useNavigate()
  const { personal: sesion } = useSesionPersonal()
  const { pedidos } = usePedidos()
  const { productos, categorias } = useProductos()
  const { personal, clientes } = useUsuarios()
  const reporte = generarReporte(pedidos)
  const enCurso = reporte.porEstado.asignado + reporte.porEstado.en_camino
  const criticos = productos.filter(esStockCritico).length

  const indicadores = [
    { titulo: 'Pedidos pendientes', valor: reporte.porEstado.pendiente, detalle: `${enCurso} en reparto y ${reporte.porEstado.entregado} entregados.`, ruta: '/administracion/pedidos', textoEnlace: 'Ver pedidos' },
    { titulo: 'Efectivo registrado', valor: formatearPrecio(reporte.efectivoCobrado), detalle: `${formatearPrecio(reporte.porCobrar)} por cobrar en pedidos no entregados.`, ruta: '/administracion/reportes', textoEnlace: 'Ver reportes' },
    { titulo: 'Productos en el catálogo', valor: productos.length, detalle: `${categorias.length} categorías.`, ruta: '/administracion/productos', textoEnlace: 'Administrar catálogo' },
    { titulo: 'Productos críticos', valor: criticos, detalle: 'Con poco stock disponible.', ruta: '/administracion/criticos', textoEnlace: 'Revisar y reponer' },
    { titulo: 'Clientes con cuenta', valor: clientes.length, detalle: `${clientes.filter((cliente) => !cliente.activo).length} desactivadas.`, ruta: '/administracion/usuarios', textoEnlace: 'Ver usuarios' },
    { titulo: 'Personal activo', valor: personal.filter((perfil) => perfil.activo).length, detalle: `${personal.filter((perfil) => perfil.rol === 'repartidor' && perfil.activo).length} repartidores disponibles.`, ruta: '/administracion/usuarios', textoEnlace: 'Ver personal' },
  ]

  return (
    <section>
      <p className="sobretitulo">Administración</p>
      <h1>Panel de administración</h1>
      <p className="text-secondary">Hola, {sesion.nombre}. Este es el resumen de la operación guardada en este navegador.</p>
      <Row className="g-3">
        {indicadores.map((indicador) => (
          <Col sm={6} xl={4} key={indicador.titulo}>
            <TarjetaIndicador {...indicador} alNavegar={navegar} />
          </Col>
        ))}
      </Row>
    </section>
  )
}
