import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import MenuAdministracion from './MenuAdministracion'

describe('MenuAdministracion', () => {
  it('marca la sección actual, también en sus subrutas', () => {
    render(<MenuAdministracion rutaActual="/administracion/pedidos/PED-0001" alNavegar={vi.fn()} />)

    expect(screen.getByRole('link', { name: 'Pedidos' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Panel' })).not.toHaveAttribute('aria-current')
  })

  it('avisa la sección elegida sin recargar', async () => {
    const alNavegar = vi.fn()
    render(<MenuAdministracion rutaActual="/administracion" alNavegar={alNavegar} />)

    await userEvent.click(screen.getByRole('link', { name: 'Reportes' }))

    expect(alNavegar).toHaveBeenCalledExactlyOnceWith('/administracion/reportes')
  })
})
