import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import SelectorTipoCliente from './SelectorTipoCliente'

describe('SelectorTipoCliente', () => {
  it('muestra la tarifa recibida y avisa la elegida', async () => {
    const alCambiar = vi.fn()
    render(<SelectorTipoCliente valor="residencial" alCambiar={alCambiar} />)

    expect(screen.getByLabelText('Tipo de cliente')).toHaveValue('residencial')
    await userEvent.selectOptions(screen.getByLabelText('Tipo de cliente'), 'Comercial')

    expect(alCambiar).toHaveBeenCalledExactlyOnceWith('comercial')
  })
})
