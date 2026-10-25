import { useRef, useState } from 'react'
import { Alert, Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import BotonAccion from '../components/atoms/BotonAccion'
import ResumenPedido from '../components/molecules/ResumenPedido'
import FormularioEntrega from '../components/organisms/FormularioEntrega'
import ResultadoPedidoFallido from '../components/organisms/ResultadoPedidoFallido'
import zonasDespacho from '../data/zonasDespacho'
import { useCarrito } from '../hooks/useCarrito'
import { usePedidos } from '../hooks/usePedidos'
import { useSesionCliente } from '../hooks/useSesionCliente'
import { useProductos } from '../hooks/useProductos'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { resumirCarrito } from '../utils/resumirCarrito'

export default function ConfirmarPedido() {
  useTituloPagina('Confirmar pedido')
  const { carrito, error, vaciar } = useCarrito()
  const { productos, recargarProductos } = useProductos()
  const { crearPedido } = usePedidos()
  const { cliente: cuenta, actualizarDatos } = useSesionCliente()
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
      clienteId: cuenta?.id ?? null,
    })
  }

  // Guarda la última dirección en la cuenta para el próximo pedido. Si falla,
  // el pedido ya quedó registrado, así que no se presenta como un error.
  function recordarEntrega() {
    if (!cuenta) return
    try {
      actualizarDatos({ direccion: borrador.cliente.direccion, zonaId: borrador.zona.id })
    } catch {
      // El próximo pedido simplemente pedirá la dirección otra vez.
    }
  }

  function confirmar() {
    if (registrado.current) return
    try {
      const pedido = crearPedido(borrador)
      registrado.current = true
      // El servicio descontó el stock del pedido: el Context vuelve a leer el catálogo.
      recargarProductos()
      recordarEntrega()
      const vaciado = vaciar()
      // recienCreado permite ver el comprobante sin volver a pedir el correo.
      navegar(`/pedido-confirmado/${pedido.id}`, {
        replace: true,
        state: {
          recienCreado: true,
          aviso: vaciado ? '' : 'Tu pedido se registró correctamente, pero no pudimos vaciar el carrito. No vuelvas a enviarlo; revisa el almacenamiento y vacía el carrito manualmente.',
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
      {errorConfirmacion && (
        <ResultadoPedidoFallido
          mensaje={errorConfirmacion}
          alReintentar={() => setErrorConfirmacion('')}
          alRevisarCarrito={() => navegar('/carrito')}
        />
      )}
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
      {/* El formulario se oculta (sin desmontarse) para conservar lo escrito al reintentar. */}
      <div hidden={!resumen.puedeConfirmar || Boolean(error) || Boolean(borrador) || Boolean(errorConfirmacion)}>
        {!cuenta && (
          <p className="border rounded p-3 bg-light">
            ¿Tienes cuenta? <Link to="/ingreso" state={{ desde: '/confirmar-pedido' }}>Ingresa</Link> para
            completar tus datos y guardar el pedido en tu historial.
          </p>
        )}
        <FormularioEntrega
          zonas={zonasDespacho}
          alPreparar={preparar}
          datosIniciales={cuenta && {
            nombre: cuenta.nombre, apellidos: cuenta.apellidos, correo: cuenta.correo,
            direccion: cuenta.direccion, zonaId: cuenta.zonaId,
          }}
        />
      </div>
      <Link className="d-inline-block mt-3" to="/carrito">Volver al carrito</Link>
    </Container>
  )
}
