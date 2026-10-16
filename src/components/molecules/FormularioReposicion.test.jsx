import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FormularioReposicion from './FormularioReposicion'

const producto = { codigo: 'AC003', nombre: 'Detector de gas a batería' }

describe('FormularioReposicion', () => {
  it('avisa al padre la cantidad y limpia el campo', async () => {
    const alReponer = vi.fn()
    render(<FormularioReposicion producto={producto} alReponer={alReponer} />)
    const campo = screen.getByLabelText('Unidades a reponer de Detector de gas a batería')

    await userEvent.type(campo, '12')
    await userEvent.click(screen.getByRole('button', { name: 'Reponer' }))

    expect(alReponer).toHaveBeenCalledExactlyOnceWith('AC003', 12)
    expect(campo).toHaveValue(null)
  })

  it('muestra el error junto al campo y no avisa con una cantidad inválida', async () => {
    const alReponer = vi.fn()
    render(<FormularioReposicion producto={producto} alReponer={alReponer} />)

    await userEvent.click(screen.getByRole('button', { name: 'Reponer' }))

    expect(screen.getByLabelText('Unidades a reponer de Detector de gas a batería'))
      .toHaveAccessibleDescription('Ingresa una cantidad entera entre 1 y 1000.')
    expect(alReponer).not.toHaveBeenCalled()
  })
})
