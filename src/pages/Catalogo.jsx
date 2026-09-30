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

  return (
    <Container as="section" className="py-5">
      <Row className="align-items-end mb-3">
        <Col md={8}>
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
        alBuscar={(valor) => actualizarParametro('buscar', valor)}
        alCambiarCategoria={(valor) => actualizarParametro('categoria', valor)}
      />
      <CatalogoGas productos={productosFiltrados} tipoCliente={tipoCliente} />
    </Container>
  )
}
