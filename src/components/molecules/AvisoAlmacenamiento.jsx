import { Alert } from 'react-bootstrap'

// Muestra los problemas de lectura de los datos guardados. No repara nada:
// solo informa, para que nadie trabaje creyendo que los datos están completos.
export default function AvisoAlmacenamiento({ errores }) {
  // Set elimina mensajes repetidos (por ejemplo, el mismo bloqueo informado por
  // varios servicios), así cada texto aparece una vez y sirve como clave única.
  const mensajes = [...new Set(errores.filter(Boolean))]
  if (mensajes.length === 0) return null

  return (
    <Alert variant="danger" className="mt-3 mb-0">
      <strong>No pudimos leer algunos datos guardados en este navegador.</strong>
      <ul className="mb-0 mt-2">
        {mensajes.map((mensaje) => <li key={mensaje}>{mensaje}</li>)}
      </ul>
    </Alert>
  )
}
