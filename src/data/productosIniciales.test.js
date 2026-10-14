import { describe, expect, it } from 'vitest'
import productos from './productosIniciales'

// Transcripción independiente del Excel Forma C, Productos y Tarifas!A4:H17.
// Orden: código, tarifa residencial, tarifa comercial y stock.
const filasExcel = [
  ['CL001', 6500, 6000, 80], ['CL002', 12000, 11000, 200],
  ['CL003', 16000, 14500, 90], ['CL004', 45000, 40000, 30],
  ['RG001', 8990, 8200, 45], ['RG002', 18990, 17000, 12],
  ['RG003', 14990, 13500, 18], ['MG001', 3990, 3500, 80],
  ['MG002', 6990, 6200, 50], ['MG003', 990, 800, 200],
  ['MG004', 12990, 11500, 25], ['AC001', 12990, 11000, 20],
  ['AC002', 1490, 1200, 60], ['AC003', 19990, 17000, 8],
]

describe('catálogo inicial del Excel', () => {
  it('incluye exactamente los catorce códigos, tarifas y existencias de origen', () => {
    expect(productos.map(({ codigo, precioResidencial, precioComercial, stock }) =>
      [codigo, precioResidencial, precioComercial, stock])).toEqual(filasExcel)
  })
  it('conserva las cuatro categorías, unidades e imágenes locales', () => {
    expect([...new Set(productos.map((producto) => producto.categoria))]).toEqual([
      'Cilindros de Gas', 'Reguladores', 'Mangueras y Conexiones', 'Accesorios',
    ])
    expect(productos.filter((producto) => producto.unidad === 'Kit').map((producto) => producto.codigo)).toEqual(['MG004'])
    productos.forEach((producto) => {
      expect(producto.nombre).not.toBe('')
      expect(producto.descripcion).not.toBe('')
      // Vite puede incorporar el SVG pequeño como URL de datos en lugar de ruta.
      expect(producto.imagen).toMatch(/\.svg(?:\?|$)|^data:image\/svg\+xml[;,]/)
    })
  })
})
