import { Link } from 'react-router-dom'
import heroDespacho from '../assets/hero-despacho.svg'

export default function Inicio() {
  return (
    <section className="hero-inicio py-5">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <p className="text-uppercase fw-semibold marca-volcan">Despacho de gas en Chillán</p>
            <h1 className="display-5 fw-bold">Tu energía llega a casa</h1>
            <p className="lead">
              Consulta cilindros, reguladores y accesorios con precios residenciales y comerciales.
            </p>
            <Link className="btn btn-danger btn-lg" to="/catalogo">
              Ver catálogo
            </Link>
          </div>
          <div className="col-lg-6 text-center">
            <img
              className="img-fluid"
              src={heroDespacho}
              alt="Camión de reparto de Gas El Volcán"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
