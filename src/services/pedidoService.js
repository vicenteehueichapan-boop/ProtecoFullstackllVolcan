import pedidosIniciales from '../data/pedidosIniciales'
import zonasDespacho from '../data/zonasDespacho'
import { precioSegunCliente } from '../utils/precioSegunCliente'
import { descontarStock, devolverStock, listarProductos } from './productoService'
import { listarPersonal } from './personalService'

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
  // Los pedidos sin sesión (o anteriores a las cuentas) no tienen clienteId.
  if (datosPedido.clienteId != null && !/^CLI-\d{4,}$/.test(datosPedido.clienteId)) {
    throw new Error('La cuenta del cliente no es válida')
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
  // Los pedidos asignados antes de guardar el identificador del repartidor no lo tienen.
  if (pedido.repartidorId !== undefined && (typeof pedido.repartidorId !== 'string' || pedido.repartidorId === '')) {
    throw new Error('El repartidor del pedido guardado no es válido')
  }
  // Los pedidos entregados antes de registrar cobros no tienen este dato: es opcional.
  if (pedido.cobro !== undefined
    && (!Number.isFinite(pedido.cobro?.monto) || !Number.isFinite(Date.parse(pedido.cobro?.fecha)))) {
    throw new Error('El cobro del pedido guardado no es válido')
  }
}

function validarCatalogoVigente(datosPedido) {
  const catalogo = listarProductos()
  for (const linea of datosPedido.productos) {
    const producto = catalogo.find((item) => item.codigo === linea.codigo)
    if (!producto) {
      throw new Error('Un producto del pedido ya no está disponible. Revisa el catálogo y prepara nuevamente el pedido.')
    }
    if (linea.cantidad > producto.stock) {
      throw new Error(`El stock de ${producto.nombre} cambió. Solo quedan ${producto.stock} unidades; corrige la cantidad.`)
    }
    if (linea.nombre !== producto.nombre || linea.precioUnitario !== precioSegunCliente(producto, datosPedido.tipoCliente)) {
      throw new Error('Los datos o precios del catálogo cambiaron. Revisa nuevamente el resumen antes de confirmar.')
    }
  }
}

function leerPedidosGuardados() {
  try {
    return localStorage.getItem(CLAVE_PEDIDOS)
  } catch {
    throw new Error('No se pudo leer el almacenamiento del navegador. Revisa sus permisos y vuelve a intentarlo.')
  }
}

export function listarPedidos() {
  const pedidosGuardados = leerPedidosGuardados()

  if (pedidosGuardados === null) {
    return restaurarPedidos()
  }

  try {
    const pedidos = JSON.parse(pedidosGuardados)

    if (Array.isArray(pedidos)) {
      pedidos.forEach(validarPedidoGuardado)
      if (new Set(pedidos.map((pedido) => pedido.id)).size === pedidos.length) {
        return copiarPedidos(pedidos)
      }
    }
  } catch {
    // El mensaje de abajo explica el problema; los datos dañados no se tocan.
  }

  // No se restaura en silencio: borraría pedidos reales que todavía se pueden revisar.
  throw new Error('Los pedidos guardados están dañados. No se modificaron; administración debe revisarlos antes de registrar o cambiar pedidos.')
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

  // El stock se descuenta antes de guardar el pedido. Si guardar falla, se devuelve:
  // así nunca queda stock descontado sin un pedido que lo justifique.
  descontarStock(pedido.productos)
  try {
    guardarPedidos([...pedidos, pedido])
  } catch (excepcion) {
    devolverStock(pedido.productos)
    throw excepcion
  }
  return copiarPedidos(pedido)
}

export function asignarRepartidor(id, repartidorId) {
  const idRepartidor = String(repartidorId ?? '').trim()

  if (idRepartidor === '') {
    throw new Error('Se debe indicar un repartidor')
  }

  // Solo un perfil activo con rol repartidor puede recibir pedidos.
  const repartidor = listarPersonal().find(
    (perfil) => perfil.id === idRepartidor && perfil.rol === 'repartidor' && perfil.activo,
  )
  if (!repartidor) {
    throw new Error('El repartidor seleccionado no está disponible')
  }

  return actualizarPedido(id, (pedido) => {
    if (pedido.estado !== ESTADOS_PEDIDO.PENDIENTE) {
      throw new Error('Solo se puede asignar un repartidor a un pedido pendiente')
    }

    // Se guarda el identificador (para filtrar sus entregas) y el nombre de ese momento,
    // como registro de quién recibió el pedido aunque después cambie su perfil.
    return {
      ...pedido,
      repartidorId: repartidor.id,
      repartidor: repartidor.nombre,
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

    const fecha = new Date().toISOString()
    const actualizado = { ...pedido, estado: nuevoEstado, fechaActualizacion: fecha }
    // El pago es en efectivo al recibir: al confirmar la entrega queda registrado el cobro
    // (documento del caso, sección 4), sin depender de anotaciones en cuadernos.
    if (nuevoEstado === ESTADOS_PEDIDO.ENTREGADO) {
      actualizado.cobro = { monto: pedido.total, fecha }
    }
    return actualizado
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
