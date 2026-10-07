import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CoberturaDespacho from './CoberturaDespacho'

describe('CoberturaDespacho', () => {
  it('compone tarjetas con las zonas recibidas y refleja cambios en props', () => {
    const zona = {
      id: 'prueba', nombre: 'Sector de prueba', comunas: 'Comuna de prueba',
      tiempoEstimado: '2 horas', dias: 'Lunes', horario: '09:00 a 18:00',
    }
    const { rerender } = render(<CoberturaDespacho zonas={[zona]} />)
    expect(screen.getByRole('heading', { name: 'Sector de prueba' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByText('2 horas')).toBeInTheDocument()
    expect(screen.getByText('Lunes · 09:00 a 18:00')).toBeInTheDocument()
    rerender(<CoberturaDespacho zonas={[{ ...zona, id: 'otra', nombre: 'Otro sector' }]} />)
    expect(screen.queryByRole('heading', { name: 'Sector de prueba' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Otro sector' })).toBeInTheDocument()
  })
})
