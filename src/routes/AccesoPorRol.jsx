import { Alert, Container } from 'react-bootstrap'
import { Link, Navigate, Outlet } from 'react-router-dom'
import { useSesionPersonal } from '../hooks/useSesionPersonal'
import { puedeAccederPersonal } from '../utils/permisosPersonal'

export default function AccesoPorRol({ roles }) {
  const { personal } = useSesionPersonal()
  if (!personal) return <Navigate to="/personal" replace />
  if (!puedeAccederPersonal(personal, roles)) {
    return <Container className="py-5"><h1>Acceso no permitido</h1><Alert variant="warning">Tu perfil no tiene acceso a esta herramienta.</Alert><Link to="/personal">Volver a mi área</Link></Container>
  }
  return <Outlet />
}
