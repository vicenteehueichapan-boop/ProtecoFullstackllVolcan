import productosIniciales from '../data/productosIniciales'

const CLAVE_PRODUCTOS = 'gas-el-volcan-productos'

function copiarProductosIniciales() {
  return productosIniciales.map((producto) => ({ ...producto }))
}

export function listarProductos() {
  const productosGuardados = localStorage.getItem(CLAVE_PRODUCTOS)

  if (productosGuardados === null) {
    const productos = copiarProductosIniciales()
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos))
    return productos
  }

  try {
    const productos = JSON.parse(productosGuardados)

    if (Array.isArray(productos)) {
      return productos
    }
  } catch {
    // Si los datos están dañados, se restaura el catálogo inicial más abajo.
  }

  const productos = copiarProductosIniciales()
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos))
  return productos
}
