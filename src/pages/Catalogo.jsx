import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import FiltrosCatalogo from '../components/molecules/FiltrosCatalogo'
import SelectorTipoCliente from '../components/molecules/SelectorTipoCliente'
import CatalogoGas from '../components/organisms/CatalogoGas'
import { useProductos } from '../hooks/useProductos'

export default function Catalogo() {
  const { productos } = useProductos()
  const [tipoCliente, setTipoCliente] = useState('residencial')
  const [parametros, setParametros] = useSearchParams()
  const busqueda = parametros.get('buscar') ?? ''
  const categoria = parametros.get('categoria') ?? ''
  const categorias = [...new Set(productos.map((producto) => producto.categoria))]
  const textoNormalizado = busqueda.trim().toLocaleLowerCase('es-CL')
  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria = !categoria || producto.categoria === categoria
    const contenido = `${producto.codigo} ${producto.nombre} ${producto.descripcion}`.toLocaleLowerCase('es-CL')
    return coincideCategoria && contenido.includes(textoNormalizado)
  })

  function actualizarParametro(nombre, valor) {
    const nuevosParametros = new URLSearchParams(parametros)
    if (valor) nuevosParametros.set(nombre, valor)
    else nuevosParametros.delete(nombre)
    setParametros(nuevosParametros)
  }

  function buscarProducto(valor) {
    actualizarParametro('buscar', valor)
  }

  function cambiarCategoria(valor) {
    actualizarParametro('categoria', valor)
  }

  return (
    <Container as="section" className="py-5">
      <Row className="align-items-end g-3 mb-4 cabecera-catalogo">
        <Col md={8}>
          <p className="sobretitulo">Para tu hogar y tu negocio</p>
          <h1>Catálogo de productos</h1>
          <p className="text-secondary">
            Selecciona el tipo de cliente para consultar la tarifa correspondiente.
          </p>
        </Col>
        <Col md={4}>
          <SelectorTipoCliente valor={tipoCliente} alCambiar={setTipoCliente} />
        </Col>
      </Row>

      <FiltrosCatalogo
        busqueda={busqueda}
        categoria={categoria}
        categorias={categorias}
        alBuscar={buscarProducto}
        alCambiarCategoria={cambiarCategoria}
      />
      <p className="resultado-catalogo" aria-live="polite">
        {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto encontrado' : 'productos encontrados'}
      </p>
      <CatalogoGas productos={productosFiltrados} tipoCliente={tipoCliente} />
    </Container>
  )
}
