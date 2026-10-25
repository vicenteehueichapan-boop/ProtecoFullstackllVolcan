import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AvisoAlmacenamiento from './AvisoAlmacenamiento'

describe('AvisoAlmacenamiento', () => {
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
})
