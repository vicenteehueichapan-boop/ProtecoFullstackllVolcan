// Calcula los reportes de operación a partir de los pedidos guardados. Es una función pura:
// no lee almacenamiento ni pantalla, por eso los números siempre salen de los datos reales.
export function generarReporte(pedidos) {
  const porEstado = { pendiente: 0, asignado: 0, en_camino: 0, entregado: 0 }
  const porTarifa = { residencial: 0, comercial: 0 }
  const zonas = new Map()
  const productos = new Map()
  let efectivoCobrado = 0
  let porCobrar = 0
  let entregadosSinCobro = 0

  for (const pedido of pedidos) {
    porEstado[pedido.estado] += 1
    porTarifa[pedido.tipoCliente] += 1
    zonas.set(pedido.zona.nombre, (zonas.get(pedido.zona.nombre) ?? 0) + 1)

    // El cobro se registra al entregar. Lo no entregado todavía está por cobrar.
    if (pedido.cobro) efectivoCobrado += pedido.cobro.monto
    else if (pedido.estado === 'entregado') entregadosSinCobro += 1
    else porCobrar += pedido.total

    for (const linea of pedido.productos) {
      const acumulado = productos.get(linea.codigo) ?? { codigo: linea.codigo, nombre: linea.nombre, unidades: 0, importe: 0 }
      productos.set(linea.codigo, {
        ...acumulado,
        unidades: acumulado.unidades + linea.cantidad,
        importe: acumulado.importe + linea.subtotal,
      })
    }
  }

  return {
    totalPedidos: pedidos.length,
    porEstado,
    porTarifa,
    efectivoCobrado,
    porCobrar,
    entregadosSinCobro,
    porZona: [...zonas].map(([zona, cantidad]) => ({ zona, pedidos: cantidad })),
    productos: [...productos.values()].sort((a, b) => b.unidades - a.unidades),
  }
}
