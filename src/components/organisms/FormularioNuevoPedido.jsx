import { useState } from 'react'
import { Alert, Col, Form, Row } from 'react-bootstrap'
import { precioSegunCliente } from '../../utils/precioSegunCliente'
import BotonAccion from '../atoms/BotonAccion'
import CampoFormulario from '../molecules/CampoFormulario'
import SelectorTipoCliente from '../molecules/SelectorTipoCliente'

const VALORES_INICIALES = {
  nombre: '',
  direccion: '',
  zonaId: '',
  tipoCliente: 'residencial',
  codigoProducto: '',
  cantidad: '1',
}

function validar(valores, productos, zonas) {
  const errores = {}
  const producto = productos.find((item) => item.codigo === valores.codigoProducto)
  const cantidad = Number(valores.cantidad)

  if (valores.nombre.trim().length < 3) {
    errores.nombre = 'Ingresa el nombre del cliente.'
  }
  if (valores.direccion.trim().length < 5) {
    errores.direccion = 'Ingresa una dirección de entrega válida.'
  }
  if (!zonas.some((zona) => zona.id === valores.zonaId)) {
    errores.zonaId = 'Selecciona una zona de despacho.'
  }
  if (!producto) {
    errores.codigoProducto = 'Selecciona el cilindro solicitado.'
  } else if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > producto.stock) {
    errores.cantidad = `La cantidad debe estar entre 1 y ${producto.stock}.`
  }

  return errores
}

export default function FormularioNuevoPedido({
  productos,
  zonas,
  alPrepararPedido,
  codigoInicial = '',
}) {
  const cilindros = productos.filter((producto) => producto.categoria === 'Cilindros de Gas')
  const [valores, setValores] = useState(() => ({
    ...VALORES_INICIALES,
    codigoProducto: cilindros.some((producto) => producto.codigo === codigoInicial)
      ? codigoInicial
      : '',
  }))
  const [errores, setErrores] = useState({})

  function actualizar(campo, valor) {
    setValores((actuales) => ({ ...actuales, [campo]: valor }))
    setErrores((actuales) => ({ ...actuales, [campo]: '' }))
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    const nuevosErrores = validar(valores, cilindros, zonas)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) return

    const producto = cilindros.find((item) => item.codigo === valores.codigoProducto)
    const zona = zonas.find((item) => item.id === valores.zonaId)
    const cantidad = Number(valores.cantidad)
    const precioUnitario = precioSegunCliente(producto, valores.tipoCliente)

    alPrepararPedido({
      cliente: {
        nombre: valores.nombre.trim(),
        direccion: valores.direccion.trim(),
      },
      zona: {
        id: zona.id,
        nombre: zona.nombre,
        tiempoEstimado: zona.tiempoEstimado,
      },
      tipoCliente: valores.tipoCliente,
      productos: [{
        codigo: producto.codigo,
        nombre: producto.nombre,
        cantidad,
        precioUnitario,
        subtotal: precioUnitario * cantidad,
      }],
      total: precioUnitario * cantidad,
      formaPago: 'efectivo_al_entregar',
    })
  }

  if (cilindros.length === 0) {
    return <Alert variant="warning">No hay cilindros disponibles para crear un pedido.</Alert>
  }

  return (
    <Form noValidate onSubmit={manejarEnvio}>
      <Row>
        <Col md={6}>
          <CampoFormulario
            identificador="nombre-cliente"
            etiqueta="Nombre del cliente"
            value={valores.nombre}
            onChange={(evento) => actualizar('nombre', evento.target.value)}
            error={errores.nombre}
          />
        </Col>
        <Col md={6}>
          <CampoFormulario
            identificador="direccion-entrega"
            etiqueta="Dirección de entrega"
            value={valores.direccion}
            onChange={(evento) => actualizar('direccion', evento.target.value)}
            error={errores.direccion}
          />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="zona-despacho">
            <Form.Label>Zona de despacho</Form.Label>
            <Form.Select
              value={valores.zonaId}
              onChange={(evento) => actualizar('zonaId', evento.target.value)}
              isInvalid={Boolean(errores.zonaId)}
            >
              <option value="">Selecciona una zona</option>
              {zonas.map((zona) => (
                <option key={zona.id} value={zona.id}>
                  {zona.nombre} · {zona.tiempoEstimado}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errores.zonaId}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <SelectorTipoCliente
            valor={valores.tipoCliente}
            alCambiar={(valor) => actualizar('tipoCliente', valor)}
          />
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Form.Group className="mb-3" controlId="producto-pedido">
            <Form.Label>Cilindro</Form.Label>
            <Form.Select
              value={valores.codigoProducto}
              onChange={(evento) => actualizar('codigoProducto', evento.target.value)}
              isInvalid={Boolean(errores.codigoProducto)}
            >
              <option value="">Selecciona un cilindro</option>
              {cilindros.map((producto) => (
                <option key={producto.codigo} value={producto.codigo}>
                  {producto.nombre} · stock {producto.stock}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errores.codigoProducto}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <CampoFormulario
            identificador="cantidad-pedido"
            etiqueta="Cantidad"
            tipo="number"
            min="1"
            step="1"
            value={valores.cantidad}
            onChange={(evento) => actualizar('cantidad', evento.target.value)}
            error={errores.cantidad}
          />
        </Col>
      </Row>

      <p className="text-secondary">El pago se realiza en efectivo al momento de la entrega.</p>
      <BotonAccion tipo="submit" variante="danger">Revisar pedido</BotonAccion>
    </Form>
  )
}
