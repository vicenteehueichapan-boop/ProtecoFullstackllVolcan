import { Route, Routes } from 'react-router-dom'
import PlantillaPublica from '../components/templates/PlantillaPublica'
import Catalogo from '../pages/Catalogo'
import Inicio from '../pages/Inicio'
import Ingreso from '../pages/Ingreso'
import PaginaNoEncontrada from '../pages/PaginaNoEncontrada'
import Categorias from '../pages/Categorias'
import DetalleProducto from '../pages/DetalleProducto'
import Registro from '../pages/Registro'
import AdministrarProductos from '../pages/AdministrarProductos'
import NuevoPedido from '../pages/NuevoPedido'
import PedidoExitoso from '../pages/PedidoExitoso'
import SeguimientoPedido from '../pages/SeguimientoPedido'
import OperadoraPedidos from '../pages/OperadoraPedidos'
import RepartidorEntregas from '../pages/RepartidorEntregas'
import PedidoNoRealizado from '../pages/PedidoNoRealizado'

export default function RutasAplicacion() {
  return (
    <Routes>
      <Route element={<PlantillaPublica />}>
        <Route index element={<Inicio />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="productos/:codigo" element={<DetalleProducto />} />
        <Route path="ingreso" element={<Ingreso />} />
        <Route path="registro" element={<Registro />} />
        <Route path="nuevo-pedido" element={<NuevoPedido />} />
        <Route path="pedido-confirmado/:id" element={<PedidoExitoso />} />
        <Route path="pedido-no-realizado" element={<PedidoNoRealizado />} />
        <Route path="seguimiento" element={<SeguimientoPedido />} />
        <Route path="seguimiento/:id" element={<SeguimientoPedido />} />
        <Route path="administracion/productos" element={<AdministrarProductos />} />
        <Route path="operadora/pedidos" element={<OperadoraPedidos />} />
        <Route path="repartidor/entregas" element={<RepartidorEntregas />} />
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Route>
    </Routes>
  )
}
