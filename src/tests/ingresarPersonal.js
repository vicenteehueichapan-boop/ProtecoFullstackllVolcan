import { act, screen } from '@testing-library/react'

export async function ingresarPersonalEnPrueba(usuario, correo) {
  act(() => {
    window.history.pushState({}, '', '/personal')
    window.dispatchEvent(new PopStateEvent('popstate'))
  })
  const salidas = screen.queryAllByRole('button', { name: 'Cerrar sesión del personal' })
  if (salidas.length) await usuario.click(salidas[0])
  await usuario.type(screen.getByLabelText('Correo del personal'), correo)
  await usuario.type(screen.getByLabelText('Contraseña'), 'formato-demo')
  await usuario.click(screen.getByRole('button', { name: 'Ingresar' }))
}
