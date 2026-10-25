import { act, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { ingresarPersonalEnPrueba } from './ingresarPersonal'

// Cambia la dirección como lo haría el navegador (historial + evento popstate).
export function irA(ruta) {
  act(() => {
    window.history.pushState({}, '', ruta)
    window.dispatchEvent(new PopStateEvent('popstate'))
  })
}

// Monta la aplicación completa, ingresa con el perfil de administración de demostración
// y abre la ruta pedida. Devuelve el usuario simulado para seguir interactuando.
export async function abrirAdministracion(ruta) {
  window.history.replaceState({}, '', '/personal')
  const usuario = userEvent.setup()
  render(<App />)
  await ingresarPersonalEnPrueba(usuario, 'administracion@ejemplo.cl')
  irA(ruta)
  return usuario
}
