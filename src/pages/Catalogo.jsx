import { useState } from 'react'
import SelectorTipoCliente from '../components/molecules/SelectorTipoCliente'
import TarjetaProducto from '../components/molecules/TarjetaProducto'
import { useProductos } from '../hooks/useProductos'

export default function Catalogo() {
  const { productos } = useProductos()
  const [tipoCliente, setTipoCliente] = useState('residencial')

  return (
    <section className="container py-5">
      <div className="row align-items-end mb-3">
        <div className="col-md-8">
          <h1>Catálogo de productos</h1>
          <p className="text-secondary">
            Selecciona el tipo de cliente para consultar la tarifa correspondiente.
          </p>
        </div>
        <div className="col-md-4">
          <SelectorTipoCliente valor={tipoCliente} alCambiar={setTipoCliente} />
        </div>
      </div>

      <div className="row g-4">
        {productos.map((producto) => (
          <div className="col-sm-6 col-lg-4 col-xl-3" key={producto.codigo}>
            <TarjetaProducto producto={producto} tipoCliente={tipoCliente} />
          </div>
        ))}
      </div>
    </section>
  )
}
