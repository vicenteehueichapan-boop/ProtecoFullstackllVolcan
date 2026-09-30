import productosIniciales from '../data/productosIniciales'

const CLAVE_PRODUCTOS = 'gas-el-volcan-productos'

function normalizarCodigo(codigo) {
  return String(codigo ?? '').trim().toUpperCase()
}

function validarTexto(valor, nombreCampo) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    throw new Error(`${nombreCampo} es obligatorio`)
  }
}

function validarNumeroNoNegativo(valor, nombreCampo) {
  if (typeof valor !== 'number' || !Number.isFinite(valor) || valor < 0) {
    throw new Error(`${nombreCampo} debe ser un número mayor o igual a cero`)
  }
}

function validarProducto(producto) {
  if (producto === null || typeof producto !== 'object' || Array.isArray(producto)) {
    throw new Error('Los datos del producto no son válidos')
  }

  validarTexto(producto.codigo, 'El código')
  validarTexto(producto.categoria, 'La categoría')
  validarTexto(producto.nombre, 'El nombre')
  validarTexto(producto.descripcion, 'La descripción')
  validarTexto(producto.unidad, 'La unidad')
  validarNumeroNoNegativo(producto.precioResidencial, 'El precio residencial')
  validarNumeroNoNegativo(producto.precioComercial, 'El precio comercial')
  validarNumeroNoNegativo(producto.stock, 'El stock')

  if (!Number.isInteger(producto.stock)) {
    throw new Error('El stock debe ser un número entero')
  }
}

function prepararProducto(producto) {
  validarProducto(producto)

  const productoPreparado = {
    ...producto,
    codigo: normalizarCodigo(producto.codigo),
    categoria: producto.categoria.trim(),
    nombre: producto.nombre.trim(),
    descripcion: producto.descripcion.trim(),
    unidad: producto.unidad.trim(),
  }

  return productoPreparado
}

function guardarProductos(productos) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos))
}

function copiarProductosIniciales() {
  return productosIniciales.map((producto) => ({ ...producto }))
}

export function listarProductos() {
  const productosGuardados = localStorage.getItem(CLAVE_PRODUCTOS)

  if (productosGuardados === null) {
    const productos = copiarProductosIniciales()
    guardarProductos(productos)
    return productos
  }

  try {
    const productos = JSON.parse(productosGuardados)

    if (Array.isArray(productos)) {
      const productosValidados = productos.map(prepararProducto)
      const codigos = new Set(productosValidados.map((producto) => producto.codigo))
      if (codigos.size === productosValidados.length) return productosValidados
    }
  } catch {
    // Si los datos están dañados, se restaura el catálogo inicial más abajo.
  }

  const productos = copiarProductosIniciales()
  guardarProductos(productos)
  return productos
}

export function obtenerProductoPorCodigo(codigo) {
  const codigoBuscado = normalizarCodigo(codigo)
  return listarProductos().find((producto) => producto.codigo === codigoBuscado) ?? null
}

export function crearProducto(producto) {
  const nuevoProducto = prepararProducto(producto)
  const productos = listarProductos()

  if (productos.some((item) => item.codigo === nuevoProducto.codigo)) {
    throw new Error(`Ya existe un producto con el código ${nuevoProducto.codigo}`)
  }

  guardarProductos([...productos, nuevoProducto])
  return nuevoProducto
}

export function actualizarProducto(codigo, cambios) {
  const codigoBuscado = normalizarCodigo(codigo)
  const productos = listarProductos()
  const indice = productos.findIndex((producto) => producto.codigo === codigoBuscado)

  if (indice === -1) {
    throw new Error(`No existe un producto con el código ${codigoBuscado}`)
  }

  const productoActualizado = prepararProducto({ ...productos[indice], ...cambios })
  const codigoRepetido = productos.some(
    (producto, posicion) => posicion !== indice && producto.codigo === productoActualizado.codigo,
  )

  if (codigoRepetido) {
    throw new Error(`Ya existe un producto con el código ${productoActualizado.codigo}`)
  }

  const productosActualizados = [...productos]
  productosActualizados[indice] = productoActualizado
  guardarProductos(productosActualizados)
  return productoActualizado
}

export function eliminarProducto(codigo) {
  const codigoBuscado = normalizarCodigo(codigo)
  const productos = listarProductos()
  const productoEliminado = productos.find((producto) => producto.codigo === codigoBuscado)

  if (productoEliminado === undefined) {
    throw new Error(`No existe un producto con el código ${codigoBuscado}`)
  }

  guardarProductos(productos.filter((producto) => producto.codigo !== codigoBuscado))
  return productoEliminado
}

export function restaurarProductos() {
  const productos = copiarProductosIniciales()
  guardarProductos(productos)
  return productos
}
