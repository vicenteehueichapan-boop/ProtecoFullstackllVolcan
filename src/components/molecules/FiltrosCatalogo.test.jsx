import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FiltrosCatalogo from './FiltrosCatalogo'

describe('FiltrosCatalogo', () => {
  it('avisa al padre el texto buscado y la categoría elegida', async () => {
    const alBuscar = vi.fn()
    const alCambiarCategoria = vi.fn()
    render(<FiltrosCatalogo busqueda="" categoria="" categorias={['Reguladores', 'Accesorios']}
      alBuscar={alBuscar} alCambiarCategoria={alCambiarCategoria} />)

    await userEvent.type(screen.getByLabelText('Buscar producto'), 'r')
    await userEvent.selectOptions(screen.getByLabelText('Categoría'), 'Accesorios')

    expect(alBuscar).toHaveBeenCalledWith('r')
    expect(alCambiarCategoria).toHaveBeenCalledWith('Accesorios')
  })

  it('ofrece la opción de ver todas las categorías', () => {
    render(<FiltrosCatalogo busqueda="" categoria="" categorias={['Reguladores']} alBuscar={vi.fn()} alCambiarCategoria={vi.fn()} />)

    expect(screen.getByRole('option', { name: 'Todas las categorías' })).toHaveValue('')
  })
})
