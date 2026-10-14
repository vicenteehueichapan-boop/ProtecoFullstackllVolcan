import { useState } from 'react'
import { Form } from 'react-bootstrap'
import BotonAccion from '../atoms/BotonAccion'
import CampoEntrada from '../atoms/CampoEntrada'

export default function BuscadorPedido({ identificadorInicial, alBuscar }) {
  const [consulta, setConsulta] = useState(identificadorInicial)

  function buscar(evento) {
    evento.preventDefault()
    const identificador = consulta.trim().toUpperCase()
    if (identificador) alBuscar(identificador)
  }

  return (
    <Form className="d-flex gap-2 my-4" onSubmit={buscar}>
      <CampoEntrada
        aria-label="Número del pedido"
        placeholder="Ejemplo: PED-0001"
        value={consulta}
        onChange={(evento) => setConsulta(evento.target.value)}
      />
      <BotonAccion tipo="submit" variante="danger">Buscar</BotonAccion>
    </Form>
  )
}
