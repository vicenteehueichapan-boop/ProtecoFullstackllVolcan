import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import BarraPersonal from './BarraPersonal'

describe('BarraPersonal', () => {
  it('ofrece cerrar sesión solo cuando hay un perfil y lo avisa al padre', async () => {
    const alSalir = vi.fn()
    const { rerender } = render(<BarraPersonal personal={null} alSalir={alSalir} alNavegar={vi.fn()} />)
    expect(screen.queryByRole('button', { name: 'Cerrar sesión del personal' })).not.toBeInTheDocument()

    rerender(<BarraPersonal personal={{ nombre: 'Operadora' }} alSalir={alSalir} alNavegar={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión del personal' }))

    expect(alSalir).toHaveBeenCalledOnce()
  })

  it('vuelve a la tienda sin recargar mediante alNavegar', async () => {
    const alNavegar = vi.fn()
    render(<BarraPersonal personal={null} alSalir={vi.fn()} alNavegar={alNavegar} />)

    await userEvent.click(screen.getByRole('link', { name: 'Volver a la tienda' }))

    expect(alNavegar).toHaveBeenCalledExactlyOnceWith('/')
  })
})
