import { Link } from 'react-router-dom'

export default function PaginaNoEncontrada() {
  return (
    <section className="container py-5 text-center">
      <h1>Página no encontrada</h1>
      <p>La dirección ingresada no corresponde a una página disponible.</p>
      <Link className="btn btn-danger" to="/">
        Volver al inicio
      </Link>
    </section>
  )
}
