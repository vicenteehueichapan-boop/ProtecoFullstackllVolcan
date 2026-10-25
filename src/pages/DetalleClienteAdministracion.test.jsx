import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { leerSesionCliente, iniciarSesionCliente, registrarCliente } from '../services/clienteService'
import { crearPedido } from '../services/pedidoService'
import { abrirAdministracion } from '../tests/abrirAdministracion'
import { datosPedido } from '../tests/datosPedido'

describe('página Ficha de cliente', () => {
  beforeEach(() => {
    localStorage.clear()
    const { id } = registrarCliente({ nombre: 'Ana', apellidos: 'Pérez', run: '12345678K', correo: 'ana@correo.cl', tipoCliente: 'residencial' })
    crearPedido({ ...datosPedido, clienteId: id })
    crearPedido(datosPedido)
  })

  it('muestra solo el historial de pedidos de esa cuenta', async () => {
    await abrirAdministracion('/administracion/usuarios/clientes/CLI-0001')

    expect(screen.getByRole('heading', { level: 1, name: 'Ana Pérez' })).toBeInTheDocument()
    expect(screen.getByText('1 pedidos · $6.500 en total.')).toBeInTheDocument()
    expect(screen.getByText('PED-0001')).toBeInTheDocument()
    expect(screen.queryByText('PED-0002')).not.toBeInTheDocument()
  })

  it('desactiva la cuenta y su sesión deja de valer', async () => {
    iniciarSesionCliente('ana@correo.cl')
    const usuario = await abrirAdministracion('/administracion/usuarios/clientes/CLI-0001')

    await usuario.click(screen.getByLabelText('Cuenta activa'))
    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Cambios guardados.')
    expect(leerSesionCliente()).toBeNull()
  })

  it('informa una cuenta inexistente', async () => {
    await abrirAdministracion('/administracion/usuarios/clientes/CLI-0404')

    expect(screen.getByText(/No existe una cuenta con el identificador CLI-0404/)).toBeInTheDocument()
  })
})
