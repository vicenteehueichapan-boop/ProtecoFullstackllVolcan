import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import EtiquetaEstadoPedido from './EtiquetaEstadoPedido'

describe('EtiquetaEstadoPedido', () => {
  it.each([
    ['pendiente', 'Pendiente', 'bg-warning'],
    ['asignado', 'Asignado', 'bg-info'],
    ['en_camino', 'En camino', 'bg-primary'],
    ['entregado', 'Entregado', 'bg-success'],
  ])('presenta el estado %s con su texto y color', (estado, texto, clase) => {
    render(<EtiquetaEstadoPedido estado={estado} />)

    expect(screen.getByText(texto)).toHaveClass(clase)
  })

  it('no falla con un estado desconocido', () => {
    render(<EtiquetaEstadoPedido estado="otro" />)

    expect(screen.getByText('Estado desconocido')).toHaveClass('bg-secondary')
  })
})
