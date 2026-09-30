import { formatearPrecio } from '../../utils/formatearPrecio'
import { precioSegunCliente } from '../../utils/precioSegunCliente'
import Precio from '../atoms/Precio'

export default function TarjetaProducto({ producto, tipoCliente }) {
  const precio = precioSegunCliente(producto, tipoCliente)
  const stockBajo = producto.stock <= 10

  return (
    <article className="card h-100 tarjeta-producto">
      <img
        className="card-img-top imagen-producto"
        src={producto.imagen}
        alt={producto.nombre}
      />
      <div className="card-body d-flex flex-column">
        <p className="text-secondary small mb-1">{producto.codigo}</p>
        <h2 className="h5 card-title">{producto.nombre}</h2>
        <p className="card-text flex-grow-1">{producto.descripcion}</p>
        <Precio valor={formatearPrecio(precio)} />
        <span className={`badge ${stockBajo ? 'text-bg-warning' : 'text-bg-success'} align-self-start`}>
          {stockBajo ? `Últimas ${producto.stock} unidades` : `Stock: ${producto.stock}`}
        </span>
      </div>
    </article>
  )
}
