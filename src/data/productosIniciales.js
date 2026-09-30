import cilindro5 from '../assets/productos/cilindro-5.svg'
import cilindro11 from '../assets/productos/cilindro-11.svg'
import cilindro15 from '../assets/productos/cilindro-15.svg'
import cilindro45 from '../assets/productos/cilindro-45.svg'
import regulador from '../assets/productos/regulador.svg'
import manguera from '../assets/productos/manguera.svg'
import conexion from '../assets/productos/conexion.svg'
import accesorio from '../assets/productos/accesorio.svg'
import detector from '../assets/productos/detector.svg'

const productosIniciales = [
  {
    codigo: 'CL001',
    categoria: 'Cilindros de Gas',
    nombre: 'Cilindro GLP 5 kg',
    descripcion: 'Cilindro para cocina y calefacción pequeña de uso residencial.',
    unidad: 'Unidad',
    precioResidencial: 6500,
    precioComercial: 6000,
    stock: 80,
    imagen: cilindro5,
  },
  {
    codigo: 'CL002',
    categoria: 'Cilindros de Gas',
    nombre: 'Cilindro GLP 11 kg',
    descripcion: 'Cilindro doméstico compatible con reguladores estándar.',
    unidad: 'Unidad',
    precioResidencial: 12000,
    precioComercial: 11000,
    stock: 200,
    imagen: cilindro11,
  },
  {
    codigo: 'CL003',
    categoria: 'Cilindros de Gas',
    nombre: 'Cilindro GLP 15 kg',
    descripcion: 'Cilindro para hogares de alto consumo o locales pequeños.',
    unidad: 'Unidad',
    precioResidencial: 16000,
    precioComercial: 14500,
    stock: 90,
    imagen: cilindro15,
  },
  {
    codigo: 'CL004',
    categoria: 'Cilindros de Gas',
    nombre: 'Cilindro GLP 45 kg',
    descripcion: 'Cilindro industrial para restaurantes, talleres y locales.',
    unidad: 'Unidad',
    precioResidencial: 45000,
    precioComercial: 40000,
    stock: 30,
    imagen: cilindro45,
  },
  {
    codigo: 'RG001',
    categoria: 'Reguladores',
    nombre: 'Regulador doméstico estándar',
    descripcion: 'Regulador para cilindros de 5, 11 y 15 kg.',
    unidad: 'Unidad',
    precioResidencial: 8990,
    precioComercial: 8200,
    stock: 45,
    imagen: regulador,
  },
  {
    codigo: 'RG002',
    categoria: 'Reguladores',
    nombre: 'Regulador de alta presión',
    descripcion: 'Regulador ajustable para cocinas industriales.',
    unidad: 'Unidad',
    precioResidencial: 18990,
    precioComercial: 17000,
    stock: 12,
    imagen: regulador,
  },
  {
    codigo: 'MG001',
    categoria: 'Mangueras y Conexiones',
    nombre: 'Manguera gas 1.5 m',
    descripcion: 'Manguera flexible homologada para reguladores estándar.',
    unidad: 'Unidad',
    precioResidencial: 3990,
    precioComercial: 3500,
    stock: 80,
    imagen: manguera,
  },
  {
    codigo: 'MG004',
    categoria: 'Mangueras y Conexiones',
    nombre: 'Kit conexión completo',
    descripcion: 'Regulador, manguera de 1.5 m y abrazaderas.',
    unidad: 'Kit',
    precioResidencial: 12990,
    precioComercial: 11500,
    stock: 25,
    imagen: conexion,
  },
  {
    codigo: 'AC001',
    categoria: 'Accesorios',
    nombre: 'Carro porta cilindro 11/15 kg',
    descripcion: 'Carro metálico con ruedas para transportar cilindros.',
    unidad: 'Unidad',
    precioResidencial: 12990,
    precioComercial: 11000,
    stock: 20,
    imagen: accesorio,
  },
  {
    codigo: 'AC003',
    categoria: 'Accesorios',
    nombre: 'Detector de gas a batería',
    descripcion: 'Alarma sonora y visual ante fugas de gas.',
    unidad: 'Unidad',
    precioResidencial: 19990,
    precioComercial: 17000,
    stock: 8,
    imagen: detector,
  },
]

export default productosIniciales
