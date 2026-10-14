import { BrowserRouter } from 'react-router-dom'
import { ProductosProvider } from './context/ProductosContext'
import { PedidosProvider } from './context/PedidosContext'
import RutasAplicacion from './routes/RutasAplicacion'
import { CarritoProvider } from './context/CarritoContext'

function App() {
  return (
    <BrowserRouter>
      <ProductosProvider>
        <PedidosProvider>
          <CarritoProvider>
            <RutasAplicacion />
          </CarritoProvider>
        </PedidosProvider>
      </ProductosProvider>
    </BrowserRouter>
  )
}

export default App
