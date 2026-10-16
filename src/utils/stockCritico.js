// Umbral de stock crítico. El caso y el Excel no lo definen: es una decisión del equipo,
// documentada en el ERS, y se cambia en este único lugar. Con 10 unidades o menos el
// producto aparece en "Productos críticos" y en el catálogo se avisa "Últimas unidades".
export const STOCK_CRITICO = 10

export function esStockCritico(producto) {
  return producto.stock <= STOCK_CRITICO
}
