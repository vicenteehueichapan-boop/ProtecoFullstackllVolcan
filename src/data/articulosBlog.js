import imagenDespacho from '../assets/blog/blog-despacho.svg'
import imagenSeguridad from '../assets/blog/blog-seguridad.svg'
import zonasDespacho from './zonasDespacho'

// Entradas del blog, migradas de la Evaluación Parcial 1 y actualizadas para EP2.
// La entrada de despacho se arma desde zonasDespacho (hoja «Zonas de Despacho» del Excel),
// así el texto no puede contradecir los datos del caso.
const articulosBlog = [
  {
    slug: 'seguridad-al-recibir-un-cilindro',
    categoria: 'Seguridad',
    titulo: 'Cinco revisiones al recibir un cilindro',
    resumen: 'Un recorrido simple por el sello, las conexiones, la ventilación y qué hacer si sientes olor a gas.',
    imagen: imagenSeguridad,
    secciones: [
      {
        titulo: '1. Retira el sello a mano',
        texto: 'Quita el sello de la válvula con la mano. No uses cuchillos ni tijeras: pueden dañar el anillo de goma de la válvula.',
      },
      {
        titulo: '2. Usa regulador y flexible certificados',
        texto: 'Conecta el cilindro con un regulador y un flexible certificados para gas. Una manguera de agua o de jardín no reemplaza un flexible para gas.',
      },
      {
        titulo: '3. Mantén ventilación, también a nivel del suelo',
        texto: 'El gas licuado es más pesado que el aire y se acumula cerca del suelo. Los espacios con artefactos a gas necesitan ventilación.',
      },
      {
        titulo: '4. Mantén el cilindro vertical',
        texto: 'Mientras esté en uso, el cilindro no debe quedar acostado. Guárdalo lejos de fuentes de calor y de ignición.',
      },
      {
        titulo: '5. Si sientes olor a gas',
        texto: 'Cierra las válvulas si puedes hacerlo, ventila de inmediato el lugar y llama a tu proveedor de gas. Nunca enciendas luces ni fuego para buscar una fuga.',
      },
    ],
    fuentes: [
      { texto: 'SEC: Gas y parafina, ¿qué hacer?', url: 'https://www.sec.cl/gas-y-parafina/' },
      {
        texto: 'SEC Los Lagos: consejos para un uso seguro de los cilindros de gas',
        url: 'https://www.sec.cl/sec-los-lagos-entrega-consejos-para-un-uso-seguro-de-los-cilindros-de-gas-en-los-hogares/',
      },
    ],
  },
  {
    slug: 'como-funcionan-nuestras-zonas',
    categoria: 'Despacho',
    titulo: 'Cómo funcionan nuestras zonas de despacho',
    resumen: 'Días, horarios y tiempos estimados de cada zona para planificar tu pedido.',
    imagen: imagenDespacho,
    secciones: [
      ...zonasDespacho.map((zona) => ({
        titulo: zona.nombre,
        texto: `Cubre ${zona.comunas}. Despachamos ${zona.dias.toLocaleLowerCase('es-CL')}, de ${zona.horario}. Tiempo estimado de entrega: ${zona.tiempoEstimado.toLocaleLowerCase('es-CL')}.`,
      })),
      {
        titulo: 'Importante',
        texto: 'Los tiempos son estimaciones según la zona, no una hora garantizada. Al confirmar tu pedido eliges tu zona y luego puedes revisar su estado en Seguimiento. El pago es en efectivo al recibir.',
      },
    ],
    fuentes: [],
  },
]

export default articulosBlog
