import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CatalogoGas from './CatalogoGas'

const productos = [
  { codigo: 'CL001', nombre: 'Cilindro GLP 5 kg', categoria: 'Cilindros de Gas', descripcion: 'Uso residencial.', precioResidencial: 6500, precioComercial: 6000, stock: 80, imagen: '/c5.svg' },
  { codigo: 'AC003', nombre: 'Detector de gas', categoria: 'Accesorios', descripcion: 'Alarma.', precioResidencial: 19990, precioComercial: 17000, stock: 8, imagen: '/d.svg' },
]

describe('CatalogoGas', () => {
  it('dibuja una tarjeta por producto con la tarifa recibida', () => {
    render(<CatalogoGas productos={productos} tipoCliente="comercial" alNavegar={vi.fn()} />)

    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByText('$6.000')).toBeInTheDocument()
    expect(screen.getByText('Últimas 8 unidades')).toBeInTheDocument()
  })

  it('explica cuando no hay productos que mostrar', () => {
    render(<CatalogoGas productos={[]} tipoCliente="residencial" alNavegar={vi.fn()} />)

    expect(screen.getByRole('alert')).toHaveTextContent('No encontramos productos')
  })
})
