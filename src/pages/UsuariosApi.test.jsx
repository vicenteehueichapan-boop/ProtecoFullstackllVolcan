import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import UsuariosApi from './UsuariosApi'
import { UsuariosContext } from '../context/usuariosContextoBase'

it('muestra el rechazo del alta dentro del formulario abierto y conserva los datos para corregirlos', async () => {
  const crearPersonal = vi.fn().mockRejectedValue(new Error('Ese correo ya está registrado.'))
  const usuario = userEvent.setup()
  render(<UsuariosContext.Provider value={{ personal: [], clientes: [], crearPersonal, actualizarPersonal: vi.fn(), desactivarUsuario: vi.fn() }}>
    <UsuariosApi />
  </UsuariosContext.Provider>)
  await usuario.click(screen.getByRole('button', { name: 'Crear cuenta del personal' }))
  const dialogo = await screen.findByRole('dialog', { name: 'Crear cuenta del personal' })
  const formulario = within(dialogo)
  await usuario.type(formulario.getByLabelText('Nombre'), 'Ana')
  await usuario.type(formulario.getByLabelText('Apellidos'), 'Prueba')
  await usuario.type(formulario.getByLabelText('Correo'), 'ana@ejemplo.cl')
  await usuario.type(formulario.getByLabelText('Contraseña inicial'), 'Prueba2026!')
  await usuario.selectOptions(formulario.getByLabelText('Rol'), 'operadora')
  await usuario.click(formulario.getByRole('button', { name: 'Crear perfil' }))

  expect(await formulario.findByRole('alert')).toHaveTextContent('Ese correo ya está registrado.')
  expect(formulario.getByLabelText('Correo')).toHaveValue('ana@ejemplo.cl')
  expect(formulario.getByLabelText('Nombre')).toHaveValue('Ana')
  expect(formulario.getByRole('button', { name: 'Crear perfil' })).toBeEnabled()
  expect(crearPersonal).toHaveBeenCalledTimes(1)
})
