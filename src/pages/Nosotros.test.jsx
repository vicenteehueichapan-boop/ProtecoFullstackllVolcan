import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Nosotros from './Nosotros'

describe('página Nosotros', () => {
  it('presenta a la empresa con los datos del caso y su equipo', () => {
    render(<Nosotros />)

    expect(screen.getByText(/fue fundada en 1998 en Chillán, Región de Ñuble/)).toBeInTheDocument()
    expect(screen.getByText(/entre 80 y 120 pedidos diarios/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Repartidores (3)' })).toBeInTheDocument()
    expect(document.title).toBe('Nosotros | Gas El Volcán')
  })
})
