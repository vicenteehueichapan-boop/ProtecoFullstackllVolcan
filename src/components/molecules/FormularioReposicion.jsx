import { useState } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import BotonAccion from '../atoms/BotonAccion'
import { validarReposicion } from '../../utils/validarReposicion'

// Campo controlado para sumar unidades a un producto. Valida y avisa al padre con la cantidad.
export default function FormularioReposicion({ producto, alReponer }) {
  const [cantidad, setCantidad] = useState('')
  const [error, setError] = useState('')
  const idCampo = `reponer-${producto.codigo}`

  function enviar(evento) {
    evento.preventDefault()
    const mensaje = validarReposicion(cantidad)
    setError(mensaje)
    if (mensaje) return
    alReponer(producto.codigo, Number(cantidad))
    setCantidad('')
  }

  return (
    <Form noValidate onSubmit={enviar}>
      <Form.Label htmlFor={idCampo} className="visually-hidden">Unidades a reponer de {producto.nombre}</Form.Label>
      <InputGroup hasValidation>
        <Form.Control
          id={idCampo}
          type="number"
          min="1"
          max="1000"
          inputMode="numeric"
          placeholder="Unidades"
          value={cantidad}
          onChange={(evento) => setCantidad(evento.target.value)}
          isInvalid={Boolean(error)}
          aria-describedby={error ? `${idCampo}-error` : undefined}
        />
        <BotonAccion tipo="submit" variante="outline-danger">Reponer</BotonAccion>
        <Form.Control.Feedback id={`${idCampo}-error`} type="invalid">{error}</Form.Control.Feedback>
      </InputGroup>
    </Form>
  )
}
