import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FormularioEntrega from './FormularioEntrega'

const zonas = [{ id: 'centro', nombre: 'Centro', tiempoEstimado: '1 a 3 horas' }]

describe('FormularioEntrega', () => {
  it('muestra errores de todos los campos y no comunica datos inválidos', async () => {
    const alPreparar = vi.fn()
    render(<FormularioEntrega zonas={zonas} alPreparar={alPreparar} />)
    await userEvent.click(screen.getByRole('button', { name: 'Revisar pedido' }))
    for (const etiqueta of ['Nombre', 'Apellidos', 'Correo', 'Dirección de entrega', 'Zona de despacho']) {
      expect(screen.getByLabelText(etiqueta)).toHaveAttribute('aria-invalid', 'true')
    }
    expect(alPreparar).not.toHaveBeenCalled()
  })

  it('entrega los datos limpios al padre y actualiza mensajes al corregir', async () => {
    const alPreparar = vi.fn()
    render(<FormularioEntrega zonas={zonas} alPreparar={alPreparar} />)
    await userEvent.click(screen.getByRole('button', { name: 'Revisar pedido' }))
    await userEvent.type(screen.getByLabelText('Nombre'), ' Ana ')
    await userEvent.type(screen.getByLabelText('Apellidos'), ' Pérez ')
    await userEvent.type(screen.getByLabelText('Correo'), 'ana@ejemplo.cl')
    await userEvent.type(screen.getByLabelText('Dirección de entrega'), ' Los Aromos 123 ')
    await userEvent.selectOptions(screen.getByLabelText('Zona de despacho'), 'centro')
    await userEvent.click(screen.getByRole('button', { name: 'Revisar pedido' }))
    expect(alPreparar).toHaveBeenCalledExactlyOnceWith({
      cliente: { nombre: 'Ana Pérez', apellidos: 'Pérez', correo: 'ana@ejemplo.cl', direccion: 'Los Aromos 123' },
      zona: zonas[0],
    })
  })
})
