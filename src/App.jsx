import { BrowserRouter } from 'react-router-dom'
import { ProductosProvider } from './context/ProductosContext'
import { PedidosProvider } from './context/PedidosContext'
import RutasAplicacion from './routes/RutasAplicacion'
import { CarritoProvider } from './context/CarritoContext'
import { SesionPersonalProvider } from './context/SesionPersonalContext'
import { SesionClienteProvider } from './context/SesionClienteContext'
import { UsuariosProvider } from './context/UsuariosContext'

function App() {
  return (
    <BrowserRouter>
      <ProductosProvider>
        <PedidosProvider>
          <CarritoProvider>
            <UsuariosProvider>
              <SesionClienteProvider>
                <SesionPersonalProvider><RutasAplicacion /></SesionPersonalProvider>
              </SesionClienteProvider>
            </UsuariosProvider>
          </CarritoProvider>
        </PedidosProvider>
      </ProductosProvider>
    </BrowserRouter>
  )
}

export default App
