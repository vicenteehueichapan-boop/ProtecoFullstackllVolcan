import { useState } from 'react'
import { Alert, Card, Col, Container, Row } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormularioRegistro from '../components/organisms/FormularioRegistro'
import { useSesionCliente } from '../hooks/useSesionCliente'
import { useTituloPagina } from '../hooks/useTituloPagina'

export default function Registro() {
  useTituloPagina('Crear cuenta')
  const { registrar } = useSesionCliente()
  const navegar = useNavigate()
  const { state } = useLocation()
  const [error, setError] = useState('')

  // El formulario ya validó el formato; aquí se guarda la cuenta y se decide adónde ir.
  // Si el servicio rechaza un dato, se devuelve { campo: mensaje } para mostrarlo junto al campo.
  function crearCuenta(datos) {
    try {
      registrar(datos)
      navegar(state?.desde ?? '/catalogo', { replace: true })
      return {}
    } catch (excepcion) {
      if (excepcion.campo) return { [excepcion.campo]: excepcion.message }
      setError(excepcion.message)
      return {}
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={9} lg={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h1 className="h3 mb-3">Crear cuenta</h1>
              <p className="text-secondary">
                Con tu cuenta, la entrega se completa sola y puedes revisar tus pedidos.
                Es una cuenta de demostración guardada en este navegador: la contraseña solo
                se valida, no se guarda. No uses una contraseña real.
              </p>
              {error && <Alert variant="danger">{error}</Alert>}
              <FormularioRegistro alRegistrar={crearCuenta} />
              <p className="mt-3 mb-0">¿Ya tienes cuenta? <Link to="/ingreso" state={state}>Ingresa aquí</Link></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
