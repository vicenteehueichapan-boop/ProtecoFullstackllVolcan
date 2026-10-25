import { describe, expect, it } from 'vitest'
import {
  validarClave, validarCorreo, validarDatosCliente, validarIngreso, validarPerfilPersonal, validarRegistro,
} from './validaciones'

describe('validaciones puras de formularios', () => {
  it.each(['', '   ', 'cliente', 'a@@b.cl', 'a@b', 'a b@c.cl'])('rechaza el correo inválido "%s"', (correo) => {
    expect(validarCorreo(correo)).toBe('Ingresa un correo válido.')
  })

  it('acepta un correo válido', () => {
    expect(validarCorreo('cliente@ejemplo.cl')).toBe('')
  })

  it('rechaza cinco caracteres y acepta el límite de seis', () => {
    expect(validarClave('12345')).toBe('La contraseña debe tener al menos 6 caracteres.')
    expect(validarClave('123456')).toBe('')
  })

  it('devuelve juntos los errores de ingreso sin modificar entradas', () => {
    expect(validarIngreso('', '')).toEqual({
      correo: 'Ingresa un correo válido.',
      clave: 'La contraseña debe tener al menos 6 caracteres.',
    })
    expect(validarIngreso('cliente@ejemplo.cl', '123456')).toEqual({})
  })

  it('valida el registro sin modificar el objeto recibido', () => {
    const datos = Object.freeze({
      nombre: 'Ana', apellidos: 'Pérez', run: '123456785', correo: 'ana@ejemplo.cl',
      clave: '123456', confirmarClave: '123456',
    })
    expect(validarRegistro(datos)).toEqual({})
    expect(validarRegistro({ ...datos, nombre: ' ', apellidos: 'P', run: '12.345.678-5', confirmarClave: '' }))
      .toMatchObject({
        nombre: 'Ingresa tu nombre.',
        apellidos: 'Ingresa tus apellidos.',
        run: 'Ingresa el RUN sin puntos ni guion.',
        confirmarClave: 'Las contraseñas deben coincidir.',
      })
  })
})

describe('validaciones de administración de usuarios', () => {
  it('valida los datos de un cliente sin exigir contraseña', () => {
    const datos = { nombre: 'Ana', apellidos: 'Pérez', run: '12345678K', correo: 'ana@correo.cl' }

    expect(validarDatosCliente(datos)).toEqual({})
    expect(validarDatosCliente({ ...datos, run: '1', correo: 'x' })).toEqual({
      run: 'Ingresa el RUN sin puntos ni guion.',
      correo: 'Ingresa un correo válido.',
    })
  })

  it('valida nombre, correo y rol de un perfil del personal', () => {
    expect(validarPerfilPersonal({ nombre: 'Repartidor 4', correo: 'r4@ejemplo.cl', rol: 'repartidor' })).toEqual({})
    expect(validarPerfilPersonal({ nombre: 'R', correo: ' ', rol: 'cliente' })).toEqual({
      nombre: 'Ingresa un nombre de al menos 3 caracteres.',
      correo: 'Ingresa un correo válido.',
      rol: 'Selecciona un rol del personal.',
    })
  })
})
