import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Precio from './Precio'

describe('Precio', () => {
  it('muestra el valor recibido con el estilo de precio del sitio', () => {
    render(<Precio valor="$12.000" />)

    expect(screen.getByText('$12.000')).toHaveClass('marca-volcan', 'fw-bold')
  })
})
