import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AvisoAlmacenamiento from './AvisoAlmacenamiento'

describe('AvisoAlmacenamiento', () => {
  afterEach(() => vi.restoreAllMocks())

  it('no muestra nada cuando no hay errores', () => {
    const { container } = render(<AvisoAlmacenamiento errores={['', '']} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('reúne en un solo aviso cada problema recibido por props', () => {
    render(<AvisoAlmacenamiento errores={['Catálogo dañado.', '', 'Pedidos dañados.']} />)

    const aviso = screen.getByRole('alert')
    expect(aviso).toHaveTextContent('Catálogo dañado.')
    expect(aviso).toHaveTextContent('Pedidos dañados.')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('muestra una sola vez un mensaje repetido por varios servicios', () => {
    const consola = vi.spyOn(console, 'error').mockImplementation(() => {})
    const bloqueado = 'No se pudo leer el almacenamiento del navegador.'

    render(<AvisoAlmacenamiento errores={[bloqueado, bloqueado, bloqueado]} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    // React avisa por consola cuando dos elementos de una lista comparten clave.
    expect(consola).not.toHaveBeenCalled()
  })
})
