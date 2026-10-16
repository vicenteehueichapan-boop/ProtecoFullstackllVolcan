import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import TablaUsuarios from './TablaUsuarios'

describe('TablaUsuarios', () => {
  it('muestra el estado de cada usuario y el enlace a su ficha', () => {
    const filas = [
      { id: 'CLI-0001', nombre: 'Ana Pérez', detalle: 'residencial', activo: true },
      { id: 'CLI-0002', nombre: 'Luis Soto', detalle: 'comercial', activo: false },
    ]
    render(<TablaUsuarios titulo="Clientes" filas={filas} rutaBase="/administracion/usuarios/clientes" alNavegar={vi.fn()} />)

    expect(screen.getByText('Activo')).toBeInTheDocument()
    expect(screen.getByText('Desactivado')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver y editar a Luis Soto' }))
      .toHaveAttribute('href', '/administracion/usuarios/clientes/CLI-0002')
  })

  it('avisa cuando todavía no hay registros', () => {
    render(<TablaUsuarios titulo="Clientes" filas={[]} rutaBase="/x" alNavegar={vi.fn()} />)

    expect(screen.getByText('Todavía no hay registros.')).toBeInTheDocument()
  })
})
