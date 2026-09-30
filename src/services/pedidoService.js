import pedidosIniciales from '../data/pedidosIniciales'
import zonasDespacho from '../data/zonasDespacho'
import { precioSegunCliente } from '../utils/precioSegunCliente'
import { listarProductos } from './productoService'

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

  const textoValido = (valor, minimo = 1) => typeof valor === 'string' && valor.trim().length >= minimo
  if (!textoValido(datosPedido.cliente?.nombre, 3) || !textoValido(datosPedido.cliente?.direccion, 5)) {
    throw new Error('El nombre y la dirección del cliente no son válidos')
  }
  const zona = zonasDespacho.find((item) => item.id === datosPedido.zona?.id)
  if (!zona || datosPedido.zona.nombre !== zona.nombre || datosPedido.zona.tiempoEstimado !== zona.tiempoEstimado) {
    throw new Error('La zona de despacho no es válida')
  }
  if (!['residencial', 'comercial'].includes(datosPedido.tipoCliente)) {
    throw new Error('El tipo de cliente no es válido')
  }
  if (datosPedido.formaPago !== 'efectivo_al_entregar') {
    throw new Error('La forma de pago no es válida')
  }
  const codigos = new Set()
  let totalCalculado = 0
  for (const producto of datosPedido.productos) {
    if (!textoValido(producto?.codigo) || !textoValido(producto?.nombre)
      || !Number.isInteger(producto.cantidad) || producto.cantidad < 1
      || !Number.isFinite(producto.precioUnitario) || producto.precioUnitario < 0
      || producto.subtotal !== producto.precioUnitario * producto.cantidad
      || codigos.has(producto.codigo)) {
      throw new Error('Los productos, cantidades o precios del pedido no son válidos')
    }
    codigos.add(producto.codigo)
    totalCalculado += producto.subtotal
  }
  if (!Number.isFinite(datosPedido.total) || datosPedido.total !== totalCalculado) {
    throw new Error('El total del pedido no coincide con sus productos')
  }
}

function validarPedidoGuardado(pedido) {
  validarDatosPedido(pedido)
  if (!/^PED-\d{4,}$/.test(pedido.id) || !Object.values(ESTADOS_PEDIDO).includes(pedido.estado)
    || !Number.isFinite(Date.parse(pedido.fechaCreacion))
    || !Number.isFinite(Date.parse(pedido.fechaActualizacion))
    || (pedido.estado === ESTADOS_PEDIDO.PENDIENTE ? pedido.repartidor !== null
      : typeof pedido.repartidor !== 'string' || pedido.repartidor.trim() === '')) {
    throw new Error('El pedido guardado tiene una estructura incorrecta')
  }
}

function validarCatalogoVigente(datosPedido) {
  const catalogo = listarProductos()
  for (const linea of datosPedido.productos) {
    const producto = catalogo.find((item) => item.codigo === linea.codigo)
    if (!producto || producto.categoria !== 'Cilindros de Gas') {
      throw new Error('Un cilindro del pedido ya no está disponible. Revisa el catálogo y prepara nuevamente el pedido.')
    }
    if (linea.cantidad > producto.stock) {
      throw new Error(`El stock de ${producto.nombre} cambió. Solo quedan ${producto.stock} unidades; corrige la cantidad.`)
    }
    if (linea.nombre !== producto.nombre || linea.precioUnitario !== precioSegunCliente(producto, datosPedido.tipoCliente)) {
      throw new Error('Los datos o precios del catálogo cambiaron. Revisa nuevamente el resumen antes de confirmar.')
    }
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
      pedidos.forEach(validarPedidoGuardado)
      if (new Set(pedidos.map((pedido) => pedido.id)).size !== pedidos.length) {
        throw new Error('Hay identificadores de pedido repetidos')
      }
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
  validarCatalogoVigente(datosPedido)

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
