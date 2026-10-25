import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PedidosProvider } from '../context/PedidosContext'
import { SesionClienteProvider } from '../context/SesionClienteContext'
import RutaActual from './RutaActual'

// Monta una página con los Context que necesita y un router en memoria.
export function renderizarConSesion(pagina, { ruta, entrada = ruta } = {}) {
  return render(
    <MemoryRouter initialEntries={[entrada]}>
      <SesionClienteProvider>
        <PedidosProvider>
          <RutaActual />
          <Routes>
            <Route path={ruta} element={pagina} />
            <Route path="*" element={null} />
          </Routes>
        </PedidosProvider>
      </SesionClienteProvider>
    </MemoryRouter>,
  )
}
