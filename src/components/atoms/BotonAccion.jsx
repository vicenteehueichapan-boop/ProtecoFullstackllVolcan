import { Button } from 'react-bootstrap'

export default function BotonAccion({ children, tipo = 'button', variante = 'primary', ...propiedades }) {
  // children es el contenido entre etiquetas; las demás props llegan al control de Bootstrap.
  return (
    <Button type={tipo} variant={variante} {...propiedades}>
      {children}
    </Button>
  )
}
