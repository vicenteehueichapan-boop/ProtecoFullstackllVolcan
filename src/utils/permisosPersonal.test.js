import { describe, expect, it } from 'vitest'
import { puedeAccederPersonal } from './permisosPersonal'

describe('puedeAccederPersonal', () => {
  it('permite el acceso solo a los roles indicados para la ruta', () => {
    const operadora = { id: 'operadora-demo', rol: 'operadora' }

    expect(puedeAccederPersonal(operadora, ['operadora'])).toBe(true)
    expect(puedeAccederPersonal(operadora, ['administracion'])).toBe(false)
  })

  it('niega el acceso sin sesión del personal', () => {
    expect(puedeAccederPersonal(null, ['administracion'])).toBe(false)
  })
})
