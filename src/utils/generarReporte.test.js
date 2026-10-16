import { describe, expect, it } from 'vitest'
import { generarReporte } from './generarReporte'

const centro = { id: 'centro', nombre: 'Zona Centro' }
const rural = { id: 'rural', nombre: 'Zona Rural' }

function pedido(id, estado, zona, tipoCliente, productos, cobro) {
  const total = productos.reduce((suma, linea) => suma + linea.subtotal, 0)
  return { id, estado, zona, tipoCliente, productos, total, ...(cobro ? { cobro } : {}) }
}

const gas11 = (cantidad) => ({ codigo: 'CL002', nombre: 'Cilindro GLP 11 kg', cantidad, subtotal: 12000 * cantidad })
const regulador = { codigo: 'RG001', nombre: 'Regulador', cantidad: 1, subtotal: 8990 }

const pedidos = [
  pedido('PED-0001', 'entregado', centro, 'residencial', [gas11(2)], { monto: 24000, fecha: '2026-10-20T15:00:00Z' }),
  pedido('PED-0002', 'en_camino', centro, 'comercial', [gas11(1), regulador]),
  pedido('PED-0003', 'pendiente', rural, 'residencial', [regulador]),
  pedido('PED-0004', 'entregado', rural, 'residencial', [gas11(1)]),
]

describe('generarReporte', () => {
  it('cuenta los pedidos por estado', () => {
    expect(generarReporte(pedidos).porEstado).toEqual({ pendiente: 1, asignado: 0, en_camino: 1, entregado: 2 })
  })

  it('separa el efectivo registrado de lo pendiente de cobro', () => {
    const reporte = generarReporte(pedidos)

    expect(reporte.efectivoCobrado).toBe(24000)
    expect(reporte.porCobrar).toBe(12000 + 8990 + 8990)
    expect(reporte.entregadosSinCobro).toBe(1)
  })

  it('suma unidades e importe por producto, de mayor a menor', () => {
    expect(generarReporte(pedidos).productos).toEqual([
      { codigo: 'CL002', nombre: 'Cilindro GLP 11 kg', unidades: 4, importe: 48000 },
      { codigo: 'RG001', nombre: 'Regulador', unidades: 2, importe: 17980 },
    ])
  })

  it('cuenta pedidos por zona y por tarifa', () => {
    const reporte = generarReporte(pedidos)

    expect(reporte.porZona).toEqual([{ zona: 'Zona Centro', pedidos: 2 }, { zona: 'Zona Rural', pedidos: 2 }])
    expect(reporte.porTarifa).toEqual({ residencial: 3, comercial: 1 })
  })

  it('entrega ceros y listas vacías cuando no hay pedidos', () => {
    expect(generarReporte([])).toMatchObject({ totalPedidos: 0, efectivoCobrado: 0, porCobrar: 0, productos: [], porZona: [] })
  })
})
