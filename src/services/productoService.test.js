import { beforeEach, describe, expect, it } from 'vitest'
import { listarProductos } from './productoService'

describe('productoService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('inicializa el catálogo con diez productos', () => {
    expect(listarProductos()).toHaveLength(10)
  })

  it('recupera los productos guardados', () => {
    listarProductos()
    expect(listarProductos()[0].codigo).toBe('CL001')
  })

  it('restaura el catálogo cuando el almacenamiento no contiene una lista', () => {
    localStorage.setItem('gas-el-volcan-productos', JSON.stringify({ codigo: 'incorrecto' }))

    expect(listarProductos()).toHaveLength(10)
  })
})
