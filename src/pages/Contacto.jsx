import { useState } from 'react'
import { Alert, Card, Col, Container, Row } from 'react-bootstrap'
import FormularioContacto from '../components/organisms/FormularioContacto'
import zonasDespacho from '../data/zonasDespacho'
import { useSesionCliente } from '../hooks/useSesionCliente'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { crearMensaje } from '../services/mensajeService'

export default function Contacto() {
  useTituloPagina('Contacto')
  const { cliente } = useSesionCliente()
  const [enviado, setEnviado] = useState(null)
  const [error, setError] = useState('')
  // Cambiar la clave vuelve a montar el formulario vacío después de un envío correcto.
  const [envios, setEnvios] = useState(0)

  // Los mensajes no se comparten entre pantallas, por eso la página llama al servicio
  // directamente en vez de pasar por un Context.
  function enviar(datos) {
    try {
      setEnviado(crearMensaje(datos))
      setError('')
      setEnvios((cantidad) => cantidad + 1)
    } catch (excepcion) {
      setError(excepcion.message)
    }
    return {}
  }

  return (
    <Container as="section" className="py-5">
      <p className="sobretitulo">Estamos para orientarte</p>
      <h1>Contacto</h1>
      <Row className="g-4">
        <Col lg={7}>
          <p>Escríbenos tus dudas sobre productos, cobertura o un pedido. Te responderemos al correo que indiques.</p>
          {enviado && (
            <Alert variant="success">
              Recibimos tu mensaje {enviado.id}. Te responderemos a {enviado.correo}.
            </Alert>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          <FormularioContacto
            key={envios}
            alEnviar={enviar}
            datosIniciales={cliente ? { nombre: `${cliente.nombre} ${cliente.apellidos}`, correo: cliente.correo } : undefined}
          />
        </Col>
        <Col lg={5}>
          <Card className="h-100">
            <Card.Body>
              <h2 className="h5">Días de despacho por zona</h2>
              <ul className="mb-3">
                {zonasDespacho.map((zona) => (
                  <li key={zona.id}><strong>{zona.nombre}:</strong> {zona.dias.toLocaleLowerCase('es-CL')}, {zona.horario}.</li>
                ))}
              </ul>
              <p className="small text-secondary mb-0">
                Este formulario no es un canal de emergencia. Si sientes olor a gas, sigue las indicaciones
                de seguridad de nuestro blog y llama a tu proveedor.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
