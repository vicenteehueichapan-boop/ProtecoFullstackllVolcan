import { useState } from 'react'
import { Alert, Card, Col, ListGroup, Row } from 'react-bootstrap'
import FormularioPerfil from '../components/organisms/FormularioPerfil'
import { useSesionPersonal } from '../hooks/useSesionPersonal'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useUsuarios } from '../hooks/useUsuarios'
import { ROLES } from '../utils/validaciones'

// Perfil de quien administra (Guía 16): sus datos y la edición de su nombre.
export default function PerfilAdministracion() {
  useTituloPagina('Mi perfil')
  const { personal } = useSesionPersonal()
  const { actualizarPersonal } = useUsuarios()
  const [mensaje, setMensaje] = useState('')

  function guardar(nombre) {
    try {
      actualizarPersonal(personal.id, { nombre })
      setMensaje('Nombre actualizado.')
      return ''
    } catch (excepcion) {
      return excepcion.message
    }
  }

  return (
    <section>
      <h1>Mi perfil</h1>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      <Row className="g-4">
        <Col lg={6}>
          <Card><Card.Body>
            <h2 className="h5">Datos de la sesión</h2>
            <ListGroup variant="flush">
              <ListGroup.Item><strong>Nombre:</strong> {personal.nombre}</ListGroup.Item>
              <ListGroup.Item><strong>Correo:</strong> {personal.correo}</ListGroup.Item>
              <ListGroup.Item><strong>Rol:</strong> {ROLES.find((rol) => rol.valor === personal.rol)?.texto}</ListGroup.Item>
              <ListGroup.Item><strong>Identificador:</strong> {personal.id}</ListGroup.Item>
            </ListGroup>
            <p className="small text-secondary mt-3 mb-0">
              Sesión de demostración: no se guarda contraseña y se cierra al recargar la página.
            </p>
          </Card.Body></Card>
        </Col>
        <Col lg={6}>
          <Card><Card.Body>
            <h2 className="h5">Editar nombre</h2>
            <FormularioPerfil key={personal.nombre} nombreInicial={personal.nombre} alGuardar={guardar} />
          </Card.Body></Card>
        </Col>
      </Row>
    </section>
  )
}
