import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FormularioProducto from './FormularioProducto'

const categorias = [{ nombre: 'Cilindros de Gas' }, { nombre: 'Accesorios' }]
const producto = {
  codigo: 'CL001', categoria: 'Cilindros de Gas', nombre: 'Cilindro GLP 5 kg', descripcion: 'Uso residencial en cocina.',
  unidad: 'Unidad', precioResidencial: 6500, precioComercial: 6000, stock: 80, destacado: false,
}

describe('FormularioProducto', () => {
  it('es dueño de sus errores: los muestra junto a cada campo y no avisa a la página', async () => {
    const alGuardar = vi.fn()
    render(<FormularioProducto categorias={categorias} alGuardar={alGuardar} alCancelar={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(screen.getByLabelText('Código')).toHaveAccessibleDescription('Ingresa un código de 3 a 10 letras o números, sin espacios.')
    expect(screen.getByLabelText('Categoría')).toHaveAccessibleDescription('Selecciona una categoría registrada.')
    expect(screen.getByLabelText('Stock')).toHaveAttribute('aria-invalid', 'true')
    expect(alGuardar).not.toHaveBeenCalled()
  })

  it('al editar parte con los datos recibidos y entrega números a la página', async () => {
    const alGuardar = vi.fn()
    render(<FormularioProducto producto={producto} categorias={categorias} alGuardar={alGuardar} alCancelar={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Editar producto' })).toBeInTheDocument()
    await userEvent.clear(screen.getByLabelText('Stock'))
    await userEvent.type(screen.getByLabelText('Stock'), '72')
    await userEvent.click(screen.getByLabelText('Destacar en la tienda'))
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(alGuardar).toHaveBeenCalledExactlyOnceWith({ ...producto, stock: 72, destacado: true })
  })

  it('muestra junto al campo el rechazo con que responde la página', async () => {
    const alGuardar = vi.fn().mockReturnValue({ codigo: 'Ya existe un producto con el código CL001' })
    render(<FormularioProducto producto={producto} categorias={categorias} alGuardar={alGuardar} alCancelar={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByLabelText('Código')).toHaveAccessibleDescription('Ya existe un producto con el código CL001')
  })

  it('solo ofrece categorías registradas y permite cancelar la edición', async () => {
    const alCancelar = vi.fn()
    render(<FormularioProducto producto={producto} categorias={categorias} alGuardar={vi.fn()} alCancelar={alCancelar} />)

    expect(screen.getAllByRole('option').map((opcion) => opcion.textContent))
      .toEqual(['Selecciona una categoría', 'Cilindros de Gas', 'Accesorios'])
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(alCancelar).toHaveBeenCalledOnce()
  })
})
