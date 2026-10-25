import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ResultadoPedidoFallido from './ResultadoPedidoFallido'

describe('ResultadoPedidoFallido', () => {
  it('explica el motivo y aclara que no se registró ningún pedido', () => {
    render(<ResultadoPedidoFallido mensaje="El stock cambió." alReintentar={vi.fn()} alRevisarCarrito={vi.fn()} />)

    const aviso = screen.getByRole('alert')
    expect(aviso).toHaveTextContent('Pedido no realizado')
    expect(aviso).toHaveTextContent('El stock cambió.')
    expect(aviso).toHaveTextContent('No se registró ningún pedido')
  })

  it('avisa al padre qué quiere hacer la persona: reintentar o revisar el carrito', async () => {
    const alReintentar = vi.fn()
    const alRevisarCarrito = vi.fn()
    render(<ResultadoPedidoFallido mensaje="Error" alReintentar={alReintentar} alRevisarCarrito={alRevisarCarrito} />)

    await userEvent.click(screen.getByRole('button', { name: 'Volver a intentarlo' }))
    await userEvent.click(screen.getByRole('button', { name: 'Revisar mi carrito' }))

    expect(alReintentar).toHaveBeenCalledOnce()
    expect(alRevisarCarrito).toHaveBeenCalledOnce()
  })
})
