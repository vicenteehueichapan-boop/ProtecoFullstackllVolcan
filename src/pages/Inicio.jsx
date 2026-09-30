import { Button, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import heroDespacho from '../assets/hero-despacho.svg'
import CatalogoGas from '../components/organisms/CatalogoGas'
import { useProductos } from '../hooks/useProductos'
import zonasDespacho from '../data/zonasDespacho'

export default function Inicio() {
  const { productos } = useProductos()
  const cilindros = productos.filter((producto) => producto.categoria === 'Cilindros de Gas').slice(0, 4)

  return (
    <>
    <section className="hero-inicio">
      <Container>
        <Row className="align-items-center gx-4 gy-5">
          <Col lg={6}>
            <p className="sobretitulo">Cerca de ti, en Chillán</p>
            <h1>La energía de tu hogar,<br /><span>a un pedido de distancia.</span></h1>
            <p className="descripcion-inicio">
              Encuentra el cilindro que necesitas, revisa tu tarifa y sigue tu pedido hasta la puerta de tu casa.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Button as={Link} variant="danger" size="lg" to="/nuevo-pedido">Pedir gas ahora</Button>
              <Button as={Link} variant="outline-secondary" size="lg" to="/catalogo">Explorar catálogo</Button>
            </div>
            <p className="nota-inicio">Clientes residenciales y comerciales · Pago en efectivo al entregar</p>
          </Col>
          <Col lg={6}>
            <div className="ilustracion-inicio">
              <img className="img-fluid" src={heroDespacho} alt="Camión de reparto de Gas El Volcán" />
              <div className="nota-despacho">
                <span className="sobretitulo mb-1">Del pedido a tu puerta</span>
                <strong>Conoce el estado de tu entrega</strong>
                <Link to="/seguimiento">Consultar mi pedido</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
    <section className="seccion-inicio" aria-labelledby="titulo-cilindros">
      <Container>
        <div className="cabecera-seccion">
          <div>
            <p className="sobretitulo">Elige lo que necesitas</p>
            <h2 id="titulo-cilindros">Gas para cada día</h2>
            <p className="text-secondary mb-0">Consulta tamaños y precios residenciales. También tenemos tarifa comercial.</p>
          </div>
          <Link className="enlace-destacado" to="/catalogo">Ver todo el catálogo</Link>
        </div>
        <CatalogoGas productos={cilindros} tipoCliente="residencial" />
      </Container>
    </section>
    <section className="seccion-inicio seccion-despacho" aria-labelledby="titulo-zonas">
      <Container>
        <div className="cabecera-seccion">
          <div>
            <p className="sobretitulo">Planifica tu entrega</p>
            <h2 id="titulo-zonas">Llegamos a tu sector</h2>
            <p className="text-secondary mb-0">Los tiempos son estimados y dependen de tu zona de despacho.</p>
          </div>
        </div>
        <Row className="g-3">
          {zonasDespacho.map((zona) => (
            <Col key={zona.id} md={6} lg={4}>
              <article className="zona-despacho h-100">
                <h3 className="h5">{zona.nombre}</h3>
                <p>{zona.comunas}</p>
                <strong>{zona.tiempoEstimado}</strong>
                <small>{zona.dias} · {zona.horario}</small>
              </article>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
    </>
  )
}
