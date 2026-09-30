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
    return JSON.parse(productosGuardados)
  } catch {
    const productos = copiarProductosIniciales()
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos))
    return productos
  }
}
