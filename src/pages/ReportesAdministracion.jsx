import { Card, Col, ProgressBar, Row, Table } from 'react-bootstrap'
import TarjetaIndicador from '../components/molecules/TarjetaIndicador'
import { usePedidos } from '../hooks/usePedidos'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { formatearPrecio } from '../utils/formatearPrecio'
import { generarReporte } from '../utils/generarReporte'

const ESTADOS = [
  { clave: 'pendiente', texto: 'Pendientes' },
  { clave: 'asignado', texto: 'Asignados' },
  { clave: 'en_camino', texto: 'En camino' },
  { clave: 'entregado', texto: 'Entregados' },
]

// Reportes de las operaciones (Guía 16), calculados con los pedidos guardados.
export default function ReportesAdministracion() {
  useTituloPagina('Reportes')
  const { pedidos } = usePedidos()
  const reporte = generarReporte(pedidos)
  const maximoZona = Math.max(1, ...reporte.porZona.map((zona) => zona.pedidos))

  return (
    <section>
      <h1>Reportes de operación</h1>
      <p className="text-secondary">Calculados con los {reporte.totalPedidos} pedidos registrados en este navegador.</p>
      <Row className="g-3 mb-4">
        <Col sm={6} xl={3}><TarjetaIndicador titulo="Efectivo registrado" valor={formatearPrecio(reporte.efectivoCobrado)} detalle="Cobros guardados al marcar cada entrega." /></Col>
        <Col sm={6} xl={3}><TarjetaIndicador titulo="Por cobrar" valor={formatearPrecio(reporte.porCobrar)} detalle="Pedidos que aún no se entregan." /></Col>
        <Col sm={6} xl={3}><TarjetaIndicador titulo="Pedidos residenciales" valor={reporte.porTarifa.residencial} /></Col>
        <Col sm={6} xl={3}><TarjetaIndicador titulo="Pedidos comerciales" valor={reporte.porTarifa.comercial} /></Col>
      </Row>
      {reporte.entregadosSinCobro > 0 && (
        <p className="small text-secondary">
          {reporte.entregadosSinCobro} pedidos entregados antes de registrar cobros no suman efectivo.
        </p>
      )}

      <Row className="g-4">
        <Col lg={6}>
          <Card className="h-100"><Card.Body>
            <h2 className="h5">Pedidos por estado</h2>
            <Table size="sm" className="mb-0">
              <tbody>
                {ESTADOS.map((estado) => (
                  <tr key={estado.clave}><th scope="row">{estado.texto}</th><td className="text-end">{reporte.porEstado[estado.clave]}</td></tr>
                ))}
              </tbody>
            </Table>
          </Card.Body></Card>
        </Col>
        <Col lg={6}>
          <Card className="h-100"><Card.Body>
            <h2 className="h5">Pedidos por zona</h2>
            {reporte.porZona.length === 0 && <p className="mb-0">Sin pedidos todavía.</p>}
            {reporte.porZona.map((zona) => (
              <div key={zona.zona} className="mb-2">
                <div className="d-flex justify-content-between small"><span>{zona.zona}</span><span>{zona.pedidos}</span></div>
                {/* La barra es solo visual: la cantidad ya está escrita arriba como texto. */}
                <ProgressBar now={(zona.pedidos / maximoZona) * 100} variant="success" aria-hidden="true" />
              </div>
            ))}
          </Card.Body></Card>
        </Col>
        <Col xs={12}>
          <Card><Card.Body>
            <h2 className="h5">Productos más pedidos</h2>
            {reporte.productos.length === 0 ? <p className="mb-0">Sin pedidos todavía.</p> : (
              <div className="table-responsive">
                <Table size="sm" className="mb-0">
                  <thead><tr><th>Producto</th><th className="text-end">Unidades</th><th className="text-end">Importe</th></tr></thead>
                  <tbody>
                    {reporte.productos.map((producto) => (
                      <tr key={producto.codigo}>
                        <td>{producto.nombre} <span className="text-secondary small">({producto.codigo})</span></td>
                        <td className="text-end">{producto.unidades}</td>
                        <td className="text-end">{formatearPrecio(producto.importe)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body></Card>
        </Col>
      </Row>
    </section>
  )
}
