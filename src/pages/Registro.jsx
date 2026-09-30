import { Card, Col, Container, Row } from 'react-bootstrap'
import FormularioRegistro from '../components/organisms/FormularioRegistro'

export default function Registro() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center"><Col xs={12} md={9} lg={6}><Card className="shadow-sm"><Card.Body className="p-4"><h1 className="h3 mb-3">Crear cuenta</h1><p className="text-secondary">Los datos se validan en React y no se envían a un servidor durante EP2.</p><FormularioRegistro /></Card.Body></Card></Col></Row>
    </Container>
  )
}
