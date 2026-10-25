// Pedidos que ve la operadora: todos los del día y, además, los de días anteriores que
// todavía no se entregan. Así un pedido hecho a las 23:50 no desaparece a medianoche sin
// asignar. Recibe la hora actual como parámetro para que la regla se pueda probar.
export function pedidosParaOperadora(pedidos, ahora) {
  const hoy = ahora.toDateString()
  return pedidos
    .filter((pedido) => new Date(pedido.fechaCreacion).toDateString() === hoy || pedido.estado !== 'entregado')
    .sort((a, b) => a.fechaCreacion.localeCompare(b.fechaCreacion))
}
