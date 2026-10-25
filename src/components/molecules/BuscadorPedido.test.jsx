import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import BuscadorPedido from './BuscadorPedido'

describe('BuscadorPedido', () => {
  it('entrega al padre el número normalizado y el correo, sin necesitar router', async () => {
    const alBuscar = vi.fn()
    render(<BuscadorPedido identificadorInicial="" alBuscar={alBuscar} />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Número del pedido' }), ' ped-0002 ')
    await userEvent.type(screen.getByRole('textbox', { name: 'Correo usado en el pedido' }), ' ana@correo.cl ')
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }))
    expect(alBuscar).toHaveBeenCalledExactlyOnceWith({ identificador: 'PED-0002', correo: 'ana@correo.cl' })
  })

  it('parte con el correo recibido por props', () => {
    render(<BuscadorPedido identificadorInicial="PED-0001" correoInicial="ana@correo.cl" alBuscar={vi.fn()} />)
    expect(screen.getByRole('textbox', { name: 'Correo usado en el pedido' })).toHaveValue('ana@correo.cl')
  })

  it('no busca cuando la entrada solo contiene espacios', async () => {
    const alBuscar = vi.fn()
    render(<BuscadorPedido identificadorInicial="" alBuscar={alBuscar} />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Número del pedido' }), '   ')
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }))
    expect(alBuscar).not.toHaveBeenCalled()
  })
})
