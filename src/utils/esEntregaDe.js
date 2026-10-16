// Indica si un pedido está asignado a un repartidor. Los pedidos nuevos guardan su
// identificador; los asignados antes de ese cambio solo guardaban su nombre.
export function esEntregaDe(pedido, repartidor) {
  if (!repartidor) return false
  if (pedido.repartidorId) return pedido.repartidorId === repartidor.id
  return pedido.repartidor === repartidor.nombre
}
