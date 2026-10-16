import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FormularioProducto from './FormularioProducto'

const datos = {
  codigo: 'CL001', categoria: 'Cilindros de Gas', nombre: 'Cilindro GLP 5 kg', descripcion: 'Uso residencial.',
  unidad: 'Unidad', precioResidencial: 6500, precioComercial: 6000, stock: 80, destacado: false,
}
const categorias = [{ nombre: 'Cilindros de Gas' }, { nombre: 'Accesorios' }]

describe('FormularioProducto', () => {
  it('muestra los datos recibidos y solo categorías registradas', () => {
    render(<FormularioProducto datos={datos} categorias={categorias} estaEditando onChange={vi.fn()} onSubmit={vi.fn()} onCancelar={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Editar producto' })).toBeInTheDocument()
    expect(screen.getByLabelText('Categoría')).toHaveValue('Cilindros de Gas')
    expect(screen.getAllByRole('option').map((opcion) => opcion.textContent))
      .toEqual(['Selecciona una categoría', 'Cilindros de Gas', 'Accesorios'])
  })

  it('avisa cada cambio y el envío a la página, que es dueña de los datos', async () => {
    const onChange = vi.fn()
    const onSubmit = vi.fn((evento) => evento.preventDefault())
    render(<FormularioProducto datos={datos} categorias={categorias} estaEditando={false} onChange={onChange} onSubmit={onSubmit} onCancelar={vi.fn()} />)

    await userEvent.click(screen.getByLabelText('Destacar en la tienda'))
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(onChange).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument()
  })
})
