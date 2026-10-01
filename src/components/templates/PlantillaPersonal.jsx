import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import BarraPersonal from '../organisms/BarraPersonal'

export default function PlantillaPersonal() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <a href="#contenido-personal" className="saltar-contenido">Saltar al contenido</a>
      <BarraPersonal />
      <main id="contenido-personal" className="flex-grow-1" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="py-3 border-top">
        <Container>
          <small>Área de trabajo · Demostración académica con datos locales, sin autenticación real.</small>
        </Container>
      </footer>
    </div>
  )
}
