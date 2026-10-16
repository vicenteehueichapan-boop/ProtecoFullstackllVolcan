// Filtra pedidos por estado y por un texto que puede ser el número, el nombre o el correo
// del cliente. Devuelve los más recientes primero. Función pura: no modifica la lista.
export function filtrarPedidos(pedidos, { texto = '', estado = '' } = {}) {
  const buscado = texto.trim().toLocaleLowerCase('es-CL')
  return pedidos
    .filter((pedido) => !estado || pedido.estado === estado)
    .filter((pedido) => {
      if (!buscado) return true
      const contenido = `${pedido.id} ${pedido.cliente.nombre} ${pedido.cliente.correo ?? ''}`.toLocaleLowerCase('es-CL')
      return contenido.includes(buscado)
    })
    .sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion))
}
