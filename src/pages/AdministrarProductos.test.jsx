import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProductosProvider } from '../context/ProductosContext'
import AdministrarProductos from './AdministrarProductos'

function renderizarAdministracion() {
  return render(
    <ProductosProvider>
      <AdministrarProductos />
    </ProductosProvider>,
  )
}

async function completarProducto(usuario, codigo = 'CL005') {
  await usuario.type(screen.getByLabelText('Código'), codigo)
  await usuario.type(screen.getByLabelText('Categoría'), 'Cilindros de Gas')
  await usuario.type(screen.getByLabelText('Nombre'), 'Cilindro GLP 2 kg')
  await usuario.type(
    screen.getByLabelText('Descripción'),
    'Cilindro compacto para hogares y emprendimientos de Chillán.',
  )
  await usuario.clear(screen.getByLabelText('Stock'))
  await usuario.type(screen.getByLabelText('Stock'), '18')
  await usuario.clear(screen.getByLabelText('Precio residencial'))
  await usuario.type(screen.getByLabelText('Precio residencial'), '4990')
  await usuario.clear(screen.getByLabelText('Precio comercial'))
  await usuario.type(screen.getByLabelText('Precio comercial'), '4500')
}

function filaProducto(codigo) {
  return screen.getByText(codigo).closest('tr')
}

describe('AdministrarProductos', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('crea un producto y lo incorpora a la tabla', async () => {
    const usuario = userEvent.setup()
    renderizarAdministracion()

    await completarProducto(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Producto agregado correctamente.')
    expect(screen.getByText('11 productos registrados')).toBeInTheDocument()
    expect(within(filaProducto('CL005')).getByText('Cilindro GLP 2 kg')).toBeInTheDocument()
  })

  it('muestra el error del negocio cuando se intenta repetir un código', async () => {
    const usuario = userEvent.setup()
    renderizarAdministracion()

    await completarProducto(usuario, 'CL001')
    await usuario.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Ya existe un producto con el código CL001',
    )
    expect(screen.getByText('10 productos registrados')).toBeInTheDocument()
  })

  it('edita un producto y refleja el cambio en la tabla', async () => {
    const usuario = userEvent.setup()
    renderizarAdministracion()
    const fila = filaProducto('CL001')

    await usuario.click(within(fila).getByRole('button', { name: 'Editar' }))
    await usuario.clear(screen.getByLabelText('Nombre'))
    await usuario.type(screen.getByLabelText('Nombre'), 'Cilindro GLP 5 kg reforzado')
    await usuario.clear(screen.getByLabelText('Stock'))
    await usuario.type(screen.getByLabelText('Stock'), '72')
    await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Producto actualizado correctamente.')
    expect(within(filaProducto('CL001')).getByText('Cilindro GLP 5 kg reforzado')).toBeInTheDocument()
    expect(within(filaProducto('CL001')).getByText('72')).toBeInTheDocument()
  })

  it('elimina un producto solamente después de confirmar', async () => {
    const usuario = userEvent.setup()
    renderizarAdministracion()

    await usuario.click(within(filaProducto('CL001')).getByRole('button', { name: 'Eliminar' }))

    const dialogo = screen.getByRole('dialog')
    expect(dialogo).toHaveTextContent('¿Eliminar el producto CL001?')
    expect(filaProducto('CL001')).toBeInTheDocument()
    await usuario.click(within(dialogo).getByRole('button', { name: 'Confirmar' }))
    expect(screen.queryByText('CL001')).not.toBeInTheDocument()
    expect(screen.getByText('9 productos registrados')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Producto eliminado correctamente.')
  })

  it('conserva el producto cuando la eliminación es cancelada', async () => {
    const usuario = userEvent.setup()
    renderizarAdministracion()

    await usuario.click(within(filaProducto('CL001')).getByRole('button', { name: 'Eliminar' }))

    await usuario.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancelar' }))
    expect(filaProducto('CL001')).toBeInTheDocument()
    expect(screen.getByText('10 productos registrados')).toBeInTheDocument()
    expect(screen.queryByText('Producto eliminado correctamente.')).not.toBeInTheDocument()
  })

  it('mantiene los cambios cuando se cancela la restauración del catálogo', async () => {
    const usuario = userEvent.setup()
    renderizarAdministracion()

    await completarProducto(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Agregar' }))
    await usuario.click(screen.getByRole('button', { name: 'Restaurar catálogo' }))

    const dialogo = screen.getByRole('dialog')
    expect(dialogo).toHaveTextContent('¿Restaurar el catálogo original del caso?')
    await usuario.click(within(dialogo).getByRole('button', { name: 'Cancelar' }))
    expect(filaProducto('CL005')).toBeInTheDocument()
    expect(screen.getByText('11 productos registrados')).toBeInTheDocument()
  })

  it('restaura el catálogo solamente después de confirmar', async () => {
    const usuario = userEvent.setup()
    renderizarAdministracion()

    await completarProducto(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Agregar' }))
    await usuario.click(screen.getByRole('button', { name: 'Restaurar catálogo' }))
    await usuario.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirmar' }))

    expect(screen.queryByText('CL005')).not.toBeInTheDocument()
    expect(screen.getByText('10 productos registrados')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Catálogo original restaurado.')
  })
})
