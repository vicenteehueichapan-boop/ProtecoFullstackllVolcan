import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import FormularioEntrega from './FormularioEntrega'

it('acepta una zona inicial nula y conserva nombre y apellidos separados al preparar la solicitud', async () => {
  const alPreparar = vi.fn()
  const usuario = userEvent.setup()
  const zona = { id: 'centro', nombre: 'Centro', tiempoEstimado: '1 a 3 horas' }
  render(<FormularioEntrega zonas={[zona]} alPreparar={alPreparar} datosIniciales={{nombre:'Ana',apellidos:'Prueba',correo:'ana@ejemplo.cl',direccion:'Calle Ficticia 123',zonaId:null}} />)
  expect(screen.getByLabelText('Zona de despacho')).toHaveValue('')
  await usuario.selectOptions(screen.getByLabelText('Zona de despacho'),'centro')
  await usuario.click(screen.getByRole('button',{name:'Revisar pedido'}))
  expect(alPreparar).toHaveBeenCalledWith({cliente:{nombre:'Ana',apellidos:'Prueba',correo:'ana@ejemplo.cl',direccion:'Calle Ficticia 123'},zona})
})
