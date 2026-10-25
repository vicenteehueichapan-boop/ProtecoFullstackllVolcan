import accesorio from '../assets/productos/accesorio.svg'
import cilindro from '../assets/productos/cilindro-11.svg'
import manguera from '../assets/productos/manguera.svg'
import generico from '../assets/productos/producto-generico.svg'
import regulador from '../assets/productos/regulador.svg'

const IMAGENES = {
  'Cilindros de Gas': cilindro,
  Reguladores: regulador,
  'Mangueras y Conexiones': manguera,
  Accesorios: accesorio,
}

// Ilustración para un producto creado por administración: la de su categoría, o una genérica
// para categorías nuevas. Así un cilindro nuevo no aparece con el dibujo de un carro.
export function imagenSegunCategoria(categoria) {
  return IMAGENES[categoria] ?? generico
}
