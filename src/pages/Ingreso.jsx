import { useState } from 'react'
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormularioIngreso from '../components/organisms/FormularioIngreso'
import { useSesionCliente } from '../hooks/useSesionCliente'
import { useTituloPagina } from '../hooks/useTituloPagina'

export default function Ingreso() {
  useTituloPagina('Ingresar')
  const { cliente, ingresar, salir } = useSesionCliente()
  const navegar = useNavigate()
  const { state } = useLocation()
  const [error, setError] = useState('')

  function recibirIngreso({ correo }) {
    try {
      ingresar(correo)
      navegar(state?.desde ?? '/mis-pedidos', { replace: true })
    } catch (excepcion) {
      setError(excepcion.message)
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h1 className="h3 mb-3">Ingresar</h1>
              {cliente ? (
                <>
                  <p>Ya ingresaste como <strong>{cliente.nombre} {cliente.apellidos}</strong>.</p>
                  <div className="d-flex flex-wrap gap-2">
                    <Button as={Link} to="/mis-pedidos" variant="danger">Ver mis pedidos</Button>
                    <Button variant="outline-secondary" onClick={salir}>Cerrar sesión</Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-secondary">
                    Demostración sin servidor: el correo identifica tu cuenta y la contraseña solo
                    se valida (mínimo seis caracteres). No escribas una contraseña real.
                  </p>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <FormularioIngreso alIngresar={recibirIngreso} etiquetaCorreo="Correo" />
                  <p className="mt-3 mb-0">¿No tienes cuenta? <Link to="/registro" state={state}>Regístrate</Link></p>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
