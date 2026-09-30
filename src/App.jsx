import { BrowserRouter } from 'react-router-dom'
import { ProductosProvider } from './context/ProductosContext'
import { PedidosProvider } from './context/PedidosContext'
import RutasAplicacion from './routes/RutasAplicacion'

function App() {
  return (
    <BrowserRouter>
      <ProductosProvider>
        <PedidosProvider>
          <RutasAplicacion />
        </PedidosProvider>
      </ProductosProvider>
    </BrowserRouter>
  )
}

export default App
