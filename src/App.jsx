import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProductosProvider } from './context/ProductosContext'
import { PedidosProvider } from './context/PedidosContext'
import { CarritoProvider } from './context/CarritoContext'
import { SesionPersonalProvider } from './context/SesionPersonalContext'
import { SesionClienteProvider } from './context/SesionClienteContext'
import { UsuariosProvider } from './context/UsuariosContext'
import AccesoPorRol from './routes/AccesoPorRol'
import PlantillaPublica from './components/templates/PlantillaPublica'
import PlantillaPersonal from './components/templates/PlantillaPersonal'
import PlantillaAdministracion from './components/templates/PlantillaAdministracion'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import Carrito from './pages/Carrito'
import ConfirmarPedido from './pages/ConfirmarPedido'
import Categorias from './pages/Categorias'
import DetalleProducto from './pages/DetalleProducto'
import Ingreso from './pages/Ingreso'
import Registro from './pages/Registro'
import MisPedidos from './pages/MisPedidos'
import Blog from './pages/Blog'
import DetalleBlog from './pages/DetalleBlog'
import Nosotros from './pages/Nosotros'
import Contacto from './pages/Contacto'
import Destacados from './pages/Destacados'
import PedidoExitoso from './pages/PedidoExitoso'
import SeguimientoPedido from './pages/SeguimientoPedido'
import PaginaNoEncontrada from './pages/PaginaNoEncontrada'
import AccesoPersonal from './pages/AccesoPersonal'
import PanelAdministracion from './pages/PanelAdministracion'
import AdministrarPedidos from './pages/AdministrarPedidos'
import OrdenPedidoAdministracion from './pages/OrdenPedidoAdministracion'
import AdministrarProductos from './pages/AdministrarProductos'
import ProductosCriticos from './pages/ProductosCriticos'
import AdministrarCategorias from './pages/AdministrarCategorias'
import AdministrarUsuarios from './pages/AdministrarUsuarios'
import DetalleClienteAdministracion from './pages/DetalleClienteAdministracion'
import DetallePersonalAdministracion from './pages/DetallePersonalAdministracion'
import ReportesAdministracion from './pages/ReportesAdministracion'
import PerfilAdministracion from './pages/PerfilAdministracion'
import OperadoraPedidos from './pages/OperadoraPedidos'
import RepartidorEntregas from './pages/RepartidorEntregas'

// Mapa de rutas de la aplicación (Guía 16): BrowserRouter se usa una sola vez y los
// proveedores de contexto envuelven todas las páginas.
function App() {
  return (
    <BrowserRouter>
      <ProductosProvider>
        <PedidosProvider>
          <CarritoProvider>
            <UsuariosProvider>
              <SesionClienteProvider>
                <SesionPersonalProvider>
                  <Routes>
                    <Route element={<PlantillaPublica />}>
                      <Route index element={<Inicio />} />
                      <Route path="catalogo" element={<Catalogo />} />
                      <Route path="carrito" element={<Carrito />} />
                      <Route path="confirmar-pedido" element={<ConfirmarPedido />} />
                      <Route path="categorias" element={<Categorias />} />
                      <Route path="productos/:codigo" element={<DetalleProducto />} />
                      <Route path="ingreso" element={<Ingreso />} />
                      <Route path="registro" element={<Registro />} />
                      <Route path="mis-pedidos" element={<MisPedidos />} />
                      <Route path="blog" element={<Blog />} />
                      <Route path="blog/:slug" element={<DetalleBlog />} />
                      <Route path="nosotros" element={<Nosotros />} />
                      <Route path="contacto" element={<Contacto />} />
                      <Route path="destacados" element={<Destacados />} />
                      <Route path="pedido-confirmado/:id" element={<PedidoExitoso />} />
                      <Route path="seguimiento" element={<SeguimientoPedido />} />
                      <Route path="seguimiento/:id" element={<SeguimientoPedido />} />
                      <Route path="*" element={<PaginaNoEncontrada />} />
                    </Route>
                    <Route element={<PlantillaPersonal />}>
                      <Route path="personal" element={<AccesoPersonal />} />
                      <Route element={<AccesoPorRol roles={['administracion']} />}>
                        <Route path="administracion" element={<PlantillaAdministracion />}>
                          <Route index element={<PanelAdministracion />} />
                          <Route path="pedidos" element={<AdministrarPedidos />} />
                          <Route path="pedidos/:id" element={<OrdenPedidoAdministracion />} />
                          <Route path="productos" element={<AdministrarProductos />} />
                          <Route path="criticos" element={<ProductosCriticos />} />
                          <Route path="categorias" element={<AdministrarCategorias />} />
                          <Route path="usuarios" element={<AdministrarUsuarios />} />
                          <Route path="usuarios/clientes/:id" element={<DetalleClienteAdministracion />} />
                          <Route path="usuarios/personal/:id" element={<DetallePersonalAdministracion />} />
                          <Route path="reportes" element={<ReportesAdministracion />} />
                          <Route path="perfil" element={<PerfilAdministracion />} />
                        </Route>
                      </Route>
                      <Route element={<AccesoPorRol roles={['operadora']} />}>
                        <Route path="operadora/pedidos" element={<OperadoraPedidos />} />
                      </Route>
                      <Route element={<AccesoPorRol roles={['repartidor']} />}>
                        <Route path="repartidor/entregas" element={<RepartidorEntregas />} />
                      </Route>
                    </Route>
                  </Routes>
                </SesionPersonalProvider>
              </SesionClienteProvider>
            </UsuariosProvider>
          </CarritoProvider>
        </PedidosProvider>
      </ProductosProvider>
    </BrowserRouter>
  )
}

export default App
