import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AxiosError } from 'axios'
import DatosApiProvider from './DatosApiProvider'
import { useSesionCliente } from '../hooks/useSesionCliente'
import { useSesionPersonal } from '../hooks/useSesionPersonal'
import { api, guardarToken, leerToken } from '../services/api'
import { obtenerSesion } from '../services/sesionService'

const usuario = { id: 'cliente-prueba', nombre: 'Ana', apellidos: 'Prueba', correo: 'ana@ejemplo.cl', rol: 'cliente',
  perfil: { tipoCliente: 'residencial', zonaId: null } }
const token = (exp) => `cabecera.${btoa(JSON.stringify({ sub: usuario.id, exp }))}.firma-ficticia`
const adapterOriginal = api.defaults.adapter
let solicitudes
let tokenActual

function Controles() {
  const sesion = useSesionCliente()
  const personal = useSesionPersonal()
  return <>
    <p>{sesion.cliente ? `Cliente: ${sesion.cliente.nombre}` : 'Sin cliente'}</p>
    <p>{personal.personal ? `Personal: ${personal.personal.rol}` : 'Sin personal'}</p>
    <button onClick={() => sesion.ingresar({ correo: 'ana@ejemplo.cl', clave: 'Prueba2026!' })}>Ingresar prueba</button>
    <button onClick={sesion.salir}>Salir prueba</button>
  </>
}

beforeEach(() => {
  sessionStorage.clear(); localStorage.clear(); solicitudes = []
  tokenActual = token(Math.floor(Date.now() / 1000) + 900)
  api.defaults.adapter = async (config) => {
    solicitudes.push({ url: config.url, autorizacion: config.headers.Authorization, cuerpo: config.data })
    let data = []
    if (config.url === '/auth/login') data = { accessToken: tokenActual, tokenType: 'Bearer', expiresIn: 900 }
    if (config.url === '/auth/me') data = usuario
    return { data, status: config.url === '/auth/logout' ? 204 : 200, statusText: 'OK', headers: {}, config }
  }
})
afterEach(() => { api.defaults.adapter = adapterOriginal; vi.useRealTimers(); guardarToken(null) })

describe('sesión real de React mediante el servicio HTTP', () => {
  it('envía credenciales al login, conserva el token en sessionStorage y restaura la identidad al remontar', async () => {
    const vista = render(<DatosApiProvider><Controles /></DatosApiProvider>)
    await screen.findByText('Sin cliente')
    fireEvent.click(screen.getByText('Ingresar prueba'))
    await screen.findByText('Cliente: Ana')
    expect(JSON.parse(solicitudes.find((solicitud) => solicitud.url === '/auth/login').cuerpo)).toEqual({correo:'ana@ejemplo.cl',contrasena:'Prueba2026!'})
    expect(leerToken()).toBe(tokenActual)
    expect(localStorage.length).toBe(0)
    expect(JSON.stringify(Object.values(sessionStorage))).not.toContain('Prueba2026!')
    vista.unmount()
    render(<DatosApiProvider><Controles /></DatosApiProvider>)
    await screen.findByText('Cliente: Ana')
    expect(solicitudes.filter((solicitud) => solicitud.url === '/auth/me')).toHaveLength(2)
    expect(solicitudes.find((solicitud) => solicitud.url === '/pedidos').autorizacion).toBe(`Bearer ${tokenActual}`)
  })
  it('logout llama a la API y elimina sesión y permisos visibles', async () => {
    guardarToken(tokenActual)
    render(<DatosApiProvider><Controles /></DatosApiProvider>)
    await screen.findByText('Cliente: Ana')
    fireEvent.click(screen.getByText('Salir prueba'))
    await screen.findByText('Sin cliente')
    expect(leerToken()).toBeNull()
    expect(solicitudes.some((solicitud) => solicitud.url === '/auth/logout')).toBe(true)
  })
  it('un 401 autenticado limpia el token y el usuario actual', async () => {
    guardarToken(tokenActual)
    render(<DatosApiProvider><Controles /></DatosApiProvider>)
    await screen.findByText('Cliente: Ana')
    api.defaults.adapter = async (config) => { throw new AxiosError('rechazado','ERR_BAD_REQUEST',config,null,{status:401,data:{error:{mensaje:'La sesión venció.'}},config,headers:{}}) }
    await act(async () => { await expect(obtenerSesion()).rejects.toThrow('La sesión venció.') })
    await screen.findByText('Sin cliente')
    expect(leerToken()).toBeNull()
  })
  it('al vencer el token se retira la sesión sin esperar otra solicitud', async () => {
    vi.useFakeTimers()
    tokenActual = token(Math.floor(Date.now() / 1000) + 10)
    guardarToken(tokenActual)
    await act(async () => { render(<DatosApiProvider><Controles /></DatosApiProvider>) })
    expect(screen.getByText('Cliente: Ana')).toBeInTheDocument()
    await act(async () => { await vi.advanceTimersByTimeAsync(11000) })
    expect(screen.getByText('Sin cliente')).toBeInTheDocument()
    expect(screen.getByText('Tu sesión venció. Vuelve a ingresar.')).toBeInTheDocument()
    expect(leerToken()).toBeNull()
  })
  it('muestra el fallo de carga y permite reintentar sin datos simulados', async () => {
    const adapter = api.defaults.adapter
    api.defaults.adapter = async (config) => { throw new AxiosError('red','ERR_NETWORK',config) }
    render(<DatosApiProvider><Controles /></DatosApiProvider>)
    await screen.findByText(/No fue posible contactar la API/)
    api.defaults.adapter = adapter
    fireEvent.click(screen.getByText('Reintentar'))
    await screen.findByText('Sin cliente')
    await waitFor(() => expect(screen.queryByText(/No fue posible contactar la API/)).not.toBeInTheDocument())
  })
})
