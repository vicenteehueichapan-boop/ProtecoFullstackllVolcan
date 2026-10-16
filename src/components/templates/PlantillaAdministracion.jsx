import { Col, Container, Row } from 'react-bootstrap'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import MenuAdministracion from '../organisms/MenuAdministracion'

// Plantilla del panel (Guía 13: PlantillaAdmin). Ubica el menú y el contenido de cada
// sección (Outlet); no decide qué datos se muestran. Solo ella usa el router.
export default function PlantillaAdministracion() {
  const navegar = useNavigate()
  const { pathname } = useLocation()

  return (
    <Container fluid="xl" className="py-4">
      <Row className="g-4">
        <Col lg={3} xl={2}>
          <MenuAdministracion rutaActual={pathname} alNavegar={navegar} />
        </Col>
        <Col lg={9} xl={10}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}
