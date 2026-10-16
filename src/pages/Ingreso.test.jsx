import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { iniciarSesionCliente, leerSesionCliente, registrarCliente } from '../services/clienteService'
import { renderizarConSesion } from '../tests/renderizarConSesion'
import Ingreso from './Ingreso'

async function ingresar(correo) {
  await userEvent.type(screen.getByLabelText('Correo'), correo)
  await userEvent.type(screen.getByLabelText('Contraseña'), 'volcan2026')
  await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
}

describe('página Ingreso', () => {
  beforeEach(() => {
    localStorage.clear()
    registrarCliente({ nombre: 'Camila', apellidos: 'Sepúlveda', run: '12345678K', correo: 'camila@correo.cl', tipoCliente: 'residencial' })
  })

  it('inicia sesión y vuelve a la página desde donde se pidió ingresar', async () => {
    renderizarConSesion(<Ingreso />, {
      ruta: '/ingreso',
      entrada: { pathname: '/ingreso', state: { desde: '/confirmar-pedido' } },
    })
    await ingresar('CAMILA@correo.cl')

    expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/confirmar-pedido')
    expect(leerSesionCliente()?.id).toBe('CLI-0001')
  })

  it('sin página de origen, lleva a Mis pedidos', async () => {
    renderizarConSesion(<Ingreso />, { ruta: '/ingreso' })
    await ingresar('camila@correo.cl')

    expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/mis-pedidos')
  })

  it('explica cuando el correo no tiene cuenta', async () => {
    renderizarConSesion(<Ingreso />, { ruta: '/ingreso' })
    await ingresar('nadie@correo.cl')

    expect(screen.getByLabelText('Correo')).toHaveAccessibleDescription(/No existe una cuenta con ese correo/)
    expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/ingreso')
  })

  it('con sesión iniciada ofrece ver pedidos o cerrar la sesión', async () => {
    iniciarSesionCliente('camila@correo.cl')
    renderizarConSesion(<Ingreso />, { ruta: '/ingreso' })

    expect(screen.getByText(/Ya ingresaste como/)).toHaveTextContent('Camila Sepúlveda')
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(screen.getByLabelText('Correo')).toBeInTheDocument()
    expect(leerSesionCliente()).toBeNull()
  })
})
