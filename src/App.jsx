import { BrowserRouter } from 'react-router-dom'
import { ProductosProvider } from './context/ProductosContext'
import { PedidosProvider } from './context/PedidosContext'
import RutasAplicacion from './routes/RutasAplicacion'
import { CarritoProvider } from './context/CarritoContext'
import { SesionPersonalProvider } from './context/SesionPersonalContext'

function App() {
  return (
    <BrowserRouter>
      <ProductosProvider>
        <PedidosProvider>
          <CarritoProvider>
            <SesionPersonalProvider><RutasAplicacion /></SesionPersonalProvider>
          </CarritoProvider>
        </PedidosProvider>
      </ProductosProvider>
    </BrowserRouter>
  )
}

export default App
