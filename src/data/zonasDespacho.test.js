import { describe, expect, it } from 'vitest'
import zonasDespacho from './zonasDespacho'

// Valores copiados a mano de la hoja «Zonas de Despacho» del Excel Forma C (filas 4 a 8),
// no generados desde el archivo que se prueba.
const ZONAS_EXCEL = [
  { nombre: 'Zona Centro', comunas: ['Chillán', 'centro', 'norte', 'sur'], dias: 'lunes a sábado', horas: ['08:00', '20:00'], estimado: '1 a 3 horas' },
  { nombre: 'Zona Oriente', comunas: ['Chillán', 'oriente', 'Chillán Viejo'], dias: 'lunes a viernes', horas: ['08:00', '18:00'], estimado: '2 a 4 horas' },
  { nombre: 'Zona Rural', comunas: ['El Carmen', 'Pinto', 'San Ignacio'], dias: 'martes y jueves', horas: ['08:00', '16:00'], estimado: '3 a 6 horas' },
  { nombre: 'Zona Sur', comunas: ['Bulnes', 'Quillón'], dias: 'miércoles', horas: ['08:00', '16:00'], estimado: '4 a 6 horas' },
  { nombre: 'Zona Comercial', comunas: ['Parques industriales', 'locales comerciales'], dias: 'lunes a viernes', horas: ['07:00', '17:00'], estimado: 'según agenda' },
]

describe('zonasDespacho', () => {
  it('tiene las cinco zonas del Excel, en el mismo orden y con identificador único', () => {
    expect(zonasDespacho.map((zona) => zona.nombre)).toEqual(ZONAS_EXCEL.map((zona) => zona.nombre))
    expect(new Set(zonasDespacho.map((zona) => zona.id)).size).toBe(5)
  })

  it.each(ZONAS_EXCEL)('respeta comunas, días, horario y estimación de $nombre', (esperada) => {
    const zona = zonasDespacho.find((item) => item.nombre === esperada.nombre)

    esperada.comunas.forEach((comuna) => expect(zona.comunas).toContain(comuna))
    expect(zona.dias.toLocaleLowerCase('es-CL')).toBe(esperada.dias)
    expect(zona.horario.match(/\d{2}:\d{2}/g)).toEqual(esperada.horas)
    expect(zona.tiempoEstimado.toLocaleLowerCase('es-CL')).toBe(esperada.estimado)
  })
})
