// Regla de privacidad del seguimiento: los datos de un pedido (dirección, productos)
// solo se muestran a la cuenta que lo registró o a quien conoce el correo usado en él.
// Así no basta con probar números correlativos (PED-0001, PED-0002...).
export function puedeVerPedido(pedido, { cliente, correo } = {}) {
  if (!pedido) return false
  if (cliente && pedido.clienteId === cliente.id) return true

  const correoPedido = String(pedido.cliente?.correo ?? '').trim().toLowerCase()
  const correoConsulta = String(correo ?? '').trim().toLowerCase()
  return correoPedido !== '' && correoPedido === correoConsulta
}
