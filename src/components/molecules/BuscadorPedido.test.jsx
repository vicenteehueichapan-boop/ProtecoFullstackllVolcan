import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import BuscadorPedido from './BuscadorPedido'

describe('BuscadorPedido', () => {
  it('entrega al padre el identificador normalizado, sin necesitar router', async () => {
    const alBuscar = vi.fn()
    render(<BuscadorPedido identificadorInicial="" alBuscar={alBuscar} />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Número del pedido' }), ' ped-0002 ')
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }))
    expect(alBuscar).toHaveBeenCalledExactlyOnceWith('PED-0002')
  })

  it('no busca cuando la entrada solo contiene espacios', async () => {
    const alBuscar = vi.fn()
    render(<BuscadorPedido identificadorInicial="" alBuscar={alBuscar} />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Número del pedido' }), '   ')
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }))
    expect(alBuscar).not.toHaveBeenCalled()
  })
})
