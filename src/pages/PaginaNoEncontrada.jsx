import { Button, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTituloPagina } from '../hooks/useTituloPagina'

export default function PaginaNoEncontrada() {
  useTituloPagina('Página no encontrada')
  return (
    <Container as="section" className="py-5 text-center">
      <h1>Página no encontrada</h1>
      <p>La dirección ingresada no corresponde a una página disponible.</p>
      <Button as={Link} variant="danger" to="/">
        Volver al inicio
      </Button>
    </Container>
  )
}
