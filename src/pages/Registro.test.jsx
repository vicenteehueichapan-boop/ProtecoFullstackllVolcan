import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { leerSesionCliente, registrarCliente } from '../services/clienteService'
import { renderizarConSesion } from '../tests/renderizarConSesion'
import Registro from './Registro'

async function completarRegistro(correo) {
  await userEvent.type(screen.getByLabelText('Nombre'), 'Camila')
  await userEvent.type(screen.getByLabelText('Apellidos'), 'Sepúlveda')
  await userEvent.type(screen.getByLabelText('RUN sin puntos ni guion'), '12345678K')
  await userEvent.type(screen.getByLabelText('Correo'), correo)
  await userEvent.type(screen.getByLabelText('Contraseña'), 'volcan2026')
  await userEvent.type(screen.getByLabelText('Confirmar contraseña'), 'volcan2026')
  await userEvent.click(screen.getByRole('button', { name: 'Registrarme' }))
}

describe('página Registro', () => {
  beforeEach(() => localStorage.clear())

  it('crea la cuenta, inicia sesión y lleva al catálogo', async () => {
    renderizarConSesion(<Registro />, { ruta: '/registro' })
    await completarRegistro('camila@correo.cl')

    expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/catalogo')
    expect(leerSesionCliente()?.correo).toBe('camila@correo.cl')
  })

  it('muestra el motivo cuando el correo ya tiene cuenta y no cambia de página', async () => {
    registrarCliente({ nombre: 'Otra', apellidos: 'Persona', run: '11111111K', correo: 'camila@correo.cl', tipoCliente: 'residencial' })
    renderizarConSesion(<Registro />, { ruta: '/registro' })
    await completarRegistro('camila@correo.cl')

    expect(screen.getByLabelText('Correo')).toHaveAccessibleDescription('Ya existe una cuenta con ese correo.')
    expect(screen.getByLabelText('Ruta actual')).toHaveTextContent('/registro')
    expect(leerSesionCliente()).toBeNull()
  })

  it('impide que un comprador use un correo del personal', async () => {
    renderizarConSesion(<Registro />, { ruta: '/registro' })
    await completarRegistro('administracion@ejemplo.cl')

    expect(screen.getByLabelText('Correo')).toHaveAccessibleDescription(/reservado para el personal/)
  })
})
