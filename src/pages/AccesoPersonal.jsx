import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import FormularioIngreso from '../components/organisms/FormularioIngreso'
import { useSesionPersonal } from '../hooks/useSesionPersonal'
import personalDemostracion from '../data/personalDemostracion'
import { useTituloPagina } from '../hooks/useTituloPagina'

const areasPersonal = [
  { rol: 'administracion', nombre: 'Administración', descripcion: 'Panel con pedidos, catálogo, categorías, usuarios, reportes y perfil.', ruta: '/administracion' },
  { rol: 'operadora', nombre: 'Operadora', descripcion: 'Revisar los pedidos del día y asignar un repartidor.', ruta: '/operadora/pedidos' },
  { rol: 'repartidor', nombre: 'Repartidor', descripcion: 'Consultar mis entregas asignadas y actualizar su avance.', ruta: '/repartidor/entregas' },
]

export default function AccesoPersonal() {
  useTituloPagina('Área del personal')
  const { personal, ingresarPersonal, salirPersonal } = useSesionPersonal()

  // El único dato que puede rechazar la sesión de demostración es el correo: el
  // mensaje vuelve al formulario para mostrarse junto a ese campo.
  function ingresar({ correo }) {
    try {
      ingresarPersonal(correo)
      return {}
    } catch (excepcion) {
      return { correo: excepcion.message }
    }
  }

  return (
    <Container as="section" className="py-5">
      <p className="sobretitulo">Gestión de la sucursal</p>
      <h1>Área del personal</h1>
      {!personal ? (
        <Row className="g-4">
          <Col md={6}>
            <h2 className="h4">Ingreso de demostración</h2>
            <Alert variant="info">
              EP2 simula los permisos sin servidor. El correo identifica el perfil; la contraseña
              solo valida el formato (mínimo seis caracteres), no comprueba identidad.
              No escribas contraseñas reales. La sesión termina al recargar o cerrar sesión.
            </Alert>
            <FormularioIngreso alIngresar={ingresar} etiquetaCorreo="Correo del personal" />
          </Col>
          <Col md={6}>
            <h2 className="h4">Perfiles ficticios para presentar</h2>
            <ul>{personalDemostracion.map((perfil) => <li key={perfil.id}>{perfil.nombre}: {perfil.correo}</li>)}</ul>
            <p>Un correo de comprador no habilita herramientas del personal. Para demostrar otro rol, cierra esta sesión y utiliza su perfil.</p>
          </Col>
        </Row>
      ) : (
        <>
          <p>Sesión de demostración: {personal.nombre}.</p>
          <Button variant="outline-secondary" className="mb-4" onClick={salirPersonal}>Cerrar sesión del personal</Button>
          <Row className="g-4">
            {areasPersonal.filter((area) => area.rol === personal.rol).map((area) => (
              <Col md={6} key={area.ruta}>
                <Card className="h-100"><Card.Body>
                  <Card.Title as="h2" className="h4">{area.nombre}</Card.Title>
                  <Card.Text>{area.descripcion}</Card.Text>
                  <Button as={Link} to={area.ruta}>Entrar a {area.nombre}</Button>
                </Card.Body></Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  )
}
