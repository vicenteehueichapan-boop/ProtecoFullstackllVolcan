import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import FormularioIngreso from './FormularioIngreso'

it('espera la respuesta, evita reenvíos y conserva los datos cuando el servicio rechaza el ingreso', async () => {
  let resolver
  const alIngresar = vi.fn(() => new Promise((resolve) => { resolver = resolve }))
  const usuario = userEvent.setup()
  render(<FormularioIngreso alIngresar={alIngresar} etiquetaCorreo="Correo" />)
  await usuario.type(screen.getByLabelText('Correo'),'ana@ejemplo.cl')
  await usuario.type(screen.getByLabelText('Contraseña'),'Prueba2026!')
  const enviar = screen.getByRole('button',{name:'Ingresar'})
  await usuario.click(enviar)
  expect(enviar).toBeDisabled()
  await usuario.click(enviar)
  expect(alIngresar).toHaveBeenCalledTimes(1)
  await act(async () => resolver({correo:'Correo o contraseña incorrectos.'}))
  expect(enviar).toBeEnabled()
  expect(screen.getByText('Correo o contraseña incorrectos.')).toBeInTheDocument()
  expect(screen.getByLabelText('Correo')).toHaveValue('ana@ejemplo.cl')
})
