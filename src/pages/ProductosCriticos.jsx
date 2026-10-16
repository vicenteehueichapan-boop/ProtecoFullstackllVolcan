import { useState } from 'react'
import { Alert, Table } from 'react-bootstrap'
import FormularioReposicion from '../components/molecules/FormularioReposicion'
import { useProductos } from '../hooks/useProductos'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { STOCK_CRITICO, esStockCritico } from '../utils/stockCritico'

// Ítems críticos (Guía 16): productos con poco stock, del menor al mayor, y reposición.
export default function ProductosCriticos() {
  useTituloPagina('Productos críticos')
  const { productos, actualizarProducto } = useProductos()
  const [mensaje, setMensaje] = useState(null)
  const criticos = productos.filter(esStockCritico).sort((a, b) => a.stock - b.stock)

  function reponer(codigo, cantidad) {
    const producto = productos.find((item) => item.codigo === codigo)
    try {
      actualizarProducto(codigo, { stock: producto.stock + cantidad })
      setMensaje({ tipo: 'success', texto: `Se sumaron ${cantidad} unidades a ${producto.nombre}.` })
    } catch (excepcion) {
      setMensaje({ tipo: 'danger', texto: excepcion.message })
    }
  }

  return (
    <section>
      <h1>Productos críticos</h1>
      <p className="text-secondary">
        Productos con {STOCK_CRITICO} unidades o menos. El umbral es una decisión del equipo; el caso no lo define.
      </p>
      {mensaje && <Alert variant={mensaje.tipo}>{mensaje.texto}</Alert>}
      {criticos.length === 0 ? (
        <p className="border rounded p-3 bg-white">No hay productos con stock crítico.</p>
      ) : (
        <div className="table-responsive bg-white shadow-sm rounded">
          <Table className="mb-0 align-middle">
            <caption className="visually-hidden">Productos con stock crítico</caption>
            <thead>
              <tr>
                <th>Producto</th>
                <th className="text-end">Stock</th>
                <th>Reponer</th>
              </tr>
            </thead>
            <tbody>
              {criticos.map((producto) => (
                <tr key={producto.codigo}>
                  <td>
                    <strong>{producto.nombre}</strong>
                    <div className="small text-secondary">{producto.codigo} · {producto.categoria}</div>
                  </td>
                  <td className={`text-end fw-bold ${producto.stock === 0 ? 'text-danger' : ''}`}>{producto.stock}</td>
                  <td style={{ minWidth: '220px' }}>
                    <FormularioReposicion producto={producto} alReponer={reponer} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </section>
  )
}
