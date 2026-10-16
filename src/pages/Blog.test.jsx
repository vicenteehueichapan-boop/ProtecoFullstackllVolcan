import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Blog from './Blog'
import DetalleBlog from './DetalleBlog'

function mostrarBlog(ruta) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<DetalleBlog />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('páginas del Blog', () => {
  it('lista las entradas y abre el detalle elegido', async () => {
    mostrarBlog('/blog')

    expect(screen.getAllByRole('link', { name: /^Leer «/ })).toHaveLength(2)
    await userEvent.click(screen.getByRole('link', { name: 'Leer «Cómo funcionan nuestras zonas de despacho»' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Cómo funcionan nuestras zonas de despacho' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Zona Rural' })).toBeInTheDocument()
  })

  it('muestra las fuentes oficiales de la entrada de seguridad, que se abren en otra pestaña', () => {
    mostrarBlog('/blog/seguridad-al-recibir-un-cilindro')

    const fuente = screen.getByRole('link', { name: 'SEC: Gas y parafina, ¿qué hacer?' })
    expect(fuente).toHaveAttribute('href', 'https://www.sec.cl/gas-y-parafina/')
    expect(fuente).toHaveAttribute('target', '_blank')
  })

  it('responde a una entrada inexistente con salida al blog', () => {
    mostrarBlog('/blog/no-existe')

    expect(screen.getByRole('heading', { name: 'Entrada no encontrada' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ver todas las entradas' })).toHaveAttribute('href', '/blog')
  })
})
