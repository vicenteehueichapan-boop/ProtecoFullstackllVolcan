import { describe, expect, it } from 'vitest'
import articulosBlog from './articulosBlog'

describe('articulosBlog', () => {
  it('tiene al menos dos entradas con identificador único (Guía 16)', () => {
    const slugs = articulosBlog.map((articulo) => articulo.slug)

    expect(articulosBlog.length).toBeGreaterThanOrEqual(2)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('arma la entrada de despacho con las cinco zonas y horarios del Excel', () => {
    const despacho = articulosBlog.find((articulo) => articulo.categoria === 'Despacho')
    const titulos = despacho.secciones.map((seccion) => seccion.titulo)

    expect(titulos).toEqual(expect.arrayContaining(['Zona Centro', 'Zona Oriente', 'Zona Rural', 'Zona Sur', 'Zona Comercial']))
    expect(despacho.secciones.find((seccion) => seccion.titulo === 'Zona Sur').texto)
      .toBe('Cubre Bulnes y Quillón. Despachamos miércoles, de 08:00 a 16:00. Tiempo estimado de entrega: 4 a 6 horas.')
  })

  it('cita la fuente oficial de cada recomendación de seguridad', () => {
    const seguridad = articulosBlog.find((articulo) => articulo.categoria === 'Seguridad')

    expect(seguridad.fuentes.length).toBeGreaterThan(0)
    expect(seguridad.fuentes.every((fuente) => fuente.url.startsWith('https://www.sec.cl/'))).toBe(true)
  })
})
