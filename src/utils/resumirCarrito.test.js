import { describe, expect, it } from 'vitest'
import { resumirCarrito } from './resumirCarrito'

const productos = [
  { codigo: 'CL001', nombre: 'Gas 5 kg', categoria: 'Cilindros de Gas', stock: 3, precioResidencial: 6500, precioComercial: 6000 },
  { codigo: 'CL002', nombre: 'Gas 11 kg', categoria: 'Cilindros de Gas', stock: 2, precioResidencial: 12000, precioComercial: 11000 },
]
const carrito = { tipoCliente: 'residencial', lineas: [{ codigo: 'CL001', cantidad: 2 }, { codigo: 'CL002', cantidad: 1 }] }

describe('resumirCarrito', () => {
  it('calcula cada subtotal y el total según la tarifa sin mutar el carrito', () => {
    const antes = structuredClone(carrito)
    expect(resumirCarrito(carrito, productos)).toMatchObject({ total: 25000, puedeConfirmar: true })
    expect(resumirCarrito({ ...carrito, tipoCliente: 'comercial' }, productos).total).toBe(23000)
    expect(carrito).toEqual(antes)
  })

  it('permite confirmar un accesorio junto a los cilindros', () => {
    const regulador = { codigo: 'RG001', nombre: 'Regulador', categoria: 'Reguladores', stock: 5, precioResidencial: 8990, precioComercial: 8200 }
    const conRegulador = { ...carrito, lineas: [...carrito.lineas, { codigo: 'RG001', cantidad: 1 }] }

    expect(resumirCarrito(conRegulador, [...productos, regulador])).toMatchObject({ total: 33990, puedeConfirmar: true })
  })

  it('bloquea la confirmación cuando el carrito está vacío', () => {
    expect(resumirCarrito({ ...carrito, lineas: [] }, productos)).toMatchObject({ total: 0, puedeConfirmar: false })
  })

  it('conserva líneas eliminadas o con stock insuficiente para poder corregirlas', () => {
    const resumen = resumirCarrito(carrito, [{ ...productos[0], stock: 1 }])
    expect(resumen.puedeConfirmar).toBe(false)
    expect(resumen.lineas).toHaveLength(2)
    expect(resumen.lineas.every((linea) => linea.error)).toBe(true)
  })

  it('usa el precio vigente del catálogo, no una copia guardada del precio', () => {
    expect(resumirCarrito(carrito, [{ ...productos[0], precioResidencial: 7000 }, productos[1]]).total).toBe(26000)
  })
})
