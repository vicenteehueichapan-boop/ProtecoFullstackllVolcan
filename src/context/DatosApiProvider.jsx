import { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Container } from 'react-bootstrap'
import { ProductosContext } from './productosContextoBase'
import { PedidosContext } from './pedidosContextoBase'
import { UsuariosContext } from './usuariosContextoBase'
import { SesionClienteContext } from './sesionClienteContextoBase'
import { SesionPersonalContext } from './sesionPersonalContextoBase'
import * as catalogoApi from '../services/catalogoApiService'
import * as pedidosApi from '../services/pedidosApiService'
import * as usuariosApi from '../services/usuariosApiService'
import * as sesionApi from '../services/sesionService'
import { guardarToken, leerToken, vencimientoToken } from '../services/api'

// Conserva los contratos de los componentes EP2. Los datos compartidos ahora vienen de la API.
export default function DatosApiProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [zonas, setZonas] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [cargandoSesion, setCargandoSesion] = useState(Boolean(leerToken()))
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true)
  const [usuarioCargado, setUsuarioCargado] = useState(null)
  const [error, setError] = useState('')
  const [avisoSesion, setAvisoSesion] = useState('')
  const [intento, setIntento] = useState(0)

  const recargarProductos = useCallback(async () => {
    const datos = await catalogoApi.listarProductos()
    setProductos(datos)
    return datos
  }, [])

  useEffect(() => {
    const control = new AbortController()
    Promise.all([catalogoApi.listarProductos(control.signal), catalogoApi.listarCategorias(control.signal), catalogoApi.listarZonas(control.signal)])
      .then(([lista, grupos, areas]) => { setProductos(lista); setCategorias(grupos); setZonas(areas); setError('') })
      .catch((excepcion) => { if (!control.signal.aborted) setError(excepcion.message) })
      .finally(() => { if (!control.signal.aborted) setCargandoCatalogo(false) })
    return () => control.abort()
  }, [intento])

  useEffect(() => {
    let vigente = true
    async function recuperar() {
      const token = leerToken()
      if (!token) { setCargandoSesion(false); return }
      if (vencimientoToken(token) <= Date.now()) { guardarToken(null); setCargandoSesion(false); return }
      try { const cuenta = await sesionApi.obtenerSesion(); if (vigente) setUsuario(cuenta) }
      catch (excepcion) { if (vigente) setAvisoSesion(excepcion.message) }
      finally { if (vigente) setCargandoSesion(false) }
    }
    recuperar()
    function cambio() {
      if (!leerToken()) {
        setUsuario(null); setPedidos([]); setUsuarios([])
      }
    }
    window.addEventListener('sesion-actualizada', cambio)
    return () => { vigente = false; window.removeEventListener('sesion-actualizada', cambio) }
  }, [])

  useEffect(() => {
    if (!usuario) return
    const restante = vencimientoToken(leerToken() ?? '') - Date.now()
    const reloj = setTimeout(() => { guardarToken(null); setAvisoSesion('Tu sesión venció. Vuelve a ingresar.') }, Math.max(0, restante))
    return () => clearTimeout(reloj)
  }, [usuario])

  useEffect(() => {
    if (!usuario) return
    const control = new AbortController()
    const leerUsuarios = usuario.rol === 'administracion' ? usuariosApi.listarUsuarios
      : usuario.rol === 'operadora' ? usuariosApi.listarRepartidores : async () => []
    Promise.all([pedidosApi.listarPedidos(control.signal), leerUsuarios(control.signal)])
      .then(([lista, cuentas]) => { setPedidos(lista); setUsuarios(cuentas); setError('') })
      .catch((excepcion) => { if (!control.signal.aborted) setError(excepcion.message) })
      .finally(() => { if (!control.signal.aborted) setUsuarioCargado(usuario.id) })
    return () => control.abort()
  }, [usuario, intento])

  async function ingresar(datos, soloPersonal = false) {
    const cuenta = await sesionApi.ingresar(datos)
    if (soloPersonal === (cuenta.rol === 'cliente')) {
      await sesionApi.salir()
      throw new Error(soloPersonal ? 'Esta cuenta pertenece a un cliente.' : 'Usa el acceso del personal para esta cuenta.')
    }
    setAvisoSesion(''); setUsuario(cuenta)
    return cuenta
  }
  async function registrar(datos) { const cuenta = await sesionApi.registrar(datos); setAvisoSesion(''); setUsuario(cuenta); return cuenta }
  async function salir() {
    try { await sesionApi.salir(); setAvisoSesion('Sesión cerrada.') }
    catch { setAvisoSesion('La sesión se cerró en esta pestaña. La API no pudo confirmar la revocación; el token vence en un máximo de 15 minutos.') }
  }
  async function guardarProducto(datos, codigo) {
    const resultado = codigo ? await catalogoApi.actualizarProducto(codigo, datos) : await catalogoApi.crearProducto(datos)
    setProductos((lista) => codigo ? lista.map((item) => item.codigo === codigo ? resultado : item) : [...lista, resultado])
    return resultado
  }
  async function eliminarProducto(codigo) {
    await catalogoApi.eliminarProducto(codigo)
    setProductos((lista) => lista.filter((item) => item.codigo !== codigo))
  }
  async function operarPedido(operacion, ...argumentos) {
    const resultado = await operacion(...argumentos)
    setPedidos((lista) => lista.some((item) => item.id === resultado.id)
      ? lista.map((item) => item.id === resultado.id ? resultado : item) : [resultado, ...lista])
    return resultado
  }
  async function eliminarPedido(id) {
    await pedidosApi.eliminarPedido(id)
    setPedidos((lista) => lista.filter((item) => item.id !== id))
    recargarProductos().catch(() => {})
  }
  async function guardarUsuario(datos, id) {
    const resultado = id ? await usuariosApi.actualizarUsuario(id, datos) : await usuariosApi.crearPersonal(datos)
    setUsuarios((lista) => id ? lista.map((item) => item.id === id ? resultado : item) : [...lista, resultado])
    if (id === usuario?.id) { guardarToken(null); setAvisoSesion('Tu cuenta cambió. Vuelve a ingresar para aplicar los permisos.') }
    return resultado
  }
  async function desactivarUsuario(id) {
    await usuariosApi.desactivarUsuario(id)
    setUsuarios((lista) => lista.map((item) => item.id === id ? { ...item, activo: false, estado: 'deshabilitado' } : item))
    if (id === usuario?.id) guardarToken(null)
  }

  const catalogo = { productos, categorias, zonas, errorProductos: '', recargarProductos,
    crearProducto: (datos) => guardarProducto(datos),
    actualizarProducto: (codigo, datos) => guardarProducto(datos, codigo), eliminarProducto }
  const registro = { pedidos, errorPedidos: '',
    crearPedido: (datos) => operarPedido(pedidosApi.crearPedido, datos),
    buscarPedido: pedidosApi.obtenerPedido,
    asignarRepartidor: (id, repartidor) => operarPedido(pedidosApi.asignarRepartidor, id, repartidor),
    cambiarEstado: (id, estado) => operarPedido(pedidosApi.cambiarEstadoPedido, id, estado),
    eliminarPedido }
  const cuentas = { personal: usuarios.filter((cuenta) => cuenta.rol !== 'cliente'), clientes: usuarios.filter((cuenta) => cuenta.rol === 'cliente'),
    errorPersonal: '', errorClientes: '', crearPersonal: (datos) => guardarUsuario(datos),
    actualizarPersonal: (id, datos) => guardarUsuario(datos, id),
    actualizarCliente: (id, datos) => guardarUsuario(datos, id), desactivarUsuario }

  return (
    <ProductosContext.Provider value={catalogo}>
      <PedidosContext.Provider value={registro}>
        <UsuariosContext.Provider value={cuentas}>
          <SesionClienteContext.Provider value={{ cliente: usuario?.rol === 'cliente' ? usuario : null, registrar, ingresar, salir, errorClientes: '', cargandoSesion }}>
            <SesionPersonalContext.Provider value={{ personal: usuario && usuario.rol !== 'cliente' ? usuario : null,
              ingresarPersonal: (datos) => ingresar(datos, true), salirPersonal: salir, cargandoSesion }}>
              <Container className="pt-2">
                {(cargandoCatalogo || cargandoSesion || (usuario && usuarioCargado !== usuario.id)) && <p role="status">Cargando datos…</p>}
                {avisoSesion && <Alert variant="info">{avisoSesion}</Alert>}
                {error && <Alert variant="danger">{error} <Button variant="outline-danger" size="sm" onClick={() => { setCargandoCatalogo(true); setIntento((actual) => actual + 1) }}>Reintentar</Button></Alert>}
              </Container>
              {!cargandoSesion && !cargandoCatalogo && (!usuario || usuarioCargado === usuario.id) && children}
            </SesionPersonalContext.Provider>
          </SesionClienteContext.Provider>
        </UsuariosContext.Provider>
      </PedidosContext.Provider>
    </ProductosContext.Provider>
  )
}
