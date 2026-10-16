import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import PiePagina from './PiePagina'

describe('PiePagina', () => {
  it('ofrece el acceso del personal como enlace real y avisa la ruta al hacer clic', async () => {
    const alNavegar = vi.fn()
    render(<PiePagina alNavegar={alNavegar} />)

    const acceso = screen.getByRole('link', { name: 'Acceso del personal' })
    expect(acceso).toHaveAttribute('href', '/personal')
    await userEvent.click(acceso)

    expect(alNavegar).toHaveBeenCalledExactlyOnceWith('/personal')
  })
})
