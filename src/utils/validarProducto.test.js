import { describe, expect, it } from 'vitest'
import { validarProducto } from './validarProducto'

const categorias = [{ nombre: 'Cilindros de Gas' }, { nombre: 'Accesorios' }]
const valido = {
  codigo: 'CL005', categoria: 'Cilindros de Gas', nombre: 'Cilindro GLP 2 kg',
  descripcion: 'Cilindro compacto para camping.', unidad: 'Unidad',
  precioResidencial: '4990', precioComercial: '4500', stock: '18',
}

describe('validarProducto', () => {
  it('acepta un producto completo, aunque los números lleguen como texto del formulario', () => {
    expect(validarProducto(valido, categorias)).toEqual({})
  })

  it('informa todos los campos con error a la vez', () => {
    const errores = validarProducto({
      codigo: 'C 1', categoria: 'Inventada', nombre: 'Ab', descripcion: 'Corta', unidad: '',
      precioResidencial: '-1', precioComercial: '12,5', stock: '2.5',
    }, categorias)

    expect(errores).toEqual({
      codigo: 'Ingresa un código de 3 a 10 letras o números, sin espacios.',
      categoria: 'Selecciona una categoría registrada.',
      nombre: 'Ingresa el nombre del producto (al menos 3 caracteres).',
      descripcion: 'Describe el producto (al menos 10 caracteres).',
      unidad: 'Indica la unidad de venta, por ejemplo Unidad o Kit.',
      precioResidencial: 'Ingresa un precio entero en pesos, igual o mayor a 0.',
      precioComercial: 'Ingresa un precio entero en pesos, igual o mayor a 0.',
      stock: 'Ingresa un stock entero, igual o mayor a 0.',
    })
  })

  it('rechaza números vacíos en vez de tomarlos como cero', () => {
    expect(validarProducto({ ...valido, stock: '' }, categorias).stock).toBe('Ingresa un stock entero, igual o mayor a 0.')
  })
})
