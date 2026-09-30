import { useState } from 'react'
import { Alert, Card, Col, Container, Row } from 'react-bootstrap'
import FormularioIngreso from '../components/organisms/FormularioIngreso'

export default function Ingreso() {
  const [mensaje, setMensaje] = useState('')

  function recibirIngreso(datos) {
    setMensaje(`Formulario válido para ${datos.correo}. La autenticación real se agregará en otra etapa.`)
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h1 className="h3 mb-3">Ingreso al sistema</h1>
              <p className="text-secondary">
                Esta pantalla valida los datos en React. Todavía no autentica contra un servidor.
              </p>
              {mensaje && <Alert variant="success">{mensaje}</Alert>}
              <FormularioIngreso alIngresar={recibirIngreso} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
