import pedidosIniciales from '../data/pedidosIniciales'

const CLAVE_PEDIDOS = 'gas-el-volcan-pedidos'

export const ESTADOS_PEDIDO = Object.freeze({
  PENDIENTE: 'pendiente',
  ASIGNADO: 'asignado',
  EN_CAMINO: 'en_camino',
  ENTREGADO: 'entregado',
})

const ESTADO_SIGUIENTE = Object.freeze({
  [ESTADOS_PEDIDO.PENDIENTE]: ESTADOS_PEDIDO.ASIGNADO,
  [ESTADOS_PEDIDO.ASIGNADO]: ESTADOS_PEDIDO.EN_CAMINO,
  [ESTADOS_PEDIDO.EN_CAMINO]: ESTADOS_PEDIDO.ENTREGADO,
})

function copiarPedidos(pedidos) {
  return structuredClone(pedidos)
}

function guardarPedidos(pedidos) {
  localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos))
}

function datosIniciales() {
  return copiarPedidos(pedidosIniciales)
}

function siguienteIdentificador(pedidos) {
  const ultimoNumero = pedidos.reduce((mayor, pedido) => {
    const numero = Number.parseInt(String(pedido.id).replace('PED-', ''), 10)
    return Number.isNaN(numero) ? mayor : Math.max(mayor, numero)
  }, 0)

  return `PED-${String(ultimoNumero + 1).padStart(4, '0')}`
}

function validarDatosPedido(datosPedido) {
  if (datosPedido === null || typeof datosPedido !== 'object' || Array.isArray(datosPedido)) {
    throw new Error('Los datos del pedido no son válidos')
  }

  if (!Array.isArray(datosPedido.productos) || datosPedido.productos.length === 0) {
    throw new Error('El pedido debe incluir al menos un producto')
  }
}

export function listarPedidos() {
  const pedidosGuardados = localStorage.getItem(CLAVE_PEDIDOS)

  if (pedidosGuardados === null) {
    return restaurarPedidos()
  }

  try {
    const pedidos = JSON.parse(pedidosGuardados)

    if (Array.isArray(pedidos)) {
      return copiarPedidos(pedidos)
    }
  } catch {
    // El almacenamiento se restaura más abajo si su contenido está dañado.
  }

  return restaurarPedidos()
}

export function obtenerPedidoPorId(id) {
  return listarPedidos().find((pedido) => pedido.id === id) ?? null
}

export function crearPedido(datosPedido) {
  validarDatosPedido(datosPedido)

  const pedidos = listarPedidos()
  const fechaCreacion = new Date().toISOString()
  const pedido = {
    ...copiarPedidos(datosPedido),
    id: siguienteIdentificador(pedidos),
    estado: ESTADOS_PEDIDO.PENDIENTE,
    repartidor: null,
    fechaCreacion,
    fechaActualizacion: fechaCreacion,
  }

  guardarPedidos([...pedidos, pedido])
  return copiarPedidos(pedido)
}

export function asignarRepartidor(id, repartidor) {
  const nombreRepartidor = String(repartidor ?? '').trim()

  if (nombreRepartidor === '') {
    throw new Error('Se debe indicar un repartidor')
  }

  return actualizarPedido(id, (pedido) => {
    if (pedido.estado !== ESTADOS_PEDIDO.PENDIENTE) {
      throw new Error('Solo se puede asignar un repartidor a un pedido pendiente')
    }

    return {
      ...pedido,
      repartidor: nombreRepartidor,
      estado: ESTADOS_PEDIDO.ASIGNADO,
      fechaActualizacion: new Date().toISOString(),
    }
  })
}

export function cambiarEstadoPedido(id, nuevoEstado) {
  return actualizarPedido(id, (pedido) => {
    const estadoEsperado = ESTADO_SIGUIENTE[pedido.estado]

    if (nuevoEstado !== estadoEsperado || nuevoEstado === ESTADOS_PEDIDO.ASIGNADO) {
      throw new Error('El cambio de estado no respeta la secuencia del pedido')
    }

    return {
      ...pedido,
      estado: nuevoEstado,
      fechaActualizacion: new Date().toISOString(),
    }
  })
}

export function restaurarPedidos() {
  const pedidos = datosIniciales()
  guardarPedidos(pedidos)
  return copiarPedidos(pedidos)
}

function actualizarPedido(id, transformar) {
  const pedidos = listarPedidos()
  const indice = pedidos.findIndex((pedido) => pedido.id === id)

  if (indice === -1) {
    throw new Error('No se encontró el pedido solicitado')
  }

  const pedidoActualizado = transformar(pedidos[indice])
  pedidos[indice] = pedidoActualizado
  guardarPedidos(pedidos)
  return copiarPedidos(pedidoActualizado)
}
