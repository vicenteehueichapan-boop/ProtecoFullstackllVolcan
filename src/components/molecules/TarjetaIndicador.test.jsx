import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TarjetaIndicador from './TarjetaIndicador'

describe('TarjetaIndicador', () => {
  it('muestra título, valor y detalle recibidos por props', () => {
    render(<TarjetaIndicador titulo="Pedidos pendientes" valor={3} detalle="Esperan repartidor." />)

    expect(screen.getByRole('heading', { name: 'Pedidos pendientes' })).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('lleva al módulo indicado', async () => {
    const alNavegar = vi.fn()
    render(<TarjetaIndicador titulo="Críticos" valor={1} ruta="/administracion/criticos" textoEnlace="Ver críticos" alNavegar={alNavegar} />)

    await userEvent.click(screen.getByRole('link', { name: 'Ver críticos' }))

    expect(alNavegar).toHaveBeenCalledWith('/administracion/criticos')
  })
})
