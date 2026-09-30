import { Route, Routes } from 'react-router-dom'
import PlantillaPublica from '../components/templates/PlantillaPublica'
import Catalogo from '../pages/Catalogo'
import Inicio from '../pages/Inicio'
import PaginaNoEncontrada from '../pages/PaginaNoEncontrada'

export default function RutasAplicacion() {
  return (
    <Routes>
      <Route element={<PlantillaPublica />}>
        <Route index element={<Inicio />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Route>
    </Routes>
  )
}
