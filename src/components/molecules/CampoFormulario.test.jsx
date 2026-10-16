import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CampoFormulario from './CampoFormulario'

describe('CampoFormulario', () => {
  it('une etiqueta y campo, sin error cuando no se recibe', () => {
    render(<CampoFormulario identificador="nombre" etiqueta="Nombre" value="Ana" onChange={vi.fn()} />)

    const campo = screen.getByLabelText('Nombre')
    expect(campo).toHaveValue('Ana')
    expect(campo).toHaveAttribute('aria-invalid', 'false')
    expect(campo).not.toHaveAttribute('aria-describedby')
  })

  it('marca el campo como inválido y asocia el mensaje para lectores de pantalla', () => {
    render(<CampoFormulario identificador="nombre" etiqueta="Nombre" value="" onChange={vi.fn()} error="Ingresa tu nombre." />)

    const campo = screen.getByLabelText('Nombre')
    expect(campo).toHaveClass('is-invalid')
    expect(campo).toHaveAccessibleDescription('Ingresa tu nombre.')
  })
})
