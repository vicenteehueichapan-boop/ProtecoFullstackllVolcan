import { useRef, useState } from 'react'
import { Alert, Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import BotonAccion from '../components/atoms/BotonAccion'
import ResumenPedido from '../components/molecules/ResumenPedido'
import FormularioEntrega from '../components/organisms/FormularioEntrega'
import zonasDespacho from '../data/zonasDespacho'
import { useCarrito } from '../hooks/useCarrito'
import { usePedidos } from '../hooks/usePedidos'
import { useProductos } from '../hooks/useProductos'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { resumirCarrito } from '../utils/resumirCarrito'

export default function ConfirmarPedido() {
  useTituloPagina('Confirmar pedido')
  const { carrito, error, vaciar } = useCarrito()
  const { productos, recargarProductos } = useProductos()
  const { crearPedido } = usePedidos()
  const navegar = useNavigate()
  const [borrador, setBorrador] = useState(null)
  const [errorConfirmacion, setErrorConfirmacion] = useState('')
  const registrado = useRef(false)
  const resumen = resumirCarrito(carrito, productos)

  function preparar({ cliente, zona }) {
    if (!resumen.puedeConfirmar || error) return
    setErrorConfirmacion('')
    setBorrador({
      cliente, zona: { id: zona.id, nombre: zona.nombre, tiempoEstimado: zona.tiempoEstimado },
      tipoCliente: carrito.tipoCliente,
      productos: resumen.lineas.map(({ codigo, nombre, cantidad, precioUnitario, subtotal }) => ({
        codigo, nombre, cantidad, precioUnitario, subtotal,
      })),
      total: resumen.total, formaPago: 'efectivo_al_entregar',
    })
  }

  function confirmar() {
    if (registrado.current) return
    try {
      const pedido = crearPedido(borrador)
      registrado.current = true
      const vaciado = vaciar()
      navegar(`/pedido-confirmado/${pedido.id}`, {
        replace: true,
        state: vaciado ? null : {
          aviso: 'Tu pedido se registró correctamente, pero no pudimos vaciar el carrito. No vuelvas a enviarlo; revisa el almacenamiento y vacía el carrito manualmente.',
        },
      })
    } catch (excepcion) {
      setErrorConfirmacion(excepcion instanceof Error ? excepcion.message : 'No pudimos registrar el pedido.')
      setBorrador(null)
      recargarProductos()
    }
  }

  return (
    <Container as="section" className="py-5">
      <h1>Datos de entrega</h1>
      <p>Completa los datos y revisa el importe antes de registrar el pedido. El pago se realiza en efectivo al entregar.</p>
      {error && <Alert variant="danger">{error}</Alert>}
      {errorConfirmacion && <Alert variant="danger">{errorConfirmacion}</Alert>}
      {!resumen.puedeConfirmar || error ? (
        <Alert variant="warning">El carrito está vacío o necesita correcciones. <Link to="/carrito">Revisar mi carrito</Link></Alert>
      ) : (
        <>
          {borrador && (
            <>
              <ResumenPedido pedido={borrador} />
              <div className="d-flex flex-wrap gap-3 my-4">
                <BotonAccion variante="danger" onClick={confirmar}>Confirmar pedido</BotonAccion>
                <BotonAccion variante="outline-secondary" onClick={() => setBorrador(null)}>Corregir datos</BotonAccion>
              </div>
            </>
          )}
        </>
      )}
      <div hidden={!resumen.puedeConfirmar || Boolean(error) || Boolean(borrador)}>
        <FormularioEntrega zonas={zonasDespacho} alPreparar={preparar} />
      </div>
      <Link className="d-inline-block mt-3" to="/carrito">Volver al carrito</Link>
    </Container>
  )
}
