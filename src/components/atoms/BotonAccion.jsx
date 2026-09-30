import { Button } from 'react-bootstrap'

export default function BotonAccion({ children, tipo = 'button', variante = 'primary', ...propiedades }) {
  return (
    <Button type={tipo} variant={variante} {...propiedades}>
      {children}
    </Button>
  )
}
