import { describe, expect, it } from 'vitest'
import { esClicSimple } from './esClicSimple'

describe('esClicSimple', () => {
  it('acepta un clic principal sin teclas modificadoras', () => {
    expect(esClicSimple({ button: 0 })).toBe(true)
  })

  it.each([
    ['Ctrl (abrir en otra pestaña)', { button: 0, ctrlKey: true }],
    ['Cmd en Mac', { button: 0, metaKey: true }],
    ['Shift (otra ventana)', { button: 0, shiftKey: true }],
    ['Alt (descargar)', { button: 0, altKey: true }],
    ['botón central', { button: 1 }],
  ])('deja actuar al navegador con %s', (_caso, evento) => {
    expect(esClicSimple(evento)).toBe(false)
  })
})
