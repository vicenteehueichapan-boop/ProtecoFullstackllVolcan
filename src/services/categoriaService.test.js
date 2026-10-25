import { beforeEach, describe, expect, it } from 'vitest'
import {
  actualizarCategoria,
  asegurarCategorias,
  crearCategoria,
  existeCategoria,
  listarCategorias,
} from './categoriaService'

describe('categoriaService', () => {
  beforeEach(() => localStorage.clear())

  it('parte con las cuatro categorías del Excel', () => {
    expect(listarCategorias().map((categoria) => categoria.nombre)).toEqual([
      'Cilindros de Gas', 'Reguladores', 'Mangueras y Conexiones', 'Accesorios',
    ])
  })

  it('crea una categoría con nombre y descripción limpios', () => {
    const creada = crearCategoria({ nombre: ' Repuestos ', descripcion: ' Piezas de reemplazo. ' })

    expect(creada).toEqual({ nombre: 'Repuestos', descripcion: 'Piezas de reemplazo.' })
    expect(existeCategoria('Repuestos')).toBe(true)
  })

  it.each([
    [{ nombre: 'reguladores' }, 'Ya existe una categoría con ese nombre'],
    [{ nombre: 'AB' }, 'al menos 3 caracteres'],
  ])('rechaza %j indicando el campo nombre', (datos, mensaje) => {
    expect(() => crearCategoria(datos)).toThrow(mensaje)
    expect(() => crearCategoria(datos)).toThrow(expect.objectContaining({ campo: 'nombre' }))
    expect(listarCategorias()).toHaveLength(4)
  })

  it('edita el nombre y la descripción sin chocar con otra categoría', () => {
    actualizarCategoria('Accesorios', { nombre: 'Accesorios del hogar', descripcion: 'Carros, tapas y detectores.' })

    expect(existeCategoria('Accesorios')).toBe(false)
    expect(existeCategoria('Accesorios del hogar')).toBe(true)
    expect(() => actualizarCategoria('Reguladores', { nombre: 'Accesorios del hogar' })).toThrow('Ya existe')
    expect(() => actualizarCategoria('No existe', { nombre: 'Otra' })).toThrow('No existe la categoría')
  })

  it('agrega categorías que falten sin duplicar las existentes', () => {
    asegurarCategorias(['Reguladores', 'Repuestos', 'Repuestos'])

    expect(listarCategorias().map((categoria) => categoria.nombre)).toEqual([
      'Cilindros de Gas', 'Reguladores', 'Mangueras y Conexiones', 'Accesorios', 'Repuestos',
    ])
  })

  it('informa categorías guardadas dañadas sin borrarlas', () => {
    localStorage.setItem('gas-el-volcan-categorias', '[{"nombre":1}]')

    expect(() => listarCategorias()).toThrow('Las categorías guardadas están dañadas')
    expect(localStorage.getItem('gas-el-volcan-categorias')).toBe('[{"nombre":1}]')
  })
})
