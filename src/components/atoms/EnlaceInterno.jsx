import { esClicSimple } from '../../utils/esClicSimple'

// Enlace interno de la aplicación (Guía 14, sección 3): un <a href> de verdad, accesible
// y que se puede abrir en otra pestaña. En un clic simple cancela la recarga y avisa la
// ruta al padre con alNavegar. No conoce el router: quien lo usa le pasa la función.
export default function EnlaceInterno({ ruta, alNavegar, children, ...propiedades }) {
  function seguir(evento) {
    if (!esClicSimple(evento)) return
    evento.preventDefault()
    alNavegar(ruta)
  }

  return (
    <a href={ruta} onClick={seguir} {...propiedades}>
      {children}
    </a>
  )
}
