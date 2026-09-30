import { BrowserRouter } from 'react-router-dom'
import { ProductosProvider } from './context/ProductosContext'
import RutasAplicacion from './routes/RutasAplicacion'

function App() {
  return (
    <BrowserRouter>
      <ProductosProvider>
        <RutasAplicacion />
      </ProductosProvider>
    </BrowserRouter>
  )
}

export default App
