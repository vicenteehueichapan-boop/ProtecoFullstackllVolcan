import { useState } from 'react'
import { Alert, Button, Form, Modal, Table } from 'react-bootstrap'
import FormularioPersonal from '../components/organisms/FormularioPersonal'
import { useUsuarios } from '../hooks/useUsuarios'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { ROLES } from '../utils/validaciones'

function EditarUsuario({ usuario, alGuardar, alCancelar }) {
  const [datos, setDatos] = useState(usuario)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  async function enviar(evento) {
    evento.preventDefault()
    if (enviando) return
    setEnviando(true)
    try { await alGuardar(datos) } catch (excepcion) { setError(excepcion.message) } finally { setEnviando(false) }
  }
  return <Form onSubmit={enviar} aria-busy={enviando}>
    {error && <Alert variant="danger">{error}</Alert>}
    <fieldset disabled={enviando}>
      {['nombre', 'apellidos', 'correo'].map((campo) => <Form.Group key={campo} controlId={`editar-${campo}`} className="mb-3">
        <Form.Label>{campo === 'nombre' ? 'Nombre' : campo === 'apellidos' ? 'Apellidos' : 'Correo'}</Form.Label>
        <Form.Control required minLength={campo === 'correo' ? undefined : 2} type={campo === 'correo' ? 'email' : 'text'}
          value={datos[campo]} onChange={(evento) => setDatos({ ...datos, [campo]: evento.target.value })} />
      </Form.Group>)}
      {usuario.rol !== 'cliente' && <Form.Group controlId="editar-rol" className="mb-3"><Form.Label>Rol</Form.Label>
        <Form.Select value={datos.rol} onChange={(evento) => setDatos({ ...datos, rol: evento.target.value })}>
          {ROLES.map((rol) => <option key={rol.valor} value={rol.valor}>{rol.texto}</option>)}
        </Form.Select></Form.Group>}
      <Form.Check id="editar-activo" label="Cuenta activa" checked={datos.activo} onChange={(evento) => setDatos({ ...datos, activo: evento.target.checked })} className="mb-3" />
      <Button type="submit">Guardar cambios</Button>{' '}<Button variant="outline-secondary" onClick={alCancelar}>Cancelar</Button>
    </fieldset>
  </Form>
}

export default function UsuariosApi() {
  useTituloPagina('Usuarios')
  const { personal, clientes, crearPersonal, actualizarPersonal, desactivarUsuario } = useUsuarios()
  const [editando, setEditando] = useState(null)
  const [desactivando, setDesactivando] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  const [creados, setCreados] = useState(0)
  const [creando, setCreando] = useState(false)
  const [enviando, setEnviando] = useState(false)
  async function crear(datos) {
    try { await crearPersonal(datos); setCreados((n) => n + 1); setCreando(false); setMensaje({ tipo: 'success', texto: 'Usuario creado.' }); return {} }
    catch (excepcion) { setMensaje({ tipo: 'danger', texto: excepcion.message }); return excepcion.detalles ?? {} }
  }
  async function guardar(datos) {
    await actualizarPersonal(datos.id, datos)
    setEditando(null); setMensaje({ tipo: 'success', texto: 'Usuario actualizado. Sus sesiones anteriores se revocaron.' })
  }
  async function desactivar() {
    if (enviando) return
    setEnviando(true)
    try { await desactivarUsuario(desactivando.id); setDesactivando(null); setMensaje({ tipo: 'success', texto: 'Cuenta desactivada.' }) }
    catch (excepcion) { setMensaje({ tipo: 'danger', texto: excepcion.message }); setDesactivando(null) }
    finally { setEnviando(false) }
  }
  return <section>
    <h1>Usuarios</h1>
    <p>Gestiona las cuentas y los roles de Gas El Volcán. Los clientes crean su cuenta desde Registro.</p>
    {mensaje && <Alert variant={mensaje.tipo}>{mensaje.texto}</Alert>}
    <Button className="mb-3" onClick={() => setCreando(true)}>Crear cuenta del personal</Button>
    <div className="table-responsive"><Table striped hover>
      <caption>Cuentas registradas</caption><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>{[...personal, ...clientes].map((usuario) => <tr key={usuario.id}>
        <td>{usuario.nombre} {usuario.apellidos}</td><td>{usuario.correo}</td><td>{usuario.rol}</td><td>{usuario.activo ? 'Activo' : 'Desactivado'}</td>
        <td><div className="d-flex flex-wrap gap-2"><Button size="sm" variant="outline-primary" aria-label={`Editar a ${usuario.nombre} ${usuario.apellidos}`} onClick={() => setEditando(usuario)}>Editar</Button>
          {usuario.activo && <Button size="sm" variant="outline-danger" aria-label={`Desactivar a ${usuario.nombre} ${usuario.apellidos}`} onClick={() => setDesactivando(usuario)}>Desactivar</Button>}</div></td>
      </tr>)}</tbody></Table></div>{personal.length + clientes.length === 0 && <p>No hay cuentas para mostrar.</p>}
    <Modal show={creando} onHide={() => setCreando(false)} aria-labelledby="titulo-crear-usuario"><Modal.Header closeButton closeLabel="Cerrar"><Modal.Title id="titulo-crear-usuario">Crear cuenta del personal</Modal.Title></Modal.Header>
      <Modal.Body><FormularioPersonal key={creados} alGuardar={crear} /></Modal.Body></Modal>
    <Modal show={Boolean(editando)} onHide={() => setEditando(null)} aria-labelledby="titulo-editar-usuario"><Modal.Header closeButton closeLabel="Cerrar"><Modal.Title id="titulo-editar-usuario">Editar usuario</Modal.Title></Modal.Header>
      <Modal.Body>{editando && <EditarUsuario key={editando.id} usuario={editando} alGuardar={guardar} alCancelar={() => setEditando(null)} />}</Modal.Body></Modal>
    <Modal show={Boolean(desactivando)} onHide={() => !enviando && setDesactivando(null)} aria-labelledby="titulo-desactivar-usuario"><Modal.Header><Modal.Title id="titulo-desactivar-usuario">Desactivar cuenta</Modal.Title></Modal.Header>
      <Modal.Body>¿Desactivar la cuenta de {desactivando?.nombre}? Perderá el acceso al sistema.</Modal.Body>
      <Modal.Footer><Button disabled={enviando} variant="outline-secondary" onClick={() => setDesactivando(null)}>Cancelar</Button><Button disabled={enviando} variant="danger" onClick={desactivar}>Confirmar desactivación</Button></Modal.Footer></Modal>
  </section>
}
