import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'

describe('página no encontrada', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/direccion-que-no-existe')
  })

  it('responde a una dirección desconocida con salida al inicio', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Volver al inicio' })).toHaveAttribute('href', '/')
  })
})
