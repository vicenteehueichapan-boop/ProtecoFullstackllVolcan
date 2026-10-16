import { useState } from 'react'
import { Alert, Card, Col, Row, Tab, Tabs } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import FormularioCliente from '../components/organisms/FormularioCliente'
import FormularioPersonal from '../components/organisms/FormularioPersonal'
import TablaUsuarios from '../components/organisms/TablaUsuarios'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useUsuarios } from '../hooks/useUsuarios'
import { ROLES } from '../utils/validaciones'

function textoRol(rol) {
  return ROLES.find((opcion) => opcion.valor === rol)?.texto ?? rol
}

// Usuarios: nuevo, mostrar y editar (Guía 16). Separa el personal de las cuentas de clientes.
export default function AdministrarUsuarios() {
  useTituloPagina('Usuarios')
  const navegar = useNavigate()
  const { personal, clientes, crearPersonal, crearCliente } = useUsuarios()
  // La pestaña activa vive en la URL, así "atrás" vuelve a la pestaña que se estaba viendo.
  const [parametros, setParametros] = useSearchParams()
  const pestana = parametros.get('vista') === 'clientes' ? 'clientes' : 'personal'
  const [mensaje, setMensaje] = useState('')
  // Cambiar la clave vuelve a montar el formulario vacío después de crear.
  const [creados, setCreados] = useState(0)

  // Las funciones devuelven { campo: mensaje } si el servicio rechaza un dato.
  function crear(operacion, datos, descripcion) {
    try {
      const creado = operacion(datos)
      setMensaje(`${descripcion} ${creado.id} creado.`)
      setCreados((cantidad) => cantidad + 1)
      return {}
    } catch (excepcion) {
      return { [excepcion.campo ?? 'nombre']: excepcion.message }
    }
  }

  return (
    <section>
      <h1>Usuarios</h1>
      <p className="text-secondary">
        Perfiles del personal y cuentas de clientes de esta demostración. No se guardan contraseñas.
      </p>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      <Tabs mountOnEnter unmountOnExit activeKey={pestana} onSelect={(clave) => { setParametros({ vista: clave }); setMensaje('') }} className="mb-3">
        <Tab eventKey="personal" title={`Personal (${personal.length})`}>
          <Row className="g-4">
            <Col xl={8}>
              <TablaUsuarios
                titulo="Perfiles del personal"
                filas={personal.map((perfil) => ({ id: perfil.id, nombre: perfil.nombre, detalle: `${textoRol(perfil.rol)} · ${perfil.correo}`, activo: perfil.activo }))}
                rutaBase="/administracion/usuarios/personal"
                alNavegar={navegar}
              />
            </Col>
            <Col xl={4}>
              <Card><Card.Body>
                <h2 className="h5">Nuevo perfil del personal</h2>
                <FormularioPersonal key={`personal-${creados}`} alGuardar={(datos) => crear(crearPersonal, datos, 'Perfil')} />
              </Card.Body></Card>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="clientes" title={`Clientes (${clientes.length})`}>
          <Row className="g-4">
            <Col xl={8}>
              <TablaUsuarios
                titulo="Cuentas de clientes"
                filas={clientes.map((cliente) => ({ id: cliente.id, nombre: `${cliente.nombre} ${cliente.apellidos}`, detalle: `${cliente.tipoCliente} · ${cliente.correo}`, activo: cliente.activo }))}
                rutaBase="/administracion/usuarios/clientes"
                alNavegar={navegar}
              />
            </Col>
            <Col xl={4}>
              <Card><Card.Body>
                <h2 className="h5">Nueva cuenta de cliente</h2>
                <FormularioCliente key={`cliente-${creados}`} alGuardar={(datos) => crear(crearCliente, datos, 'Cliente')} />
              </Card.Body></Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </section>
  )
}
