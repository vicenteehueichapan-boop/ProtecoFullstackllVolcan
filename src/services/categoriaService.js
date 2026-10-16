import productosIniciales from '../data/productosIniciales'
import { errorDeCampo } from '../utils/errorDeCampo'

// Categorías del catálogo. Parten de las cuatro del Excel y administración puede crear
// nuevas o editarlas. Este servicio no conoce los productos: productoService lo usa para
// validar y para renombrar la categoría en sus productos (dependencia en un solo sentido).
const CLAVE_CATEGORIAS = 'gas-el-volcan-categorias'

function normalizar(nombre) {
  return String(nombre ?? '').trim().toLocaleLowerCase('es-CL')
}

function preparar(datos) {
  const categoria = {
    nombre: String(datos?.nombre ?? '').trim(),
    descripcion: String(datos?.descripcion ?? '').trim(),
  }
  if (categoria.nombre.length < 3) throw errorDeCampo('nombre', 'El nombre debe tener al menos 3 caracteres.')
  return categoria
}

function guardar(categorias) {
  localStorage.setItem(CLAVE_CATEGORIAS, JSON.stringify(categorias))
}

function categoriasIniciales() {
  const nombres = [...new Set(productosIniciales.map((producto) => producto.categoria))]
  return nombres.map((nombre) => ({ nombre, descripcion: '' }))
}

export function listarCategorias() {
  let texto
  try {
    texto = localStorage.getItem(CLAVE_CATEGORIAS)
  } catch {
    throw new Error('No se pudo leer el almacenamiento del navegador. Revisa sus permisos y vuelve a intentarlo.')
  }
  if (texto === null) {
    const iniciales = categoriasIniciales()
    guardar(iniciales)
    return iniciales
  }

  try {
    const categorias = JSON.parse(texto)
    const validas = Array.isArray(categorias) && categorias.every(
      (categoria) => typeof categoria?.nombre === 'string' && categoria.nombre.trim().length >= 3
        && typeof categoria.descripcion === 'string',
    )
    if (validas && new Set(categorias.map((categoria) => normalizar(categoria.nombre))).size === categorias.length) {
      return categorias
    }
  } catch {
    // El mensaje de abajo explica el problema; los datos dañados no se tocan.
  }
  throw new Error('Las categorías guardadas están dañadas. No se modificaron.')
}

export function existeCategoria(nombre) {
  return listarCategorias().some((categoria) => categoria.nombre === nombre)
}

export function crearCategoria(datos) {
  const categorias = listarCategorias()
  const nueva = preparar(datos)
  if (categorias.some((categoria) => normalizar(categoria.nombre) === normalizar(nueva.nombre))) {
    throw errorDeCampo('nombre', 'Ya existe una categoría con ese nombre.')
  }
  guardar([...categorias, nueva])
  return { ...nueva }
}

export function actualizarCategoria(nombreActual, datos) {
  const categorias = listarCategorias()
  const indice = categorias.findIndex((categoria) => categoria.nombre === nombreActual)
  if (indice === -1) throw new Error('No existe la categoría indicada.')

  const editada = preparar(datos)
  const repetida = categorias.some(
    (categoria, posicion) => posicion !== indice && normalizar(categoria.nombre) === normalizar(editada.nombre),
  )
  if (repetida) throw errorDeCampo('nombre', 'Ya existe una categoría con ese nombre.')

  const copia = [...categorias]
  copia[indice] = editada
  guardar(copia)
  return { ...editada }
}

// Vuelve a las cuatro categorías del Excel (se usa al restaurar el catálogo original).
export function restaurarCategorias() {
  const iniciales = categoriasIniciales()
  guardar(iniciales)
  return iniciales
}

// Agrega las categorías usadas por productos guardados que todavía no están en la lista
// (por ejemplo, productos creados antes de existir este módulo). No borra ni cambia ninguna.
export function asegurarCategorias(nombres) {
  const categorias = listarCategorias()
  const faltantes = [...new Set(nombres)].filter(
    (nombre) => !categorias.some((categoria) => categoria.nombre === nombre),
  )
  if (faltantes.length > 0) guardar([...categorias, ...faltantes.map((nombre) => ({ nombre, descripcion: '' }))])
}
