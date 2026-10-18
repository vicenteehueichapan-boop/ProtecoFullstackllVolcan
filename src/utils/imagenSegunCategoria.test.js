import { describe, expect, it } from 'vitest'
import accesorio from '../assets/productos/accesorio.svg'
import cilindro from '../assets/productos/cilindro-11.svg'
import manguera from '../assets/productos/manguera.svg'
import generico from '../assets/productos/producto-generico.svg'
import regulador from '../assets/productos/regulador.svg'
import { imagenSegunCategoria } from './imagenSegunCategoria'

describe('imagenSegunCategoria', () => {
  it('usa la ilustración de cada categoría del Excel', () => {
    expect(imagenSegunCategoria('Cilindros de Gas')).toBe(cilindro)
    expect(imagenSegunCategoria('Reguladores')).toBe(regulador)
    expect(imagenSegunCategoria('Mangueras y Conexiones')).toBe(manguera)
    expect(imagenSegunCategoria('Accesorios')).toBe(accesorio)
  })

  it('usa una ilustración genérica para una categoría nueva', () => {
    expect(imagenSegunCategoria('Repuestos')).toBe(generico)
  })
})
