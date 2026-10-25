import { Alert, Container } from 'react-bootstrap'

// Muestra los problemas de lectura de los datos guardados. No repara nada:
// solo informa, para que nadie trabaje creyendo que los datos están completos.
export default function AvisoAlmacenamiento({ errores }) {
  const mensajes = errores.filter(Boolean)
  if (mensajes.length === 0) return null

  return (
    <Container className="pt-3">
      <Alert variant="danger" className="mb-0">
        <strong>No pudimos leer algunos datos guardados en este navegador.</strong>
        <ul className="mb-0 mt-2">
          {mensajes.map((mensaje) => <li key={mensaje}>{mensaje}</li>)}
        </ul>
      </Alert>
    </Container>
  )
}
