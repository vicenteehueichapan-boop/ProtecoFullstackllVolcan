import codigosDestacadosIniciales from '../data/destacadosIniciales'
import productosIniciales from '../data/productosIniciales'
import { errorDeCampo } from '../utils/errorDeCampo'
import {
  actualizarCategoria, asegurarCategorias, existeCategoria, listarCategorias, restaurarCategorias,
} from './categoriaService'

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

  if (producto.destacado !== undefined && typeof producto.destacado !== 'boolean') {
    throw new Error('El campo destacado debe ser verdadero o falso')
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
    destacado: producto.destacado === true,
  }

  return productoPreparado
}

function guardarProductos(productos) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos))
}

function copiarProductosIniciales() {
  return productosIniciales.map((producto) => ({
    ...producto,
    destacado: codigosDestacadosIniciales.includes(producto.codigo),
  }))
}

function leerProductosGuardados() {
  try {
    return localStorage.getItem(CLAVE_PRODUCTOS)
  } catch {
    throw new Error('No se pudo leer el almacenamiento del navegador. Revisa sus permisos y vuelve a intentarlo.')
  }
}

function leerCatalogo() {
  const productosGuardados = leerProductosGuardados()

  if (productosGuardados === null) {
    const productos = copiarProductosIniciales()
    guardarProductos(productos)
    return productos
  }

  try {
    const productos = JSON.parse(productosGuardados)

    if (Array.isArray(productos)) {
      // Migración: un catálogo guardado antes de existir el campo destacado no lo trae en
      // ningún producto. Se marcan los destacados iniciales y se conserva todo lo demás.
      const esquemaAnterior = productos.every((producto) => producto && !('destacado' in producto))
      const productosValidados = productos.map(prepararProducto)
      const codigos = new Set(productosValidados.map((producto) => producto.codigo))
      if (codigos.size === productosValidados.length) {
        if (!esquemaAnterior) return productosValidados
        const migrados = productosValidados.map((producto) => ({
          ...producto,
          destacado: codigosDestacadosIniciales.includes(producto.codigo),
        }))
        guardarProductos(migrados)
        return migrados
      }
    }
  } catch {
    // El mensaje de abajo explica el problema; los datos dañados no se tocan.
  }

  // No se restaura en silencio: se perderían los cambios hechos por administración.
  throw new Error('El catálogo guardado está dañado. No se modificó; administración puede revisarlo o restaurar el catálogo original.')
}

export function listarProductos() {
  const productos = leerCatalogo()
  // Toda categoría usada por un producto debe estar en la lista de categorías.
  asegurarCategorias(productos.map((producto) => producto.categoria))
  return productos
}

// Un producto solo puede pertenecer a una categoría registrada (Guía 16: categorías).
function comprobarCategoria(producto) {
  if (!existeCategoria(producto.categoria)) {
    throw errorDeCampo('categoria', 'Selecciona una categoría existente.')
  }
}

export function obtenerProductoPorCodigo(codigo) {
  const codigoBuscado = normalizarCodigo(codigo)
  return listarProductos().find((producto) => producto.codigo === codigoBuscado) ?? null
}

export function crearProducto(producto) {
  const nuevoProducto = prepararProducto(producto)
  const productos = listarProductos()
  comprobarCategoria(nuevoProducto)

  if (productos.some((item) => item.codigo === nuevoProducto.codigo)) {
    throw errorDeCampo('codigo', `Ya existe un producto con el código ${nuevoProducto.codigo}`)
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
  comprobarCategoria(productoActualizado)
  const codigoRepetido = productos.some(
    (producto, posicion) => posicion !== indice && producto.codigo === productoActualizado.codigo,
  )

  if (codigoRepetido) {
    throw errorDeCampo('codigo', `Ya existe un producto con el código ${productoActualizado.codigo}`)
  }

  const productosActualizados = [...productos]
  productosActualizados[indice] = productoActualizado
  guardarProductos(productosActualizados)
  return productoActualizado
}

// Renombra una categoría y la actualiza en todos sus productos. Si no se pueden guardar
// los productos, la categoría vuelve a su nombre anterior para no quedar desalineadas.
export function renombrarCategoria(nombreActual, datos) {
  const productos = listarProductos()
  const anterior = listarCategorias().find((categoria) => categoria.nombre === nombreActual)
  const editada = actualizarCategoria(nombreActual, datos)
  try {
    guardarProductos(productos.map((producto) => (
      producto.categoria === nombreActual ? { ...producto, categoria: editada.nombre } : producto
    )))
  } catch (excepcion) {
    actualizarCategoria(editada.nombre, anterior)
    throw excepcion
  }
  return editada
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

// Suma (signo 1) o resta (signo -1) las cantidades de varias líneas. Primero calcula todos
// los cambios y recién al final guarda: si una línea falla, no se modifica ningún stock.
function ajustarStock(lineas, signo) {
  const productos = listarProductos()
  for (const linea of lineas) {
    if (!productos.some((producto) => producto.codigo === linea.codigo)) {
      throw new Error(`No existe un producto con el código ${linea.codigo}`)
    }
  }
  const actualizados = productos.map((producto) => {
    const linea = lineas.find((item) => item.codigo === producto.codigo)
    if (!linea) return producto
    const stock = producto.stock + signo * linea.cantidad
    if (stock < 0) throw new Error(`No hay stock suficiente de ${producto.nombre}`)
    return { ...producto, stock }
  })
  guardarProductos(actualizados)
}

// Al registrar un pedido se descuenta su stock: así el stock visible ya considera lo
// comprometido y no se aceptan pedidos que no se podrían entregar.
export function descontarStock(lineas) {
  ajustarStock(lineas, -1)
}

// Revierte un descuento cuando el pedido no se pudo guardar.
export function devolverStock(lineas) {
  ajustarStock(lineas, 1)
}

export function restaurarProductos() {
  const productos = copiarProductosIniciales()
  restaurarCategorias()
  guardarProductos(productos)
  return productos
}

export function incorporarProductosDelCaso() {
  const productos = listarProductos()
  const codigos = new Set(productos.map((producto) => producto.codigo))
  const faltantes = copiarProductosIniciales().filter((producto) => !codigos.has(producto.codigo))
  const completos = [...productos, ...faltantes]
  guardarProductos(completos)
  return completos
}
