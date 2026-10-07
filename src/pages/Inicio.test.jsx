import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'

describe('Inicio', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  it('compone cilindros y cobertura, y permite continuar al catálogo', async () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Gas para cada día' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Llegamos a tu sector' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Ver detalle de/ })).toHaveLength(4)
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(5)
    await userEvent.click(screen.getByRole('link', { name: 'Ver todo el catálogo' }))
    expect(screen.getByRole('heading', { name: 'Catálogo de productos' })).toBeInTheDocument()
    expect(screen.getByText('10 productos encontrados')).toBeInTheDocument()
  })
})
