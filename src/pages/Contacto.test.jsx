import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { listarMensajes } from '../services/mensajeService'
import { renderizarConSesion } from '../tests/renderizarConSesion'
import Contacto from './Contacto'

describe('página Contacto', () => {
  beforeEach(() => localStorage.clear())

  it('guarda el mensaje, confirma con su número y deja el formulario vacío', async () => {
    renderizarConSesion(<Contacto />, { ruta: '/contacto' })

    await userEvent.type(screen.getByLabelText('Nombre'), 'Ana Pérez')
    await userEvent.type(screen.getByLabelText('Correo para responderte'), 'ana@correo.cl')
    await userEvent.selectOptions(screen.getByLabelText('Motivo'), 'Estado de un pedido')
    await userEvent.type(screen.getByLabelText('Mensaje'), 'Mi pedido PED-0001 no ha llegado.')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Recibimos tu mensaje MSG-0001')
    expect(listarMensajes()).toHaveLength(1)
    expect(screen.getByLabelText('Nombre')).toHaveValue('')
  })

  it('muestra los días de despacho de las cinco zonas', () => {
    renderizarConSesion(<Contacto />, { ruta: '/contacto' })

    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    expect(screen.getByText(/martes y jueves, 08:00 a 16:00/)).toBeInTheDocument()
  })
})
