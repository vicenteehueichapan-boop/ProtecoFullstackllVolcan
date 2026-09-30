import { Badge } from 'react-bootstrap'

const PRESENTACION_ESTADOS = {
  pendiente: { texto: 'Pendiente', variante: 'warning', textoOscuro: true },
  asignado: { texto: 'Asignado', variante: 'info', textoOscuro: true },
  en_camino: { texto: 'En camino', variante: 'primary', textoOscuro: false },
  entregado: { texto: 'Entregado', variante: 'success', textoOscuro: false },
}

export default function EtiquetaEstadoPedido({ estado }) {
  const presentacion = PRESENTACION_ESTADOS[estado] ?? {
    texto: 'Estado desconocido',
    variante: 'secondary',
    textoOscuro: false,
  }

  return (
    <Badge bg={presentacion.variante} text={presentacion.textoOscuro ? 'dark' : undefined}>
      {presentacion.texto}
    </Badge>
  )
}
