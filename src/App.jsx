import { ProductosProvider } from './context/ProductosContext'
import RutasAplicacion from './routes/RutasAplicacion'

function App() {
  return (
    <ProductosProvider>
      <RutasAplicacion />
    </ProductosProvider>
  )
}

export default App
