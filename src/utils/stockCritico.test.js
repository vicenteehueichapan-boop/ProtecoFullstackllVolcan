import { describe, expect, it } from 'vitest'
import { STOCK_CRITICO, esStockCritico } from './stockCritico'

describe('esStockCritico', () => {
  it('marca como crítico un stock igual o menor al umbral', () => {
    expect(esStockCritico({ stock: STOCK_CRITICO })).toBe(true)
    expect(esStockCritico({ stock: 0 })).toBe(true)
  })

  it('no marca un stock mayor al umbral', () => {
    expect(esStockCritico({ stock: STOCK_CRITICO + 1 })).toBe(false)
  })
})
