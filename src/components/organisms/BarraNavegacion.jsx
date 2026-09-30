import { NavLink } from 'react-router-dom'

export default function BarraNavegacion() {
  return (
    <nav className="navbar navbar-expand-md bg-dark" data-bs-theme="dark">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">
          Gas El Volcán
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navegacion-principal"
          aria-controls="navegacion-principal"
          aria-expanded="false"
          aria-label="Mostrar navegación"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navegacion-principal">
          <div className="navbar-nav ms-auto">
            <NavLink className="nav-link" to="/">
              Inicio
            </NavLink>
            <NavLink className="nav-link" to="/catalogo">
              Catálogo
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}
