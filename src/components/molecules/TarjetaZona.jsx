export default function TarjetaZona({ zona }) {
  return (
    <article className="zona-despacho h-100">
      <h3 className="h5">{zona.nombre}</h3>
      <p>{zona.comunas}</p>
      <strong>{zona.tiempoEstimado}</strong>
      <small>{zona.dias} · {zona.horario}</small>
    </article>
  )
}
