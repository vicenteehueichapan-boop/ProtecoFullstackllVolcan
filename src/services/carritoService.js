import { obtenerProductoPorCodigo } from './productoService'

const CLAVE_CARRITO = 'gas-el-volcan-carrito'

export function carritoVacio() {
  return { tipoCliente: 'residencial', lineas: [] }
}

function validarCarrito(carrito) {
  if (!carrito || !['residencial', 'comercial'].includes(carrito.tipoCliente)
    || !Array.isArray(carrito.lineas)) throw new Error('El carrito guardado no es válido.')
  const codigos = new Set()
  for (const linea of carrito.lineas) {
    if (!linea || typeof linea.codigo !== 'string' || !linea.codigo.trim()
      || linea.codigo !== linea.codigo.trim().toUpperCase()
      || !Number.isSafeInteger(linea.cantidad) || linea.cantidad < 1 || codigos.has(linea.codigo)) {
      throw new Error('El carrito guardado contiene líneas inválidas.')
    }
    codigos.add(linea.codigo)
  }
}

export function leerCarrito() {
  const texto = localStorage.getItem(CLAVE_CARRITO)
  if (texto === null) return carritoVacio()
  let carrito
  try {
    carrito = JSON.parse(texto)
  } catch {
    throw new Error('No se pudo leer el carrito guardado. Puedes vaciarlo para comenzar de nuevo.')
  }
  validarCarrito(carrito)
  return carrito
}

function guardarCarrito(carrito) {
  validarCarrito(carrito)
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
  return carrito
}

function comprobarCantidad(codigo, cantidad) {
  const producto = obtenerProductoPorCodigo(codigo)
  if (!producto) {
    throw new Error('El producto ya no está disponible en el catálogo.')
  }
  if (!Number.isSafeInteger(cantidad) || cantidad < 1 || cantidad > producto.stock) {
    throw new Error(`La cantidad de ${producto.nombre} debe estar entre 1 y ${producto.stock}.`)
  }
}

export function agregarAlCarrito(codigo) {
  codigo = String(codigo ?? '').trim().toUpperCase()
  const carrito = leerCarrito()
  const existente = carrito.lineas.find((linea) => linea.codigo === codigo)
  const cantidad = (existente?.cantidad ?? 0) + 1
  comprobarCantidad(codigo, cantidad)
  const lineas = existente
    ? carrito.lineas.map((linea) => linea.codigo === codigo ? { ...linea, cantidad } : linea)
    : [...carrito.lineas, { codigo, cantidad }]
  return guardarCarrito({ ...carrito, lineas })
}

export function cambiarCantidadCarrito(codigo, cantidad) {
  codigo = String(codigo ?? '').trim().toUpperCase()
  const carrito = leerCarrito()
  if (!carrito.lineas.some((linea) => linea.codigo === codigo)) {
    throw new Error('El producto no está en el carrito.')
  }
  comprobarCantidad(codigo, cantidad)
  return guardarCarrito({
    ...carrito,
    lineas: carrito.lineas.map((linea) => linea.codigo === codigo ? { ...linea, cantidad } : linea),
  })
}

export function quitarDelCarrito(codigo) {
  codigo = String(codigo ?? '').trim().toUpperCase()
  const carrito = leerCarrito()
  return guardarCarrito({ ...carrito, lineas: carrito.lineas.filter((linea) => linea.codigo !== codigo) })
}

export function cambiarTarifaCarrito(tipoCliente) {
  return guardarCarrito({ ...leerCarrito(), tipoCliente })
}

export function vaciarCarrito() {
  return guardarCarrito(carritoVacio())
}
