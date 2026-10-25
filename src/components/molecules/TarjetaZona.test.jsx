import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TarjetaZona from './TarjetaZona'

describe('TarjetaZona', () => {
  it('muestra comunas, tiempo estimado, días y horario de la zona', () => {
    const zona = { nombre: 'Zona Sur', comunas: 'Bulnes y Quillón', dias: 'Miércoles', horario: '08:00 a 16:00', tiempoEstimado: '4 a 6 horas' }
    render(<TarjetaZona zona={zona} />)

    expect(screen.getByRole('heading', { name: 'Zona Sur' })).toBeInTheDocument()
    expect(screen.getByText('Bulnes y Quillón')).toBeInTheDocument()
    expect(screen.getByText('4 a 6 horas')).toBeInTheDocument()
    expect(screen.getByText('Miércoles · 08:00 a 16:00')).toBeInTheDocument()
  })
})
